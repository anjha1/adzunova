'use client';

import React, { useState, useEffect } from 'react';
import { BrandPageContainer } from '@/components/brand/shell/brand-page-container';
import { evaluateWorkEmailRules } from '@/lib/statutory/work-email-rules';

interface MemberItem {
  id: string;
  userId: string;
  email: string;
  name?: string;
  role: string;
  brandIds: string[];
  approvalLimitMinor?: number;
  status: string;
  joinedAt: string;
}

interface InvitationItem {
  id: string;
  email: string;
  role: string;
  brandIds: string[];
  expiresAt: string;
  status: string;
}

interface BrandItem {
  id: string;
  name: string;
}

export default function BrandTeamPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('CAMPAIGN_MANAGER');
  const [inviteBrandIds, setInviteBrandIds] = useState<string[]>([]);
  const [approvalLimitRupees, setApprovalLimitRupees] = useState('100000');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brand/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
        setBrands(data.brands || []);
      }
    } catch (e) {
      console.error('Failed to load team', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);

    // Client-side domain policy check (Phase B engine)
    const evalRes = evaluateWorkEmailRules(inviteEmail);
    if (!evalRes.allowed) {
      setInviteError(
        evalRes.errorMessage ||
          'Please use your company email address. Personal email providers are not supported.'
      );
      return;
    }

    try {
      setInviteSubmitting(true);
      const limitMinor = approvalLimitRupees ? parseInt(approvalLimitRupees, 10) * 100 : undefined;

      const res = await fetch('/api/brand/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          brandIds: inviteBrandIds,
          approvalLimitMinor: limitMinor,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to send invitation');
      }

      setInviteSuccess(`Invitation successfully dispatched to ${inviteEmail}.`);
      setInviteEmail('');
      setShowInviteModal(false);
      fetchTeam();
    } catch (err: any) {
      setInviteError(err.message || 'Invitation failed');
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleRemove = async (id: string, isInvitation = false) => {
    if (!confirm(isInvitation ? 'Revoke this invitation?' : 'Remove this member from the workspace?')) {
      return;
    }

    try {
      const res = await fetch('/api/brand/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: id, isInvitation }),
      });

      if (res.ok) {
        fetchTeam();
      }
    } catch (e) {
      console.error('Failed to remove member', e);
    }
  };

  const getRoleBadgeTone = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'ADMIN':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
      case 'FINANCE':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'LEGAL':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'CAMPAIGN_MANAGER':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <BrandPageContainer
      title="Team & Roles"
      category="WORKSPACE"
      description="Manage enterprise team members, RBAC permissions, client brand scoping and approval limits"
      iconName="Users"
    >
      <div className="space-y-6 max-w-6xl">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Workspace Members & Delegations</h2>
            <p className="text-xs text-muted-foreground">
              Work-email verified team members authorized to access this workspace.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Invite Team Member</span>
          </button>
        </div>

        {inviteSuccess && (
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{inviteSuccess}</span>
          </div>
        )}

        {/* Member List Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role & Scope</th>
                  <th className="py-3 px-4">Client Brands</th>
                  <th className="py-3 px-4">Approval Limit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading team members...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id || m.userId} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                            {(m.name?.[0] || m.email[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{m.name || m.email.split('@')[0]}</div>
                            <div className="text-muted-foreground text-[11px] font-mono">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getRoleBadgeTone(
                            m.role
                          )}`}
                        >
                          {m.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {m.brandIds && m.brandIds.length > 0 ? (
                          <span className="text-foreground font-medium">
                            {m.brandIds.length} Assigned {m.brandIds.length === 1 ? 'Brand' : 'Brands'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">All Brands (Workspace)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                        {m.role === 'OWNER' || m.role === 'ADMIN'
                          ? 'Unlimited'
                          : m.approvalLimitMinor
                          ? `₹${(m.approvalLimitMinor / 100).toLocaleString('en-IN')}`
                          : '₹1,00,000 (Default)'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {m.role !== 'OWNER' && (
                          <button
                            onClick={() => handleRemove(m.id)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remove member"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Invitations Section */}
        {invitations.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Pending Invitations ({invitations.length})</span>
            </div>
            <div className="divide-y divide-border">
              {invitations.map((inv) => (
                <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <div>
                      <span className="font-semibold text-foreground">{inv.email}</span>
                      <span className="mx-2 text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{inv.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Expires in 7 days</span>
                    <button
                      onClick={() => handleRemove(inv.id, true)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invite Modal Dialog */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                  <h3 className="text-sm font-bold text-foreground">Invite Workspace Teammate</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4">
                {inviteError && (
                  <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{inviteError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Company Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@yourcompany.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Per Adzunova Brand Security Policy, only corporate work emails are permitted.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="CAMPAIGN_MANAGER">Campaign Manager</option>
                      <option value="ADMIN">Admin</option>
                      <option value="FINANCE">Finance</option>
                      <option value="LEGAL">Legal</option>
                      <option value="VIEWER">Viewer (Read-Only)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Approval Limit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      value={approvalLimitRupees}
                      onChange={(e) => setApprovalLimitRupees(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {brands.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Client Brand Scoping (Agency Isolation)
                    </label>
                    <div className="p-2.5 rounded-xl border border-border bg-muted/20 max-h-32 overflow-y-auto space-y-1">
                      {brands.map((b) => (
                        <label key={b.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={inviteBrandIds.includes(b.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInviteBrandIds([...inviteBrandIds, b.id]);
                              } else {
                                setInviteBrandIds(inviteBrandIds.filter((id) => id !== b.id));
                              }
                            }}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span>{b.name}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Leave empty to allow member access across all workspace brands.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteSubmitting}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {inviteSubmitting ? 'Sending...' : 'Send Work Invitation'}
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
