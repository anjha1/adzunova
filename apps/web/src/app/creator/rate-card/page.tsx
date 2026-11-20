'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageHeader, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import {
  RateCardItem,
  RateCardPlatform,
  ContentFormat,
  RateCardStatus,
  PlatformFeeConfig,
} from '@/lib/rate-card/types';
import { RateCardItemCard } from '@/components/creator/rate-card/rate-card-item-card';
import { RateCardItemModal } from '@/components/creator/rate-card/rate-card-item-modal';
import { QuoteSimulator } from '@/components/creator/rate-card/quote-simulator';
import { CURRENT_PLATFORM_FEE_CONFIG } from '@/lib/rate-card/quote-calculator';

export default function RateCardPage() {
  const [items, setItems] = useState<RateCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'custom' | 'price_asc' | 'price_desc' | 'newest'>('custom');

  // Selection & Simulator
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RateCardItem | null>(null);

  // Platform Fee Config
  const [feeConfig, setFeeConfig] = useState<PlatformFeeConfig>(CURRENT_PLATFORM_FEE_CONFIG);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Platform Fee Config
  useEffect(() => {
    async function loadFeeConfig() {
      try {
        const res = await fetch('/api/platform-fee/current');
        if (res.ok) {
          const data = await res.json();
          setFeeConfig(data);
        }
      } catch (err) {
        console.warn('Failed to load current platform fee, using fallback:', err);
      }
    }
    loadFeeConfig();
  }, []);

  // Fetch Items from API
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedPlatform !== 'ALL') params.append('platform', selectedPlatform);
      if (selectedFormat !== 'ALL') params.append('contentFormat', selectedFormat);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`/api/creator/rate-card/items?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load rate card items: HTTP ${res.status}`);
      }
      const data = await res.json();
      const loadedItems: RateCardItem[] = data.items || [];
      setItems(loadedItems);

      // Select first item by default if nothing selected or previous selection gone
      if (loadedItems.length > 0) {
        if (!selectedItemId || !loadedItems.some((i) => i.id === selectedItemId)) {
          setSelectedItemId(loadedItems[0].id);
        }
      } else {
        setSelectedItemId(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading deliverables');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlatform, selectedFormat, selectedStatus, debouncedSearch, sortBy, selectedItemId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Active deliverables calculations for stat cards
  const activeItems = useMemo(() => items.filter((i) => i.status === 'ACTIVE'), [items]);

  const startingRate = useMemo(() => {
    if (activeItems.length === 0) return null;
    const prices = activeItems.map((i) => i.price).filter((p) => p > 0);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  }, [activeItems]);

  const avgTurnaround = useMemo(() => {
    if (activeItems.length === 0) return '—';
    const days = activeItems.map((i) => i.deliveryDays);
    const min = Math.min(...days);
    const max = Math.max(...days);
    return min === max ? `${min} Days` : `${min}-${max} Days`;
  }, [activeItems]);

  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) || null;
  }, [items, selectedItemId]);

  // Item Actions
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: RateCardItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (payload: any) => {
    if (editingItem) {
      // Update
      const res = await fetch(`/api/creator/rate-card/items/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update deliverable');
      }
      showToast('Deliverable updated successfully!');
    } else {
      // Create
      const res = await fetch('/api/creator/rate-card/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create deliverable');
      }
      showToast('New deliverable created and activated!');
    }
    await fetchItems();
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/creator/rate-card/items/${id}/duplicate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to duplicate item');
      showToast('Deliverable duplicated as Draft');
      await fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: RateCardStatus) => {
    const nextStatus: RateCardStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/creator/rate-card/items/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to change status');
      }
      showToast(`Deliverable ${nextStatus === 'ACTIVE' ? 'activated' : 'paused'}`);
      await fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      const res = await fetch(`/api/creator/rate-card/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          visibleToBrands: !currentVisibility,
        }),
      });
      if (!res.ok) throw new Error('Failed to update visibility');
      showToast(currentVisibility ? 'Hidden from brand discovery' : 'Now visible to brands');
      await fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/creator/rate-card/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      showToast('Deliverable deleted');
      setCheckedIds((prev) => prev.filter((i) => i !== id));
      await fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Bulk Actions
  const handleCheckAll = (checked: boolean) => {
    setCheckedIds(checked ? items.map((i) => i.id) : []);
  };

  const handleCheckSingle = (id: string, checked: boolean) => {
    setCheckedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const handleBulkStatusChange = async (targetStatus: RateCardStatus) => {
    if (checkedIds.length === 0) return;
    try {
      for (const id of checkedIds) {
        await fetch(`/api/creator/rate-card/items/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: targetStatus }),
        });
      }
      showToast(`${checkedIds.length} deliverables updated to ${targetStatus}`);
      setCheckedIds([]);
      await fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (checkedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${checkedIds.length} deliverables?`)) {
      return;
    }
    try {
      for (const id of checkedIds) {
        await fetch(`/api/creator/rate-card/items/${id}`, { method: 'DELETE' });
      }
      showToast(`${checkedIds.length} deliverables deleted`);
      setCheckedIds([]);
      await fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-card border border-indigo-500/30 shadow-2xl text-foreground text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <ShellIcon name="Check" size={16} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Creator Rate Card"
        description="Set deliverable rates, multi-tier add-ons, and brand licensing terms. All brand bookings calculate exact payouts using versioned platform fee configurations."
        action={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <ShellIcon name="Plus" size={14} />
            <span>Add Rate Card Item</span>
          </button>
        }
      />

      {/* Live Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 desk:grid-cols-4 gap-4">
        <StatCard
          label="Active Deliverables"
          value={activeItems.length}
          subValue={`${items.length} total configured`}
          icon={<ShellIcon name="Tag" size={16} />}
        />
        <StatCard
          label="Starting Rate"
          value={startingRate !== null ? `₹${startingRate.toLocaleString('en-IN')}` : '—'}
          subValue="Minimum deliverable price"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Platform Commission"
          value={`${feeConfig.commissionPercent}%`}
          subValue={`Config version: ${feeConfig.version}`}
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
        <StatCard
          label="Avg Turnaround"
          value={avgTurnaround}
          subValue="Creator SLA"
          icon={<ShellIcon name="Calendar" size={16} />}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 desk:grid-cols-3 gap-6">
        {/* Left 2 Cols: Deliverables List & Filters */}
        <div className="desk:col-span-2 space-y-4">
          {/* Filters and Search Bar */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <ShellIcon
                  name="Search"
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search deliverables, platforms, formats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="custom">Custom Order</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Filter Pills / Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border text-xs">
              {/* Platform */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground text-xs"
              >
                <option value="ALL">All Platforms</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="TIKTOK">TikTok</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="X">X (Twitter)</option>
                <option value="LINKEDIN">LinkedIn</option>
              </select>

              {/* Format */}
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground text-xs"
              >
                <option value="ALL">All Formats</option>
                <option value="REEL">Reel</option>
                <option value="SHORT">Short</option>
                <option value="LONG_VIDEO">Long-form Video</option>
                <option value="STORY">Story</option>
                <option value="POST">Post</option>
                <option value="CAROUSEL">Carousel</option>
                <option value="LIVE">Live</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="DRAFT">Draft</option>
              </select>

              {(selectedPlatform !== 'ALL' || selectedFormat !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('ALL');
                    setSelectedFormat('ALL');
                    setSelectedStatus('ALL');
                    setSearchQuery('');
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {checkedIds.length > 0 && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs animate-in fade-in duration-200">
              <span className="font-semibold text-foreground">
                {checkedIds.length} deliverable{checkedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkStatusChange('ACTIVE')}
                  className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30 transition"
                >
                  Bulk Activate
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatusChange('PAUSED')}
                  className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30 transition"
                >
                  Bulk Pause
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold border border-destructive/30 transition"
                >
                  Bulk Delete
                </button>
              </div>
            </div>
          )}

          {/* Deliverables List Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={items.length > 0 && checkedIds.length === items.length}
                onChange={(e) => handleCheckAll(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                aria-label="Select all deliverables"
              />
              <span className="text-xs font-semibold text-muted-foreground">
                Deliverables ({items.length})
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Click any card to load quote simulator
            </span>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="p-4 rounded-2xl border border-border bg-card animate-pulse space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-muted rounded-md" />
                    <div className="w-16 h-4 bg-muted rounded-md" />
                  </div>
                  <div className="w-48 h-5 bg-muted rounded-md" />
                  <div className="w-full h-3 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-3">
              <ShellIcon name="AlertCircle" size={24} className="mx-auto text-destructive" />
              <p className="text-xs text-destructive font-semibold">{error}</p>
              <button
                type="button"
                onClick={fetchItems}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-muted"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && items.length === 0 && (
            <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ShellIcon name="Tag" size={20} />
              </div>
              <h3 className="text-sm font-bold text-foreground">No deliverables found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No deliverables match your search or filters. Create your first deliverable to start receiving brand offers.
              </p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Create your first deliverable
              </button>
            </div>
          )}

          {/* List Cards */}
          {!isLoading && !error && items.length > 0 && (
            <div className="space-y-3">
              {items.map((item) => (
                <RateCardItemCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedItemId}
                  isChecked={checkedIds.includes(item.id)}
                  onSelect={(it) => setSelectedItemId(it.id)}
                  onCheck={handleCheckSingle}
                  onEdit={handleOpenEditModal}
                  onDuplicate={handleDuplicate}
                  onToggleStatus={handleToggleStatus}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Brand Quote Simulator */}
        <div>
          <QuoteSimulator
            selectedItem={selectedItem}
            platformFeeConfig={feeConfig}
          />
        </div>
      </div>

      {/* Add / Edit Drawer Modal */}
      <RateCardItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
