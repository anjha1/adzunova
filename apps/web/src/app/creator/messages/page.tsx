'use client';

import React, { useState } from 'react';
import { PageHeader, EmptyState, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

interface ChatMessage {
  id: string;
  sender: 'brand' | 'creator' | 'system';
  text: string;
  timestamp: string;
  attachmentName?: string;
}

interface Conversation {
  id: string;
  brandName: string;
  campaignTitle: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  escrowStatus: 'funded' | 'released' | 'pending';
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    brandName: 'Nordic Audio Tech',
    campaignTitle: 'Wireless ANC Headphone Launch',
    avatarBg: 'bg-blue-600',
    lastMessage: 'The script draft looks great! Please proceed to shoot the b-roll.',
    time: '10:42 AM',
    unreadCount: 1,
    escrowStatus: 'funded',
    messages: [
      {
        id: 'm1',
        sender: 'system',
        text: 'Escrow Locked: Nordic Audio Tech has pre-funded ₹65,000 for this campaign. Work is protected.',
        timestamp: 'Nov 16, 2:00 PM',
      },
      {
        id: 'm2',
        sender: 'brand',
        text: 'Hi! We love your tech reviews. We sent over the review sample via courier yesterday. Tracking: BLR89102.',
        timestamp: 'Nov 16, 2:15 PM',
      },
      {
        id: 'm3',
        sender: 'creator',
        text: 'Thanks! Package received. I will outline the script focusing on the ANC battery performance and noise cancellation in metro commutes.',
        timestamp: 'Nov 17, 11:30 AM',
      },
      {
        id: 'm4',
        sender: 'brand',
        text: 'The script draft looks great! Please proceed to shoot the b-roll.',
        timestamp: 'Today, 10:42 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    brandName: 'FitPro Nutrition',
    campaignTitle: 'Whey Isolate Q4 Push',
    avatarBg: 'bg-emerald-600',
    lastMessage: 'Can you provide the raw footage files alongside the final reel?',
    time: 'Yesterday',
    unreadCount: 0,
    escrowStatus: 'funded',
    messages: [
      {
        id: 'm2-1',
        sender: 'system',
        text: 'Escrow Locked: FitPro Nutrition pre-funded ₹35,000.',
        timestamp: 'Nov 15',
      },
      {
        id: 'm2-2',
        sender: 'brand',
        text: 'Can you provide the raw footage files alongside the final reel?',
        timestamp: 'Yesterday, 4:10 PM',
      },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'creator',
      text: inputText,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessage: inputText,
              time: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
    setInputText('');
  };

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
          description="When a brand reaches out regarding an offer or books your rate card, a private encrypted chat thread will open here."
          actionText="View Brand Offers"
          actionHref="/creator/offers"
        />
      ) : (
        <div className="grid grid-cols-1 desk:grid-cols-3 gap-0 rounded-2xl bg-card border border-border shadow-sm overflow-hidden min-h-[580px]">
          {/* Thread List Sidebar */}
          <div className="border-r border-border flex flex-col">
            <div className="p-3.5 border-b border-border bg-muted/30">
              <input
                type="text"
                placeholder="Search deals or brands..."
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex-1 divide-y divide-border overflow-y-auto">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    className={`w-full text-left p-4 transition flex items-start gap-3 hover:bg-muted/40 ${
                      isActive ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${conv.avatarBg}`}
                    >
                      {conv.brandName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground truncate">{conv.brandName}</h4>
                        <span className="text-[10px] text-muted-foreground shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {conv.campaignTitle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Window */}
          {activeConv ? (
            <div className="desk:col-span-2 flex flex-col justify-between">
              {/* Top Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${activeConv.avatarBg}`}
                  >
                    {activeConv.brandName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-foreground">{activeConv.brandName}</h3>
                      <StatusBadge variant="success" label="Escrow Funded" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">{activeConv.campaignTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted font-medium">
                    View Contract
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[440px]">
                {activeConv.messages.map((m) => {
                  if (m.sender === 'system') {
                    return (
                      <div key={m.id} className="text-center my-2">
                        <span className="inline-block px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          🛡️ {m.text}
                        </span>
                      </div>
                    );
                  }

                  const isMe = m.sender === 'creator';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-muted text-foreground border border-border rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-border bg-card">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Attach draft media or script PDF"
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  >
                    <ShellIcon name="Paperclip" size={16} />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message or share deliverable update..."
                    className="flex-1 text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="desk:col-span-2 flex items-center justify-center p-8 text-center text-muted-foreground text-xs">
              Select a conversation to view chat history
            </div>
          )}
        </div>
      )}
    </div>
  );
}
