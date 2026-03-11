'use client';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function Repositories() {
  const [repos, setRepos] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const r = await apiFetch('/api/github/repos');
        setRepos(r.repos);
      } catch (e: any) {
        setError(e.message);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => repos.filter(r => r.fullName.toLowerCase().includes(query.toLowerCase())), [repos, query]);

  async function connect(fullName: string) {
    try {
      setBusy(fullName);
      await apiFetch('/api/repos/connect', { method: 'POST', body: JSON.stringify({ fullName }) });
      alert(`Connected ${fullName}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  }

  if (error) return <div>
    <p style={{ color: 'crimson' }}>Error: {error}</p>
    <a href="/">Go back</a>
  </div>;

  return (
    <div>
      <h2>Select repositories to connect</h2>
      <input placeholder="Search repositories" value={query} onChange={e => setQuery(e.target.value)} style={{ padding: 8, width: '100%', maxWidth: 400 }} />
      <ul>
        {filtered.map(r => (
          <li key={r.fullName} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
            <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{r.fullName}</code>
            <button onClick={() => connect(r.fullName)} disabled={busy === r.fullName}>
              {busy === r.fullName ? 'Connecting…' : 'Connect'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}