'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { StoragePurpose } from '@/lib/storage/classification';

export interface UploadedAssetResult {
  sessionId: string;
  assetId: string;
  assetUuid: string;
  purpose: StoragePurpose;
  visibility: 'PUBLIC' | 'PRIVATE';
  scanStatus: 'REENCODED' | 'QUARANTINED' | 'SCANNING' | 'CLEAN' | 'REJECTED' | 'SCAN_FAILED' | 'NOT_SCANNED';
  sha256Hex: string;
  sizeBytes: number;
  contentType: string;
  publicUrl: string | null;
  thumbUrl: string | null;
  objectKey: string;
  bucket: string;
}

export interface FileUploaderProps {
  purpose: StoragePurpose;
  label: string;
  accept: string;
  maxSizeLabel?: string;
  currentUrl?: string | null;
  allowCamera?: boolean;
  onUploaded: (result: UploadedAssetResult) => void;
  testId?: string;
}

type UploadPhase =
  | 'idle'
  | 'hashing'
  | 'uploading'
  | 'paused'
  | 'finalizing'
  | 'ready'
  | 'rejected'
  | 'not_configured'
  | 'error';

interface PersistedMultipartState {
  sessionId: string;
  partSize: number;
  partCount: number;
  parts: Array<{ partNumber: number; etag: string }>;
}

