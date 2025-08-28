// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anon) {
  // 環境変数が未設定のときに早めに気づけるようガード
  throw new Error('Supabase URL / ANON KEY が未設定です。.env.local を確認してください。')
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: false }
})