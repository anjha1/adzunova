import { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';

export const instant = false;
import {
  getPublicProfileBySlug,
  getCreatorPackages,
  getCreatorTopContent,
  seedDemoProfile,
} from '@/lib/public-profile/public-profile-repository';
import { serializePublicProfile } from '@/lib/public-profile/serializer';
import { getSocialAccountLatest } from '@/lib/social/latest-state';
import { getRateCardItems } from '@/lib/rate-card/rate-card-repository';
import { PublicProfileClient } from '@/components/creator/public-profile/public-profile-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic SEO & OpenGraph Metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return {};

  const normSlug = slug.toLowerCase().trim();
  let { profile, isRedirect, redirectSlug } = await getPublicProfileBySlug(normSlug);

  if (!profile && normSlug === 'a_n_jha1') {
    profile = await seedDemoProfile('demo-creator-jha', 'a_n_jha1');
  }

  if (isRedirect && redirectSlug) {
    return {
      title: 'Redirecting...',
    };
  }

  if (!profile || !profile.isPublished) {
    return {
      title: 'Creator Profile Not Found — Adzunova',
      robots: { index: false, follow: false },
    };
  }

  const [latestSocial, rateCardItems] = await Promise.all([
    getSocialAccountLatest(profile.creatorId).catch(() => null),
    getRateCardItems(profile.creatorId).catch(() => []),
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
  const { slug } = await params;
  if (!slug) notFound();

  const normSlug = slug.toLowerCase().trim();
  let { profile, isRedirect, redirectSlug } = await getPublicProfileBySlug(normSlug);

  // Auto-seed demo profile for testing demo user
  if (!profile && normSlug === 'a_n_jha1') {
    profile = await seedDemoProfile('demo-creator-jha', 'a_n_jha1');
  }

  // 301 Permanent Redirect for past custom slugs
  if (isRedirect && redirectSlug) {
    redirect(`/c/${redirectSlug}`, RedirectType.replace);
  }

  // 404 for unpublished or missing profiles
  if (!profile || !profile.isPublished) {
    notFound();
  }

  const [latestSocial, rateCardItems] = await Promise.all([
    getSocialAccountLatest(profile.creatorId).catch(() => null),
    getRateCardItems(profile.creatorId).catch(() => []),
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

      <PublicProfileClient profile={dto} />
    </>
  );
}
