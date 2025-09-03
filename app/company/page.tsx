// app/company/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Company | UHOUHO Company",
  description:
    "UHOUHO Companyの企業情報ページ。ミッション、事業内容、チーム、沿革、採用、連絡先をご紹介します。",
};

export default function CompanyPage() {
  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50 px-4 pb-16">
      {/* 背景スキャンライン（クリック操作を邪魔しない）*/}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* HERO */}
        <section className="pt-12 sm:pt-16">
          <div className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 sm:p-10 shadow-[6px_6px_0_0_#1f2937] flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="UHOUHO Company" width={56} height={56} className="select-none" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-wide">UHOUHO Company</h1>
            </div>
            <p className="text-neutral-300 max-w-2xl">
              We build playful, high‑performance digital experiences.
              <br className="hidden sm:block" />
              楽しく、速く、結果にコミットするITパートナー。
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-lime-400 px-6 py-3 font-extrabold text-neutral-900 shadow-[4px_4px_0_0_#1f2937] hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                CONTACT US
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-neutral-800 px-6 py-3 font-bold text-neutral-100 shadow-[4px_4px_0_0_#1f2937] hover:bg-neutral-700"
              >
                OUR SERVICES
              </Link>
            </div>
          </div>
        </section>

        {/* 会社概要 & ミッション */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 shadow-[4px_4px_0_0_#1f2937]">
            <h2 id="about" className="scroll-mt-24 text-xl font-black mb-3 tracking-wide">
              ABOUT <span className="text-lime-300">{"//"}</span> 会社概要
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              <dt className="text-neutral-400">会社名</dt>
              <dd className="sm:col-span-2">UHOUHO Company</dd>
              <dt className="text-neutral-400">事業内容</dt>
              <dd className="sm:col-span-2">Web/LP制作、ゲーム・アプリ開発、SEO・グロース支援、業務自動化</dd>
              <dt className="text-neutral-400">所在地</dt>
              <dd className="sm:col-span-2">札幌市北区北３２条西６丁目１－３３３</dd>
              <dt className="text-neutral-400">設立</dt>
              <dd className="sm:col-span-2">２０２５年３月３日</dd>
              <dt className="text-neutral-400">お問い合わせ</dt>
              <dd className="sm:col-span-2"><Link href="/contact" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">/contact</Link></dd>
            </dl>
          </div>

          <div className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 shadow-[4px_4px_0_0_#1f2937]">
            <h3 className="text-lg font-black mb-2 tracking-wide">MISSION</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              「遊び心 × 高速 × 再現性」で、ビジネス成果に直結する体験をつくる。
              プロトタイプの速さと、運用で勝ち続ける設計を両立します。
            </p>
            <ul className="mt-4 text-sm list-disc pl-5 space-y-1 text-neutral-300">
              <li>高パフォーマンス：TTFB/CLS まで最適化</li>
              <li>拡張しやすい設計：モジュール化・型安全</li>
              <li>遊び心：レトロゲーム風UI、ミニインタラクション</li>
            </ul>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mt-12">
          <h2 className="scroll-mt-24 text-xl font-black mb-4 tracking-wide">
            SERVICES <span className="text-lime-300">{"//"}</span> 事業内容
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { title: "Website / LP", desc: "Next.js + Tailwindで高速・運用しやすいサイト。SEO/計測込み。" },
              { title: "Game / App", desc: "Webゲームや社内ツールの小さく速いプロトタイプ→本番まで伴走。" },
              { title: "SEO / Growth", desc: "テクニカルSEO、E-E-A-T、CVR改善。コンテンツ運用の仕組み化。" },
              { title: "Automation", desc: "SaaS連携やスクリプトで手作業を自動化。ワークフロー最適化。" },
            ].map((s, i) => (
              <article key={i} className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-5 shadow-[4px_4px_0_0_#1f2937]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block h-4 w-4 bg-lime-400 shadow-[2px_2px_0_0_#111]" />
                  <h3 className="font-black tracking-wide">{s.title}</h3>
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed">{s.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 実績ハイライト（ダミー）*/}
        <section className="mt-12">
          <h2 className="scroll-mt-24 text-xl font-black mb-4 tracking-wide">
            HIGHLIGHTS <span className="text-lime-300">{"//"}</span> 実績ハイライト
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { k: "PageSpeed 90+", v: "Core Web Vitals 最適化" },
              { k: "+30% CVR", v: "計測にもとづく導線改善" },
              { k: "<2w Prototype", v: "素早い検証と学習" },
            ].map((h, i) => (
              <div key={i} className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-5 shadow-[4px_4px_0_0_#1f2937]">
                <div className="text-2xl font-black">{h.k}</div>
                <div className="text-sm text-neutral-300 mt-1">{h.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team （写真がなければイニシャル）*/}
        <section className="mt-12">
          <h2 className="scroll-mt-24 text-xl font-black mb-4 tracking-wide">
            TEAM <span className="text-lime-300">{"//"}</span> メンバー
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "soda", role: "Producer / Dev", img: "/team/zen.png" },
              { name: "gori", role: "Designer / Frontend", img: "/team/uho.png" },
              { name: "an", role: "Backend / Infra", img: "/team/guest.png" },
            ].map((m, i) => (
              <article key={i} className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-5 shadow-[4px_4px_0_0_#1f2937]">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 bg-neutral-800 grid place-items-center text-xl font-black">
                    {/* 画像がある場合に出す。なければイニシャル */}
                    {m.img ? (
                      <Image src={m.img} alt={m.name} fill className="object-cover" />
                    ) : (
                      <span>{m.name.slice(0,1)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-black">{m.name}</div>
                    <div className="text-sm text-neutral-300">{m.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 沿革（ダミー）*/}
        <section className="mt-12">
          <h2 className="scroll-mt-24 text-xl font-black mb-4 tracking-wide">
            HISTORY <span className="text-lime-300">{"//"}</span> 沿革
          </h2>
          <ol className="relative border-s-2 border-neutral-800 pl-6 space-y-4">
            {[
              { y: "2025", txt: "UHOUHO Company サイトβ公開" },
              { y: "2025", txt: "ゲーム風UIコンポーネント設計を公開" },
              { y: "2026", txt: "—" },
            ].map((it, i) => (
              <li key={i} className="grid gap-1">
                <div className="absolute -left-[9px] mt-1 h-4 w-4 bg-lime-400 shadow-[2px_2px_0_0_#111]" />
                <div className="text-sm text-neutral-400">{it.y}</div>
                <div className="font-medium">{it.txt}</div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-[6px_6px_0_0_#1f2937] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-wide">Let’s build something fun & fast.</h2>
              <p className="text-neutral-300 text-sm mt-1">小さく作って、早く学ぶ。成果が出るまで伴走します。</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-lime-400 px-6 py-3 font-extrabold text-neutral-900 shadow-[4px_4px_0_0_#1f2937] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              ご相談はこちら
            </Link>
          </div>
        </section>

        {/* フッター的リンク */}
        <nav className="mt-10 flex flex-wrap gap-4 text-sm text-neutral-400">
          <Link href="/privacy" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">プライバシーポリシー</Link>
          <Link href="/terms" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">利用規約</Link>
          <Link href="/contact" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">お問い合わせ</Link>
        </nav>
      </div>
    </main>
  );
}
