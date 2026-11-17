'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthRole = 'creator' | 'brand';
type AuthMode = 'signup' | 'signin';

interface AuthModalContextType {
  isOpen: boolean;
  role: AuthRole;
  mode: AuthMode;
  openAuth: (options?: { role?: AuthRole; mode?: AuthMode }) => void;
  closeAuth: () => void;
  setRole: (role: AuthRole) => void;
  setMode: (mode: AuthMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<AuthRole>('creator');
  const [mode, setMode] = useState<AuthMode>('signup');

  function openAuth(options?: { role?: AuthRole; mode?: AuthMode }) {
    if (options?.role) setRole(options.role);
    if (options?.mode) setMode(options.mode);
    setIsOpen(true);
  }

  function closeAuth() {
    setIsOpen(false);
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAuth();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        role,
        mode,
        openAuth,
        closeAuth,
        setRole,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within an AuthModalProvider');
  return ctx;
}
