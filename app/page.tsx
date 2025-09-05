// app/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Uhouho Company</h1>
      <p>暫定ホーム。/api/health と /api/debug/env を確認してください。</p>
      <ul>
        <li><a href="/api/health">/api/health</a></li>
        <li><a href="/api/debug/env">/api/debug/env</a></li>
      </ul>
    </main>
  );
}
