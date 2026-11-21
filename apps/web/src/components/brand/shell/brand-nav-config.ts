export type BrandNavSection =
  | 'main'
  | 'work'
  | 'finance'
  | 'insights'
  | 'trust'
  | 'workspace'
  | 'support';

export type BrandUserRole =
  | 'OWNER'
  | 'ADMIN'
  | 'CAMPAIGN_MANAGER'
  | 'FINANCE'
  | 'LEGAL'
  | 'VIEWER';

export interface BrandNavItem {
  title: string;
  href: string;
  iconName: string;
  section: BrandNavSection;
  badge?: number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
  roles?: BrandUserRole[];
  featureFlag?: string;
  description?: string;
}

export const BRAND_NAV_SECTIONS: { id: BrandNavSection; label: string }[] = [
  { id: 'main', label: 'MAIN' },
  { id: 'work', label: 'WORK' },
  { id: 'finance', label: 'FINANCE' },
  { id: 'insights', label: 'INSIGHTS' },
  { id: 'trust', label: 'TRUST' },
  { id: 'workspace', label: 'WORKSPACE' },
  { id: 'support', label: 'SUPPORT' },
];

export const BRAND_NAV_ITEMS: BrandNavItem[] = [
  // MAIN
  {
    title: 'Dashboard',
    href: '/brand/dashboard',
    iconName: 'Home',
    section: 'main',
    description: 'Workspace performance, active campaigns and quick actions',
  },
  {
    title: 'Discover Creators',
    href: '/brand/discover',
    iconName: 'Compass',
    section: 'main',
    description: 'Find platform-verified talent across platforms',
  },
  {
    title: 'Shortlists',
    href: '/brand/shortlists',
    iconName: 'Bookmark',
    section: 'main',
    description: 'Curated rosters and talent bookmarks',
  },
  {
    title: 'Campaigns',
    href: '/brand/campaigns',
    iconName: 'Briefcase',
    section: 'main',
    description: 'Campaign briefs, deliverables and timelines',
  },

  // WORK
  {
    title: 'Offers & Bookings',
    href: '/brand/offers',
    iconName: 'Inbox',
    section: 'work',
    roles: ['OWNER', 'ADMIN', 'CAMPAIGN_MANAGER', 'VIEWER'],
    description: 'Direct booking requests and creator proposals',
  },
  {
    title: 'Contracts',
    href: '/brand/contracts',
    iconName: 'FileText',
    section: 'work',
    roles: ['OWNER', 'ADMIN', 'LEGAL', 'CAMPAIGN_MANAGER', 'VIEWER'],
    description: 'Executed agreements, licensing terms and NDAs',
  },
  {
    title: 'Content Review',
    href: '/brand/content-review',
    iconName: 'CheckSquare',
    section: 'work',
    roles: ['OWNER', 'ADMIN', 'CAMPAIGN_MANAGER', 'VIEWER'],
    description: 'Draft review, revision cycles and script approvals',
  },
  {
    title: 'Messages',
    href: '/brand/messages',
    iconName: 'MessageSquare',
    section: 'work',
    featureFlag: 'NEXT_PUBLIC_ENABLE_BRAND_MESSAGES',
    description: 'Direct brand-to-creator messaging portal',
  },

  // FINANCE
  {
    title: 'Wallet & Escrow',
    href: '/brand/finance',
    iconName: 'CreditCard',
    section: 'finance',
    roles: ['OWNER', 'ADMIN', 'FINANCE'],
    description: 'Wallet balance, milestone escrow locks and transactions',
  },
  {
    title: 'Invoices & Tax',
    href: '/brand/invoices',
    iconName: 'Receipt',
    section: 'finance',
    roles: ['OWNER', 'ADMIN', 'FINANCE'],
    description: 'GST compliance invoices, TDS and tax receipts',
  },
  {
    title: 'Budgets',
    href: '/brand/budgets',
    iconName: 'PieChart',
    section: 'finance',
    roles: ['OWNER', 'ADMIN', 'FINANCE', 'CAMPAIGN_MANAGER'],
    description: 'Campaign budget allocations and spend tracking',
  },

  // INSIGHTS
  {
    title: 'Analytics & Reports',
    href: '/brand/analytics',
    iconName: 'BarChart2',
    section: 'insights',
    description: 'Aggregated ROI, verified views and conversion metrics',
  },

  // TRUST
  {
    title: 'Disputes',
    href: '/brand/disputes',
    iconName: 'Scale',
    section: 'trust',
    roles: ['OWNER', 'ADMIN', 'LEGAL'],
    description: 'Arbitration cases and milestone dispute resolution',
  },
  {
    title: 'Reviews',
    href: '/brand/reviews',
    iconName: 'Star',
    section: 'trust',
    description: 'Creator performance reviews and mutual ratings',
  },

  // WORKSPACE
  {
    title: 'Team & Roles',
    href: '/brand/team',
    iconName: 'Users',
    section: 'workspace',
    roles: ['OWNER', 'ADMIN'],
    description: 'Member access, RBAC permissions and invitations',
  },
  {
    title: 'Brands & Entities',
    href: '/brand/entities',
    iconName: 'Layers',
    section: 'workspace',
    roles: ['OWNER', 'ADMIN'],
    description: 'Agency client workspaces and multi-brand entities',
  },
  {
    title: 'Brand Safety',
    href: '/brand/safety',
    iconName: 'ShieldCheck',
    section: 'workspace',
    roles: ['OWNER', 'ADMIN'],
    description: 'Content guidelines, competitor blacklists and domain security',
  },
  {
    title: 'Integrations & API',
    href: '/brand/integrations',
    iconName: 'Cpu',
    section: 'workspace',
    roles: ['OWNER', 'ADMIN'],
    description: 'CRM, webhooks and API credentials',
  },
  {
    title: 'Audit Log',
    href: '/brand/audit-log',
    iconName: 'Activity',
    section: 'workspace',
    roles: ['OWNER', 'ADMIN', 'LEGAL'],
    description: 'Tamper-evident workspace security & audit trail',
  },
  {
    title: 'Settings',
    href: '/brand/settings',
    iconName: 'Settings',
    section: 'workspace',
    roles: ['OWNER', 'ADMIN'],
    description: 'Company legal profile, GSTIN and notifications',
  },

  // SUPPORT
  {
    title: 'Help Center',
    href: '/brand/help',
    iconName: 'LifeBuoy',
    section: 'support',
    description: 'Knowledge base, workflow guides and onboarding help',
  },
  {
    title: 'Tickets',
    href: '/brand/tickets',
    iconName: 'Ticket',
    section: 'support',
    description: 'Direct enterprise support tickets and SLA tracking',
  },
];

