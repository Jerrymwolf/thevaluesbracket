import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'white',
          borderRadius: 36,
        }}
      >
        {/* Magnifying glass container */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: 140,
            height: 140,
          }}
        >
          {/* Lens — circle with prism gradient */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B46C1 0%, #4A5FC1 33%, #E85D4C 66%, #F6AD55 100%)',
              opacity: 0.85,
              border: '6px solid #002233',
            }}
          />
          {/* Handle — rotated rectangle */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 55,
              height: 8,
              background: '#002233',
              borderRadius: 4,
              transform: 'rotate(45deg)',
              transformOrigin: 'right center',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
