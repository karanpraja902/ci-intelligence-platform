'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const me = await apiFetch('/api/me');
        setUser(me.user);
        const r = await apiFetch('/api/repos');
        setRepos(r.repos);
      } catch (e: any) {
        setError(e.message);
      }
    }
    load();
  }, []);

  if (error) return <div>
    <p style={{ color: 'crimson' }}>Error: {error}</p>
    <a href="/">Go back</a>
  </div>;

  if (!user) return <p>Loading…</p>;

  return (
    <div>
      <h2>Welcome, {user.login}</h2>
      <p>Connected repositories: {repos.length}</p>
      <ul>
        {repos.map((r) => (
          <li key={r.id}>{r.fullName} {r.private ? '(private)' : ''}</li>
        ))}
      </ul>
      <p><a href="/repositories">Connect more repositories →</a></p>
    </div>
  );
}