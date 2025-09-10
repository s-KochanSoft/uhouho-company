"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FC, FormEvent } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ========= 型 =========
type Message = {
  id: string;                // uuid
  author: string;            // 投稿者名
  content: string;           // 本文
  created_at: string;        // ISO文字列
};

type FetchMessagesResponse = {
  data: Message[];
};

type RealtimeBoardProps = {
  /** 初期に取得する件数（新しい順） */
  initialLimit?: number;
  /** Supabase のチャンネル名（任意） */
  channelName?: string;
};

// ========= Supabase クライアント作成（ブラウザ側） =========
// NEXT_PUBLIC_ で始まる公開キーを .env に用意しておく想定
function useSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const client = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  return client;
}

// ========= 本体 =========
const RealtimeBoard: FC<RealtimeBoardProps> = ({
  initialLimit = 50,
  channelName = "public:messages",
}) => {
  const supabase = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // 初期読み込み
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/messages?limit=${initialLimit}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("Failed to fetch messages:", await res.text());
          return;
        }
        const json = (await res.json()) as FetchMessagesResponse;
        if (!cancelled) {
          // 新しい順で返ってきたと仮定し、表示は古い→新しいにしたいなら reverse
          setMessages([...json.data].sort((a, b) => a.created_at.localeCompare(b.created_at)));
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialLimit]);

  // 自動スクロール
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Supabase Realtime 購読
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newRow = payload.new as unknown as Message;
          setMessages((prev) => [...prev, newRow]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updated = payload.new as unknown as Message;
          setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const deleted = payload.old as unknown as { id: string };
          setMessages((prev) => prev.filter((m) => m.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, channelName]);

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    try {
      setLoading(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ author: author.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        console.error("Failed to post message:", await res.text());
        return;
      }

      // ここではリアルタイムを頼り、手動でリストへ追加はしない
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl w-full p-4">
      <h2 className="text-xl font-bold mb-3">Realtime Board</h2>

      <div className="border rounded-lg p-3 h-[60vh] overflow-y-auto bg-white/60 dark:bg-black/30">
        {messages.length === 0 ? (
          <p className="text-sm opacity-70">まだ投稿はありません。</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="border rounded-md p-2">
                <div className="text-xs opacity-70">
                  {new Date(m.created_at).toLocaleString()}
                </div>
                <div className="font-semibold">{m.author}</div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </li>
            ))}
          </ul>
        )}
        <div ref={listEndRef} />
      </div>

      <form onSubmit={onSubmit} className="mt-3 grid grid-cols-1 gap-2">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border rounded-md p-2"
          aria-label="author"
        />
        <textarea
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded-md p-2 h-24"
          aria-label="content"
        />
        <button
          type="submit"
          disabled={loading || !author.trim() || !content.trim()}
          className="rounded-md px-4 py-2 border font-medium disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default RealtimeBoard;
