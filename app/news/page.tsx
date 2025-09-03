// app/news/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News | UHOUHO Company",
  description: "UHOUHO Company のお知らせ・更新情報（プレースホルダー）",
};

// 仮ニュースデータ（実運用ではCMSやMDXに置き換え）
const NEWS = [
  {
    date: "2025-08-20",
    title: "サイトβ公開と世界観アップデート",
    slug: "site-beta-and-style",
    tags: ["Release", "Design"],
    excerpt: "UHOUHO Company サイトをβ公開。レトロ×ゲーム風のUIスタイルに統一しました。",
  },
  {
    date: "2025-08-18",
    title: "お問い合わせフォーム改善（バリデーション/送信）",
    slug: "contact-form-update",
    tags: ["Feature", "Form"],
    excerpt: "入力の見やすさと送信の信頼性を改善しました。ありがとうございます！",
  },
  {
    date: "2025-08-15",
    title: "会社情報ページを追加",
    slug: "company-page-added",
    tags: ["Pages"],
    excerpt: "会社概要・ミッション・チーム・沿革を公開。",
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function NewsPage() {
  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50 px-4 pb-16">
      {/* 背景スキャンライン */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* HERO */}
        <section className="pt-12 sm:pt-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wide">
            NEWS <span className="text-lime-300">{"//"}</span> お知らせ
          </h1>
          
        </section>

        {/* タグ簡易フィルタ（ダミーUI）*/}
        <section className="mt-6 flex flex-wrap gap-2 justify-center">
          {(["All", ...Array.from(new Set(NEWS.flatMap(n => n.tags)))]).map((t, i) => (
            <button key={i} type="button" className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 px-3 py-1 text-sm text-neutral-200 shadow-[3px_3px_0_0_#1f2937] hover:bg-neutral-800">
              {t}
            </button>
          ))}
        </section>

        {/* 一覧 */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {NEWS.map((n) => (
            <article key={n.slug} className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 shadow-[4px_4px_0_0_#1f2937] flex flex-col">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <time dateTime={n.date}>{formatDate(n.date)}</time>
                <span className="inline-flex gap-1">
                  {n.tags.map((tg) => (
                    <span key={tg} className="rounded-none border border-neutral-700 bg-neutral-800 px-2 py-0.5">{tg}</span>
                  ))}
                </span>
              </div>
              <h2 className="mt-2 font-black text-lg leading-tight tracking-wide">
                <Link href={`/news/${n.slug}`} className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">
                  {n.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{n.excerpt}</p>
              <div className="mt-auto pt-4 text-right">
                <Link href={`/news/${n.slug}`} className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-neutral-800 px-4 py-2 text-sm font-bold text-neutral-100 shadow-[3px_3px_0_0_#1f2937] hover:bg-neutral-700">
                  READ MORE
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* ページネーション（ダミー） */}
        <nav className="mt-10 flex items-center justify-center gap-3 text-sm">
          <button className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 px-4 py-2 shadow-[3px_3px_0_0_#1f2937] text-neutral-400" disabled>
            ← Newer
          </button>
          <button className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 px-4 py-2 shadow-[3px_3px_0_0_#1f2937] text-neutral-200">
            Older →
          </button>
        </nav>

        {/* 補足リンク */}
        <div className="mt-10 text-center text-sm text-neutral-400">
          <Link href="/company" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">会社情報</Link>
          <span className="mx-2">/</span>
          <Link href="/contact" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">お問い合わせ</Link>
        </div>
      </div>
    </main>
  );
}
