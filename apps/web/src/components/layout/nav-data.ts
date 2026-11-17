// ---------------------------------------------------------------------------
// Navigation data — shared between desktop Navigation and MobileNavigation.
// Server-safe (no browser APIs). Pure data, no components.
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  /** If present, renders as a dropdown with these links */
  children?: NavLink[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Product',
    href: '/product',
    children: [
      {
        label: 'Platform Overview',
        href: '/product',
        description: 'Tour the end-to-end creator collaboration lifecycle',
      },
      {
        label: 'Creator Discovery',
        href: '/product#discovery',
        description: 'Platform-verified talent discovery across social channels',
      },
      {
        label: 'Milestones & Review',
        href: '/product#milestones',
        description: 'Standardized deliverable approvals and revision flows',
      },
      {
        label: 'Escrow Settlements',
        href: '/product#escrow',
        description: 'Instant automated payouts upon asset sign-off',
      },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      {
        label: 'For Creators',
        href: '/for-creators',
        description: 'Showcase verified reach, lock scope, and get paid safely',
      },
      {
        label: 'For Brands',
        href: '/for-brands',
        description: 'Eliminate chaotic spreadsheets and scale influencer ROI',
      },
      {
        label: 'For Agencies',
        href: '/for-brands',
        description: 'Multi-creator campaign management and roster workflows',
      },
    ],
  },
  {
    label: 'For Creators',
    href: '/for-creators',
  },
  {
    label: 'For Brands',
    href: '/for-brands',
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      {
        label: 'Trust & Safety',
        href: '/trust',
        description: 'Platform verification, milestone escrow, and AI ethics',
      },
      {
        label: 'Frequently Asked Questions',
        href: '/faq',
        description: 'Answers about creator onboarding, rates, and payments',
      },
      {
        label: 'Early Access Cohort',
        href: '/#join',
        description: 'Join the priority access queue for creators & brands',
      },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
];
