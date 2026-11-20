'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { SocialPlatformIcon } from '@/components/creator/ui/social-platform-icon';
import {
  RateCardItem,
  RateCardPlatform,
  ContentFormat,
  DeliverableType,
  PriceType,
  RateCardStatus,
  RateCardAddon,
  AddonType,
} from '@/lib/rate-card/types';
import {
  PLATFORM_METADATA,
  FORMAT_METADATA,
  DELIVERABLE_TYPE_METADATA,
  ADDON_TYPE_METADATA,
  getSupportedFormats,
  generateSuggestedTitle,
} from '@/lib/rate-card/compatibility';

interface RateCardItemModalProps {
  isOpen: boolean;
  item: RateCardItem | null; // null means creating a new item
  onClose: () => void;
  onSave: (savedData: any) => Promise<void>;
  connectedPlatforms?: RateCardPlatform[];
}

const ALL_PLATFORMS: RateCardPlatform[] = [
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'FACEBOOK',
  'X',
  'LINKEDIN',
];

const ALL_DELIVERABLE_TYPES: DeliverableType[] = [
  'DEDICATED_VIDEO',
  'BRAND_INTEGRATION',
  'LOGO_BANNER_PLACEMENT',
  'AD_CREATIVE',
  'STORY_MENTION',
  'LINK_IN_BIO',
];

const ALL_ADDON_TYPES: AddonType[] = [
  'USAGE_RIGHTS',
  'EXCLUSIVITY',
  'RUSH_DELIVERY',
  'EXTRA_REVISION',
  'RAW_FOOTAGE',
  'WHITELISTING_SPARK_ADS',
];

const DURATION_PRESETS = [
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '60s (1m)', seconds: 60 },
  { label: '120s (2m)', seconds: 120 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '30m', seconds: 1800 },
];

