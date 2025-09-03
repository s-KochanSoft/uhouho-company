// components/RealtimeBoardWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// RealtimeBoard をクライアント側だけで描画（SSR無効）
const RealtimeBoard = dynamic(() => import("./RealtimeBoard"), {
  ssr: false,
});

export default function RealtimeBoardWrapper() {
  return <RealtimeBoard />;
}
