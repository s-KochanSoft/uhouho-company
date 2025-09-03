// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 外部SDKを使うので Node 実行に固定（Edge未対応SDK対策）
export const runtime = "nodejs";

// ★ ランタイムでだけ環境変数を読む（ビルド時に落とさない）
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
});

// 最新50件を新しい順で返す
export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase URL/ANON KEY 未設定");
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ messages: data });
}

// 新規投稿を受け付ける
export async function POST(req: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase URL/ANON KEY 未設定");
    return NextResponse.json(
      { error: "Server is misconfigured" },
      { status: 500 }
    );
  }

  try {
    const json = await req.json();
    const { author, body } = Schema.parse(json);

    const { data, error } = await supabase
      .from("messages")
      .insert({ author, body })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: data }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
