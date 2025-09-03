// lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ビルド時に落ちないよう「遅延初期化」。
 * env が無い場合は null を返し、呼び出し側で分岐する。
 */
export function getSupabase(): SupabaseClient | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anon) return null;
  return createClient(url, anon);
}