export function RateCardItemModal({
  isOpen,
  item,
  onClose,
  onSave,
  connectedPlatforms,
}: RateCardItemModalProps) {
  const isEditing = Boolean(item);

  const [activeTab, setActiveTab] = useState<'basics' | 'specs' | 'pricing' | 'options' | 'addons'>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [platform, setPlatform] = useState<RateCardPlatform>('INSTAGRAM');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('REEL');
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('DEDICATED_VIDEO');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationSeconds, setDurationSeconds] = useState<number | null>(60);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [freeRevisions, setFreeRevisions] = useState<number>(1);
  const [price, setPrice] = useState<number>(25000);
  const [currency] = useState('INR');
  const [priceType, setPriceType] = useState<PriceType>('FIXED');
  const [minimumBookingAmount, setMinimumBookingAmount] = useState<number | null>(null);
  const [publishOnMyChannel, setPublishOnMyChannel] = useState(true);
  const [scriptApprovalRequired, setScriptApprovalRequired] = useState(true);
  const [status, setStatus] = useState<RateCardStatus>('ACTIVE');
  const [visibleToBrands, setVisibleToBrands] = useState(true);
  const [addons, setAddons] = useState<RateCardAddon[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize or reset form on item change or open
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setPlatform(item.platform);
        setContentFormat(item.contentFormat);
        setDeliverableType(item.deliverableType);
        setTitle(item.title);
        setDescription(item.description || '');
        setDurationSeconds(item.durationSeconds ?? null);
        setIsCustomDuration(Boolean(item.durationSeconds && !DURATION_PRESETS.some((p) => p.seconds === item.durationSeconds)));
        setDeliveryDays(item.deliveryDays);
        setFreeRevisions(item.freeRevisions);
        setPrice(item.price);
        setPriceType(item.priceType);
        setMinimumBookingAmount(item.minimumBookingAmount ?? null);
        setPublishOnMyChannel(item.publishOnMyChannel);
        setScriptApprovalRequired(item.scriptApprovalRequired);
        setStatus(item.status);
        setVisibleToBrands(item.visibleToBrands);
        setAddons(item.addons || []);
      } else {
        setPlatform('INSTAGRAM');
        setContentFormat('REEL');
        setDeliverableType('DEDICATED_VIDEO');
        setTitle('1 Min Dedicated Instagram Reel');
        setDescription('High-energy vertical reel featuring organic product integration, customized CTA, and creator brand voice.');
        setDurationSeconds(60);
        setIsCustomDuration(false);
        setDeliveryDays(5);
        setFreeRevisions(1);
        setPrice(25000);
        setPriceType('FIXED');
        setMinimumBookingAmount(null);
        setPublishOnMyChannel(true);
        setScriptApprovalRequired(true);
        setStatus('ACTIVE');
        setVisibleToBrands(true);
        // Default initialized addons
        setAddons([
          {
            id: 'addon-1',
            type: 'USAGE_RIGHTS',
            enabled: true,
            pricingMode: 'PERCENT_OF_BASE',
            value: 20,
            durationDays: 30,
          },
          {
            id: 'addon-2',
            type: 'EXCLUSIVITY',
            enabled: true,
            pricingMode: 'PERCENT_OF_BASE',
            value: 30,
            durationDays: 90,
          },
          {
            id: 'addon-3',
            type: 'RUSH_DELIVERY',
            enabled: true,
            pricingMode: 'PERCENT_OF_BASE',
            value: 25,
            rushWithinHours: 48,
          },
        ]);
      }
      setActiveTab('basics');
      setErrorMessage(null);
      setIsDirty(false);
    }
  }, [isOpen, item]);

  // Dependent formats based on selected platform
  const supportedFormats = useMemo(() => getSupportedFormats(platform), [platform]);

  // Handle platform change: automatically ensure format is valid
  const handlePlatformChange = (newPlatform: RateCardPlatform) => {
    setPlatform(newPlatform);
    setIsDirty(true);
    const validFormats = getSupportedFormats(newPlatform);
    if (!validFormats.includes(contentFormat)) {
      setContentFormat(validFormats[0] || 'POST');
    }
  };

  const handleSuggestTitle = () => {
    const suggested = generateSuggestedTitle(platform, contentFormat, deliverableType, durationSeconds);
    setTitle(suggested);
    setIsDirty(true);
  };

  // Addon helpers
  const handleToggleAddon = (type: AddonType) => {
    setIsDirty(true);
    setAddons((prev) => {
      const existing = prev.find((a) => a.type === type);
      if (existing) {
        return prev.map((a) => (a.type === type ? { ...a, enabled: !a.enabled } : a));
      }
      const meta = ADDON_TYPE_METADATA[type];
      return [
        ...prev,
        {
          id: crypto.randomUUID ? crypto.randomUUID() : `addon-${Date.now()}`,
          type,
          enabled: true,
          pricingMode: meta.defaultPricingMode,
          value: meta.defaultValue,
          durationDays: meta.allowedDurations ? meta.allowedDurations[0] : null,
          rushWithinHours: type === 'RUSH_DELIVERY' ? 48 : null,
        },
      ];
    });
  };

  const handleUpdateAddon = (type: AddonType, updates: Partial<RateCardAddon>) => {
    setIsDirty(true);
    setAddons((prev) =>
      prev.map((a) => (a.type === type ? { ...a, ...updates } : a))
    );
  };

  const handleClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
      return;
    }
    onClose();
  };

  const handleSubmit = async (targetStatus?: RateCardStatus) => {
    setErrorMessage(null);

    const finalStatus = targetStatus || status;

    // Client-side validations
    if (!title.trim() || title.trim().length < 3) {
      setErrorMessage('Please enter a deliverable title (at least 3 characters).');
      setActiveTab('basics');
      return;
    }

    if (finalStatus === 'ACTIVE' && (isNaN(price) || price <= 0)) {
      setErrorMessage('Active deliverables must have a starting price greater than ₹0. Set status to Draft if pricing is undecided.');
      setActiveTab('pricing');
      return;
    }

    if (deliveryDays < 1 || deliveryDays > 90) {
      setErrorMessage('Turnaround delivery time must be between 1 and 90 days.');
      setActiveTab('specs');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        platform,
        contentFormat,
        deliverableType,
        durationSeconds: durationSeconds || null,
        price: Number(price),
        currency,
        priceType,
        minimumBookingAmount: minimumBookingAmount ? Number(minimumBookingAmount) : null,
        title: title.trim(),
        description: description.trim(),
        deliveryDays: Number(deliveryDays),
        freeRevisions: Number(freeRevisions),
        publishOnMyChannel,
        scriptApprovalRequired,
        status: finalStatus,
        visibleToBrands,
        addons: addons.filter((a) => a.enabled),
      };

      if (isEditing && item) {
        payload.version = item.version;
      }

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save deliverable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isEditing ? `Edit Deliverable — ${item?.title}` : 'Add New Rate Card Deliverable'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define pricing, technical specs, platform rules, and brand add-on tiers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            aria-label="Close"
          >
            <ShellIcon name="X" size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <ShellIcon name="AlertCircle" size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-border overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'basics'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            1. Basics & Format
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            2. Specs & SLA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            3. Pricing & Terms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'options'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            4. Creator Options
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addons')}
            className={`pb-2.5 px-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'addons'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            5. Add-ons & Licensing ({addons.filter((a) => a.enabled).length})
          </button>
        </div>

        {/* Modal Body & Live Preview */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Fields (2 Cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. BASICS */}
            {activeTab === 'basics' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Platform Selection */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Platform
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ALL_PLATFORMS.map((p) => {
                      const meta = PLATFORM_METADATA[p];
                      const isSelected = platform === p;
                      const isConnected = !connectedPlatforms || connectedPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePlatformChange(p)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                            isSelected
                              ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-500/10 text-foreground font-semibold'
                              : 'border-border bg-card hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                            <SocialPlatformIcon platform={p} size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="truncate block">{meta.label}</span>
                            {!isConnected && (
                              <span className="text-[10px] text-amber-500 block">Not connected</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Format & Deliverable Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Content Format (Filtered for {PLATFORM_METADATA[platform].label})
                    </label>
                    <select
                      value={contentFormat}
                      onChange={(e) => {
                        setContentFormat(e.target.value as ContentFormat);
                        setIsDirty(true);
                      }}
                      className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {supportedFormats.map((f) => (
                        <option key={f} value={f}>
                          {FORMAT_METADATA[f].label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {FORMAT_METADATA[contentFormat]?.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Deliverable Type
                    </label>
                    <select
                      value={deliverableType}
                      onChange={(e) => {
                        setDeliverableType(e.target.value as DeliverableType);
                        setIsDirty(true);
                      }}
                      className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {ALL_DELIVERABLE_TYPES.map((dt) => (
                        <option key={dt} value={dt}>
                          {DELIVERABLE_TYPE_METADATA[dt].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title with Suggestion */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Deliverable Title <span className="text-destructive">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSuggestTitle}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ShellIcon name="Sparkles" size={12} />
                      Auto-Suggest Title
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. 1 Min Dedicated Instagram Reel"
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>Clear, descriptive title shown to brands</span>
                    <span>{title.length}/80</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Deliverable Scope & What&apos;s Included
                  </label>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Describe what brand gets, production quality, scripting process, and call to action placement..."
                    className="w-full text-xs rounded-xl border border-border bg-background p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="text-right text-[11px] text-muted-foreground mt-0.5">
                    {description.length}/1000
                  </div>
                </div>
              </div>
            )}

            {/* 2. SPECS & SLA */}
            {activeTab === 'specs' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Content Duration
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {DURATION_PRESETS.map((preset) => {
                      const isSelected = !isCustomDuration && durationSeconds === preset.seconds;
                      return (
                        <button
                          key={preset.seconds}
                          type="button"
                          onClick={() => {
                            setDurationSeconds(preset.seconds);
                            setIsCustomDuration(false);
                            setIsDirty(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'border-border bg-card text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDuration(true);
                        setIsDirty(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        isCustomDuration
                          ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Custom Seconds
                    </button>
                  </div>

                  {isCustomDuration && (
                    <div className="flex items-center gap-2 max-w-xs">
                      <input
                        type="number"
                        min={1}
                        max={7200}
                        value={durationSeconds || ''}
                        onChange={(e) => {
                          setDurationSeconds(e.target.value ? Number(e.target.value) : null);
                          setIsDirty(true);
                        }}
                        placeholder="Seconds (e.g. 90)"
                        className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-muted-foreground">seconds</span>
                    </div>
                  )}
                </div>

                {/* Delivery SLA & Revisions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Standard Delivery Time (Days) <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={deliveryDays}
                      onChange={(e) => {
                        setDeliveryDays(Number(e.target.value));
                        setIsDirty(true);
                      }}
                      className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Business days required from concept approval to draft delivery.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Included Free Revisions
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={freeRevisions}
                      onChange={(e) => {
                        setFreeRevisions(Number(e.target.value));
                        setIsDirty(true);
                      }}
                      className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Rounds of minor feedback included before additional surcharge applies.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PRICING & TERMS */}
            {activeTab === 'pricing' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Deliverable Base Price (INR ₹) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={price || ''}
                      onChange={(e) => {
                        setPrice(Number(e.target.value));
                        setIsDirty(true);
                      }}
                      placeholder="25000"
                      className="w-full text-sm font-bold rounded-xl border border-border bg-background pl-8 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Standard rate for this single deliverable. Zero ₹0 active items are strictly prohibited.
                  </p>
                </div>

                {/* Price Type & Min Booking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Pricing Flexibility
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPriceType('FIXED');
                          setIsDirty(true);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                          priceType === 'FIXED'
                            ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        Fixed Price
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPriceType('NEGOTIABLE');
                          setIsDirty(true);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                          priceType === 'NEGOTIABLE'
                            ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        Negotiable
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Minimum Booking Amount (Optional)
                    </label>
                    <input
                      type="number"
                      value={minimumBookingAmount || ''}
                      onChange={(e) => {
                        setMinimumBookingAmount(e.target.value ? Number(e.target.value) : null);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. 20000"
                      className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. CREATOR OPTIONS */}
            {activeTab === 'options' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Toggles */}
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">
                        Publish on My Creator Channel
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Content is posted directly on your verified social feed.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={publishOnMyChannel}
                      onChange={(e) => {
                        setPublishOnMyChannel(e.target.checked);
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <div className="border-t border-border pt-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-semibold text-foreground block">
                          Script Approval Required Before Shoot
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          Brand must review and sign off on video script/storyboard.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={scriptApprovalRequired}
                        onChange={(e) => {
                          setScriptApprovalRequired(e.target.checked);
                          setIsDirty(true);
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  </div>

                  <div className="border-t border-border pt-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="text-xs font-semibold text-foreground block">
                          Visible in Brand Discovery &amp; Search
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          Allow verified brands to view this item on your public rate card.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibleToBrands}
                        onChange={(e) => {
                          setVisibleToBrands(e.target.checked);
                          setIsDirty(true);
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Item Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ACTIVE', 'PAUSED', 'DRAFT'] as RateCardStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setStatus(st);
                          setIsDirty(true);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                          status === st
                            ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-border bg-card text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. ADD-ONS & LICENSING */}
            {activeTab === 'addons' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <p className="text-xs text-muted-foreground">
                  Configure add-on licensing rates for this deliverable. Brand simulator and contracts will use your exact settings.
                </p>

                {ALL_ADDON_TYPES.map((type) => {
                  const meta = ADDON_TYPE_METADATA[type];
                  const configured = addons.find((a) => a.type === type);
                  const isEnabled = Boolean(configured?.enabled);

                  return (
                    <div
                      key={type}
                      className={`p-3.5 rounded-xl border transition ${
                        isEnabled ? 'border-border bg-card' : 'border-border/60 bg-muted/20 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() => handleToggleAddon(type)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {meta.label}
                          </span>
                        </div>
                        {isEnabled && configured && (
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            {configured.pricingMode === 'PERCENT_OF_BASE'
                              ? `+${configured.value}% of base`
                              : `+₹${configured.value.toLocaleString('en-IN')}`}
                          </span>
                        )}
                      </div>

                      {isEnabled && configured && (
                        <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                              Pricing Mode
                            </label>
                            <select
                              value={configured.pricingMode}
                              onChange={(e) =>
                                handleUpdateAddon(type, {
                                  pricingMode: e.target.value as any,
                                })
                              }
                              className="w-full text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
                            >
                              <option value="PERCENT_OF_BASE">% of Base Deliverable</option>
                              <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                              {configured.pricingMode === 'PERCENT_OF_BASE' ? 'Percentage (+%)' : 'Fixed Surcharge (₹)'}
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={configured.value}
                              onChange={(e) =>
                                handleUpdateAddon(type, {
                                  value: Number(e.target.value),
                                })
                              }
                              className="w-full text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
                            />
                          </div>

                          {meta.allowedDurations && (
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                                Duration Tier
                              </label>
                              <div className="flex gap-2">
                                {meta.allowedDurations.map((days) => (
                                  <button
                                    key={days}
                                    type="button"
                                    onClick={() => handleUpdateAddon(type, { durationDays: days })}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                                      configured.durationDays === days
                                        ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                                    }`}
                                  >
                                    {days >= 365 ? '1 Year / Lifetime' : `${days} Days`}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Live "Brand Sees This" Preview Card */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <ShellIcon name="Eye" size={14} className="text-indigo-600 dark:text-indigo-400" />
              Live Brand Preview
            </span>

            <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center shrink-0">
                    <SocialPlatformIcon platform={platform} size={20} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${PLATFORM_METADATA[platform].badgeColor}`}>
                    {PLATFORM_METADATA[platform].label}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-foreground">
                  ₹{Number(price || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground leading-snug">
                  {title.trim() || 'Untitled Deliverable'}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                  {description.trim() || 'Standard deliverable package details.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t border-border">
                <span>⏱️ {deliveryDays}d delivery</span>
                <span>•</span>
                <span>🔄 {freeRevisions} free revision{freeRevisions !== 1 ? 's' : ''}</span>
                {durationSeconds && (
                  <>
                    <span>•</span>
                    <span>⌛ {durationSeconds >= 60 ? `${Math.round(durationSeconds / 60)}m` : `${durationSeconds}s`}</span>
                  </>
                )}
              </div>

              {addons.filter((a) => a.enabled).length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-bold text-muted-foreground block mb-1">
                    Configured Add-ons:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {addons
                      .filter((a) => a.enabled)
                      .map((a) => (
                        <span
                          key={a.type}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-foreground border border-border"
                        >
                          {ADDON_TYPE_METADATA[a.type]?.label.split(' ')[0]}:{' '}
                          {a.pricingMode === 'PERCENT_OF_BASE' ? `+${a.value}%` : `+₹${a.value}`}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Brands filter rate cards by turn-around time and deliverable type. Clear descriptions close deals 2.4x faster.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('DRAFT')}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('ACTIVE')}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-60"
            >
              <ShellIcon name="Save" size={14} />
              {isSubmitting ? 'Saving...' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
