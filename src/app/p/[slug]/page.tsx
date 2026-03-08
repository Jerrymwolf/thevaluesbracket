import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Force dynamic rendering - this page queries the database at runtime
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProfileValue {
  rank: number;
  valueId?: string;
  valueName: string;
  tagline: string;
}

const RANK_COLORS = [
  { bg: 'from-amber-400 to-amber-500', label: '1st' },
  { bg: 'from-gray-300 to-gray-400', label: '2nd' },
  { bg: 'from-amber-600 to-amber-700', label: '3rd' },
  { bg: 'from-purple-500 to-purple-600', label: '4th' },
  { bg: 'from-blue-500 to-blue-600', label: '5th' },
];

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.shareSlug, slug))
      .limit(1);

    if (!profile || !profile.profileJson) {
      return {
        title: 'Profile Not Found | The Values Bracket',
      };
    }

    // Support both old top3 and new top5 format
    const values: ProfileValue[] = profile.profileJson.top5 || profile.profileJson.top3 || [];
    const top1 = values[0];
    const title = `My #1 Value: ${top1?.valueName} | The Values Bracket`;
    const description = `"${top1?.tagline}" - Discover your core values at The Values Bracket`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'profile',
        images: [`/api/og/${slug}`],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`/api/og/${slug}`],
      },
    };
  } catch {
    return {
      title: 'The Values Bracket',
    };
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { slug } = await params;

  let profile;
  try {
    const [result] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.shareSlug, slug))
      .limit(1);
    profile = result;
  } catch (error) {
    console.error('Database error:', error);
    notFound();
  }

  if (!profile || !profile.profileJson) {
    notFound();
  }

  // Support both old top3 and new top5 format
  const values: ProfileValue[] = profile.profileJson.top5 || profile.profileJson.top3 || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-wide mb-2">
            MY CORE {values.length} VALUES
          </h1>
          <p className="text-white/70 text-sm">
            thevaluesbracket.com
          </p>
        </div>

        {/* Value cards */}
        <div className="space-y-3 mb-12">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-white/95 rounded-xl shadow-lg p-4 flex items-center gap-4"
            >
              {/* Rank badge */}
              <span
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${RANK_COLORS[index]?.bg || 'from-gray-200 to-gray-300'} text-white font-bold text-sm flex-shrink-0`}
              >
                {RANK_COLORS[index]?.label || item.rank}
              </span>

              {/* Name + tagline */}
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {item.valueName}
                </p>
                {item.tagline && (
                  <p className="text-brand-700 italic text-sm mt-0.5">
                    {item.tagline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start the Bracket
          </Link>
          <p className="text-white/60 text-sm mt-4">
            Free ~5-minute values discovery
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-white/50 text-sm">thevaluesbracket.com</p>
          <a
            href="https://buymeacoffee.com/thew0lf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v2"/>
              <path d="M14 2v2"/>
              <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
              <path d="M6 2v2"/>
            </svg>
            Support the creator
          </a>
        </div>
      </div>
    </div>
  );
}
