'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface Ticket {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastReply: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('Campaign Deliverables');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `t-${Date.now()}`,
        ticketNumber: `TKT-ADZ-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        subject,
        status: 'open',
        createdAt: 'Just now',
        lastReply: 'Support ticket received. Assigned to creator support queue.',
      };
      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setSubject('');
      setMessage('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Support & Helpdesk"
        description="Assistance for contract compliance, payouts, and technical account inquiries."
      />

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Open Tickets"
          value={tickets.filter((t) => t.status !== 'resolved').length}
          subValue="Active inquiries"
          icon={<ShellIcon name="Clock" size={16} />}
        />
        <StatCard
          label="Support SLA"
          value="< 24 Hours"
          subValue="Standard queue response"
          icon={<ShellIcon name="AlertCircle" size={16} />}
        />
        <StatCard
          label="Account Status"
          value="Normal"
          subValue="Zero restrictions"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
        {/* Open Ticket Form */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Open Support Ticket</h2>
            <span className="text-xs text-muted-foreground">Direct Helpdesk</span>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              ✓ Ticket submitted! Our Creator Success team will respond via email shortly.
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="Campaign Deliverables">Campaign Deliverables & Feedback</option>
                <option value="Payouts & Banking">Payouts & Banking</option>
                <option value="Technical Support">Technical & OAuth Sync Bug</option>
                <option value="Account Settings">Account & Profile Settings</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of your question or issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="Provide contract numbers, brand names, or specific timestamps..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground leading-relaxed focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              {isSubmitting ? 'Submitting Ticket...' : 'Submit Support Request'}
            </button>
          </form>
        </div>

        {/* Existing Tickets Roster */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
              Your Support History
            </h3>

            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No active tickets.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] text-muted-foreground">
                        {t.ticketNumber}
                      </span>
                      {t.status === 'resolved' ? (
                        <StatusBadge variant="success" label="Resolved" />
                      ) : (
                        <StatusBadge variant="warning" label="In Progress" />
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground">{t.subject}</h4>
                    <p className="text-[11px] text-muted-foreground">{t.lastReply}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
