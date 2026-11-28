import { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { connection } from 'next/server';

export const instant = false;
import {
  getPublicProfileBySlug,
  getCreatorPackages,
  getCreatorTopContent,
} from '@/lib/public-profile/public-profile-repository';
import { serializePublicProfile } from '@/lib/public-profile/serializer';
import { getSocialAccountLatest } from '@/lib/social/latest-state';
import { getRateCardItems } from '@/lib/rate-card/rate-card-repository';
import { listCreatorPackages } from '@/lib/creator/packages-repository';
import { getSession } from '@/lib/auth';
import { PublicProfileClient } from '@/components/creator/public-profile/public-profile-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic SEO & OpenGraph Metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  if (!slug) return {};

  const normSlug = slug.toLowerCase().trim();
  const { profile, isRedirect, redirectSlug } = await getPublicProfileBySlug(normSlug);

  if (isRedirect && redirectSlug) {
    return {
      title: 'Redirecting...',
    };
  }

  if (!profile) {
    return {
      title: 'Creator Profile Not Found — Adzunova',
      robots: { index: false, follow: false },
    };
  }

  // Unpublished creator: owner gets noindex preview; public gets 404
  if (!profile.isPublished) {
    const session = await getSession().catch(() => null);
    const isOwner = session?.user?.id === profile.creatorId;
    if (!isOwner) {
      return {
        title: 'Creator Profile Not Found — Adzunova',
        robots: { index: false, follow: false },
      };
    }
    return {
      title: `[PREVIEW] ${profile.displayName} — Adzunova`,
      robots: { index: false, follow: false },
    };
  }

  const [latestSocial, rateCardItems, persistedPackages] = await Promise.all([
    getSocialAccountLatest(profile.creatorId).catch(() => null),
    getRateCardItems(profile.creatorId).catch(() => []),
    listCreatorPackages(profile.creatorId, { activeOnly: true }).catch(() => []),
  ]);

  const dto = serializePublicProfile({
    profile,
    latestSocial,
    rateCardItems,
  });

  return {
    title: dto.seo.title,
    description: dto.seo.description,
    alternates: {
      canonical: dto.seo.canonicalUrl,
    },
    robots: {
      index: dto.allowIndexing,
      follow: dto.allowIndexing,
    },
    openGraph: {
      title: dto.seo.title,
      description: dto.seo.description,
      url: dto.seo.canonicalUrl,
      siteName: 'Adzunova',
      images: [
        {
          url: dto.seo.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${dto.displayName} on Adzunova`,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: dto.seo.title,
      description: dto.seo.description,
      images: [dto.seo.ogImageUrl],
    },
  };
}

/**
 * Public Creator Profile Page (SSR / ISR)
 */
export default async function PublicCreatorProfilePage({ params }: PageProps) {
  await connection();
  const { slug } = await params;
  if (!slug) notFound();

  const normSlug = slug.toLowerCase().trim();
  const { profile, isRedirect, redirectSlug } = await getPublicProfileBySlug(normSlug);

  // 301 Permanent Redirect for past custom slugs
  if (isRedirect && redirectSlug) {
    redirect(`/c/${redirectSlug}`, RedirectType.replace);
  }

  if (!profile) {
    notFound();
  }

  // Unpublished creator profiles: 404 for public; owner gets labelled draft preview
  let isOwnerPreview = false;
  if (!profile.isPublished) {
    const session = await getSession().catch(() => null);
    if (session?.user?.id && session.user.id === profile.creatorId) {
      isOwnerPreview = true;
    } else {
      notFound();
    }
  }

  const [latestSocial, rateCardItems, persistedPackages] = await Promise.all([
    getSocialAccountLatest(profile.creatorId).catch(() => null),
    getRateCardItems(profile.creatorId).catch(() => []),
    listCreatorPackages(profile.creatorId, { activeOnly: true }).catch(() => []),
  ]);

  const packages = getCreatorPackages(profile.creatorId);
  const topContent = getCreatorTopContent(profile.creatorId);

  const dto = serializePublicProfile({
    profile,
    latestSocial,
    rateCardItems,
    packages,
    topContent,
  });

  // JSON-LD Structured Data (Person & ProfilePage)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: dto.displayName,
      alternateName: dto.handle,
      description: dto.bio,
      url: dto.seo.canonicalUrl,
      image: dto.avatarUrl,
      interactionStatistic: dto.stats
        ? [
            {
              '@type': 'InteractionCounter',
              interactionType: 'https://schema.org/FollowAction',
              userInteractionCount: dto.stats.totalVerifiedReach,
            },
          ]
        : undefined,
    },
  };

  return (
    <>
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isOwnerPreview && (
        <div className="sticky top-0 z-50 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center justify-center gap-2 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>UNPUBLISHED DRAFT PREVIEW — Visible only to you as owner. Hidden from public discovery and search engines.</span>
        </div>
      )}

      <PublicProfileClient
        profile={dto}
        creatorId={profile.creatorId}
        persistedPackages={persistedPackages}
      />
    </>
  );
}
