export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
  section?: 'main' | 'business' | 'insights' | 'account';
}

export const CREATOR_NAV_ITEMS: NavItem[] = [
  // Main
  { title: 'Overview', href: '/creator/dashboard', iconName: 'Home', section: 'main' },
  { title: 'Offers & Deals', href: '/creator/offers', iconName: 'Inbox', section: 'main' },
  { title: 'Campaigns', href: '/creator/campaigns', iconName: 'Briefcase', section: 'main' },
  { title: 'Messages', href: '/creator/messages', iconName: 'MessageSquare', section: 'main' },

  // Business & Monetization
  { title: 'Rate Card', href: '/creator/rate-card', iconName: 'Tag', section: 'business' },
  { title: 'Packages', href: '/creator/packages', iconName: 'Package', section: 'business' },
  { title: 'Availability', href: '/creator/availability', iconName: 'Calendar', section: 'business' },
  { title: 'Contracts', href: '/creator/contracts', iconName: 'FileText', section: 'business' },
  { title: 'Content Vault', href: '/creator/content', iconName: 'FolderCheck', section: 'business' },
  { title: 'Wallet & Payouts', href: '/creator/earnings', iconName: 'CreditCard', section: 'business' },
  { title: 'Affiliate Hub', href: '/creator/affiliate', iconName: 'TrendingUp', section: 'business' },

  // Insights & Intelligence
  { title: 'Analytics', href: '/creator/analytics', iconName: 'BarChart2', section: 'insights' },
  { title: 'Trend Explorer', href: '/creator/analytics/trends', iconName: 'Flame', section: 'insights' },
  { title: 'Growth & Optimization', href: '/creator/growth', iconName: 'TrendingUp', section: 'insights' },
  { title: 'Reviews & Trust', href: '/creator/trust', iconName: 'ShieldCheck', section: 'insights' },
  { title: 'Auto Media Kit', href: '/creator/media-kit', iconName: 'Share2', section: 'insights' },

  // Account & Setup
  { title: 'Public Profile', href: '/creator/profile', iconName: 'User', section: 'account' },
  { title: 'Connected Accounts', href: '/creator/accounts', iconName: 'Link2', section: 'account' },
  { title: 'Settings', href: '/creator/settings', iconName: 'Settings', section: 'account' },
];

export const MOBILE_PRIMARY_TABS = [
  { title: 'Home', href: '/creator/dashboard', iconName: 'Home' },
  { title: 'Offers', href: '/creator/offers', iconName: 'Inbox' },
  { title: 'Campaigns', href: '/creator/campaigns', iconName: 'Briefcase' },
  { title: 'Wallet', href: '/creator/earnings', iconName: 'CreditCard' },
  { title: 'More', href: '#more', iconName: 'Menu' },
];
