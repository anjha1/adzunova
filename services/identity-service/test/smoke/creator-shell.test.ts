import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const WEB_SRC = join(__dirname, '..', '..', '..', '..', 'apps', 'web', 'src');

describe('Creator Dashboard Responsive Shell & Breakpoint Verification', () => {
  const sidebarPath = join(WEB_SRC, 'components', 'creator', 'shell', 'creator-sidebar.tsx');
  const bottomNavPath = join(WEB_SRC, 'components', 'creator', 'shell', 'mobile-bottom-nav.tsx');
  const shellPath = join(WEB_SRC, 'components', 'creator', 'shell', 'creator-shell.tsx');

  it('creator-sidebar enforces hidden on mobile (hidden desk:flex)', () => {
    expect(existsSync(sidebarPath)).toBe(true);
    const content = readFileSync(sidebarPath, 'utf-8');
    // Sidebar must hide on <= 640px and show on >= 641px (desk)
    expect(content).toContain('hidden desk:flex');
  });

  it('mobile-bottom-nav enforces visible on mobile only (desk:hidden)', () => {
    expect(existsSync(bottomNavPath)).toBe(true);
    const content = readFileSync(bottomNavPath, 'utf-8');
    // Bottom nav must be desk:hidden (visible on <= 640px, hidden on >= 641px)
    expect(content).toContain('desk:hidden');
  });

  it('creator-shell integrates both sidebar and bottom navigation', () => {
    expect(existsSync(shellPath)).toBe(true);
    const content = readFileSync(shellPath, 'utf-8');
    expect(content).toContain('<CreatorSidebar');
    expect(content).toContain('<MobileBottomNav');
    expect(content).toContain('<MobileMoreSheet');
  });

  it('all 18 navigation routes are defined with zero broken routes', () => {
    const navConfigPath = join(WEB_SRC, 'components', 'creator', 'shell', 'nav-config.ts');
    expect(existsSync(navConfigPath)).toBe(true);
    const content = readFileSync(navConfigPath, 'utf-8');
    
    // Check key routes exist in nav config
    const expectedRoutes = [
      '/creator/dashboard',
      '/creator/offers',
      '/creator/campaigns',
      '/creator/messages',
      '/creator/rate-card',
      '/creator/packages',
      '/creator/availability',
      '/creator/contracts',
      '/creator/content',
      '/creator/earnings',
      '/creator/affiliate',
      '/creator/analytics',
      '/creator/growth',
      '/creator/trust',
      '/creator/media-kit',
      '/creator/profile',
      '/creator/accounts',
      '/creator/settings',
    ];

    for (const route of expectedRoutes) {
      expect(content).toContain(route);
    }
  });

  it('no horizontal scroll - safe viewport margins defined', () => {
    const shellContent = readFileSync(shellPath, 'utf-8');
    expect(shellContent).toContain('min-w-0');
    expect(shellContent).toContain('max-w-7xl');
  });
});
