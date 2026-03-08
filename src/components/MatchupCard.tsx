'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VALUES_BY_ID, CATEGORY_COLORS } from '@/lib/data/values';
import type { BracketMatchup } from '@/lib/types';

interface MatchupCardProps {
  matchup: BracketMatchup;
  customValue?: { id: string; name: string } | null;
  onPick: (winnerId: string) => void;
}

export default function MatchupCard({ matchup, customValue, onPick }: MatchupCardProps) {
  const [picked, setPicked] = useState<string | null>(null);

  const getValueInfo = (id: string | null) => {
    if (!id) return null;
    if (id.startsWith('custom_') && customValue?.id === id) {
      return {
        name: customValue.name,
        cardText: 'A value that matters deeply to you',
        category: 'custom' as const,
      };
    }
    const v = VALUES_BY_ID[id];
    return v ? { name: v.name, cardText: v.cardText, category: v.category } : null;
  };

  const valueA = getValueInfo(matchup.valueA);
  const valueB = getValueInfo(matchup.valueB);

  if (!valueA || !valueB || !matchup.valueA || !matchup.valueB) return null;

  const handlePick = (winnerId: string) => {
    if (picked) return;
    setPicked(winnerId);
    setTimeout(() => onPick(winnerId), 600);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={matchup.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-2xl mx-auto"
      >
        <p className="text-center text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
          {matchup.roundName}
        </p>
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-6">
          Which value matters more to you?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: matchup.valueA, info: valueA },
            { id: matchup.valueB, info: valueB },
          ].map(({ id, info }) => {
            const isWinner = picked === id;
            const isLoser = picked !== null && picked !== id;
            const color = CATEGORY_COLORS[info.category] || '#6B7280';

            return (
              <motion.button
                key={id}
                onClick={() => handlePick(id!)}
                disabled={picked !== null}
                animate={{
                  scale: isWinner ? 1.05 : isLoser ? 0.95 : 1,
                  opacity: isLoser ? 0.4 : 1,
                }}
                whileHover={!picked ? { scale: 1.02 } : undefined}
                whileTap={!picked ? { scale: 0.98 } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`
                  relative p-6 rounded-2xl text-left transition-shadow
                  ${picked === null ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
                  ${isWinner ? 'shadow-xl ring-2 ring-offset-2' : 'shadow-md'}
                  bg-white border-2
                `}
                style={{
                  borderColor: isWinner ? color : isLoser ? '#E5E7EB' : `${color}40`,
                  // Use CSS custom property for Tailwind ring color
                  '--tw-ring-color': isWinner ? color : undefined,
                } as React.CSSProperties}
              >
                <div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ backgroundColor: color }}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{info.cardText}</p>

                {isWinner && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: color }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
