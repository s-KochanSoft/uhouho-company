// app/recruit/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruit | UHOUHO Company",
  description: "UHOUHO Companyの採用ページ（いまは準備中）",
  robots: { index: false, follow: true }, // いまは採用してないので検索除外
};

export default function RecruitPage() {
  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center px-4">
      {/* 背景スキャンライン */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      {/* 一言だけ、でかでかと */}
      <h1
        className="relative z-10 select-none text-center font-black tracking-wide leading-tight
                   text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
      >
        <span className="block">NO OPEN ROLES</span>
        <span className="block text-lime-300">WE’RE GRINDING EXP.</span>
      </h1>
      <p className="relative z-10 mt-4 text-sm text-neutral-400">※ 現在は経験値稼ぎ中です</p>
    </main>
  );
}
