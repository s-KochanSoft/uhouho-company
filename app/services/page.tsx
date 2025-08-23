// app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | UHOUHO Company",
  description:
    "UHOUHO Company のサービス一覧。Web/LP、ゲーム・アプリ、SEO/グロース、業務自動化のプレースホルダー。",
};

export default function ServicesPage() {
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
            SERVICES <span className="text-lime-300">//</span> サービス一覧
          </h1>
          <p className="mt-3 text-neutral-300 max-w-2xl mx-auto text-sm">
            いまはプレースホルダーです。詳細は <Link href="/contact" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">お問い合わせ</Link> ください。
          </p>
        </section>

        {/* Cards */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              k: "WEB / LP",
              desc: "Next.js + Tailwindで高速・運用しやすいサイト。SEO/計測込み。",
              bullets: ["Jamstack構成", "Core Web Vitals配慮", "CMS連携可"],
            },
            {
              k: "GAME / APP",
              desc: "Webゲームや小規模アプリを素早く試作→本番運用へ。",
              bullets: ["小さく作る", "遊び心UI", "分析計測込み"],
            },
            {
              k: "SEO / GROWTH",
              desc: "テクニカルSEOとCVR改善。運用の再現性重視。",
              bullets: ["サイト健診", "内部最適化", "ABテスト支援"],
            },
            {
              k: "AUTOMATION",
              desc: "SaaS連携やスクリプトで手作業を自動化。",
              bullets: ["ノーコード/コード", "Bot/通知", "運用設計"],
            },
          ].map((s, i) => (
            <article key={i} className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 shadow-[4px_4px_0_0_#1f2937] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block h-4 w-4 bg-lime-400 shadow-[2px_2px_0_0_#111]" />
                <h2 className="font-black tracking-wide">{s.k}</h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{s.desc}</p>
              <ul className="mt-3 text-sm text-neutral-300 list-disc pl-5 space-y-1">
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-neutral-800 text-sm text-neutral-400">
                <div>Price: —（要件次第）</div>
                <div className="mt-1">Lead time: —（相談ベース）</div>
              </div>
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-neutral-800 px-5 py-2 font-bold text-neutral-100 shadow-[4px_4px_0_0_#1f2937] hover:bg-neutral-700"
                >
                  お問い合わせ
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* FAQ（ダミー） */}
        <section className="mt-12">
          <h2 className="text-xl font-black tracking-wide mb-4">
            FAQ <span className="text-lime-300">//</span> よくある質問（ダミー）
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "見積もりは無料ですか？",
                a: "はい。要件をお聞きして概算をお出しします。",
              },
              {
                q: "小さな案件でも相談できますか？",
                a: "もちろん。まずは小さく始めるのが得意です。",
              },
              {
                q: "納期の目安は？",
                a: "内容によります。最短2週間～を目安に調整します。",
              },
              {
                q: "運用や保守も対応しますか？",
                a: "可能です。計測・改善まで含めて伴走します。",
              },
            ].map((f, i) => (
              <article key={i} className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 shadow-[4px_4px_0_0_#1f2937]">
                <h3 className="font-black mb-2">Q. {f.q}</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-[6px_6px_0_0_#1f2937] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-wide">ご依頼・ご相談はお気軽に</h2>
              <p className="text-neutral-300 text-sm mt-1">実績や会社概要は <Link href="/company" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">/company</Link> をご覧ください。</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-lime-400 px-6 py-3 font-extrabold text-neutral-900 shadow-[4px_4px_0_0_#1f2937] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              お問い合わせ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
