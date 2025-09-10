"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null; // ここで throw しない
  return createClient(url, anon);
}
