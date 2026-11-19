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

const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-omnichannel',
    name: 'Omnichannel Launch Campaign',
    tagline: 'Maximum reach across long-form YouTube + high-viral Instagram Reels.',
    deliverables: [
      '1x Dedicated YouTube Video (8-12m)',
      '2x Instagram 60s High-Retention Reels',
      '3x Instagram Story Frames with Link Sticker',
      '30-Day Paid Ad Usage Whitelist Rights',
    ],
    originalPriceMinor: 17000000, // ₹1,70,000
    discountedPriceMinor: 14500000, // ₹1,45,000 (15% bundle discount)
    turnaroundDays: 14,
    revisions: 2,
    isActive: true,
  },
  {
    id: 'pkg-reel-blast',
    name: 'Short-Form Viral Burst',
    tagline: 'High volume short-form deliverables for immediate product awareness.',
    deliverables: [
      '3x Instagram Reels / YouTube Shorts',
      'Bio Link placement for 14 days',
      'Co-author collaboration tag',
    ],
    originalPriceMinor: 10500000, // ₹1,05,000
    discountedPriceMinor: 8900000, // ₹89,000
    turnaroundDays: 7,
    revisions: 1,
    isActive: true,
  },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_PACKAGES);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newPrice, setNewPrice] = useState(50000);
  const [newTurnaround, setNewTurnaround] = useState(7);

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}`,
      name: newTitle,
      tagline: newTagline || 'Custom promotional package bundle.',
      deliverables: ['1x Primary Video Deliverable', '1x Social Amplifier Post'],
      originalPriceMinor: newPrice * 100 * 1.15,
      discountedPriceMinor: newPrice * 100,
      turnaroundDays: newTurnaround,
      revisions: 1,
      isActive: true,
    };

    setPackages([newPkg, ...packages]);
    setIsCreating(false);
    setNewTitle('');
    setNewTagline('');
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
        description="Bundle multiple platforms and formats together with an attractive discount to incentivize larger brand campaign budgets."
        action={
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
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
          value="₹1,17,000"
          subValue="Bundle booking average"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Highest Booking Rate"
          value="Omnichannel Launch"
          subValue="Top brand preference"
          icon={<ShellIcon name="Sparkles" size={16} />}
        />
      </div>

      {/* Create Modal / Form Drawer */}
      {isCreating && (
        <div className="p-5 rounded-2xl bg-card border-2 border-indigo-600/30 dark:border-indigo-500/30 shadow-md space-y-4 animate-in fade-in">
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
                  value={newPrice}
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
                placeholder="Briefly explain what brand gets and why this package drives results."
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
          {packages.map((pkg) => {
            const discountPercent = Math.round(
              ((pkg.originalPriceMinor - pkg.discountedPriceMinor) / pkg.originalPriceMinor) * 100
            );

            return (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-border/80 transition"
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
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs line-through text-muted-foreground">
                          <Money minorUnits={pkg.originalPriceMinor} currency="INR" />
                        </span>
                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                          <Money minorUnits={pkg.discountedPriceMinor} currency="INR" />
                        </span>
                      </div>
                      {discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Save {discountPercent}% bundle discount
                        </span>
                      )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
