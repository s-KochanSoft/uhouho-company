// app/api/messages/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'

// 外部SDKを使うので Node 実行に固定（Edgeだと未対応なSDKがある）
export const runtime = 'nodejs'

const Schema = z.object({
  author: z.string().min(1).max(24),
  body: z.string().min(1).max(500)
})

// 最新50件を新しい順で返す
export async function GET() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ messages: data })
}

// 新規投稿を受け付ける
export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { author, body } = Schema.parse(json)

    const { data, error } = await supabase
      .from('messages')
      .insert({ author, body })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: data }, { status: 201 })
 } catch (e: unknown) {
  const message = e instanceof Error ? e.message : 'Invalid payload'
  return NextResponse.json({ error: message }, { status: 400 })
}
}
