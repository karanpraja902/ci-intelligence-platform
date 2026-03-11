export const metadata = { title: 'Distributed CI Intelligence', description: 'Code Review Platform' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <strong>Distributed CI Intelligence</strong>
        </header>
        <main style={{ padding: '16px' }}>{children}</main>
      </body>
    </html>
  );
}