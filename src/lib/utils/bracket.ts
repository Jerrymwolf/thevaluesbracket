import type { BracketMatchup, BracketState } from '@/lib/types';

function nextPowerOf2(n: number): number {
  if (n <= 4) return 4;
  if (n <= 8) return 8;
  return 16;
}

function getRoundName(round: number, totalRounds: number, matchesInRound: number): string {
  if (round === totalRounds - 1) return 'Final';
  if (round === totalRounds - 2) return 'Semifinals';
  if (matchesInRound === 4) return 'Quarterfinals';
  if (matchesInRound === 8) return 'Round of 16';
  return `Round ${round + 1}`;
}

function firstMatchOfRound(round: number, bracketSize: number): number {
  let start = 0;
  for (let r = 0; r < round; r++) {
    start += bracketSize / Math.pow(2, r + 1);
  }
  return start;
}

/**
 * Standard tournament bracket seeding order.
 * Returns an array where result[i] = seed index at bracket position i.
 * Ensures top seeds are maximally separated and byes are spread evenly.
 * E.g. for size=8: [0, 7, 4, 3, 2, 5, 6, 1]
 */
function standardSeedOrder(size: number): number[] {
  let seeds = [0, 1];
  while (seeds.length < size) {
    const expanded: number[] = [];
    const round = seeds.length;
    for (const seed of seeds) {
      expanded.push(seed);
      expanded.push(2 * round - 1 - seed);
    }
    seeds = expanded;
  }
  return seeds;
}

export function generateBracket(valueIds: string[]): BracketState {
  const n = valueIds.length;
  const size = nextPowerOf2(Math.max(n, 5));
  const totalRounds = Math.log2(size);
  const matchups: BracketMatchup[] = [];
  let matchId = 0;

  // Standard seeding: spread byes across bracket to prevent double-byes
  const seedOrder = standardSeedOrder(size);
  const seeds: (string | null)[] = seedOrder.map(
    (seedIdx) => (seedIdx < n ? valueIds[seedIdx] : null)
  );

  // Generate main bracket rounds
  for (let round = 0; round < totalRounds; round++) {
    const matchesInRound = size / Math.pow(2, round + 1);
    for (let pos = 0; pos < matchesInRound; pos++) {
      const matchup: BracketMatchup = {
        id: matchId,
        round,
        roundName: getRoundName(round, totalRounds, matchesInRound),
        position: pos,
        valueA: null,
        valueB: null,
        winner: null,
        isBye: false,
        isConsolation: false,
      };

      if (round === 0) {
        matchup.valueA = seeds[pos * 2] ?? null;
        matchup.valueB = seeds[pos * 2 + 1] ?? null;
        const hasNull = matchup.valueA === null || matchup.valueB === null;
        matchup.isBye = hasNull;
        if (hasNull) {
          // Auto-advance the non-null value (or null if both are null)
          matchup.winner = matchup.valueA ?? matchup.valueB ?? null;
        }
      }

      matchups.push(matchup);
      matchId++;
    }
  }

  const thirdPlaceId = matchId++;
  matchups.push({
    id: thirdPlaceId,
    round: totalRounds,
    roundName: '3rd Place',
    position: 0,
    valueA: null,
    valueB: null,
    winner: null,
    isBye: false,
    isConsolation: true,
  });

  let fifthPlaceId: number | null = null;
  if (size >= 8) {
    fifthPlaceId = matchId++;
    matchups.push({
      id: fifthPlaceId,
      round: totalRounds,
      roundName: '5th Place',
      position: 1,
      valueA: null,
      valueB: null,
      winner: null,
      isBye: false,
      isConsolation: true,
    });
  }

  // Propagate bye winners through main bracket, round by round
  for (let round = 0; round < totalRounds - 1; round++) {
    const roundStart = firstMatchOfRound(round, size);
    const matchesInRound = size / Math.pow(2, round + 1);
    const nextRoundStart = firstMatchOfRound(round + 1, size);

    for (let pos = 0; pos < matchesInRound; pos++) {
      const match = matchups[roundStart + pos];
      if (match.winner) {
        const nextMatchPos = Math.floor(pos / 2);
        const nextMatch = matchups[nextRoundStart + nextMatchPos];
        if (pos % 2 === 0) {
          nextMatch.valueA = match.winner;
        } else {
          nextMatch.valueB = match.winner;
        }
      }
    }

    // After propagating all winners from this round, auto-resolve bye-advanced matches in the next round
    const nextMatchesInRound = size / Math.pow(2, round + 2);
    for (let pos = 0; pos < nextMatchesInRound; pos++) {
      const nextMatch = matchups[nextRoundStart + pos];
      if (nextMatch.winner) continue; // Already resolved

      // Check if both feeder matches from this round have actually resolved
      // A match is resolved if it has a winner (string) or is a bye (including double-bye with null winner)
      const feederA = matchups[roundStart + pos * 2];
      const feederB = matchups[roundStart + pos * 2 + 1];
      const isResolved = (m: BracketMatchup) => m.winner !== null || m.isBye;
      const bothFeedersResolved = isResolved(feederA) && isResolved(feederB);

      if (bothFeedersResolved) {
        // If only one side has a value, it's a bye-advance
        if (nextMatch.valueA && !nextMatch.valueB) {
          nextMatch.isBye = true;
          nextMatch.winner = nextMatch.valueA;
        } else if (!nextMatch.valueA && nextMatch.valueB) {
          nextMatch.isBye = true;
          nextMatch.winner = nextMatch.valueB;
        } else if (!nextMatch.valueA && !nextMatch.valueB) {
          // Both feeders were empty byes — double-bye, mark resolved with no winner
          nextMatch.isBye = true;
          nextMatch.winner = null;
        }
      }
    }
  }

  // Build presentation order: all rounds in order, then consolation, then final
  const presentationOrder: number[] = [];
  const finalMatchId = firstMatchOfRound(totalRounds - 1, size); // The final

  // Add all rounds except the final
  for (let round = 0; round < totalRounds - 1; round++) {
    const roundStart = firstMatchOfRound(round, size);
    const matchesInRound = size / Math.pow(2, round + 1);
    for (let pos = 0; pos < matchesInRound; pos++) {
      const m = matchups[roundStart + pos];
      if (!m.isBye) {
        presentationOrder.push(m.id);
      }
    }
  }

  // 5th place, then 3rd place, then Final
  if (fifthPlaceId !== null) {
    presentationOrder.push(fifthPlaceId);
  }
  presentationOrder.push(thirdPlaceId);
  presentationOrder.push(finalMatchId);

  // Find first playable match
  const currentOrderIndex = presentationOrder.findIndex(
    (id) => !matchups[id].winner
  );

  return {
    values: valueIds,
    size,
    matchups,
    presentationOrder,
    currentOrderIndex: currentOrderIndex >= 0 ? currentOrderIndex : 0,
    isComplete: false,
    rankings: [],
  };
}

