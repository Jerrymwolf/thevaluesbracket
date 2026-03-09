'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useHydration } from '@/hooks/useHydration';
import { getCurrentMatchup, getPlayableMatchCount } from '@/lib/utils/bracket';
import MatchupCard from '@/components/MatchupCard';
import BracketView from '@/components/BracketView';

const MIN_VERY_IMPORTANT = 5;

export default function BracketPage() {
  const router = useRouter();
  const isHydrated = useHydration();

  const sessionId = useAssessmentStore((s) => s.sessionId);
  const sortedValues = useAssessmentStore((s) => s.sortedValues);
  const bracket = useAssessmentStore((s) => s.bracket);
  const customValues = useAssessmentStore((s) => s.customValues);
  const initBracket = useAssessmentStore((s) => s.initBracket);
  const pickBracketWinner = useAssessmentStore((s) => s.pickBracketWinner);

  const veryCount = sortedValues.very.length;

  // Initialize bracket on mount if not already done
  useEffect(() => {
    if (!isHydrated) return;
    if (!sessionId) {
      router.replace('/');
      return;
    }
    if (veryCount < MIN_VERY_IMPORTANT) {
      router.replace('/assess/sort');
      return;
    }
    if (!bracket) {
      initBracket(sortedValues.very);
    }
  }, [isHydrated, sessionId, veryCount, bracket, sortedValues.very, initBracket, router]);

  // Navigate to results when bracket is complete
  useEffect(() => {
    if (bracket?.isComplete) {
      const timer = setTimeout(() => router.push('/assess/results'), 1000);
      return () => clearTimeout(timer);
    }
  }, [bracket?.isComplete, router]);

  const currentMatchup = useMemo(
    () => (bracket ? getCurrentMatchup(bracket) : null),
    [bracket]
  );

  const progress = useMemo(
    () => (bracket ? getPlayableMatchCount(bracket) : { played: 0, total: 0 }),
    [bracket]
  );

  if (!isHydrated || !bracket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading bracket...</div>
      </div>
    );
  }

  if (bracket.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900">Bracket Complete!</h2>
          <p className="text-gray-500 mt-2">Revealing your Core 5...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Match {progress.played + 1} of {progress.total}</span>
            <span>{Math.round((progress.played / progress.total) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-500 rounded-full"
              initial={false}
              animate={{ width: `${(progress.played / progress.total) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>

        {/* Current matchup */}
        {currentMatchup && (
          <MatchupCard
            key={currentMatchup.id}
            matchup={currentMatchup}
            customValues={customValues}
            onPick={(winnerId) => pickBracketWinner(currentMatchup.id, winnerId)}
          />
        )}

        {/* Mini bracket */}
        <div className="mt-8">
          <BracketView bracket={bracket} customValues={customValues} />
        </div>
      </div>
    </div>
  );
}
