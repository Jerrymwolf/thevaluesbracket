'use client';

import { forwardRef } from 'react';

export interface BracketCardValue {
  id: string;
  name: string;
  tagline: string;
}

interface ValuesCardBracketProps {
  values: BracketCardValue[];
  containerWidth: number;
}

const CARD_WIDTH = 1500;
const CARD_HEIGHT = 900;
const ASPECT_RATIO = CARD_WIDTH / CARD_HEIGHT;

const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];
const RANK_COLORS = [
  '#D4AF37', // Gold
  '#A8A9AD', // Silver
  '#CD7F32', // Bronze
  '#6B46C1', // Purple
  '#0279AF', // Blue
];

function getSizes(width: number) {
  const calc = (pct: number, min: number) => Math.max(width * pct, min);

  return {
    title: calc(0.028, 13),
    rankBadge: calc(0.022, 10),
    valueName: calc(0.03, 14),
    tagline: calc(0.018, 11),
    gradientBar: calc(0.014, 4),
    padding: calc(0.032, 10),
    rowGap: calc(0.012, 4),
    footer: calc(0.011, 8),
  };
}

const ValuesCardBracket = forwardRef<HTMLDivElement, ValuesCardBracketProps>(
  ({ values, containerWidth }, ref) => {
    const height = containerWidth / ASPECT_RATIO;
    const sizes = getSizes(containerWidth);

    return (
      <div
        ref={ref}
        className="relative overflow-hidden bg-white"
        style={{
          width: `${containerWidth}px`,
          height: `${height}px`,
        }}
      >
        {/* Left Prism Gradient Bar */}
        <div
          className="absolute top-0 left-0 bottom-0"
          style={{
            width: `${sizes.gradientBar}px`,
            background: 'linear-gradient(180deg, #8B5CF6, #F97316, #EC4899)',
          }}
        />

        {/* Right Prism Gradient Bar */}
        <div
          className="absolute top-0 right-0 bottom-0"
          style={{
            width: `${sizes.gradientBar}px`,
            background: 'linear-gradient(180deg, #8B5CF6, #F97316, #EC4899)',
          }}
        />

        {/* Content */}
        <div
          className="relative h-full flex flex-col"
          style={{
            paddingLeft: `${sizes.gradientBar + sizes.padding}px`,
            paddingRight: `${sizes.gradientBar + sizes.padding}px`,
            paddingTop: `${sizes.padding * 0.7}px`,
            paddingBottom: `${sizes.padding * 0.5}px`,
          }}
        >
          {/* Title */}
          <div className="text-center flex-shrink-0" style={{ marginBottom: `${sizes.rowGap * 1.5}px` }}>
            <h1
              className="font-bold text-brand-900 tracking-wide"
              style={{ fontSize: `${sizes.title}px` }}
            >
              MY CORE 5 VALUES
            </h1>
            <div
              className="w-full bg-gray-200"
              style={{
                height: `${Math.max(1, containerWidth * 0.001)}px`,
                marginTop: `${sizes.rowGap}px`,
              }}
            />
          </div>

          {/* Values List - Vertical layout */}
          <div className="flex-1 flex flex-col justify-center" style={{ gap: `${sizes.rowGap}px` }}>
            {values.slice(0, 5).map((value, index) => (
              <div
                key={value.id}
                className="flex items-center"
                style={{ gap: `${containerWidth * 0.012}px` }}
              >
                {/* Rank Badge */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white"
                  style={{
                    width: `${sizes.rankBadge * 2.2}px`,
                    height: `${sizes.rankBadge * 2.2}px`,
                    fontSize: `${sizes.rankBadge}px`,
                    backgroundColor: RANK_COLORS[index],
                  }}
                >
                  {RANK_LABELS[index]}
                </div>

                {/* Value Name + Tagline */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-brand-900 leading-tight"
                    style={{ fontSize: `${sizes.valueName}px` }}
                  >
                    {value.name}
                  </p>
                  {value.tagline && (
                    <p
                      className="text-gray-500 italic leading-snug"
                      style={{ fontSize: `${sizes.tagline}px` }}
                    >
                      {value.tagline}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center flex-shrink-0" style={{ paddingTop: `${sizes.rowGap}px` }}>
            <div
              className="w-full bg-gray-200"
              style={{
                height: `${Math.max(1, containerWidth * 0.001)}px`,
                marginBottom: `${containerWidth * 0.006}px`,
              }}
            />
            <span
              className="text-gray-500 font-medium tracking-wide"
              style={{ fontSize: `${sizes.footer}px` }}
            >
              thevaluesbracket.com
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ValuesCardBracket.displayName = 'ValuesCardBracket';

export default ValuesCardBracket;
export { CARD_WIDTH, CARD_HEIGHT };
