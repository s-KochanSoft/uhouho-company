// app/page.tsx
export const runtime = "nodejs";          // SDK対策
export const dynamic = "force-dynamic";   // 事前静的化をオフ（prerender回避）
export const revalidate = 0;              // キャッシュしない

import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
// RealtimeBoard は SSR を完全に切る（ビルド時に評価させない）
import dynamicImport from "next/dynamic";
const RealtimeBoard = dynamicImport(() => import("@/components/RealtimeBoard"), {
  ssr: false,
});

function ServicesPreview() {
  const items = [
    { title: "Web / LP", desc: "Next.js + Tailwindで高速＆SEO対応。運用しやすい構成。" },
    { title: "Game / App", desc: "小さく速い試作から本番まで。遊び心あるUIも。" },
    { title: "Automation", desc: "SaaS連携やスクリプトで業務を自動化。" },
  ];
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-black tracking-wide mb-4">
          SERVICES <span className="text-lime-300">{"//"}</span> 事業内容
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <article
              key={i}
              className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 shadow-[4px_4px_0_0_#1f2937]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block h-4 w-4 bg-lime-400 shadow-[2px_2px_0_0_#111]" />
                <h3 className="font-black tracking-wide">{s.title}</h3>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/services"
            className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300 text-sm"
          >
            もっと見る →
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsHighlight() {
  const news = [
    { date: "2025-08-20", title: "サイトβ公開", href: "/news/site-beta-and-style" },
    { date: "2025-08-18", title: "フォーム改善", href: "/news/contact-form-update" },
    { date: "2025-08-15", title: "会社情報追加", href: "/news/company-page-added" },
  ];
  return (
    <section className="mt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-black tracking-wide mb-4">
          LATEST NEWS <span className="text-lime-300">{"//"}</span> お知らせ
        </h2>
        <ul className="space-y-2 text-sm">
          {news.map((n, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-2"
            >
              <Link
                href={n.href}
                className="hover:underline decoration-lime-400/70 underline-offset-4"
              >
                {n.title}
              </Link>
              <time className="text-neutral-500">
                {new Date(n.date).toLocaleDateString("ja-JP")}
              </time>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <Link
            href="/news"
            className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300 text-sm"
          >
            すべて見る →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ClientLogos() {
  const logos = [
    { src: "/logo.png", alt: "Client A" },
    { src: "/logo.png", alt: "Client B" },
    { src: "/logo.png", alt: "Client C" },
    { src: "/logo.png", alt: "Client D" },
    { src: "/logo.png", alt: "Client E" },
    { src: "/logo.png", alt: "Client F" },
  ];
  return (
    <section className="mt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-black tracking-wide mb-4">
          HIGHLIGHTS <span className="text-lime-300">{"//"}</span> 実績
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {logos.map((l, i) => (
            <div
              key={i}
              className="relative h-16 bg-neutral-900 border-[3px] border-neutral-800 shadow-[4px_4px_0_0_#1f2937] grid place-items-center"
            >
              {/* 画像が存在するならImageを表示。無ければLOGOテキスト */}
              {l.src ? (
                <Image src={l.src} alt={l.alt} fill className="object-contain p-2" />
              ) : (
                <span className="text-neutral-500 text-xs">LOGO</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mt-16 mb-16">
      <div className="mx-auto max-w-6xl rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-8 text-center shadow-[6px_6px_0_0_#1f2937]">
        <h2 className="text-2xl font-black mb-2 tracking-wide">Let’s build something fun & fast</h2>
        <p className="text-neutral-300 text-sm mb-4">
          小さく作って、早く学ぶ。成果が出るまで伴走します。
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-lime-400 px-6 py-3 font-extrabold text-neutral-900 shadow-[4px_4px_0_0_#1f2937] hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          お問い合わせ
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50">
      {/* 背景スキャンライン（クリック不可） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      <div className="relative z-10 px-4">
        <div className="mx-auto max-w-6xl">
          <Hero />

          {/* ▼ HEROの直下：リアルタイム掲示板（クライアント側のみ描画） */}
          <div className="mt-10">
            <RealtimeBoard />
          </div>

          <ServicesPreview />
          <NewsHighlight />
          <ClientLogos />
          <CTA />
        </div>
      </div>
    </main>
  );
}
