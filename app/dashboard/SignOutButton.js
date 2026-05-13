'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/auth-browser';

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    await getSupabaseBrowser().auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button onClick={handle} disabled={busy} className="nav-cta">
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
