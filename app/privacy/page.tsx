// app/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | UHOUHO Company",
  description: "UHOUHO Company の個人情報の取扱いに関する方針を定めたプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50 px-4 py-10 sm:py-16">
      {/* 薄いスキャンライン。クリックを邪魔しない */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="font-black text-2xl sm:text-3xl tracking-wide">
            PRIVACY POLICY <span className="text-lime-300">//</span> プライバシーポリシー
          </h1>
          <p className="mt-2 text-sm text-neutral-400">最終更新日：2025-08-23</p>
        </header>

        {/* 本文枠 */}
        <section className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 p-5 sm:p-8 shadow-[4px_4px_0_0_#1f2937]">
          {/* 目次 */}
          <nav aria-label="目次" className="mb-6">
            <ul className="list-disc pl-6 text-sm text-neutral-300 space-y-1">
              <li><a href="#scope" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">1. 目的および適用範囲</a></li>
              <li><a href="#items" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">2. 取得する情報の項目</a></li>
              <li><a href="#purpose" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">3. 利用目的</a></li>
              <li><a href="#basis" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">4. 法的根拠・準拠法</a></li>
              <li><a href="#cookies" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">5. クッキー等の利用</a></li>
              <li><a href="#third" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">6. 第三者提供・委託</a></li>
              <li><a href="#transfer" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">7. 国外移転</a></li>
              <li><a href="#security" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">8. 安全管理措置</a></li>
              <li><a href="#retention" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">9. 保有期間</a></li>
              <li><a href="#rights" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">10. 開示・訂正・利用停止等の請求</a></li>
              <li><a href="#inquiries" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">11. お問い合わせ窓口</a></li>
              <li><a href="#updates" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">12. 改定</a></li>
            </ul>
          </nav>

          <div className="prose prose-invert prose-neutral max-w-none">
            <h2 id="scope" className="scroll-mt-24">1. 目的および適用範囲</h2>
            <p>
              本プライバシーポリシー（以下「本ポリシー」）は、UHOUHO Company（以下「当社」）が提供するウェブサイトおよび関連サービス（以下「本サービス」）における、利用者の個人情報その他の情報の取扱いについて定めるものです。
            </p>

            <h2 id="items" className="scroll-mt-24">2. 取得する情報の項目</h2>
            <p>当社は、以下の情報を必要な範囲で取得します。</p>
            <ul>
              <li>お問い合わせ時にご提供いただく情報（氏名、メールアドレス、電話番号、会社名、所属、その他入力内容）</li>
              <li>Cookie、端末識別子、IPアドレス、ブラウザ情報、リファラ等の技術情報</li>
              <li>アクセス解析により取得される行動履歴（閲覧URL、滞在時間、参照元等）</li>
            </ul>

            <h2 id="purpose" className="scroll-mt-24">3. 利用目的</h2>
            <ul>
              <li>お問い合わせへの回答、連絡、関連情報のご案内</li>
              <li>本サービスの提供、維持、保護および改善</li>
              <li>不正利用の防止、セキュリティ確保</li>
              <li>統計データの作成（個人を識別できない形での分析・公表）</li>
              <li>法令または行政機関の要請に基づく対応</li>
            </ul>

            <h2 id="basis" className="scroll-mt-24">4. 法的根拠・準拠法</h2>
            <p>
              当社は、日本の個人情報保護法（個人情報の保護に関する法律）その他関連法令に従い、適法かつ公正な手段により情報を取り扱います。EU/EEA在住者の情報を取り扱う場合には、適用ある限りGDPRの規律を尊重します。
            </p>

            <h2 id="cookies" className="scroll-mt-24">5. クッキー等の利用</h2>
            <p>
              当社は、利便性向上やアクセス解析のためにCookie等を使用します。ブラウザ設定によりCookieを無効化できますが、本サービスの一部機能が利用できなくなる場合があります。サードパーティの解析ツールを利用する場合、その提供者によるデータ収集・利用が行われることがあります。
            </p>

            <h2 id="third" className="scroll-mt-24">6. 第三者提供・委託</h2>
            <p>
              当社は、法令に基づく場合、本人の同意がある場合、または業務遂行に必要な範囲で秘密保持契約を締結した委託先に対してのみ、情報を第三者に提供・委託することがあります。
            </p>

            <h2 id="transfer" className="scroll-mt-24">7. 国外移転</h2>
            <p>
              本サービスの提供に必要な範囲で、情報を国外のサーバーまたは事業者に移転することがあります。移転先が所在する国・地域の法制に応じ、適切な保護措置を講じます。
            </p>

            <h2 id="security" className="scroll-mt-24">8. 安全管理措置</h2>
            <p>
              当社は、組織的・人的・物理的・技術的安全管理措置を講じ、情報の漏えい、滅失、毀損の防止に努めます。必要に応じて委託先の監督を行います。
            </p>

            <h2 id="retention" className="scroll-mt-24">9. 保有期間</h2>
            <p>
              情報は、利用目的の達成に必要な期間、または法令で定める期間に限り保有し、不要となった場合には適切な方法で削除・廃棄します。
            </p>

            <h2 id="rights" className="scroll-mt-24">10. 開示・訂正・利用停止等の請求</h2>
            <p>
              本人からの開示、訂正、追加、削除、利用停止、第三者提供停止等のご請求には、法令に基づき適切に対応します。請求の際は、本人確認のための情報のご提示をお願いする場合があります。
            </p>

            <h2 id="inquiries" className="scroll-mt-24">11. お問い合わせ窓口</h2>
            <p>
              本ポリシーおよび個人情報の取扱いに関するご質問やご請求は、以下までご連絡ください。
            </p>
            <p>
              UHOUHO Company<br />
              お問い合わせフォーム：<Link href="/contact" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">/contact</Link><br />
              メール：<a href="mailto:support@uhouho.example" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">support@uhouho.example</a>
            </p>

            <h2 id="updates" className="scroll-mt-24">12. 改定</h2>
            <p>
              当社は、必要に応じて本ポリシーを改定することがあります。重要な変更がある場合には、本サイト上で告知します。改定後のポリシーは、本ページに掲載された時点から適用されます。
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
