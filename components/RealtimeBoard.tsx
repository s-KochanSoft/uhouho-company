'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Message = { id: number; author: string; body: string; created_at: string }

export default function RealtimeBoard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const submitting = useRef(false)

  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((res) => setMessages(res.messages ?? []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => [newMsg, ...prev].slice(0, 50))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true

    const temp: Message = {
      id: Date.now(),
      author: author.trim() || 'anonymous',
      body: body.trim(),
      created_at: new Date().toISOString()
    }
    if (!temp.body) { submitting.current = false; return }

    setMessages((prev) => [temp, ...prev])

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: temp.author, body: temp.body })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'failed')
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id))
      alert('投稿に失敗しました')
    } finally {
      submitting.current = false
      setBody('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl p-4">
      <h2 className="text-xl font-bold mb-3">Realtime Board</h2>

      <form
        onSubmit={onSubmit}
        className="mb-4 grid gap-2 sm:grid-cols-[160px_1fr_auto]"
      >
        {/* Name */}
        <input
          className="w-full rounded-md border border-neutral-700 bg-neutral-900
                     text-neutral-100 placeholder-neutral-500
                     px-3 py-2 outline-none
                     focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40"
          placeholder="Name (任意)"
          aria-label="お名前"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={24}
          name="author"
          autoComplete="name"
        />

        {/* Message */}
        <input
          className="w-full rounded-md border border-neutral-700 bg-neutral-900
                     text-neutral-100 placeholder-neutral-500
                     px-3 py-2 outline-none
                     focus:border-lime-400 focus:ring-2 focus:ring-lime-400/40"
          placeholder="メッセージ (最大500文字)"
          aria-label="メッセージ本文"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
          name="body"
          autoComplete="off"
          spellCheck={false}
        />

        <button
          type="submit"
          className="h-[42px] rounded-md border border-neutral-700
                     bg-lime-400 px-4 font-bold text-neutral-900
                     shadow-[2px_2px_0_0_#1f2937]
                     hover:translate-x-[1px] hover:translate-y-[1px]
                     disabled:opacity-50"
          disabled={!body.trim()}
        >
          投稿
        </button>
      </form>

      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
            <div className="text-sm text-neutral-400">
              <span className="font-medium text-neutral-100">{m.author}</span>
              <span className="mx-1">•</span>
              <time dateTime={m.created_at}>
                {new Date(m.created_at).toLocaleString()}
              </time>
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-neutral-100">
              {m.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
