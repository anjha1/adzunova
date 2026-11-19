'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface LedgerEntry {
  id: string;
  txId: string;
  date: string;
  description: string;
  type: 'escrow_release' | 'payout' | 'commission' | 'tax_tds';
  amountMinor: number;
  isCredit: boolean;
  status: 'settled' | 'pending';
}

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'tx-1',
    txId: 'TXN-ADZ-99104',
    date: 'Nov 17, 2026',
    description: 'Escrow Release: FitPro Nutrition Campaign Deliverable V1',
    type: 'escrow_release',
    amountMinor: 3500000, // ₹35,000
    isCredit: true,
    status: 'settled',
  },
  {
    id: 'tx-2',
    txId: 'TXN-ADZ-99105',
    date: 'Nov 17, 2026',
    description: 'Adzunova Platform Fee (10%)',
    type: 'commission',
    amountMinor: 350000, // ₹3,500
    isCredit: false,
    status: 'settled',
  },
  {
    id: 'tx-3',
    txId: 'TXN-ADZ-99106',
    date: 'Nov 17, 2026',
    description: 'Statutory TDS Withholding (Sec 194J - 1%)',
    type: 'tax_tds',
    amountMinor: 35000, // ₹350
    isCredit: false,
    status: 'settled',
  },
  {
    id: 'tx-4',
    txId: 'TXN-ADZ-98440',
    date: 'Nov 10, 2026',
    description: 'Bank IMPS Payout to HDFC Bank (A/C **4891)',
    type: 'payout',
    amountMinor: 7500000, // ₹75,000
    isCredit: false,
    status: 'settled',
  },
];

export default function EarningsPage() {
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [availableMinorUnits, setAvailableMinorUnits] = useState(3115000); // ₹31,150
  const [escrowMinorUnits, setEscrowMinorUnits] = useState(6500000); // ₹65,000 locked for Nordic Audio
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(31150);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'upi'>('upi');
  const [upiId, setUpiId] = useState('creator@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount * 100 > availableMinorUnits) return;

    setIsProcessing(true);
    setTimeout(() => {
      const amountMinor = withdrawAmount * 100;
      const newTx: LedgerEntry = {
        id: `tx-${Date.now()}`,
        txId: `TXN-ADZ-${Math.floor(10000 + Math.random() * 90000)}`,
        date: 'Today',
        description: `Instant Payout to ${payoutMethod === 'upi' ? `UPI (${upiId})` : 'HDFC Bank (**4891)'}`,
        type: 'payout',
        amountMinor,
        isCredit: false,
        status: 'settled',
      };

      setLedger([newTx, ...ledger]);
      setAvailableMinorUnits((prev) => prev - amountMinor);
      setIsProcessing(false);
      setIsWithdrawing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Wallet & Financial Ledger"
        description="Double-entry financial accounting. Guaranteed escrow releases, statutory TDS receipts, and instant automated bank/UPI payouts."
        action={
          <button
            onClick={() => setIsWithdrawing(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ShellIcon name="CreditCard" size={14} />
            Withdraw Available Funds
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Available for Withdrawal"
          value={<Money minorUnits={availableMinorUnits} currency="INR" />}
          subValue="Ready for instant transfer"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Locked in Escrow"
          value={<Money minorUnits={escrowMinorUnits} currency="INR" />}
          subValue="Guaranteed on brand sign-off"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
        <StatCard
          label="Lifetime Payouts"
          value={<Money minorUnits={10615000} currency="INR" />}
          subValue="Total earnings disbursed"
          icon={<ShellIcon name="TrendingUp" size={16} />}
        />
        <StatCard
          label="Statutory TDS Deducted"
          value={<Money minorUnits={110000} currency="INR" />}
          subValue="Form 16A auto-generated"
          icon={<ShellIcon name="FileText" size={16} />}
        />
      </div>

      {/* Ledger Table */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Double-Entry Transaction Ledger</h2>
          <span className="text-xs text-muted-foreground font-mono">Currency: INR (Minor unit: Paise)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold">Date & Tx ID</th>
                <th className="pb-3 font-semibold">Transaction Description</th>
                <th className="pb-3 font-semibold">Classification</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/30 transition">
                  <td className="py-3 font-medium">
                    <span className="text-foreground block">{entry.date}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{entry.txId}</span>
                  </td>
                  <td className="py-3 text-foreground font-medium">{entry.description}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {entry.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    <StatusBadge variant="success" label="Settled" />
                  </td>
                  <td className="py-3 text-right font-bold text-sm">
                    <span
                      className={
                        entry.isCredit
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                      }
                    >
                      {entry.isCredit ? '+' : '-'}
                      <Money minorUnits={entry.amountMinor} currency="INR" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Withdraw Available Earnings</h3>
              <button
                onClick={() => setIsWithdrawing(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Withdrawal Amount (Available: <Money minorUnits={availableMinorUnits} currency="INR" />)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    max={availableMinorUnits / 100}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    required
                    className="w-full text-xs rounded-xl border border-border bg-background pl-7 pr-3 py-2 font-bold text-foreground focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Payout Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('upi')}
                    className={`p-2 rounded-xl border text-center font-medium ${
                      payoutMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-border'
                    }`}
                  >
                    Instant UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`p-2 rounded-xl border text-center font-medium ${
                      payoutMethod === 'bank'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-border'
                    }`}
                  >
                    Bank IMPS/NEFT
                  </button>
                </div>
              </div>

              {payoutMethod === 'upi' ? (
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Verified UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground font-mono"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                  <p className="font-semibold text-foreground">HDFC Bank Limited</p>
                  <p className="text-muted-foreground font-mono">A/C: ************4891 • IFSC: HDFC0001024</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawing(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {isProcessing ? 'Processing Transfer...' : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
