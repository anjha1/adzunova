'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND_NAV_ITEMS, BrandNavItem } from './brand-nav-config';
import { BrandShellIcon } from './brand-shell-icons';

interface BrandGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandGlobalSearch({ isOpen, onClose }: BrandGlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = query.trim() === ''
    ? BRAND_NAV_ITEMS.slice(0, 8)
    : BRAND_NAV_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: BrandNavItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-border">
          <BrandShellIcon name="Search" size={18} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search brand pages, campaigns, creator tools..."
            className="w-full h-14 px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <BrandShellIcon name="X" size={16} />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono border border-border rounded-md text-muted-foreground">
            ESC
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No brand records found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <BrandShellIcon name={item.iconName} size={16} />
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold truncate">{item.title}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {item.section}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <BrandShellIcon
                    name="ChevronRight"
                    size={14}
                    className={`shrink-0 ${
                      isSelected ? 'text-primary' : 'text-muted-foreground opacity-50'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-muted/30 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigation shortcut:</span>
            <kbd className="px-1 py-0.5 border border-border rounded-xs bg-card font-mono text-[10px]">↑</kbd>
            <kbd className="px-1 py-0.5 border border-border rounded-xs bg-card font-mono text-[10px]">↓</kbd>
            <span>to navigate</span>
            <kbd className="px-1 py-0.5 border border-border rounded-xs bg-card font-mono text-[10px]">↵</kbd>
            <span>to select</span>
          </div>
          <span>Brand Navigation</span>
        </div>
      </div>
    </div>
  );
}
