// === VALUES ===
export type ValueCategory = 'autonomy' | 'care' | 'learning' | 'institutional' | 'purpose' | 'ethical' | 'custom';

export interface Value {
  id: string;
  name: string;
  cardText: string;
  category: ValueCategory;
}

// === CUSTOM VALUES ===
export interface CustomValue {
  id: string;
  name: string;
  definition?: string;
}

// === SORTING ===
export type SortCategory = 'very' | 'somewhat' | 'less';

export interface ValueSort {
  valueId: string;
  category: SortCategory;
  sortedAt: number;
}

// === BRACKET ===
export interface BracketMatchup {
  id: number;
  round: number;
  roundName: string;
  position: number;
  valueA: string | null;
  valueB: string | null;
  winner: string | null;
  isBye: boolean;
  isConsolation: boolean;
}

export interface BracketState {
  values: string[];
  size: number;
  matchups: BracketMatchup[];
  presentationOrder: number[];
  currentOrderIndex: number;
  isComplete: boolean;
  rankings: string[];
}

// === PROFILES ===
export interface ProfileValue {
  rank: 1 | 2 | 3 | 4 | 5;
  valueId: string;
  valueName: string;
  tagline: string;
}

// === API ===
export interface CreateProfileRequest {
  sessionId: string;
  values: ProfileValue[];
}

export interface CreateProfileResponse {
  success: boolean;
  slug: string;
  profileUrl: string;
}
