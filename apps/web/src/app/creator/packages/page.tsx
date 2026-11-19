'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  deliverables: string[];
  originalPriceMinor: number;
  discountedPriceMinor: number;
  turnaroundDays: number;
  revisions: number;
  isActive: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newTurnaround, setNewTurnaround] = useState(7);

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newPrice <= 0) return;

    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}`,
      name: newTitle,
      tagline: newTagline || 'Custom promotional package bundle.',
      deliverables: ['Custom Package Deliverables'],
      originalPriceMinor: Math.round(newPrice * 100 * 1.15),
      discountedPriceMinor: newPrice * 100,
      turnaroundDays: newTurnaround,
      revisions: 1,
      isActive: true,
    };

    setPackages([newPkg, ...packages]);
    setIsCreating(false);
    setNewTitle('');
    setNewTagline('');
    setNewPrice(0);
  };

  const handleToggle = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Packages & Bundles"
        description="Bundle multiple platforms and formats together with a discount to incentivize larger campaign bookings."
        action={
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <ShellIcon name="Plus" size={14} />
            Create Bundle Package
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-4">
        <StatCard
          label="Active Packages"
          value={packages.filter((p) => p.isActive).length}
          subValue="Available in Brand Catalog"
          icon={<ShellIcon name="Package" size={16} />}
        />
        <StatCard
          label="Average Deal Size"
          value={packages.length === 0 ? '₹0' : '—'}
          subValue="Bundle booking average"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Top Package"
          value={packages.length === 0 ? '—' : packages[0]?.name}
          subValue="Based on booking volume"
          icon={<ShellIcon name="Sparkles" size={16} />}
        />
      </div>

      {/* Create Modal / Form Drawer */}
      {isCreating && (
        <div className="p-5 rounded-2xl bg-card border-2 border-indigo-600/30 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Create New Campaign Package</h3>
            <button
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
                  placeholder="e.g. YouTube Dedicated + 2x Shorts Bundle"
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
                  placeholder="50000"
                  value={newPrice || ''}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  required
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
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Save Package
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Package Cards List */}
      {packages.length === 0 ? (
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
                      <Money minorUnits={pkg.discountedPriceMinor} currency="INR" />
                    </span>
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
                  <span>⏱️ {pkg.turnaroundDays} Days Delivery</span>
                  <span>🔄 {pkg.revisions} Revisions</span>
                </div>
                <button
                  onClick={() => handleToggle(pkg.id)}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {pkg.isActive ? 'Deactivate' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
