// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{padding:"24px", borderTop:"1px solid #eee", marginTop:"40px"}}>
      <p style={{marginBottom:"8px"}}>
        <Link href="/terms">利用規約</Link> / 
        <Link href="/privacy">プライバシー</Link> / 
        <Link href="/contact">問い合わせ</Link>
      </p>
      <small>© {new Date().getFullYear()} © Uhouho Conpany All Rights Reserved.</small>
    </footer>
  );
}