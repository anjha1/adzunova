'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  deliverables: string[];
  originalPricePaise: string;
  discountedPricePaise: string;
  turnaroundDays: number;
  revisions: number;
  isActive: boolean;
  version: number;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newTurnaround, setNewTurnaround] = useState(7);
  const [newRevisions, setNewRevisions] = useState(1);
  const [newDeliverables, setNewDeliverables] = useState('');

  async function loadPackages() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/creator/packages', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load packages');
      } else {
        setPackages(Array.isArray(data.packages) ? data.packages : []);
      }
    } catch {
      setErrorMsg('Network error loading packages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPackages();
  }, []);

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice <= 0) return;

    setSaving(true);
    setErrorMsg(null);
    try {
      const deliverables = newDeliverables
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const discountedPaise = String(Math.round(newPrice * 100));
      const originalPaise = String(Math.round(newPrice * 100 * 1.15));

      const res = await fetch('/api/creator/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTitle.trim(),
          tagline: newTagline.trim() || 'Custom promotional package bundle.',
          deliverables: deliverables.length > 0 ? deliverables : ['Custom Package Deliverables'],
          originalPricePaise: originalPaise,
          discountedPricePaise: discountedPaise,
          turnaroundDays: newTurnaround,
          revisions: newRevisions,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to save package');
        return;
      }
      setPackages((prev) => [data.package, ...prev]);
      setIsCreating(false);
      setNewTitle('');
      setNewTagline('');
      setNewPrice(0);
      setNewDeliverables('');
    } catch {
      setErrorMsg('Network error saving package');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (pkg: PackageItem) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/creator/packages/${encodeURIComponent(pkg.id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to update package status');
        return;
      }
      setPackages((prev) => prev.map((p) => (p.id === pkg.id ? data.package : p)));
    } catch {
      setErrorMsg('Network error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/creator/packages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.detail || data.error || 'Failed to delete package');
        return;
      }
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setErrorMsg('Network error deleting package');
    }
  };

  const activeCount = packages.filter((p) => p.isActive).length;
  const avgPaise =
    packages.length > 0
      ? Math.round(
          packages.reduce((acc, p) => acc + Number(p.discountedPricePaise), 0) / packages.length
        )
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Packages & Bundles"
        description="Bundle multiple platforms and formats together with a discount to incentivize larger campaign bookings."
        action={
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-primary-foreground font-medium text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <ShellIcon name="Plus" size={14} />
            Create Bundle Package
          </button>
        }
      />

      {errorMsg && (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Active Packages"
          value={activeCount}
          subValue="Available in Brand Catalog"
          icon={<ShellIcon name="Package" size={16} />}
        />
        <StatCard
          label="Average Deal Size"
          value={packages.length === 0 ? '₹0' : <Money minorUnits={avgPaise} currency="INR" />}
          subValue="Bundle booking average"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Top Package"
          value={packages.length === 0 ? '—' : packages[0]?.name}
          subValue="Most recent configured bundle"
          icon={<ShellIcon name="Sparkles" size={16} />}
        />
      </div>

      {isCreating && (
        <div className="p-5 rounded-2xl bg-card border-2 border-indigo-600/30 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Create New Campaign Package</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddPackage} className="space-y-4">
            <div className="grid grid-cols-1 desk:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Package Title</label>
                <input
                  type="text"
                  placeholder="e.g. YouTube Dedicated + Shorts Bundle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Package Price (INR)</label>
                <input
                  type="number"
                  min={1}
                  placeholder="50000"
                  value={newPrice || ''}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  required
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 desk:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Turnaround (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={newTurnaround}
                  onChange={(e) => setNewTurnaround(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Included Revisions</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={newRevisions}
                  onChange={(e) => setNewRevisions(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Short Description / Pitch</label>
              <input
                type="text"
                placeholder="Briefly explain what brand gets with this package."
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Deliverables (one per line)</label>
              <textarea
                rows={3}
                placeholder="Dedicated Video Integration&#10;Story Link + Pin"
                value={newDeliverables}
                onChange={(e) => setNewDeliverables(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-primary-foreground text-xs font-bold"
              >
                {saving ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-8 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
          Loading packages...
        </div>
      ) : packages.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="Package" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Packages Configured"
          description="Create your first combo package to offer brands multi-channel coverage at a bundled rate."
          actionText="Create Package"
          onAction={() => setIsCreating(true)}
        />
      ) : (
        <div className="grid grid-cols-1 desk:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-5 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{pkg.name}</h3>
                      {pkg.isActive ? (
                        <StatusBadge variant="success" label="Active" />
                      ) : (
                        <StatusBadge variant="neutral" label="Draft" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{pkg.tagline}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      <Money minorUnits={Number(pkg.discountedPricePaise)} currency="INR" />
                    </span>
                    <div className="text-[10px] text-muted-foreground">v{pkg.version}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border space-y-2">
                  <span className="text-xs font-semibold text-foreground">Included Deliverables:</span>
                  <ul className="space-y-1.5">
                    {pkg.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShellIcon name="CheckCircle" size={14} className="text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>{`${pkg.turnaroundDays} Days Delivery`}</span>
                  <span>{`${pkg.revisions} Revisions`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleToggle(pkg)}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {pkg.isActive ? 'Deactivate' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(pkg.id)}
                    className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
