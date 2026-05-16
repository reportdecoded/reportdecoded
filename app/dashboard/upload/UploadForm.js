'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { track } from '@vercel/analytics';
import { useUploadThing } from '@/lib/uploadthing';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function UploadForm({ tier }) {
  const router = useRouter();
  // When the user clicks "Try again" on a failed row in /dashboard/reports,
  // we redirect them here with ?retryFor=<reportId>&addr=...&intent=...&type=...
  // so they don't have to retype the metadata. The PDF still has to be
  // selected fresh (UploadThing URLs aren't reusable across submissions).
  const params = useSearchParams();
  const [file, setFile] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  const [propertyAddress, setPropertyAddress] = useState(params?.get('addr') || '');
  const [purchasePrice, setPurchasePrice] = useState(params?.get('price') || '');
  const [clientEmail, setClientEmail] = useState(params?.get('email') || '');
  const [reportType, setReportType] = useState(params?.get('type') || 'pre_purchase');
  const [purchaseIntent, setPurchaseIntent] = useState(params?.get('intent') || 'home');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const retryFor = params?.get('retryFor') || null;

  const { startUpload, isUploading } = useUploadThing('agentReport', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.serverData?.url || res?.[0]?.ufsUrl || res?.[0]?.url;
      if (!url) {
        setError('Upload finished but no URL returned.');
        return;
      }
      setReportUrl(url);
      setError(null);
    },
    onUploadError: (e) => setError(e?.message || 'Upload failed.'),
  });

  const handleFileSelect = (e) => {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('File is over 25 MB. Please choose a smaller PDF.');
      return;
    }
    setFile(f);
    setReportUrl(null);
    startUpload([f]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!reportUrl) {
      setError('Please attach the inspection PDF first.');
      return;
    }
    if (!propertyAddress.trim()) {
      setError('Please enter the property address — it powers the local tradie matching for your client.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/agent-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportUrl,
          propertyAddress: propertyAddress || null,
          purchasePrice: purchasePrice ? Number(purchasePrice) : null,
          clientEmail: clientEmail || null,
          reportType,
          purchaseIntent,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not start analysis.');
        setSubmitting(false);
        track('agent_upload_failed', { tier, reportType, purchaseIntent, message: (data.error || '').slice(0, 80) });
        return;
      }

      track('agent_upload_completed', { tier, reportType, purchaseIntent, overage: !!data.overage });

      // Redirect to the dashboard reports list so the agent can watch the
      // new report flip from 'processing' -> 'complete'.
      router.push(`/dashboard/reports?new=${data.reportId}${data.overage ? '&overage=1' : ''}`);
    } catch (err) {
      setError(err?.message || 'Network error');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      {retryFor && (
        <div
          style={{
            marginBottom: 18,
            padding: '12px 14px',
            background: 'var(--cream2)',
            border: '1px dashed var(--gold)',
            borderRadius: 8,
            fontSize: 13,
            color: 'var(--ink)',
            lineHeight: 1.5,
          }}
        >
          <strong>Re-uploading.</strong> Your previous attempt failed —
          we've pre-filled the address, intent, and report type so you just
          need to attach the correct inspection PDF and resubmit.
        </div>
      )}

      {/* --- PDF picker --- */}
      <Label>1. Inspection PDF</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        aria-label="Upload your client's Australian building or pest inspection report PDF"
        style={{ display: 'none' }}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        style={dropzoneStyle(!!reportUrl, isUploading)}
      >
        {isUploading ? (
          <span>Uploading {file?.name}…</span>
        ) : reportUrl ? (
          <span>✓ {file?.name} ready</span>
        ) : (
          <span style={{ color: 'var(--muted)' }}>Click to choose PDF (max 25 MB)</span>
        )}
      </div>

      {/* --- Address (required — powers tradie matching) --- */}
      <Label>
        2. Property address <span style={{ ...hintStyle, color: 'var(--amber)' }}>*required</span>
      </Label>
      <AddressAutocomplete
        value={propertyAddress}
        onChange={setPropertyAddress}
        placeholder="123 Main Street, Suburb VIC 3000"
        inputStyle={inputStyle}
        required
      />
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
        Start typing — pick a suggestion to lock in a real address. Powers the
        local tradie matching for your client.
      </div>

      {/* --- Purchase price (optional) --- */}
      <Label>
        3. Purchase price <span style={hintStyle}>(optional — sharpens negotiation estimates)</span>
      </Label>
      <input
        type="number"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
        placeholder="850000"
        min="0"
        style={inputStyle}
      />

      {/* --- Report type --- */}
      <Label>4. Report type</Label>
      <div style={toggleRowStyle}>
        <ToggleOption
          active={reportType === 'pre_purchase'}
          onClick={() => setReportType('pre_purchase')}
          label="Pre-purchase"
          sub="Existing property"
        />
        <ToggleOption
          active={reportType === 'new_build_handover'}
          onClick={() => setReportType('new_build_handover')}
          label="New build handover"
          sub="Snagging list for builder"
        />
      </div>

      {/* --- Purchase intent --- */}
      <Label>5. Your client's intent</Label>
      <div style={toggleRowStyle}>
        <ToggleOption
          active={purchaseIntent === 'home'}
          onClick={() => setPurchaseIntent('home')}
          label="Home"
          sub="Owner-occupier"
        />
        <ToggleOption
          active={purchaseIntent === 'investment'}
          onClick={() => setPurchaseIntent('investment')}
          label="Investment"
          sub="Investor"
        />
      </div>

      {/* --- Optional client email --- */}
      <Label>
        6. Client email <span style={hintStyle}>(optional — they'll get a copy when ready)</span>
      </Label>
      <input
        type="email"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
        placeholder="client@example.com"
        style={inputStyle}
      />

      <button
        type="submit"
        disabled={submitting || isUploading || !reportUrl}
        style={submitStyle(submitting || isUploading || !reportUrl)}
      >
        {submitting ? 'Starting analysis…' : 'Generate report →'}
      </button>

      {error && (
        <div style={{ marginTop: 14, color: 'var(--red)', fontSize: 14 }}>
          {error}
        </div>
      )}

      {tier === 'starter' && (
        <div style={hintFooterStyle}>
          Starter plan: 12 reports/month included. Report #13+ within 30 days
          adds $15 to your next invoice via metered billing.
        </div>
      )}
    </form>
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        marginTop: 18,
        marginBottom: 6,
        color: 'var(--text)',
      }}
    >
      {children}
    </label>
  );
}

