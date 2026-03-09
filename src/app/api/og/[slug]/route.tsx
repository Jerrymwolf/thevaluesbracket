import { ImageResponse } from 'next/og';
import { db, profiles } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const RANK_COLORS = ['#D4AF37', '#A8A9AD', '#CD7F32', '#6B46C1', '#0279AF'];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.shareSlug, slug))
      .limit(1);

    if (!profile || !profile.profileJson) {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0268A0 0%, #0279AF 50%, #8FD932 100%)',
              padding: 60,
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
              The Values Bracket
            </div>
            <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.8)' }}>
              Discover your Core 5 values
            </div>
          </div>
        ),
        { width: 1200, height: 628 }
      );
    }

    // Support both old top3 and new top5 format
    const values = profile.profileJson.top5 || profile.profileJson.top3 || [];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0268A0 0%, #0279AF 50%, #8FD932 100%)',
            padding: '48px 60px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '0.05em',
              }}
            >
              MY CORE {values.length} VALUES
            </div>
          </div>

          {/* Values list - vertical compact layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              flex: 1,
            }}
          >
            {values.map((item: { rank: number; valueName: string; tagline: string }, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: 12,
                  padding: '12px 20px',
                }}
              >
                {/* Rank badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: RANK_COLORS[index] || '#9CA3AF',
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </div>

                {/* Name + tagline */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      color: '#1a1a2e',
                    }}
                  >
                    {item.valueName}
                  </div>
                  {item.tagline && (
                    <div
                      style={{
                        fontSize: 14,
                        color: '#015E8C',
                        fontStyle: 'italic',
                      }}
                    >
                      {item.tagline}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>
              thevaluesbracket.vercel.app
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 628 }
    );
  } catch (error) {
    console.error('OG image generation error:', error);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0268A0 0%, #0279AF 50%, #8FD932 100%)',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>
            The Values Bracket
          </div>
        </div>
      ),
      { width: 1200, height: 628 }
    );
  }
}