export const MOBILE_BRAND_PRIMARY_TABS = [
  { title: 'Home', href: '/brand/dashboard', iconName: 'Home' },
  { title: 'Discover', href: '/brand/discover', iconName: 'Compass' },
  { title: 'Campaigns', href: '/brand/campaigns', iconName: 'Briefcase' },
  { title: 'Finance', href: '/brand/finance', iconName: 'CreditCard' },
  { title: 'More', href: '#more', iconName: 'Menu' },
];

/**
 * Filter items accessible to a given role and feature-flag configuration
 */
export function getFilteredBrandNavItems(
  role: BrandUserRole = 'OWNER',
  enabledFlags: Record<string, boolean> = {}
): BrandNavItem[] {
  return BRAND_NAV_ITEMS.filter((item) => {
    // Check feature flag
    if (item.featureFlag && !enabledFlags[item.featureFlag]) {
      return false;
    }
    // Check role permissions
    if (item.roles && !item.roles.includes(role)) {
      return false;
    }
    return true;
  });
}

/**
 * Single active item via longest prefix match
 */
export function getActiveBrandRoute(pathname: string | null | undefined): string {
  if (!pathname) return '/brand/dashboard';
  // Exact match first
  const exact = BRAND_NAV_ITEMS.find((i) => i.href === pathname);
  if (exact) return exact.href;
  // Longest prefix match
  const matches = BRAND_NAV_ITEMS.filter(
    (i) => i.href !== '/brand/dashboard' && pathname.startsWith(i.href)
  ).sort((a, b) => b.href.length - a.href.length);
  return matches[0]?.href ?? (pathname === '/brand/dashboard' ? '/brand/dashboard' : '');
}
