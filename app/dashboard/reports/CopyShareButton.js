'use client';

import { useState } from 'react';

export default function CopyShareButton({ shareUrl }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const fullUrl = new URL(shareUrl, window.location.origin).toString();
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: select prompt
      window.prompt('Copy this link:', new URL(shareUrl, window.location.origin).toString());
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: copied ? 'var(--teal-light)' : 'transparent',
        color: copied ? 'var(--teal)' : 'var(--muted)',
        border: '1px solid var(--border)',
        fontSize: 12,
        fontWeight: 600,
        padding: '6px 10px',
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? '✓ Copied' : 'Copy link'}
    </button>
  );
}