function hashFileInWorker(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/workers/sha256-worker.js');
    worker.onmessage = (ev) => {
      if (ev.data?.type === 'progress') {
        const pct = ev.data.total > 0 ? Math.round((ev.data.loaded / ev.data.total) * 100) : 100;
        onProgress(pct);
      } else if (ev.data?.type === 'done') {
        worker.terminate();
        resolve(ev.data.sha256);
      }
    };
    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message || 'Hashing failed'));
    };
    worker.postMessage({ file });
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileUploader({
  purpose,
  label,
  accept,
  maxSizeLabel,
  currentUrl,
  allowCamera = false,
  onUploaded,
  testId,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pausedRef = useRef(false);

  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [speedText, setSpeedText] = useState('');
  const [etaText, setEtaText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<UploadedAssetResult | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const storageKeyFor = (file: File) => `adzunova:mp:${purpose}:${file.name}:${file.size}`;

  const runUpload = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      setErrorMsg(null);
      setLastResult(null);
      pausedRef.current = false;

      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setPhase('hashing');
        setProgressPct(0);
        const sha256 = await hashFileInWorker(file, (pct) => setProgressPct(pct));

        setPhase('uploading');
        setProgressPct(0);

        // Check for resumable multipart session in sessionStorage
        let resumeSession: PersistedMultipartState | null = null;
        try {
          const raw = sessionStorage.getItem(storageKeyFor(file));
          if (raw) resumeSession = JSON.parse(raw);
        } catch {
          resumeSession = null;
        }

        let sessionId = '';
        let mode: 'single' | 'multipart' = 'single';
        let partSize = file.size;
        let partCount = 1;
        let singleUploadUrl = '';
        const completedParts = new Map<number, string>();

        if (resumeSession?.sessionId) {
          const stRes = await fetch(`/api/storage/uploads/${resumeSession.sessionId}`, {
            signal: controller.signal,
          });
          if (stRes.ok) {
            const st = await stRes.json();
            if (st.status === 'INITIATED') {
              sessionId = st.sessionId;
              mode = st.mode;
              partSize = st.partSize;
              partCount = st.partCount;
              for (const p of st.uploadedParts || []) {
                completedParts.set(p.partNumber, p.etag);
              }
              for (const p of resumeSession.parts || []) {
                if (!completedParts.has(p.partNumber)) completedParts.set(p.partNumber, p.etag);
              }
            }
          }
        }

        if (!sessionId) {
          const idempKey = `${purpose}-${sha256.slice(0, 16)}-${file.size}`;
          const createRes = await fetch('/api/storage/uploads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              purpose,
              fileName: file.name,
              declaredSize: file.size,
              declaredContentType: file.type || 'application/octet-stream',
              sha256,
              idempotencyKey: idempKey,
            }),
          });

          if (!createRes.ok) {
            const problem = await createRes.json().catch(() => ({}));
            if (problem.code === 'STORAGE_NOT_CONFIGURED' || createRes.status === 503) {
              setPhase('not_configured');
              setErrorMsg(problem.detail || 'Storage not configured');
              return;
            }
            if (problem.code === 'QUOTA_EXCEEDED') {
              setPhase('rejected');
              setErrorMsg('Storage quota exceeded.');
              return;
            }
            setPhase('rejected');
            setErrorMsg(problem.detail || 'Upload request rejected.');
            return;
          }

          const created = await createRes.json();
          if (created.completed && created.result) {
            setLastResult(created.result);
            setPhase('ready');
            setProgressPct(100);
            onUploaded(created.result);
            return;
          }

          sessionId = created.sessionId;
          mode = created.mode;
          partSize = created.partSize;
          partCount = created.partCount;
          singleUploadUrl = created.uploadUrl || '';
        }

        const startTime = Date.now();
        let uploadedBytes = 0;

        if (mode === 'single') {
          const putRes = await fetch(singleUploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file,
            signal: controller.signal,
          });
          if (!putRes.ok) {
            throw new Error(`Direct upload failed (${putRes.status})`);
          }
          uploadedBytes = file.size;
          setProgressPct(100);
        } else {
          // Persist multipart session for reload resume
          const saveProgress = () => {
            const partsArr = Array.from(completedParts.entries()).map(([partNumber, etag]) => ({ partNumber, etag }));
            try {
              sessionStorage.setItem(
                storageKeyFor(file),
                JSON.stringify({ sessionId, partSize, partCount, parts: partsArr })
              );
            } catch {
              // ignore storage quota
            }
          };
          saveProgress();

          const remaining: number[] = [];
          for (let pn = 1; pn <= partCount; pn++) {
            if (!completedParts.has(pn)) remaining.push(pn);
            else uploadedBytes += Math.min(partSize, file.size - (pn - 1) * partSize);
          }

          // Fetch presigned part URLs in batches of up to 50
          const partUrlMap = new Map<number, string>();
          for (let i = 0; i < remaining.length; i += 50) {
            const batch = remaining.slice(i, i + 50);
            const pRes = await fetch(`/api/storage/uploads/${sessionId}/parts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({ partNumbers: batch }),
            });
            if (!pRes.ok) {
              const prob = await pRes.json().catch(() => ({}));
              throw new Error(prob.detail || 'Failed to sign upload parts');
            }
            const pJson = await pRes.json();
            for (const item of pJson.parts || []) {
              partUrlMap.set(item.partNumber, item.url);
            }
          }

          // Adaptive concurrency (starts at 3, backs off on 429/503)
          let concurrency = 3;
          let cursor = 0;
          const uploadOnePart = async (partNumber: number) => {
            const start = (partNumber - 1) * partSize;
            const end = Math.min(start + partSize, file.size);
            const blob = file.slice(start, end);
            const url = partUrlMap.get(partNumber);
            if (!url) throw new Error(`Missing presigned URL for part ${partNumber}`);

            for (let attempt = 1; attempt <= 3; attempt++) {
              if (pausedRef.current || controller.signal.aborted) return;
              const resp = await fetch(url, {
                method: 'PUT',
                body: blob,
                signal: controller.signal,
              });
              if (resp.ok) {
                const etag = resp.headers.get('etag') || resp.headers.get('ETag') || '';
                if (!etag) throw new Error('R2 CORS did not expose ETag header');
                completedParts.set(partNumber, etag);
                uploadedBytes += blob.size;
                const elapsedSec = Math.max(0.2, (Date.now() - startTime) / 1000);
                const bps = uploadedBytes / elapsedSec;
                const remSec = Math.max(0, Math.round((file.size - uploadedBytes) / Math.max(1, bps)));
                setProgressPct(Math.min(99, Math.round((uploadedBytes / file.size) * 100)));
                setSpeedText(`${(bps / (1024 * 1024)).toFixed(2)} MB/s`);
                setEtaText(`${remSec}s left`);
                saveProgress();
                return;
              }
              if (resp.status === 429 || resp.status >= 500) {
                concurrency = 1;
                await new Promise((r) => setTimeout(r, 300 * attempt));
                continue;
              }
              throw new Error(`Part ${partNumber} failed (${resp.status})`);
            }
            throw new Error(`Part ${partNumber} failed after retries`);
          };

          while (cursor < remaining.length && !pausedRef.current && !controller.signal.aborted) {
            const slice = remaining.slice(cursor, cursor + concurrency);
            cursor += slice.length;
            await Promise.all(slice.map((pn) => uploadOnePart(pn)));
          }

          if (pausedRef.current) {
            setPhase('paused');
            return;
          }
        }

        setPhase('finalizing');
        const partsList =
          mode === 'multipart'
            ? Array.from(completedParts.entries())
                .map(([partNumber, etag]) => ({ partNumber, etag }))
                .sort((a, b) => a.partNumber - b.partNumber)
            : undefined;

        const compRes = await fetch(`/api/storage/uploads/${sessionId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ parts: partsList }),
        });

        if (!compRes.ok) {
          const prob = await compRes.json().catch(() => ({}));
          setPhase('rejected');
          setErrorMsg(prob.detail || 'File validation failed.');
          try {
            sessionStorage.removeItem(storageKeyFor(file));
          } catch {}
          return;
        }

        const result: UploadedAssetResult = await compRes.json();
        try {
          sessionStorage.removeItem(storageKeyFor(file));
        } catch {}
        setLastResult(result);
        if (result.publicUrl) {
          setPreviewUrl((prev) => {
            if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
            return null;
          });
        }
        setPhase('ready');
        setProgressPct(100);
        setSpeedText('');
        setEtaText('');
        onUploaded(result);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          if (!pausedRef.current) setPhase('idle');
          return;
        }
        setPhase('error');
        setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    [onUploaded, purpose]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            runUpload(file);
            break;
          }
        }
      }
    },
    [runUpload]
  );

  return (
    <div
      data-testid={testId || `uploader-${purpose}`}
      onPaste={handlePaste}
      className="rounded-xl border border-border bg-card p-4 text-card-foreground space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {maxSizeLabel && <p className="text-xs text-muted-foreground">{maxSizeLabel}</p>}
        </div>
        {(previewUrl || currentUrl) && (
          <img
            src={previewUrl || currentUrl || ''}
            alt={`${label} preview`}
            className="h-10 w-10 rounded-lg object-cover border border-border"
          />
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) runUpload(f);
        }}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          capture={allowCamera ? 'environment' : undefined}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) runUpload(f);
          }}
        />
        <p className="text-xs font-medium text-foreground">
          Drag &amp; drop, click to choose, or paste an image
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Direct upload to Cloudflare R2 quarantine
        </p>
      </div>

      {(phase === 'hashing' || phase === 'uploading' || phase === 'finalizing' || phase === 'paused') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {phase === 'hashing' && `Computing SHA-256 (${progressPct}%)...`}
              {phase === 'uploading' &&
                `Uploading ${selectedFile ? formatBytes(selectedFile.size) : ''} (${progressPct}%)`}
              {phase === 'paused' && `Paused (${progressPct}%)`}
              {phase === 'finalizing' && 'Validating & promoting...'}
            </span>
            <span>{[speedText, etaText].filter(Boolean).join(' · ')}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            {phase === 'uploading' && (
              <button
                type="button"
                onClick={() => {
                  pausedRef.current = true;
                  abortRef.current?.abort();
                }}
                className="px-2.5 py-1 text-xs rounded-md border border-border text-foreground hover:bg-muted"
              >
                Pause
              </button>
            )}
            {phase === 'paused' && selectedFile && (
              <button
                type="button"
                onClick={() => runUpload(selectedFile)}
                className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground"
              >
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                pausedRef.current = false;
                abortRef.current?.abort();
                setPhase('idle');
              }}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(phase === 'rejected' || phase === 'error' || phase === 'not_configured') && errorMsg && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-center justify-between gap-2"
        >
          <span>{errorMsg}</span>
          {selectedFile && phase !== 'not_configured' && (
            <button
              type="button"
              onClick={() => runUpload(selectedFile)}
              className="underline font-medium shrink-0"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {phase === 'ready' && lastResult && (
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-foreground flex items-center justify-between gap-2">
          <span>
            Uploaded ({formatBytes(lastResult.sizeBytes)})
            {lastResult.scanStatus === 'NOT_SCANNED' ? ' — Not yet scanned' : ' — Verified WebP'}
          </span>
        </div>
      )}
    </div>
  );
}