function ToggleOption({ active, onClick, label, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        background: active ? 'var(--amber)' : '#fff',
        color: active ? '#fff' : 'var(--text)',
        border: active ? 0 : '1px solid var(--border)',
        padding: '12px 14px',
        borderRadius: 10,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

// --- Styles ---
const cardStyle = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '28px 30px',
};
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontFamily: 'inherit',
  background: '#fff',
  color: 'var(--text)',
  boxSizing: 'border-box',
};
const hintStyle = {
  color: 'var(--subtle)',
  fontSize: 12,
  fontWeight: 400,
};
const hintFooterStyle = {
  marginTop: 16,
  padding: '10px 14px',
  background: 'var(--cream2)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--muted)',
  lineHeight: 1.5,
};
const toggleRowStyle = {
  display: 'flex',
  gap: 10,
};
const dropzoneStyle = (haveUrl, uploading) => ({
  border: '1px dashed var(--border)',
  borderRadius: 10,
  padding: '20px 16px',
  textAlign: 'center',
  cursor: uploading ? 'wait' : 'pointer',
  background: haveUrl ? 'var(--teal-light)' : '#fafafa',
  color: haveUrl ? 'var(--teal)' : 'var(--text)',
  fontWeight: haveUrl ? 600 : 400,
  fontSize: 14,
});
const submitStyle = (disabled) => ({
  marginTop: 24,
  background: disabled ? 'var(--cream2)' : 'var(--amber)',
  color: disabled ? 'var(--muted)' : '#fff',
  border: 0,
  padding: '14px 20px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 15,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
  width: '100%',
});
