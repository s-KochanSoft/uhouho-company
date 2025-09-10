// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---- 防御（Origin 制限 & レート制限） ----
export const runtime = "nodejs";

const ALLOWED_ORIGINS = new Set<string>([
  "https://uhouho-company.onrender.com",
  "http://localhost:3000",
]);

const RL_LIMIT = Number(process.env.BOARD_RL_LIMIT ?? "6");
const RL_WINDOW_MS = Number(process.env.BOARD_RL_WINDOW_MS ?? "60000");

type RLState = { count: number; resetAt: number };

// グローバルに型を拡張（any なし）
declare global {
  // eslint-disable-next-line no-var
  var __boardRateMap: Map<string, RLState> | undefined;
}
const rateMap: Map<string, RLState> =
  globalThis.__boardRateMap ?? (globalThis.__boardRateMap = new Map());

function getIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  const xrip = h.get("x-real-ip");
  return xrip ?? "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const cur = rateMap.get(ip);
  if (!cur || cur.resetAt <= now) {
    rateMap.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
    return {
      ok: true,
      remaining: RL_LIMIT - 1,
      retryAfter: Math.ceil(RL_WINDOW_MS / 1000),
    };
  }
  if (cur.count >= RL_LIMIT) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((cur.resetAt - now) / 1000),
    };
  }
  cur.count += 1;
  return {
    ok: true,
    remaining: RL_LIMIT - cur.count,
    retryAfter: Math.ceil((cur.resetAt - now) / 1000),
  };
}

// ---- Supabase 遅延初期化 ----
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

const Schema = z.object({
  author: z.string().min(1).max(24),
  body: z.string().min(1).max(500),
  hp: z.string().optional(), // ハニーポット
});

// ---- Handlers ----
export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server is misconfigured" },
      { status: 500 }
    );
  }
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}

export async function POST(req: Request) {
  // Origin 制限
  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  // IP レート制限
  const ip = getIp(req.headers);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too Many Requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // JSON 以外拒否
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 415 }
    );
  }

  // 入力検証 + ハニーポット
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

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server is misconfigured" },
      { status: 500 }
    );
  }

  const { author, body } = payload;
  const { data, error } = await supabase
    .from("messages")
    .insert({ author, body })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: data }, { status: 201 });
}
