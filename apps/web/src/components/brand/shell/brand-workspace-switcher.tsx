'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BrandShellIcon } from './brand-shell-icons';

export interface BrandEntity {
  id: string;
  name: string;
  role?: string;
  isAgency?: boolean;
}

interface BrandWorkspaceSwitcherProps {
  currentBrandName?: string;
  entities?: BrandEntity[];
  isAgency?: boolean;
}

export function BrandWorkspaceSwitcher({
  currentBrandName = 'Workspace',
  entities = [],
  isAgency = false,
}: BrandWorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('default');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fallback entity list if not provided
  const availableEntities: BrandEntity[] = entities.length > 0
    ? entities
    : [{ id: 'default', name: currentBrandName, isAgency }];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeEntity = availableEntities.find((e) => e.id === selectedEntityId) || availableEntities[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground transition text-left cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <BrandShellIcon name="Building2" size={15} />
        </div>
        <div className="min-w-0 max-w-[140px] sm:max-w-[200px]">
          <div className="text-xs font-semibold truncate leading-tight group-hover:text-primary transition">
            {activeEntity.name}
          </div>
          <div className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
            <span>{isAgency ? 'Agency Client' : 'Direct Brand'}</span>
          </div>
        </div>
        <BrandShellIcon
          name="ChevronDown"
          size={14}
          className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">
            Workspaces & Brand Entities
          </div>

          <div className="mt-1 space-y-1 max-h-56 overflow-y-auto">
            {availableEntities.map((ent) => (
              <button
                key={ent.id}
                type="button"
                onClick={() => {
                  setSelectedEntityId(ent.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition cursor-pointer ${
                  ent.id === activeEntity.id
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <div className="truncate flex-1">
                  <div className="truncate">{ent.name}</div>
                  {ent.role && (
                    <div className="text-[10px] text-muted-foreground font-normal">
                      {ent.role}
                    </div>
                  )}
                </div>
                {ent.id === activeEntity.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-border flex flex-col gap-1">
            <Link
              href="/brand/entities"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <BrandShellIcon name="Layers" size={14} />
              <span>Manage Brand Entities</span>
            </Link>
            <Link
              href="/brand/team"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <BrandShellIcon name="Users" size={14} />
              <span>Invite Team Members</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
