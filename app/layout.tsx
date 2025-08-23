// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AI Coding Contest",
  description: "ATCODERのAI版・競技プログラミング（仮）公式サイト",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={pressStart2P.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}