// app/contact/thanks/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanks | UHOUHO Company",
  robots: { index: false, follow: false }, // ありがとうページは検索除外
};

export default function ThanksPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="UHOUHO Company"
          width={120}
          height={120}
          priority
          sizes="120px"
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
        Thank you for your inquiry!
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-center leading-relaxed">
        お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。
      </p>

      <Link
        href="/"
        aria-label="Back to Home"
        className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white"
        role="button"
      >
        Back to Home
      </Link>
    </main>
  );
}