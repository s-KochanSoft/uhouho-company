// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---- ここから “防御” 追加 ----

// このサイトからの POST だけ許可（ローカル開発も許可）
const ALLOWED_ORIGINS = new Set<string>([
  "https://uhouho-company.onrender.com",
  "http://localhost:3000",
]);

// 1分間に同一IPからの投稿は N 回まで
const RL_LIMIT = Number(process.env.BOARD_RL_LIMIT ?? "6");
const RL_WINDOW_MS = Number(process.env.BOARD_RL_WINDOW_MS ?? "60000");

// Nodeランタイムであればモジュール変数がプロセス存続中は保持される
type RLState = { count: number; resetAt: number };
const _global = globalThis as any;
if (!_global.__boardRateMap) _global.__boardRateMap = new Map<string, RLState>();
const rateMap: Map<string, RLState> = _global.__boardRateMap;

function getIp(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = h.get("x-real-ip");
  return xrip ?? "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const cur = rateMap.get(ip);
  if (!cur || cur.resetAt <= now) {
    rateMap.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS });
    return { ok: true, remaining: RL_LIMIT - 1, retryAfter: RL_WINDOW_MS / 1000 };
  }
  if (cur.count >= RL_LIMIT) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((cur.resetAt - now) / 1000) };
  }
  cur.count += 1;
  return { ok: true, remaining: RL_LIMIT - cur.count, retryAfter: Math.ceil((cur.resetAt - now) / 1000) };
}

// ---- ここまで “防御” 追加 ----

// 外部SDKを使うので Node 実行に固定
export const runtime = "nodejs";

// Supabase は “遅延初期化”（ビルド時に落とさない）
function getSupabase(): SupabaseClient | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

const Schema = z.object({
  author: z.string().min(1).max(24),
  body: z.string().min(1).max(500),
  // ハニーポット（人間は空のまま送る想定）
  hp: z.string().optional(),
});

// 最新50件を新しい順で返す
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
  return NextResponse.json({ messages: data });
}

// 新規投稿を受け付ける
export async function POST(req: Request) {
  // --- Origin 制限 ---
  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  // --- レート制限（IP）---
  const ip = getIp(req.headers);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too Many Requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // --- JSON だけ受け付ける ---
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  }

  // --- 入力検証 & ハニーポット ---
  let payload: z.infer<typeof Schema>;
  try {
    payload = Schema.parse(await req.json());
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (payload.hp && payload.hp.trim().length > 0) {
    // ボットが隠しフィールドを埋めた
    return NextResponse.json({ error: "Bot detected" }, { status: 400 });
  }

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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: data }, { status: 201 });
}
