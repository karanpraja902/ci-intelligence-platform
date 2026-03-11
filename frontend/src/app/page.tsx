'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function HomePage() {
  const loginUrl = `${API_BASE}/auth/github`;
  return (
    <div>
      <h1>Welcome</h1>
      <p>Connect GitHub to start analyzing repositories.</p>
      <a href={loginUrl} style={{ display: 'inline-block', padding: '8px 12px', background: '#24292f', color: '#fff', borderRadius: 6 }}>Sign in with GitHub</a>
    </div>
  );
}