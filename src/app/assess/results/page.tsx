'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';
import ShareInterface from '@/components/ShareInterface';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { VALUES_BY_ID } from '@/lib/data/values';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';
import { useHydration } from '@/hooks/useHydration';
import type { BracketCardValue } from '@/components/ValuesCardBracket';

export default function ResultsPage() {
  const router = useRouter();
  const isHydrated = useHydration();
  const {
    sessionId,
    rankedValues,
    customValues,
    bracket,
    shareSlug,
    setShareSlug,
    sortedValues,
    consentResearch,
    reset,
  } = useAssessmentStore();

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valuesForCard: BracketCardValue[] = useMemo(() => {
    return rankedValues.slice(0, 5).map((id) => {
      const value = VALUES_BY_ID[id];
      const isCustom = id.startsWith('custom_');
      const cv = isCustom ? customValues?.find((c) => c.id === id) : null;

      const valueName = cv
        ? cv.name
        : value?.name || 'Value';

      const tagline = isCustom
        ? (cv?.definition || 'A value you chose for yourself')
        : getFallbackTagline(valueName);

      return { id, name: valueName, tagline };
    }).filter((v) => v.name);
  }, [rankedValues, customValues]);

  const createProfile = useCallback(async () => {
    if (!sessionId || rankedValues.length === 0) return;

    setIsCreatingProfile(true);
    setError(null);

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rankedValues,
          customValues,
        }),
      });

      if (!response.ok) throw new Error('Failed to create profile');

      const data = await response.json();
      setShareSlug(data.slug);

      // Save session data for research (fire and forget)
      fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          consentResearch,
          sortedValues,
          rankedValues,
          bracketMatchups: bracket?.matchups.map(m => ({
            valueA: m.valueA,
            valueB: m.valueB,
            winner: m.winner,
            round: m.round,
            roundName: m.roundName,
            isConsolation: m.isConsolation,
          })),
          customValues,
        }),
      }).catch((err) => console.error('Session save error:', err));
    } catch (err) {
      console.error('Profile creation error:', err);
      setError('Could not create shareable profile');
    } finally {
      setIsCreatingProfile(false);
    }
  }, [sessionId, rankedValues, customValues, setShareSlug, consentResearch, sortedValues, bracket]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!sessionId) {
      router.replace('/');
      return;
    }
    if (!bracket?.isComplete || rankedValues.length === 0) {
      router.replace('/assess/bracket');
    }
  }, [isHydrated, sessionId, bracket?.isComplete, rankedValues.length, router]);

  useEffect(() => {
    if (!isHydrated) return;
    if (shareSlug || !sessionId || rankedValues.length === 0) return;
    createProfile();
  }, [isHydrated, sessionId, rankedValues.length, shareSlug, createProfile]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const shareUrl = shareSlug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${shareSlug}`
    : undefined;

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  if (!sessionId || valuesForCard.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col pb-4"
    >
      {/* Celebration header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-prism rounded-full mb-4"
        >
          <Trophy className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-brand-900 mb-2">
          Your Top 5 Values
        </h1>
        <p className="text-gray-600">
          The bracket has spoken. Here&apos;s what matters most to you.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Feel free to download the card and share — it&apos;s optimized for social media.
        </p>
      </div>

      {/* Profile creation status */}
      {isCreatingProfile && (
        <div className="text-center mb-6 text-gray-500 text-sm">
          Creating your shareable profile...
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm text-center">
          {error}
          <button
            onClick={createProfile}
            className="block mx-auto mt-2 text-amber-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Share interface with card preview */}
      <ShareInterface values={valuesForCard} shareUrl={shareUrl} />

      {/* More ValuesApps coming soon */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-center">
        <Sparkles className="w-5 h-5 text-brand-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium">
          More ValuesApps coming soon.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Stay tuned for new tools to explore what matters most.
        </p>
      </div>

      {/* Start over */}
      <div className="mt-12 text-center">
        <button
          onClick={handleStartOver}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RotateCcw size={16} />
          Start a new bracket
        </button>
      </div>
    </motion.div>
  );
}
