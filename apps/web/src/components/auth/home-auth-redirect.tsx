'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client-side session redirect for marketing homepage.
 * Runs only in the browser via useEffect, ensuring the homepage
 * remains 100% statically prerenderable during build time.
 */
export function HomeAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          if (data.user?.role === 'CREATOR') {
            router.replace(data.profile?.onboardingCompleted ? '/creator/dashboard' : '/creator/onboarding');
          } else if (data.user?.role === 'BRAND') {
            router.replace(data.profile?.onboardingCompleted ? '/brand/dashboard' : '/brand/onboarding');
          }
        }
      })
      .catch(() => {});
  }, [router]);

  return null;
}
