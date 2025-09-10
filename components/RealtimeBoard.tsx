"use client";

import { useEffect, useRef, useState } from "react";

type Msg = {
  id: string;
  author: string;
  body: string;
  created_at?: string;
};

type GetMessagesOK = { messages: Msg[] };
type ErrorRes = { error: string };
type PostOK = { message: Msg };

// 型ガード（any 使わず unknown を絞る）
function getErrorMessage(data: unknown): string | null {
  if (typeof data === "object" && data !== null && "error" in data) {
    const v = (data as { error?: unknown }).error;
    return typeof v === "string" ? v : null;
  }
  return null;
}
function extractMessages(data: unknown): Msg[] {
  if (typeof data === "object" && data !== null) {
    const v = (data as { messages?: unknown }).messages;
    if (Array.isArray(v)) return v as Msg[];
  }
  return [];
}
function extractSavedMessage(data: unknown): Msg | null {
  if (typeof data === "object" && data !== null && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "object" && m !== null) return m as Msg;
  }
  return null;
}

export default function RealtimeBoard() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState(""); // ハニーポット
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 初回 + 4秒ポーリング
  const load = async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const json: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = getErrorMessage(json) ?? `Load failed: ${res.status}`;
        throw new Error(msg);
      }
      setMessages(extractMessages(json));
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "読み込みエラー";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 投稿
  const submit = async () => {
    if (!author.trim() || !body.trim()) return;
    if (posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim().slice(0, 24),
          body: body.trim().slice(0, 500),
          hp, // 人間は空のまま
        }),
      });
      const json: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = getErrorMessage(json) ?? "投稿に失敗しました";
        throw new Error(msg);
      }

      const saved = extractSavedMessage(json);
      if (saved) {
        setMessages((prev) => [saved, ...prev]);
      } else {
        await load(); // 念のため再取得
      }
      setBody("");
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "投稿に失敗しました";
      setError(msg);
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-4 shadow-[6px_6px_0_0_#1f2937]">
      <h2 className="text-lg font-extrabold tracking-wide">
        BOARD <span className="text-lime-300">{"//"}</span> リアルタイム掲示板
      </h2>

      {/* 投稿フォーム */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 relative">
        <input
          type="text"
          placeholder="おなまえ（必須）"
          className="rounded-none border-[3px] border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={24}
        />
        <input
          type="text"
          placeholder="メッセージ（必須）"
          className="rounded-none border-[3px] border-neutral-800 bg-neutral-950 px-3 py-2 text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
        />
        <button
          onClick={submit}
          disabled={posting || !author.trim() || !body.trim()}
          className="rounded-none border-[3px] border-neutral-800 bg-lime-400 px-4 py-2 font-extrabold text-neutral-900 shadow-[4px_4px_0_0_#1f2937] disabled:opacity-50"
        >
          {posting ? "送信中..." : "送信"}
        </button>

        {/* ハニーポット：画面外に配置 */}
        <div
          aria-hidden
          className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
        >
          <label htmlFor="hp">HP</label>
          <input
            id="hp"
            name="hp"
            type="text"
            autoComplete="off"
            tabIndex={-1}
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mt-3 text-sm text-red-400 border border-red-500/40 p-2 bg-red-950/30 rounded">
          {error}
        </div>
      )}

      {/* メッセージ一覧 */}
      <div className="mt-4">
        {loading ? (
          <div className="text-sm text-neutral-400">読み込み中...</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-neutral-400">まだ投稿がありません。</div>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className="border-[3px] border-neutral-800 bg-neutral-950 p-3 shadow-[4px_4px_0_0_#1f2937]"
              >
                <div className="text-xs text-neutral-500">
                  {m.created_at
                    ? new Date(m.created_at).toLocaleString("ja-JP")
                    : ""}
                </div>
                <div>
                  <span className="font-bold">{m.author}</span>
                  <span className="mx-2 text-neutral-600">{"//"}</span>
                  <span>{m.body}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
