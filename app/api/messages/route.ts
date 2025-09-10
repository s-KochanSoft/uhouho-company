// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

// ── 設定 ──
const ALLOWED_ORIGINS = new Set<string>([
  "https://uhouho-company.onrender.com",
  "http://localhost:3000",
  // "https://www.your-domain.com", // ← ここに実オリジンを追加
  // "https://your-domain.com",
]);

const POST_ENABLED = (process.env.BOARD_POST_ENABLED ?? "true") === "true";
const RL_LIMIT = Number(process.env.BOARD_RL_LIMIT ?? "6");
const RL_WINDOW_MS = Number(process.env.BOARD_RL_WINDOW_MS ?? "60000");
const MIN_INTERVAL_MS = Number(process.env.BOARD_MIN_INTERVAL_MS ?? "8000");
const GLOBAL_COOLDOWN_MS = Number(process.env.BOARD_GLOBAL_COOLDOWN_MS ?? "1500");
const TEXT_WINDOW_MS = Number(process.env.BOARD_TEXT_WINDOW_MS ?? String(15 * 60 * 1000));
const BLOCK_URLS = (process.env.BOARD_BLOCK_URLS ?? "true") === "true";
const CSRF_COOKIE = "board_csrf";
const SECURE_COOKIE = process.env.NODE_ENV === "production";

type RLState = { count: number; resetAt: number; lastAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __boardRateMap: Map<string, RLState> | undefined;
  // eslint-disable-next-line no-var
  var __boardGlobalAt: number | undefined;
  // eslint-disable-next-line no-var
  var __boardRecentBodies: Map<string, number> | undefined;
}

const rateMap: Map<string, RLState> =
  globalThis.__boardRateMap ?? (globalThis.__boardRateMap = new Map());
const recentBodies: Map<string, number> =
  globalThis.__boardRecentBodies ?? (globalThis.__boardRecentBodies = new Map());

function getIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  const xrip = h.get("x-real-ip");
  return xrip ?? "unknown";
}
function isBrowserFetch(h: Headers): boolean {
  const sfs = h.get("sec-fetch-site");
  const xrw = h.get("x-requested-with");
  return sfs === "same-origin" || sfs === "same-site" || xrw === "XMLHttpRequest";
}
function uaBlocked(h: Headers): boolean {
  const ua = h.get("user-agent") || "";
  return /curl|wget|powershell|httpie|postman|insomnia|python-requests|libwww|okhttp/i.test(ua);
}
function originAllowed(h: Headers): boolean {
  const origin = h.get("origin");
  const ref = h.get("referer");
  const oOk = origin ? ALLOWED_ORIGINS.has(origin) : false;
  let rOk = false;
  if (ref) {
    try {
      rOk = ALLOWED_ORIGINS.has(new URL(ref).origin);
    } catch {
      rOk = false;
    }
  }
  return oOk || rOk;
}
function checkRateByIp(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const cur = rateMap.get(ip);
  if (!cur || cur.resetAt <= now) {
    rateMap.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS, lastAt: now });
    return { ok: true, retryAfter: Math.ceil(RL_WINDOW_MS / 1000) };
  }
  if (now - cur.lastAt < MIN_INTERVAL_MS) {
    return { ok: false, retryAfter: Math.ceil((MIN_INTERVAL_MS - (now - cur.lastAt)) / 1000) };
  }
  if (cur.count >= RL_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((cur.resetAt - now) / 1000) };
  }
  cur.count += 1;
  cur.lastAt = now;
  return { ok: true, retryAfter: Math.ceil((cur.resetAt - now) / 1000) };
}
function checkGlobalCooldown(): boolean {
  const now = Date.now();
  const last = globalThis.__boardGlobalAt ?? 0;
  if (now - last < GLOBAL_COOLDOWN_MS) return false;
  globalThis.__boardGlobalAt = now;
  return true;
}
function containsUrl(text: string): boolean {
  return /(https?:\/\/|www\.)\S+/i.test(text);
}
function isDuplicateBody(body: string): boolean {
  const now = Date.now();
  for (const [k, exp] of Array.from(recentBodies.entries())) {
    if (exp < now) recentBodies.delete(k);
  }
  const norm = body.trim().replace(/\s+/g, " ").toLowerCase();
  if (recentBodies.has(norm)) return true;
  recentBodies.set(norm, now + TEXT_WINDOW_MS);
  return false;
}

// Supabase
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

// 入力スキーマ
const Schema = z.object({
  author: z.string().min(1).max(24),
  body: z.string().min(1).max(500),
  hp: z.string().optional(),
});

// GET: 最新 50 件 + CSRF 配布
export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server is misconfigured" }, { status: 500 });
  }
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const res = NextResponse.json({ messages: data ?? [] });

  const ck = await cookies();
  let csrf = ck.get(CSRF_COOKIE)?.value;
  if (!csrf) csrf = randomUUID();
  res.cookies.set({
    name: CSRF_COOKIE,
    value: csrf,
    httpOnly: false,
    sameSite: "lax",
    secure: SECURE_COOKIE,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}

// POST: 新規投稿
export async function POST(req: Request) {
  if (!POST_ENABLED) {
    return NextResponse.json({ error: "Posting disabled" }, { status: 503 });
  }
  if (!originAllowed(req.headers) || !isBrowserFetch(req.headers) || uaBlocked(req.headers)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // CSRF
  const csrfHeader = req.headers.get("x-board-csrf") || "";
  const ck = await cookies();
  const csrfCookie = ck.get(CSRF_COOKIE)?.value || "";
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: "CSRF required" }, { status: 403 });
  }

  // レート制限
  const ip = getIp(req.headers);
  if (!checkGlobalCooldown()) {
    return NextResponse.json({ error: "Please wait a moment" }, { status: 429 });
  }
  const rl = checkRateByIp(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too Many Requests. Slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // Content-Type
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  }

  // 入力検証
  let payload: z.infer<typeof Schema>;
  try {
    payload = Schema.parse(await req.json());
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (payload.hp && payload.hp.trim().length > 0) {
    return NextResponse.json({ error: "Bot detected" }, { status: 400 });
  }
  if (BLOCK_URLS && containsUrl(payload.body)) {
    return NextResponse.json({ error: "Links are not allowed" }, { status: 400 });
  }
  if (isDuplicateBody(payload.body)) {
    return NextResponse.json({ error: "Duplicate content" }, { status: 409 });
  }

  // 保存
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server is misconfigured" }, { status: 500 });
  }
  const { author, body } = payload;
  const { data, error } = await supabase
    .from("messages")
    .insert({ author, body })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: data }, { status: 201 });
}
