'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader, StatCard, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface BrandReview {
  id: string;
  brandName: string;
  campaignTitle: string;
  rating: number;
  date: string;
  comment: string;
  dealValueMinor: number;
}

const REVIEWS: BrandReview[] = [
  {
    id: 'rev-1',
    brandName: 'Nordic Audio Tech',
    campaignTitle: 'Wireless ANC Headphone Launch',
    rating: 5,
    date: 'Nov 17, 2026',
    comment:
      'Exceptional production quality! Delivered the 4K review video 2 days ahead of schedule with flawless sound engineering and clear articulation of product USPs.',
    dealValueMinor: 6500000,
  },
  {
    id: 'rev-2',
    brandName: 'FitPro Nutrition',
    campaignTitle: 'Whey Isolate Q4 Push',
    rating: 5,
    date: 'Nov 12, 2026',
    comment:
      'Great energy in the reel and high audience retention. The trackable affiliate link generated over 800 clicks within 48 hours of posting.',
    dealValueMinor: 3500000,
  },
];

export default function TrustPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Reviews, Reputation & Trust Score"
        description="Verified brand feedback and on-time reliability metrics. Only brands with fully funded escrow deals can submit reviews."
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Creator Trust Score"
          value="98 / 100"
          subValue="Enterprise Verified"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
        <StatCard
          label="On-Time Delivery Rate"
          value="100%"
          subValue="Zero SLA breaches"
          icon={<ShellIcon name="Clock" size={16} />}
        />
        <StatCard
          label="Brand Satisfaction"
          value="5.0 / 5.0"
          subValue="Based on verified reviews"
          icon={<ShellIcon name="Award" size={16} />}
        />
        <StatCard
          label="Escrow Dispute Rate"
          value="0.0%"
          subValue="Clean settlement record"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-sm font-bold text-foreground">Verified Brand Reviews</h2>
          <span className="text-xs text-muted-foreground">Double-blind authenticated reviews</span>
        </div>

        <div className="space-y-4">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-xl border border-border bg-card space-y-3 hover:border-border/80 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{review.brandName}</h3>
                    <StatusBadge variant="success" label="Verified Escrow Deal" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.campaignTitle}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 justify-end">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{review.date}</span>
                </div>
              </div>

              <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-xl border border-border">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
