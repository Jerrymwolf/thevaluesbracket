'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VALUES_BY_ID, CATEGORY_COLORS } from '@/lib/data/values';
import type { BracketState, BracketMatchup } from '@/lib/types';

interface BracketViewProps {
  bracket: BracketState;
  customValue?: { id: string; name: string } | null;
}

function getValueName(id: string | null, customValue?: { id: string; name: string } | null): string {
  if (!id) return '?';
  if (id.startsWith('custom_') && customValue?.id === id) return customValue.name;
  return VALUES_BY_ID[id]?.name ?? '?';
}

function getValueColor(id: string | null): string {
  if (!id) return '#D1D5DB';
  const v = VALUES_BY_ID[id];
  return v ? (CATEGORY_COLORS[v.category] || '#6B7280') : '#9CA3AF';
}

function MatchSlot({
  matchup,
  customValue,
  isCurrentMatch,
}: {
  matchup: BracketMatchup;
  customValue?: { id: string; name: string } | null;
  isCurrentMatch: boolean;
}) {
  const nameA = getValueName(matchup.valueA, customValue);
  const nameB = getValueName(matchup.valueB, customValue);
  const colorA = matchup.valueA ? getValueColor(matchup.valueA) : '#D1D5DB';
  const colorB = matchup.valueB ? getValueColor(matchup.valueB) : '#D1D5DB';

  return (
    <div
      className={`rounded-lg border text-xs overflow-hidden ${
        isCurrentMatch ? 'ring-2 ring-brand-500 border-brand-300' : 'border-gray-200'
      }`}
    >
      <div
        className={`flex items-center gap-1.5 px-2 py-1 ${
          matchup.winner === matchup.valueA ? 'bg-gray-50 font-semibold' : 'bg-white'
        } ${matchup.winner && matchup.winner !== matchup.valueA ? 'opacity-40' : ''}`}
      >
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorA }} />
        <span className="truncate">{nameA}</span>
      </div>
      <div className="border-t border-gray-100" />
      <div
        className={`flex items-center gap-1.5 px-2 py-1 ${
          matchup.winner === matchup.valueB ? 'bg-gray-50 font-semibold' : 'bg-white'
        } ${matchup.winner && matchup.winner !== matchup.valueB ? 'opacity-40' : ''}`}
      >
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorB }} />
        <span className="truncate">{nameB}</span>
      </div>
    </div>
  );
}

export default function BracketView({ bracket, customValue }: BracketViewProps) {
  const [collapsed, setCollapsed] = useState(false);

  const totalRounds = Math.log2(bracket.size);
  const currentMatchId = bracket.currentOrderIndex < bracket.presentationOrder.length
    ? bracket.presentationOrder[bracket.currentOrderIndex]
    : -1;

  const roundGroups = useMemo(() => {
    const groups: { name: string; matchups: BracketMatchup[] }[] = [];

    // Main bracket rounds
    for (let round = 0; round < totalRounds; round++) {
      const roundMatchups = bracket.matchups.filter(
        (m) => m.round === round && !m.isConsolation
      );
      if (roundMatchups.length > 0) {
        groups.push({ name: roundMatchups[0].roundName, matchups: roundMatchups });
      }
    }

    // Consolation matches
    const consolation = bracket.matchups.filter((m) => m.isConsolation);
    if (consolation.length > 0) {
      groups.push({ name: 'Consolation', matchups: consolation });
    }

    return groups;
  }, [bracket.matchups, totalRounds]);

  return (
    <div className="w-full">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2 sm:hidden"
      >
        {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        {collapsed ? 'Show bracket' : 'Hide bracket'}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
              {roundGroups.map((group) => (
                <div key={group.name} className="flex-shrink-0 min-w-[120px]">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 text-center">
                    {group.name}
                  </p>
                  <div className="flex flex-col gap-2 justify-center" style={{ minHeight: '100%' }}>
                    {group.matchups
                      .filter((m) => !m.isBye)
                      .map((matchup) => (
                        <MatchSlot
                          key={matchup.id}
                          matchup={matchup}
                          customValue={customValue}
                          isCurrentMatch={matchup.id === currentMatchId}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
