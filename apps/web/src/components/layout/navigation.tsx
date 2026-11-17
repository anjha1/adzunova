'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_ITEMS } from './nav-data';
import type { NavItem } from './nav-data';

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : 'rotate-0'}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface DropdownPanelProps {
  item: NavItem;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  id: string;
}

function DropdownPanel({ item, isOpen, onClose, triggerRef, id }: DropdownPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!item.children) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          ref={panelRef}
          role="menu"
          aria-label={`${item.label} submenu`}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-[var(--z-dropdown)] min-w-[17rem] p-1.5 rounded-2xl bg-[var(--color-surface-overlay)] border border-[var(--color-border)] shadow-xl backdrop-blur-xl overflow-hidden"
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={onClose}
              className="group block px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:bg-[var(--color-surface-2)] transition-colors"
            >
              <span className="block text-sm font-semibold text-[var(--color-fg-primary)] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {child.label}
              </span>
              {child.description && (
                <span className="block text-xs text-[var(--color-fg-muted)] mt-0.5 leading-snug">
                  {child.description}
                </span>
              )}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface NavItemButtonProps {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
  uniqueId: string;
}

function NavItemButton({
  item,
  isOpen,
  isActive,
  onToggle,
  onOpen,
  onClose,
  uniqueId,
}: NavItemButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (item.children) {
      onOpen();
    }
  }

  function handleMouseLeave() {
    if (item.children) {
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 150);
    }
  }

  const baseClass = [
    'relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]',
    isActive || isOpen
      ? 'text-[var(--color-fg-primary)] font-semibold'
      : 'text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)]',
  ].join(' ');

  if (item.href && !item.children) {
    return (
      <Link href={item.href} className={baseClass}>
        {item.label}
        {isActive && (
          <motion.div
            layoutId="navbar-active-indicator"
            className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`nav-btn-${uniqueId}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
            triggerRef.current?.focus();
          }
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`nav-menu-${uniqueId}`}
        className={baseClass}
      >
        <span>{item.label}</span>
        <ChevronDown open={isOpen} />
        {isActive && (
          <motion.div
            layoutId="navbar-active-indicator"
            className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      <DropdownPanel
        id={`nav-menu-${uniqueId}`}
        item={item}
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
      />
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);

  // Close menus when route changes by wrapping onClose or on link click
  const handleClose = () => setOpenId(null);

  // Global escape key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenId(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Items to show at 641px-1023px (desk but < lg):
  // Product, For Creators, For Brands, and a "More" dropdown for the rest
  const primaryTabletItems = NAV_ITEMS.filter((item) =>
    ['Product', 'For Creators', 'For Brands'].includes(item.label)
  );

  const overflowTabletItems: NavItem = {
    label: 'More',
    children: NAV_ITEMS.filter(
      (item) => !['Product', 'For Creators', 'For Brands'].includes(item.label)
    ).flatMap((item) =>
      item.children
        ? item.children
        : item.href
        ? [{ label: item.label, href: item.href }]
        : []
    ),
  };

  return (
    <>
      {/* 641px to 1023px tablet view: compact 3 items + More */}
      <nav
        aria-label="Tablet navigation"
        className="hidden desk:flex lg:hidden items-center gap-1"
      >
        {primaryTabletItems.map((item) => {
          const isActive =
            (item.href && pathname === item.href) ||
            Boolean(item.children?.some((c) => pathname === c.href));
          return (
            <NavItemButton
              key={item.label}
              item={item}
              uniqueId={`tab-${item.label}`}
              isOpen={openId === `tab-${item.label}`}
              isActive={isActive}
              onToggle={() =>
                setOpenId(openId === `tab-${item.label}` ? null : `tab-${item.label}`)
              }
              onOpen={() => setOpenId(`tab-${item.label}`)}
              onClose={handleClose}
            />
          );
        })}
        {/* More dropdown */}
        <NavItemButton
          item={overflowTabletItems}
          uniqueId="tab-more"
          isOpen={openId === 'tab-more'}
          isActive={false}
          onToggle={() => setOpenId(openId === 'tab-more' ? null : 'tab-more')}
          onOpen={() => setOpenId('tab-more')}
          onClose={handleClose}
        />
      </nav>

      {/* 1024px+ desktop view: all 6 items */}
      <nav
        aria-label="Desktop navigation"
        className="hidden lg:flex items-center gap-1"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            (item.href && pathname === item.href) ||
            Boolean(item.children?.some((c) => pathname === c.href));
          return (
            <NavItemButton
              key={item.label}
              item={item}
              uniqueId={`desk-${item.label}`}
              isOpen={openId === `desk-${item.label}`}
              isActive={isActive}
              onToggle={() =>
                setOpenId(openId === `desk-${item.label}` ? null : `desk-${item.label}`)
              }
              onOpen={() => setOpenId(`desk-${item.label}`)}
              onClose={handleClose}
            />
          );
        })}
      </nav>
    </>
  );
}
