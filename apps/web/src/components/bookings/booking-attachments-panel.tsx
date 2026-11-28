'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface AttachmentItem {
  assetId: string;
  fileName: string;
  contentType: string;
  scanStatus: string;
  releaseStatus: string;
  canDownload: boolean;
}

interface BookingAttachmentsPanelProps {
  bookingId: string;
  assetCount: number;
}

function formatScanBadge(scanStatus: string, canDownload: boolean): {
  label: string;
  cls: string;
} {
  if (canDownload && scanStatus === 'CLEAN') {
    return {
      label: 'Ready',
      cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    };
  }
  if (scanStatus === 'REJECTED') {
    return {
      label: 'File rejected',
      cls: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    };
  }
  if (scanStatus === 'SCAN_FAILED') {
    return {
      label: 'Scan unavailable',
      cls: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    };
  }
  return {
    label: 'Uploaded — scan pending',
    cls: 'border-border bg-muted text-muted-foreground',
  };
}

export function BookingAttachmentsPanel({ bookingId, assetCount }: BookingAttachmentsPanelProps) {
  const [items, setItems] = useState<AttachmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAttachments = useCallback(async () => {
    if (assetCount <= 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/attachments`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load attachments');
      } else {
        setItems(Array.isArray(data.items) ? data.items : []);
      }
    } catch {
      setErrorMsg('Network error loading attachments');
    } finally {
      setLoading(false);
    }
  }, [bookingId, assetCount]);

  useEffect(() => {
    void loadAttachments();
  }, [loadAttachments]);

  if (assetCount <= 0) return null;

  const handleDownload = async (assetId: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(bookingId)}/attachments/${encodeURIComponent(assetId)}/download`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Download blocked');
        return;
      }
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setErrorMsg('Network error authorizing download');
    }
  };

  return (
    <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Brief Attachments</span>
        <button
          type="button"
          onClick={() => void loadAttachments()}
          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Refresh
        </button>
      </div>
      {errorMsg && (
        <div className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[11px]">
          {errorMsg}
        </div>
      )}
      {loading ? (
        <p className="text-[11px] text-muted-foreground">Checking attachment scan status...</p>
      ) : items.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">No accessible attachments.</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((item) => {
            const badge = formatScanBadge(item.scanStatus, item.canDownload);
            return (
              <div
                key={item.assetId}
                className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-foreground truncate">{item.fileName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
                {item.canDownload && (
                  <button
                    type="button"
                    onClick={() => void handleDownload(item.assetId)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 !text-white text-[11px] font-bold"
                  >
                    Download
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
