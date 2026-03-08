'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SortCategory, BracketState } from '@/lib/types';
import { generateBracket, advanceBracket } from '@/lib/utils/bracket';

interface CustomValue {
  id: string;
  name: string;
}

interface AssessmentState {
  sessionId: string | null;
  startedAt: number | null;
  consentResearch: boolean;

  // Sort phase
  shuffledValueIds: string[];
  currentCardIndex: number;
  sortedValues: {
    very: string[];
    somewhat: string[];
    less: string[];
  };
  customValue: CustomValue | null;

  // Bracket phase
  bracket: BracketState | null;

  // Results (derived from bracket)
  rankedValues: string[];

  // Sharing
  shareSlug: string | null;
}

interface AssessmentActions {
  initSession: (sessionId: string, shuffledValueIds: string[]) => void;
  setConsentResearch: (consent: boolean) => void;

  // Sorting
  sortValue: (valueId: string, category: SortCategory) => void;
  undoLastSort: () => void;
  addCustomValue: (name: string) => void;

  // Bracket
  initBracket: (veryImportantIds: string[]) => void;
  pickBracketWinner: (matchId: number, winnerId: string) => void;

  // Sharing
  setShareSlug: (slug: string) => void;

  // Reset
  reset: () => void;
}

type AssessmentStore = AssessmentState & AssessmentActions;

const initialState: AssessmentState = {
  sessionId: null,
  startedAt: null,
  consentResearch: false,
  shuffledValueIds: [],
  currentCardIndex: 0,
  sortedValues: { very: [], somewhat: [], less: [] },
  customValue: null,
  bracket: null,
  rankedValues: [],
  shareSlug: null,
};

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      ...initialState,

      initSession: (sessionId, shuffledValueIds) =>
        set({
          ...initialState,
          sessionId,
          shuffledValueIds,
          startedAt: Date.now(),
        }),

      setConsentResearch: (consent) => set({ consentResearch: consent }),

      sortValue: (valueId, category) =>
        set((state) => ({
          sortedValues: {
            ...state.sortedValues,
            [category]: [...state.sortedValues[category], valueId],
          },
          currentCardIndex: state.currentCardIndex + 1,
        })),

      undoLastSort: () =>
        set((state) => {
          if (state.currentCardIndex === 0) return state;
          const lastValueId = state.shuffledValueIds[state.currentCardIndex - 1];
          const newSorted = { ...state.sortedValues };
          for (const cat of ['very', 'somewhat', 'less'] as SortCategory[]) {
            newSorted[cat] = newSorted[cat].filter((id) => id !== lastValueId);
          }
          return {
            sortedValues: newSorted,
            currentCardIndex: state.currentCardIndex - 1,
          };
        }),

      addCustomValue: (name) =>
        set((state) => {
          const customId = `custom_${Date.now()}`;
          return {
            customValue: { id: customId, name },
            shuffledValueIds: [...state.shuffledValueIds, customId],
            sortedValues: {
              ...state.sortedValues,
              very: [...state.sortedValues.very, customId],
            },
          };
        }),

      initBracket: (veryImportantIds) =>
        set(() => {
          const capped = veryImportantIds.slice(0, 16);
          const bracket = generateBracket(capped);
          return { bracket };
        }),

      pickBracketWinner: (matchId, winnerId) =>
        set((state) => {
          if (!state.bracket) return state;
          const newBracket = advanceBracket(state.bracket, matchId, winnerId);
          return {
            bracket: newBracket,
            rankedValues: newBracket.isComplete ? newBracket.rankings : state.rankedValues,
          };
        }),

      setShareSlug: (slug) => set({ shareSlug: slug }),

      reset: () => set(initialState),
    }),
    {
      name: 'valuesprofile-assessment',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          return initialState;
        }
        return persisted as AssessmentState;
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selectors
export const selectProgress = (state: AssessmentStore) => ({
  current: state.currentCardIndex,
  total: state.shuffledValueIds.length,
  percentage:
    state.shuffledValueIds.length > 0
      ? Math.round((state.currentCardIndex / state.shuffledValueIds.length) * 100)
      : 0,
});

export const selectCurrentValue = (state: AssessmentStore) =>
  state.shuffledValueIds[state.currentCardIndex] || null;

export const selectVeryImportantValues = (state: AssessmentStore) => state.sortedValues.very;

export const selectIsSortingComplete = (state: AssessmentStore) =>
  state.currentCardIndex >= state.shuffledValueIds.length && state.shuffledValueIds.length > 0;
