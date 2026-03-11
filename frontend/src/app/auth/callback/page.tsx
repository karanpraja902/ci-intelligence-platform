'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      router.replace('/dashboard');
    } else {
      router.replace('/');
    }
  }, [router]);
  return <p>Signing you in…</p>;
}