'use client';

import React, { useState, useEffect } from 'react';
import { BrandPageContainer } from '@/components/brand/shell/brand-page-container';

interface ApprovalItem {
  id: string;
  type: string;
  resourceId: string;
  requesterId: string;
  requesterName?: string;
  approverId?: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  amountMinor?: number;
  currency: string;
  slaDeadline?: string;
  createdAt: string;
}

export default function BrandContentReviewPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');

  // Decision Modal State
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [decisionAction, setDecisionAction] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brand/approvals');
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (e) {
      console.error('Failed to load approvals', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval || !decisionAction) return;

    if (decisionAction === 'REJECTED' && (!decisionReason || decisionReason.trim().length < 5)) {
      setErrorMsg('A detailed reason (at least 5 characters) is required when rejecting.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/brand/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId: selectedApproval.id,
          decision: decisionAction,
          reason: decisionReason.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Decision failed');
      }

      setSelectedApproval(null);
      setDecisionAction(null);
      setDecisionReason('');
      fetchApprovals();
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.decision === 'PENDING');
  const resolvedApprovals = approvals.filter((a) => a.decision !== 'PENDING');

  const displayedApprovals = activeTab === 'PENDING' ? pendingApprovals : resolvedApprovals;

  return (
    <BrandPageContainer
      title="Content & Workflow Approvals"
      category="WORK"
      description="Review creator deliverables, campaign launches, and high-value booking authorizations with SLA tracking"
      iconName="CheckSquare"
    >
      <div className="space-y-6 max-w-5xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'PENDING'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <span>Pending Approvals</span>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary-foreground text-primary font-bold">
                {pendingApprovals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'RESOLVED'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <span>Decision History ({resolvedApprovals.length})</span>
          </button>
        </div>

        {/* Approvals List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground rounded-2xl border border-border bg-card">
              Loading approval requests...
            </div>
          ) : displayedApprovals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-border bg-card space-y-3">
              <svg className="w-8 h-8 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <h3 className="text-sm font-semibold text-foreground">
                {activeTab === 'PENDING' ? 'Zero Pending Approvals' : 'No Resolved Decisions'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {activeTab === 'PENDING'
                  ? 'All creator deliverables, bookings above approval thresholds, and escrow releases are fully up to date.'
                  : 'Historical approvals and decisions will appear here.'}
              </p>
            </div>
          ) : (
            displayedApprovals.map((appr) => {
              const isOverdue = appr.slaDeadline ? new Date(appr.slaDeadline).getTime() < Date.now() : false;

              return (
                <div
                  key={appr.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[11px] font-semibold">
                        {appr.type.replace(/_/g, ' ')}
                      </span>
                      {appr.decision === 'PENDING' ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            isOverdue
                              ? 'bg-destructive/10 text-destructive font-bold'
                              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{isOverdue ? 'SLA Breached' : 'Pending Review'}</span>
                        </span>
                      ) : appr.decision === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                          <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-destructive/10 text-destructive">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          <span>Rejected</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Resource ID: <span className="font-mono">{appr.resourceId}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>Requested by {appr.requesterName || appr.requesterId.slice(0, 8)}</span>
                        <span>·</span>
                        <span>
                          {new Date(appr.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {appr.reason && (
                      <div className="p-2.5 rounded-xl border border-border bg-muted/20 text-xs text-foreground italic">
                        "{appr.reason}"
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-3 shrink-0">
                    {appr.amountMinor !== undefined && appr.amountMinor > 0 && (
                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground">Authorization Value</span>
                        <div className="text-base font-bold text-foreground font-mono">
                          ₹{(appr.amountMinor / 100).toLocaleString('en-IN')}
                        </div>
                      </div>
                    )}

                    {appr.decision === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedApproval(appr);
                            setDecisionAction('REJECTED');
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApproval(appr);
                            setDecisionAction('APPROVED');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Decision Modal */}
        {selectedApproval && decisionAction && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-foreground">
                {decisionAction === 'APPROVED' ? 'Confirm Approval Authorization' : 'Reject Workflow Request'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {decisionAction === 'APPROVED'
                  ? 'Confirming will authorize this request and record a tamper-evident audit log.'
                  : 'Please state the regulatory, financial or creative reason for rejection.'}
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleDecisionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {decisionAction === 'APPROVED' ? 'Approval Note (Optional)' : 'Rejection Reason (Mandatory)'}
                  </label>
                  <textarea
                    rows={3}
                    required={decisionAction === 'REJECTED'}
                    placeholder={
                      decisionAction === 'APPROVED'
                        ? 'e.g. Approved per Q3 brand allocation budget.'
                        : 'e.g. Budget ceiling exceeded. Please negotiate revised deliverable terms.'
                    }
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApproval(null);
                      setDecisionAction(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-opacity disabled:opacity-50 ${
                      decisionAction === 'APPROVED'
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'bg-destructive text-destructive-foreground hover:opacity-90'
                    }`}
                  >
                    {submitting ? 'Submitting...' : decisionAction === 'APPROVED' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BrandPageContainer>
  );
}
