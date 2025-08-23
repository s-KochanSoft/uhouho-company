// app/contact/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: HTMLFormElement) {
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const next: Record<string, string> = {};
    if (!name) next.name = "お名前を入力してください";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "有効なメールアドレスを入力してください";
    if (!message) next.message = "お問い合わせ内容を入力してください";
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;

    // フロント簡易バリデーション
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      setSubmitting(true);
      const fd = new FormData(form); // ← API側は req.formData() で受ける前提
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        alert(`送信に失敗しました：${data?.error || res.status}`);
        return; // 失敗時はサンクスに行かない
      }
      window.location.href = "/contact/thanks";
    } catch {
      alert("ネットワークエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-neutral-950 text-neutral-50 px-4 py-10 sm:py-16">
      {/* デコレーション層はクリックを邪魔しないように pointer-events-none */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-10 mix-blend-soft-light
                   [background:repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,.12)_2px_3px)]"
      />

      <div className="mx-auto max-w-3xl relative z-10">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Image src="/logo.png" alt="UHOUHO Company" width={48} height={48} className="select-none" />
          <h1 className="font-black text-2xl sm:text-3xl tracking-wide">
            CONTACT <span className="text-lime-300">//</span> UHOUHO
          </h1>
        </div>

        <section className="rounded-none border-[3px] border-neutral-800 bg-neutral-900 shadow-[4px_4px_0_0_#1f2937] p-5 sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="inline-block h-5 w-5 bg-lime-400 shadow-[2px_2px_0_0_#111]" />
            <p className="text-sm sm:text-base text-neutral-300">ご相談内容を入力してください（* は必須）</p>
          </div>

          {/* 重要：inputs は必ず <form> に内包、ボタンは type=submit */}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
            {/* name/email/phone/category/message の name 属性は API のキーと一致させる */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-bold tracking-wide">
                お名前<span className="text-lime-300"> *</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="山田 太郎"
                className="w-full rounded-none border-2 border-neutral-700 bg-neutral-950 px-3 py-3 text-base shadow-[2px_2px_0_0_#111]
                           outline-none placeholder:text-neutral-500 focus:border-lime-400"
              />
              {errors.name && <p className="mt-2 text-sm text-red-300">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold tracking-wide">
                メールアドレス<span className="text-lime-300"> *</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-none border-2 border-neutral-700 bg-neutral-950 px-3 py-3 text-base shadow-[2px_2px_0_0_#111]
                           outline-none placeholder:text-neutral-500 focus:border-lime-400"
              />
              {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-bold tracking-wide">電話番号（任意）</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="090-1234-5678"
                className="w-full rounded-none border-2 border-neutral-700 bg-neutral-950 px-3 py-3 text-base shadow-[2px_2px_0_0_#111]
                           outline-none placeholder:text-neutral-500 focus:border-lime-400"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-bold tracking-wide">相談カテゴリ</label>
              <select
                id="category"
                name="category"
                defaultValue="General"
                className="w-full rounded-none border-2 border-neutral-700 bg-neutral-950 px-3 py-3 text-base shadow-[2px_2px_0_0_#111]
                           outline-none focus:border-lime-400"
              >
                <option value="General">General</option>
                <option value="Website">Website / LP</option>
                <option value="Game">Game / App</option>
                <option value="SEO">SEO / Growth</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-bold tracking-wide">
                お問い合わせ内容<span className="text-lime-300"> *</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="ご相談の背景・目的・ご予算の目安なども書いていただけるとスムーズです。"
                className="w-full rounded-none border-2 border-neutral-700 bg-neutral-950 px-3 py-3 text-base shadow-[2px_2px_0_0_#111]
                           outline-none placeholder:text-neutral-500 focus:border-lime-400"
              />
              {errors.message && <p className="mt-2 text-sm text-red-300">{errors.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                className="mt-1 h-5 w-5 rounded-none border-2 border-neutral-700 bg-neutral-950 shadow-[2px_2px_0_0_#111]
                           checked:bg-lime-400 focus:border-lime-400"
              />
              <label htmlFor="agree" className="text-sm text-neutral-300">
                送信にあたり、<Link href="/privacy" className="underline decoration-lime-400/70 underline-offset-4 hover:decoration-lime-300">プライバシーポリシー</Link>に同意します。
              </label>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex select-none items-center justify-center rounded-none border-[3px] border-neutral-800
                           bg-lime-400 px-6 py-3 font-extrabold text-neutral-900 shadow-[4px_4px_0_0_#1f2937]
                           transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60"
              >
                <span className="mr-2">{submitting ? "SENDING..." : "SEND"}</span>
                <span className="grid place-items-center h-5 w-5 bg-neutral-900 text-lime-300 shadow-[2px_2px_0_0_#111] group-active:shadow-none">▶</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-none border-[3px] border-neutral-800 bg-neutral-800 px-6 py-3
                           font-bold text-neutral-100 shadow-[4px_4px_0_0_#1f2937] hover:bg-neutral-700 active:translate-x-[2px] active:translate-y-[2px]"
              >
                BACK TO HOME
              </Link>
            </div>
          </form>
        </section>

        <p className="mt-6 text-xs text-neutral-400/90 text-center">
          入力欄が見えない・押せない等があれば、別ブラウザか <span className="whitespace-nowrap">support@uhouho.example</span> までご連絡ください。
        </p>
      </div>
    </main>
  );
}