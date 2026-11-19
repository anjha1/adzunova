'use client';

import React, { useState } from 'react';
import { PageHeader, EmptyState } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface ChatMessage {
  id: string;
  sender: 'brand' | 'creator' | 'system';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  brandName: string;
  campaignTitle: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>([]);
  const [activeConvId] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Messages & Deal Communication"
        description="Direct communication with verified brand marketing managers. Share deliverable drafts, script outlines, and review comments."
      />

      {conversations.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="MessageSquare" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Conversations Active"
          description="When a brand reaches out regarding an offer or books your rate card, a direct communication thread will open here."
          actionText="View Brand Offers"
          actionHref="/creator/offers"
        />
      ) : (
        <div className="grid grid-cols-1 desk:grid-cols-3 gap-0 rounded-2xl bg-card border border-border shadow-xs overflow-hidden min-h-[580px]">
          {/* Conversation list and chat stream render when conversations exist */}
        </div>
      )}
    </div>
  );
}
