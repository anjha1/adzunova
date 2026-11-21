'use client';

import React, { useState, useEffect } from 'react';
import { BrandPageContainer } from '@/components/brand/shell/brand-page-container';

interface AuditItem {
  id: string;
  action: string;
  actorEmail?: string;
  actorId: string;
  actorIp?: string;
  resourceType: string;
  resourceId: string;
  previousHash: string;
  hash: string;
  payload?: any;
  createdAt: string;
}

export default function BrandAuditLogPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    totalEntries: number;
    error?: string;
  } | null>(null);

  const fetchAuditLogs = async (verify = false) => {
    try {
      if (verify) setVerifying(true);
      else setLoading(true);

      const url = verify ? '/api/brand/audit-log?verify=true' : '/api/brand/audit-log';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        if (data.verification) {
          setVerificationResult(data.verification);
        }
      }
    } catch (e) {
      console.error('Failed to load audit trail', e);
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(true);
  }, []);

  const handleDownload = (format: 'csv' | 'json') => {
    window.open(`/api/brand/audit-log?format=${format}`, '_blank');
  };

  return (
    <BrandPageContainer
      title="Audit Log"
      category="WORKSPACE"
      description="Tamper-evident, immutable activity audit trail of workspace actions and cryptographic hash chain verification"
      iconName="Activity"
    >
      <div className="space-y-6 max-w-6xl">
        {/* Verification & Export Banner */}
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Cryptographic Hash Chain</h3>
                {verificationResult?.valid && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Chain Intact (Untampered)</span>
                  </span>
                )}
                {verificationResult && !verificationResult.valid && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-destructive/10 text-destructive">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Chain Broken</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Every administrative, team, financial, and approval operation is linked via continuous SHA-256 hash pointers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => fetchAuditLogs(true)}
              disabled={verifying}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-50"
            >
              <svg className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
              <span>{verifying ? 'Verifying...' : 'Verify Chain'}</span>
            </button>
            <div className="flex items-center rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => handleDownload('csv')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-background hover:bg-muted transition-colors border-r border-border"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleDownload('json')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-background hover:bg-muted transition-colors"
              >
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                  <th className="py-3 px-4 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading audit records...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No audit records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={log.id || log.hash} className="hover:bg-muted/20 transition-colors font-mono">
                      <td className="py-3 px-4 text-muted-foreground font-sans">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground font-mono">{log.action}</span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="text-foreground">{log.actorEmail || log.actorId.slice(0, 8)}</div>
                        {log.actorIp && <div className="text-[11px] text-muted-foreground font-mono">{log.actorIp}</div>}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground font-medium">
                          {log.resourceType}:{log.resourceId.slice(0, 8)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-muted-foreground">
                        <span title={log.hash}>
                          {log.hash.slice(0, 10)}...{log.hash.slice(-8)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                          <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Linked #{idx + 1}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BrandPageContainer>
  );
}
