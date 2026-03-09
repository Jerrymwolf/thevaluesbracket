import { NextResponse } from 'next/server';
import { db, sessions, sorts, rankings, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { VALUES_BY_ID } from '@/lib/data/values';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';

interface BracketMatchupData {
  valueA: string | null;
  valueB: string | null;
  winner: string | null;
  round: number;
  roundName: string;
  isConsolation: boolean;
}

interface RequestBody {
  sessionId: string;
  consentResearch: boolean;
  sortedValues: {
    very: string[];
    somewhat: string[];
    less: string[];
  };
  rankedValues: string[];
  bracketMatchups?: BracketMatchupData[];
  customValues?: {
    id: string;
    name: string;
    definition?: string;
  }[];
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const {
      sessionId,
      consentResearch,
      sortedValues,
      rankedValues,
      bracketMatchups,
      customValues,
    } = body;

    if (!sessionId || !sortedValues || !rankedValues) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if session already exists
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    let dbSessionId: string;

    if (existingSession.length > 0) {
      await db
        .update(sessions)
        .set({
          completedAt: new Date(),
          consentResearch,
        })
        .where(eq(sessions.id, sessionId));
      dbSessionId = sessionId;
    } else {
      const [newSession] = await db
        .insert(sessions)
        .values({
          id: sessionId,
          completedAt: new Date(),
          consentResearch,
        })
        .returning();
      dbSessionId = newSession.id;
    }

    // Delete existing sorts and rankings for this session (in case of re-completion)
    await Promise.all([
      db.delete(sorts).where(eq(sorts.sessionId, dbSessionId)),
      db.delete(rankings).where(eq(rankings.sessionId, dbSessionId)),
    ]);

    // Insert all sorts
    const sortInserts = [
      ...sortedValues.very.map((valueName) => ({
        sessionId: dbSessionId,
        valueName,
        category: 'very' as const,
      })),
      ...sortedValues.somewhat.map((valueName) => ({
        sessionId: dbSessionId,
        valueName,
        category: 'somewhat' as const,
      })),
      ...sortedValues.less.map((valueName) => ({
        sessionId: dbSessionId,
        valueName,
        category: 'less' as const,
      })),
    ];

    if (sortInserts.length > 0) {
      await db.insert(sorts).values(sortInserts);
    }

    // Insert rankings (top 5 from bracket)
    const rankingInserts = rankedValues.slice(0, 5).map((valueName, index) => ({
      sessionId: dbSessionId,
      valueName,
      rank: index + 1,
    }));

    if (rankingInserts.length > 0) {
      await db.insert(rankings).values(rankingInserts);
    }

    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.sessionId, dbSessionId))
      .limit(1);

    let profileSlug: string;

    const top5 = rankedValues.slice(0, 5).map((id, index) => {
      const value = VALUES_BY_ID[id];
      const isCustom = id.startsWith('custom_');
      const cv = isCustom ? customValues?.find((c) => c.id === id) : null;
      const valueName = cv
        ? cv.name
        : value?.name || id;

      return {
        rank: index + 1,
        valueId: id,
        valueName,
        tagline: isCustom
          ? (cv?.definition || 'A value you chose for yourself')
          : getFallbackTagline(valueName),
      };
    });

    if (existingProfile.length > 0) {
      profileSlug = existingProfile[0].shareSlug!;
      await db
        .update(profiles)
        .set({
          profileJson: {
            top5,
            bracketMatchups: consentResearch ? bracketMatchups : undefined,
            createdAt: new Date().toISOString(),
          },
        })
        .where(eq(profiles.sessionId, dbSessionId));
    } else {
      profileSlug = nanoid(10);
      await db.insert(profiles).values({
        sessionId: dbSessionId,
        shareSlug: profileSlug,
        profileJson: {
          top5,
          bracketMatchups: consentResearch ? bracketMatchups : undefined,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: dbSessionId,
      profileSlug,
    });
  } catch (error) {
    console.error('Session completion error:', error);
    return NextResponse.json(
      { error: 'Failed to save session data' },
      { status: 500 }
    );
  }
}