export function advanceBracket(
  state: BracketState,
  matchId: number,
  winnerId: string
): BracketState {
  const matchups = state.matchups.map((m) => ({ ...m }));
  const match = matchups.find((m) => m.id === matchId);
  if (!match || match.winner) return state;

  const totalRounds = Math.log2(state.size);
  const loserId = match.valueA === winnerId ? match.valueB : match.valueA;

  match.winner = winnerId;

  // Advance winner to next round (if not final and not consolation)
  if (!match.isConsolation && match.round < totalRounds - 1) {
    const nextRoundStart = firstMatchOfRound(match.round + 1, state.size);
    const nextMatchPos = Math.floor(match.position / 2);
    const nextMatch = matchups[nextRoundStart + nextMatchPos];
    if (match.position % 2 === 0) {
      nextMatch.valueA = winnerId;
    } else {
      nextMatch.valueB = winnerId;
    }

    // Auto-resolve if the next match has one value and the other is null (bye propagation)
    if (nextMatch.valueA && nextMatch.valueB === null) {
      // Check if the other feeder match was a bye that already resolved
      const otherPos = match.position % 2 === 0 ? match.position + 1 : match.position - 1;
      const roundStart = firstMatchOfRound(match.round, state.size);
      const matchesInRound = state.size / Math.pow(2, match.round + 1);
      if (otherPos >= 0 && otherPos < matchesInRound) {
        const otherMatch = matchups[roundStart + otherPos];
        if (otherMatch.winner && otherMatch.isBye) {
          nextMatch.valueB = otherMatch.winner;
        }
      }
    } else if (nextMatch.valueB && nextMatch.valueA === null) {
      const otherPos = match.position % 2 === 0 ? match.position + 1 : match.position - 1;
      const roundStart = firstMatchOfRound(match.round, state.size);
      const matchesInRound = state.size / Math.pow(2, match.round + 1);
      if (otherPos >= 0 && otherPos < matchesInRound) {
        const otherMatch = matchups[roundStart + otherPos];
        if (otherMatch.winner && otherMatch.isBye) {
          nextMatch.valueA = otherMatch.winner;
        }
      }
    }
  }

  // Route SF losers to 3rd place match
  const sfRound = totalRounds - 2;
  if (match.round === sfRound && !match.isConsolation && loserId) {
    const thirdPlaceMatch = matchups.find(
      (m) => m.isConsolation && m.roundName === '3rd Place'
    );
    if (thirdPlaceMatch) {
      if (match.position === 0) {
        thirdPlaceMatch.valueA = loserId;
      } else {
        thirdPlaceMatch.valueB = loserId;
      }
    }

    // Route QF loser (who lost to this SF loser) to 5th place match
    if (state.size >= 8) {
      const fifthPlaceMatch = matchups.find(
        (m) => m.isConsolation && m.roundName === '5th Place'
      );
      if (fifthPlaceMatch && loserId) {
        // Find the QF match that the SF loser (loserId) won
        const qfRound = totalRounds - 3;
        const qfStart = firstMatchOfRound(qfRound, state.size);
        const qfCount = state.size / Math.pow(2, qfRound + 1);
        for (let i = 0; i < qfCount; i++) {
          const qfMatch = matchups[qfStart + i];
          if (qfMatch.winner === loserId) {
            // The loser of this QF match is a 5th place candidate
            const qfLoser = qfMatch.valueA === loserId ? qfMatch.valueB : qfMatch.valueA;
            if (qfLoser) {
              if (match.position === 0) {
                fifthPlaceMatch.valueA = qfLoser;
              } else {
                fifthPlaceMatch.valueB = qfLoser;
              }
            }
            break;
          }
        }
      }
    }
  }

  // Find next playable match in presentation order
  let nextOrderIndex = state.currentOrderIndex;
  while (nextOrderIndex < state.presentationOrder.length) {
    const nextId = state.presentationOrder[nextOrderIndex];
    const nextMatch = matchups[nextId];
    if (!nextMatch) break;
    // Playable = has both values, no winner, not a bye
    if (nextMatch.valueA && nextMatch.valueB && !nextMatch.winner && !nextMatch.isBye) {
      break;
    }
    nextOrderIndex++;
  }

  // Check if bracket is complete
  const isComplete = nextOrderIndex >= state.presentationOrder.length;

  // Derive rankings if complete
  const rankings: string[] = [];
  if (isComplete) {
    const finalMatch = matchups.find(
      (m) => !m.isConsolation && m.round === totalRounds - 1
    );
    const thirdMatch = matchups.find(
      (m) => m.isConsolation && m.roundName === '3rd Place'
    );
    const fifthMatch = matchups.find(
      (m) => m.isConsolation && m.roundName === '5th Place'
    );

    if (finalMatch?.winner) {
      rankings.push(finalMatch.winner); // 1st
      const runnerUp = finalMatch.valueA === finalMatch.winner
        ? finalMatch.valueB
        : finalMatch.valueA;
      if (runnerUp) rankings.push(runnerUp); // 2nd
    }

    if (thirdMatch?.winner) {
      rankings.push(thirdMatch.winner); // 3rd
      const fourth = thirdMatch.valueA === thirdMatch.winner
        ? thirdMatch.valueB
        : thirdMatch.valueA;
      if (fourth) rankings.push(fourth); // 4th
    }

    if (fifthMatch?.winner) {
      rankings.push(fifthMatch.winner); // 5th
    } else if (!fifthMatch && rankings.length < 5) {
      // No 5th place match (bracket size 4) — pick from QF losers
      const qfRound = totalRounds - 3;
      if (qfRound >= 0) {
        const qfStart = firstMatchOfRound(qfRound, state.size);
        const qfCount = state.size / Math.pow(2, qfRound + 1);
        for (let i = 0; i < qfCount; i++) {
          const qfMatch = matchups[qfStart + i];
          if (qfMatch.winner) {
            const loser = qfMatch.valueA === qfMatch.winner
              ? qfMatch.valueB
              : qfMatch.valueA;
            if (loser && !rankings.includes(loser)) {
              rankings.push(loser);
              if (rankings.length >= 5) break;
            }
          }
        }
      }
    }

    // If we still don't have 5, fill from remaining values
    if (rankings.length < 5) {
      for (const v of state.values) {
        if (!rankings.includes(v)) {
          rankings.push(v);
          if (rankings.length >= 5) break;
        }
      }
    }
  }

  return {
    ...state,
    matchups,
    currentOrderIndex: nextOrderIndex,
    isComplete,
    rankings,
  };
}

export function getCurrentMatchup(state: BracketState): BracketMatchup | null {
  if (state.isComplete || state.currentOrderIndex >= state.presentationOrder.length) {
    return null;
  }
  const matchId = state.presentationOrder[state.currentOrderIndex];
  return state.matchups[matchId] ?? null;
}

export function getPlayableMatchCount(state: BracketState): { played: number; total: number } {
  const playable = state.presentationOrder.filter((id) => {
    const m = state.matchups[id];
    return m && !m.isBye;
  });
  const played = playable.filter((id) => state.matchups[id]?.winner).length;
  return { played, total: playable.length };
}
