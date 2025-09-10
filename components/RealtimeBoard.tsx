"use client";

import { useEffect, useRef, useState } from "react";

type Msg = {
  id: string;
  author: string;
  body: string;
  created_at?: string;
};

export default function RealtimeBoard() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 初回読み込み + 4秒ごとポーリング（簡易リアルタイム）
  const load = async () => {
  try {
    const res = await fetch("/api/messages", { cache: "no-store" });
    // ← 先にJSONを読んで、サーバ側の error メッセージを拾う
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json && json.error) ? json.error : `Load failed: ${res.status}`;
      throw new Error(msg);
    }
    const list: Msg[] = json?.messages ?? [];
    setMessages(list);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "投稿に失敗しました");

      // 先頭に追加（APIの返却: { message } を想定）
      const saved: Msg | undefined = json?.message;
      if (saved) {
        setMessages((prev) => [saved, ...prev]);
      } else {
        // 念のためリロード
        load();
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
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2">
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
      </div>

      {/* エラー表示（落とさない） */}
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
