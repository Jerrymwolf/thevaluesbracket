import type { Value } from '@/lib/types';

export const ALL_VALUES: Value[] = [
  // Autonomy, Agency, Power
  { id: 'benevolent-power', name: 'Benevolent Power', cardText: 'Using your influence to lift others up', category: 'autonomy' },
  { id: 'autonomy', name: 'Autonomy', cardText: 'Charting your own course and owning your choices', category: 'autonomy' },
  { id: 'courage', name: 'Courage', cardText: 'Acting on conviction despite fear, risk, or personal cost', category: 'autonomy' },

  // Care, Belonging, Relatedness
  { id: 'compassion-care-empathy', name: 'Compassion, Care, & Empathy', cardText: 'Seeing someone hurting and doing something about it', category: 'care' },
  { id: 'respect-human-dignity', name: 'Respect for Human Dignity', cardText: 'Treating every person as inherently worthy', category: 'care' },
  { id: 'trust', name: 'Trust', cardText: 'Counting on others and being someone they can count on', category: 'care' },
  { id: 'belonging', name: 'Belonging', cardText: 'Being part of something where you truly matter', category: 'care' },

  // Learning & Mastery
  { id: 'development-growth', name: 'Development & Growth', cardText: 'Becoming more than you were and helping others do the same', category: 'learning' },
  { id: 'achievement-excellence', name: 'Achievement & Excellence', cardText: 'Setting worthy goals and refusing to settle', category: 'learning' },
  { id: 'recognition', name: 'Recognition', cardText: 'Being seen and valued for your contributions', category: 'learning' },
  { id: 'competence-expertise', name: 'Competence & Expertise', cardText: 'Mastering your craft and knowing your stuff', category: 'learning' },

  // Institutional Mores
  { id: 'safety-wellbeing', name: 'Safety & Wellbeing', cardText: 'Protecting people and creating conditions where they can thrive', category: 'institutional' },
  { id: 'responsibility-accountability', name: 'Responsibility & Accountability', cardText: 'Owning what you do and following through on your word', category: 'institutional' },
  { id: 'fairness-justice', name: 'Fairness & Justice', cardText: 'Treating people equitably and standing up for what is right', category: 'institutional' },
  { id: 'teamwork-collaboration', name: 'Teamwork & Collaboration', cardText: 'Accomplishing more together than anyone could alone', category: 'institutional' },

  // Purpose
  { id: 'service', name: 'Service', cardText: "Putting others' needs before your own", category: 'purpose' },
  { id: 'purpose', name: 'Purpose', cardText: "Knowing why you're here and what you're for", category: 'purpose' },
  { id: 'duty', name: 'Duty', cardText: "Honoring the responsibilities you've accepted", category: 'purpose' },

  // Ethical Identity
  { id: 'integrity', name: 'Integrity', cardText: "Doing what's right, even when no one is watching", category: 'ethical' },
  { id: 'moral-identity', name: 'Moral Identity', cardText: 'Being someone whose character you can stand behind', category: 'ethical' },
  { id: 'humility', name: 'Humility', cardText: "Knowing you don't have all the answers — and being okay with that", category: 'ethical' },
];

// Map for O(1) lookup by ID
export const VALUES_BY_ID: Record<string, Value> = ALL_VALUES.reduce(
  (acc, value) => ({ ...acc, [value.id]: value }),
  {} as Record<string, Value>
);

// Map for O(1) lookup by name
export const VALUES_BY_NAME: Record<string, Value> = ALL_VALUES.reduce(
  (acc, value) => ({ ...acc, [value.name]: value }),
  {} as Record<string, Value>
);

export const getValueById = (id: string): Value | undefined => VALUES_BY_ID[id];
export const getValueByName = (name: string): Value | undefined => VALUES_BY_NAME[name];

// Category display names
export const CATEGORY_LABELS: Record<string, string> = {
  autonomy: 'Autonomy, Agency, Power',
  care: 'Care, Belonging, Relatedness',
  learning: 'Learning & Mastery',
  institutional: 'Institutional Mores',
  purpose: 'Purpose',
  ethical: 'Ethical Identity',
  custom: 'Your Values',
};

// Category colors for bracket visualization
export const CATEGORY_COLORS: Record<string, string> = {
  autonomy: '#6B46C1',
  care: '#E85D4C',
  learning: '#0279AF',
  institutional: '#2D8A4E',
  purpose: '#F6AD55',
  ethical: '#4A5FC1',
  custom: '#9CA3AF',
};
