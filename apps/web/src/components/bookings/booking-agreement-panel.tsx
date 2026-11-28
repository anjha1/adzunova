'use client';

import React, { useCallback, useEffect, useState } from 'react';

export interface AgreementSummary {
  agreementId: string;
  bookingId: string;
  version: number;
  templateVersion: string;
  status: 'GENERATING' | 'PENDING_SIGNATURES' | 'SIGNED' | 'EXPIRED' | 'SUPERSEDED';
  pdfSha256: string | null;
  signedPdfSha256: string | null;
  provider: string;
  brandSignedAt: string | null;
  creatorSignedAt: string | null;
  expiresAt: string;
  signedAt: string | null;
}

interface BookingAgreementPanelProps {
  bookingId: string;
  bookingStatus: string;
  viewerRole: 'BRAND' | 'CREATOR';
  onStatusUpdated?: () => void;
}

export function BookingAgreementPanel({
  bookingId,
  bookingStatus,
  viewerRole,
  onStatusUpdated,
}: BookingAgreementPanelProps) {
  const [agreement, setAgreement] = useState<AgreementSummary | null>(null);
  const [esignConfigured, setEsignConfigured] = useState(false);
  const [esignMessage, setEsignMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const shouldRender =
    bookingStatus === 'ACCEPTED' ||
    bookingStatus === 'AGREEMENT_PENDING' ||
    bookingStatus === 'SIGNED' ||
    bookingStatus === 'EXPIRED';

  const loadAgreement = useCallback(async () => {
    if (!shouldRender) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/agreement`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load agreement status');
      } else {
        setAgreement(data.agreement ?? null);
        setEsignConfigured(Boolean(data.esignConfigured));
        setEsignMessage(data.esignMessage ?? null);
      }
    } catch {
      setErrorMsg('Network error loading agreement');
    } finally {
      setLoading(false);
    }
  }, [bookingId, shouldRender]);

  useEffect(() => {
    void loadAgreement();
  }, [loadAgreement, bookingStatus]);

  if (!shouldRender) return null;

  const handleGenerate = async () => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/agreement`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to generate agreement PDF');
        return;
      }
      setAgreement(data.agreement ?? null);
      setEsignConfigured(Boolean(data.esignConfigured));
      setEsignMessage(data.esignMessage ?? null);
      onStatusUpdated?.();
    } catch {
      setErrorMsg('Network error generating agreement PDF');
    } finally {
      setBusy(false);
    }
  };

  const handleViewPdf = async (signed = false) => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const url = `/api/bookings/${encodeURIComponent(bookingId)}/agreement/pdf${signed ? '?signed=1' : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Unable to authorize agreement PDF');
        return;
      }
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setErrorMsg('Network error fetching agreement PDF');
    } finally {
      setBusy(false);
    }
  };

  const handleSign = async () => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/agreement/sign`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'E-sign not configured');
        return;
      }
      if (data.signingUrl) {
        window.open(data.signingUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setErrorMsg('Network error starting e-sign session');
    } finally {
      setBusy(false);
    }
  };

  const viewerSigned =
    viewerRole === 'BRAND' ? Boolean(agreement?.brandSignedAt) : Boolean(agreement?.creatorSignedAt);
  const counterpartySigned =
    viewerRole === 'BRAND' ? Boolean(agreement?.creatorSignedAt) : Boolean(agreement?.brandSignedAt);

  let statusLabel = 'Agreement Ready';
  if (bookingStatus === 'SIGNED' || agreement?.status === 'SIGNED') {
    statusLabel = 'Signed';
  } else if (bookingStatus === 'EXPIRED' || agreement?.status === 'EXPIRED') {
    statusLabel = 'Expired';
  } else if (agreement?.status === 'PENDING_SIGNATURES') {
    if (!viewerSigned) statusLabel = 'Awaiting Your Signature';
    else if (!counterpartySigned) statusLabel = 'Awaiting Other Party';
  }

  return (
    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">Agreement &amp; E-Sign</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-card text-foreground">
            {statusLabel}
          </span>
        </div>
        {agreement && (
          <span className="text-[11px] text-muted-foreground">
            {`v${agreement.version} · ${agreement.templateVersion}`}
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => void loadAgreement()}
            className="underline font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading agreement status...</p>
      ) : !agreement || agreement.status === 'GENERATING' ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {agreement?.status === 'GENERATING'
              ? 'Agreement PDF storage did not complete. Retry generation safely.'
              : 'Terms accepted. Generate the immutable agreement PDF to proceed with signatures.'}
          </p>
          {bookingStatus === 'ACCEPTED' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleGenerate()}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 !text-white text-xs font-bold"
            >
              {busy
                ? 'Generating...'
                : agreement?.status === 'GENERATING'
                  ? 'Retry Agreement PDF'
                  : 'Generate Agreement'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-card border border-border">
              <div className="text-muted-foreground">Brand Signature</div>
              <div className="font-semibold text-foreground mt-0.5">
                {agreement.brandSignedAt
                  ? `Signed (${new Date(agreement.brandSignedAt).toLocaleDateString()})`
                  : 'Pending'}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-card border border-border">
              <div className="text-muted-foreground">Creator Signature</div>
              <div className="font-semibold text-foreground mt-0.5">
                {agreement.creatorSignedAt
                  ? `Signed (${new Date(agreement.creatorSignedAt).toLocaleDateString()})`
                  : 'Pending'}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-card border border-border">
              <div className="text-muted-foreground">Signing Deadline</div>
              <div className="font-semibold text-foreground mt-0.5">
                {new Date(agreement.expiresAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {agreement.pdfSha256 && (
            <div className="text-[11px] text-muted-foreground">
              {`PDF SHA-256: ${agreement.pdfSha256.slice(0, 16)}...`}
            </div>
          )}

          {(bookingStatus === 'SIGNED' || agreement.status === 'SIGNED') && (
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
              Agreement signed. Payment is not enabled yet.
            </div>
          )}

          {(bookingStatus === 'EXPIRED' || agreement.status === 'EXPIRED') && (
            <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium">
              Agreement signing deadline expired. Late signatures are rejected.
            </div>
          )}

          {agreement.status === 'PENDING_SIGNATURES' && !esignConfigured && (
            <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
              {esignMessage || 'E-sign not configured'}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {agreement.pdfSha256 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleViewPdf(false)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted"
              >
                View Agreement PDF
              </button>
            )}
            {agreement.signedPdfSha256 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleViewPdf(true)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted"
              >
                View Signed PDF
              </button>
            )}
            {agreement.status === 'PENDING_SIGNATURES' && !viewerSigned && (
              <button
                type="button"
                disabled={busy || !esignConfigured}
                onClick={() => void handleSign()}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 !text-white text-xs font-bold"
              >
                {esignConfigured ? 'Sign Agreement' : 'E-sign not configured'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
