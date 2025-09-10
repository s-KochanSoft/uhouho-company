"use client";

import dynamic from "next/dynamic";
import ClientErrorBoundary from "./ClientErrorBoundary";

// SSR無効でクライアントだけ読み込み
const RealtimeBoard = dynamic(() => import("./RealtimeBoard"), { ssr: false });

export default function RealtimeBoardWrapper() {
  return (
    <ClientErrorBoundary
      fallback={
        <div className="text-sm text-red-400 border border-red-500/40 p-3 bg-red-950/30 rounded">
          掲示板の読み込み中にエラーが発生しました。設定を確認しています。
        </div>
      }
    >
      <RealtimeBoard />
    </ClientErrorBoundary>
  );
}
