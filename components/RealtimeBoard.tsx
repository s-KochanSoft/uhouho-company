"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FC, FormEvent } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ========= 型 =========
type Message = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

type GetMessagesResponse = {
  messages: Message[];
};

type PostMessageResponse =
  | { message: Message }
  | { error: string };

// ========= Supabase（ブラウザ） =========
function useSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return useMemo(() => {
    if (!url || !anon) return null;
    return createClient(url, anon);
  }, [url, anon]);
}

// ========= Cookie から CSRF を読む =========
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[-./*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return m ? decodeURIComponent(m[1]) : null;
}

// ========= 本体 =========
const RealtimeBoard: FC = () => {
  const supabase = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // 初期読み込み
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/messages", { cache: "no-store" });
        const json = (await res.json()) as GetMessagesResponse;
        if (!aborted) {
          // 旧来の「カードに古→新で表示」へ
          const ordered = [...(json.messages ?? [])].sort((a, b) =>
            a.created_at.localeCompare(b.created_at)
          );
          setMessages(ordered);
        }
      } catch (e) {
        setBanner({ type: "error", text: "メッセージの取得に失敗しました。" });
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // 自動スクロール
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Supabase Realtime
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("public:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => {
        const m = p.new as unknown as Message;
        setMessages((prev) => [...prev, m]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, (p) => {
        const m = p.new as unknown as Message;
        setMessages((prev) => prev.map((x) => (x.id === m.id ? m : x)));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (p) => {
        const del = p.old as unknown as { id: string };
        setMessages((prev) => prev.filter((x) => x.id !== del.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!author.trim() || !body.trim()) return;

    try {
      setLoading(true);
      setBanner(null);

      const csrf = getCookie("board_csrf") ?? "";
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-board-csrf": csrf,
        },
        body: JSON.stringify({ author: author.trim(), body: body.trim() }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as PostMessageResponse;
        const msg =
          "error" in json && json.error
            ? json.error
            : `投稿に失敗しました（${res.status}）`;
        setBanner({ type: "error", text: msg });
        return;
      }

      // Realtime が流れてくるので手動追加は不要
      setBody("");
    } catch {
      setBanner({ type: "error", text: "ネットワークエラーが発生しました。" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl w-full p-4">
      <h2 className="text-xl font-bold mb-3">Realtime Board</h2>

      {banner && (
        <div
          className={`mb-3 rounded-md border px-3 py-2 text-sm ${
            banner.type === "error"
              ? "border-red-300 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200"
              : "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200"
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* メッセージリスト（旧来風のカード表示） */}
      <div className="border rounded-lg p-3 h-[60vh] overflow-y-auto bg-white dark:bg-neutral-900">
        {messages.length === 0 ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-300">まだ投稿はありません。</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className="border rounded-md p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
              >
                <div className="text-[11px] opacity-70">
                  {new Date(m.created_at).toLocaleString()}
                </div>
                <div className="font-semibold">{m.author}</div>
                <div className="whitespace-pre-wrap">{m.body}</div>
              </li>
            ))}
          </ul>
        )}
        <div ref={listEndRef} />
      </div>

      {/* 入力フォーム（見た目を“はっきり”に戻す） */}
      <form onSubmit={onSubmit} className="mt-3 grid grid-cols-1 gap-2">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border rounded-md p-2 bg-white text-black placeholder-neutral-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:placeholder-neutral-400"
          aria-label="author"
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border rounded-md p-2 h-28 bg-white text-black placeholder-neutral-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white dark:placeholder-neutral-400"
          aria-label="content"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            500文字まで。URLは投稿できません。
          </span>
          <button
            type="submit"
            disabled={loading || !author.trim() || !body.trim()}
            className="rounded-md px-4 py-2 border font-medium disabled:opacity-50
                       bg-white text-black hover:bg-neutral-50
                       dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RealtimeBoard;
