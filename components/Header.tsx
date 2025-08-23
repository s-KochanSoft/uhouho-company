// components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  const nav = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/news", label: "News" },
    { href: "/recruit", label: "Recruit" },
    { href: "/company", label: "Company" },
    // ★ 配列に特別ボタンも追加
    { href: "/contact", label: "Request Consultation", special: true },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* 左：ロゴ */}
        <Link href="/" className={styles.logoLink} aria-label="Top">
          <div className={styles.logoBox}>
            <Image src="/logo.png" alt="Logo" fill className={styles.logoImg} priority />
          </div>
        </Link>

        {/* 右：ナビ */}
        <nav className={styles.nav}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={n.special ? styles.ctaBtn : styles.btn} // ★ specialならCTAスタイル
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}