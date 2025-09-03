// app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 | UHOUHO Company",
  description: "UHOUHO Company のウェブサイトおよび関連サービスに関する利用規約です。",
};

export default function TermsPage() {
  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50 px-4 py-10 sm:py-16">
      {/* 装飾（ゲーム風・薄いスキャンライン） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="font-black text-2xl sm:text-3xl tracking-wide">
            TERMS OF USE <span className="text-lime-300">{"//"}</span> 利用規約
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            最終更新日：2025-08-23
          </p>
        </header>

        {/* 枠 */}
        <section className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-5 sm:p-8 shadow-[4px_4px_0_0_#1f2937]">
          {/* 目次 */}
          <nav aria-label="目次" className="mb-6">
            <ul className="list-disc pl-6 text-sm text-neutral-300 space-y-1">
              <li><a href="#art1" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第1条（適用）</a></li>
              <li><a href="#art2" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第2条（利用登録）</a></li>
              <li><a href="#art3" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第3条（禁止事項）</a></li>
              <li><a href="#art4" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第4条（本サービスの提供停止等）</a></li>
              <li><a href="#art5" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第5条（免責事項）</a></li>
              <li><a href="#art6" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第6条（知的財産権）</a></li>
              <li><a href="#art7" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第7条（利用規約の変更）</a></li>
              <li><a href="#art8" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">第8条（準拠法・裁判管轄）</a></li>
            </ul>
          </nav>

          <div className="prose prose-invert prose-neutral max-w-none">
            <h2 id="art1">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、UHOUHO Company（以下「当社」）が提供するウェブサイトおよび関連サービス（以下「本サービス」）の利用に関し、利用者と当社との間に適用されます。利用者は、本サービスを利用することにより本規約に同意したものとみなします。
            </p>

            <h2 id="art2">第2条（利用登録）</h2>
            <ol>
              <li>本サービスの一部の機能を利用する場合、当社所定の方法により利用登録を行う必要があります。</li>
              <li>当社は、申込者が以下の事由に該当すると判断した場合、利用登録を承認しないことがあります。
                <ul>
                  <li>虚偽の情報を申請した場合</li>
                  <li>過去に本規約違反等により利用停止措置を受けたことがある場合</li>
                  <li>その他当社が適当でないと判断した場合</li>
                </ul>
              </li>
            </ol>

            <h2 id="art3">第3条（禁止事項）</h2>
            <p>利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ol>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社、他の利用者、または第三者の知的財産権、肖像権、プライバシーを侵害する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセスやセキュリティホールの悪用</li>
              <li>当社の許可なく営利目的で本サービスを利用する行為</li>
            </ol>

            <h2 id="art4">第4条（本サービスの提供停止等）</h2>
            <p>当社は、以下の場合、利用者に事前通知することなく本サービスの全部または一部の提供を停止または中断することがあります。</p>
            <ul>
              <li>システムの保守点検を行う場合</li>
              <li>火災、停電、天災等の不可抗力によりサービス提供が困難となった場合</li>
              <li>通信回線やサーバーが停止した場合</li>
              <li>その他、当社が提供の継続を困難と判断した場合</li>
            </ul>

            <h2 id="art5">第5条（免責事項）</h2>
            <ol>
              <li>当社は、本サービスに事実上または法律上の瑕疵がないことを保証しません。</li>
              <li>利用者が本サービスを利用したことにより生じたいかなる損害についても、当社は責任を負いません。ただし、故意または重過失による場合はこの限りではありません。</li>
              <li>利用者同士または第三者との間で生じた紛争について、当社は一切責任を負いません。</li>
            </ol>

            <h2 id="art6">第6条（知的財産権）</h2>
            <p>
              本サービスに関する著作権、商標権その他一切の知的財産権は、当社または正当な権利者に帰属します。利用者は、当社の事前の承諾なく、本サービスを利用して得られる情報を複製・転載・頒布してはなりません。
            </p>

            <h2 id="art7">第7条（利用規約の変更）</h2>
            <p>
              当社は、必要と判断した場合には、利用者に通知することなく本規約を変更することがあります。変更後の規約は、本サイトに掲載した時点で効力を生じます。
            </p>

            <h2 id="art8">第8条（準拠法・裁判管轄）</h2>
            <p>
              本規約の解釈および適用は、日本法に準拠するものとします。 本サービスに関して生じた紛争については、当社本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </div>

          {/* 戻るリンク */}
          <div className="mt-8 flex justify-end">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-neutral-800 px-5 py-3 font-bold text-neutral-100 shadow-[4px_4px_0_0_#1f2937] hover:bg-neutral-700"
            >
              BACK TO HOME
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
