import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { VALUES_BY_ID } from '@/lib/data/values';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';

interface RequestBody {
  sessionId: string;
  rankedValues: string[];
  customValues?: { id: string; name: string; definition?: string }[];
}

// POST: Create a new profile
export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { sessionId, rankedValues, customValues } = body;

    if (!sessionId || !rankedValues || rankedValues.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const shareSlug = nanoid(10);

    // Build top 5 profile
    const top5 = rankedValues.slice(0, 5).map((id, index) => {
      const value = VALUES_BY_ID[id];
      const isCustom = id.startsWith('custom_');
      const cv = isCustom ? customValues?.find((c) => c.id === id) : null;
      const valueName = cv
        ? cv.name
        : value?.name || id;
      const tagline = isCustom
        ? (cv?.definition || 'A value you chose for yourself')
        : getFallbackTagline(valueName);

      return {
        rank: index + 1,
        valueId: id,
        valueName,
        tagline,
      };
    });

    try {
      // Check if profile already exists for this session
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.sessionId, sessionId))
        .limit(1);

      if (existingProfile.length > 0) {
        return NextResponse.json({
          slug: existingProfile[0].shareSlug,
          url: `/p/${existingProfile[0].shareSlug}`,
          existing: true,
        });
      }

      // Create new profile
      const [newProfile] = await db
        .insert(profiles)
        .values({
          sessionId,
          shareSlug,
          profileJson: {
            top5,
            createdAt: new Date().toISOString(),
          },
        })
        .returning();

      return NextResponse.json({
        slug: newProfile.shareSlug,
        url: `/p/${newProfile.shareSlug}`,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        slug: shareSlug,
        url: `/p/${shareSlug}`,
        clientOnly: true,
      });
    }
  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

// GET: Retrieve a profile by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.shareSlug, slug))
      .limit(1);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      slug: profile.shareSlug,
      profile: profile.profileJson,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
