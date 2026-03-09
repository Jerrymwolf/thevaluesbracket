import type { Value } from '@/lib/types';

export const ALL_VALUES: Value[] = [
  // Autonomy, Agency, Power
  { id: 'benevolent-power', name: 'Benevolent Power', cardText: 'Using your authority to make others stronger, not smaller', category: 'autonomy' },
  { id: 'autonomy', name: 'Autonomy', cardText: 'Trusting your own judgment and standing behind the call you make', category: 'autonomy' },
  { id: 'courage', name: 'Courage', cardText: 'Acting on what you believe is right despite fear, risk, or personal cost', category: 'autonomy' },

  // Care, Belonging, Relatedness
  { id: 'compassion-care-empathy', name: 'Compassion, Care, & Empathy', cardText: 'Noticing someone\'s pain and moving toward it, not away', category: 'care' },
  { id: 'respect-human-dignity', name: 'Respect for Human Dignity', cardText: 'Seeing the whole person in front of you and treating them like they matter', category: 'care' },
  { id: 'trust', name: 'Trust', cardText: 'Believing that those with power over you will use it for your good, not your destruction', category: 'care' },
  { id: 'belonging', name: 'Belonging', cardText: 'Being part of something where you\'re known, needed, and not alone', category: 'care' },

  // Learning & Mastery
  { id: 'development-growth', name: 'Development & Growth', cardText: 'Becoming sharper through challenge and pulling others forward with you', category: 'learning' },
  { id: 'achievement-excellence', name: 'Achievement & Excellence', cardText: 'Holding a standard for yourself that won\'t bend to what\'s easy', category: 'learning' },
  { id: 'recognition', name: 'Recognition', cardText: 'Being seen and valued for the work you actually did', category: 'learning' },
  { id: 'competence-expertise', name: 'Competence & Expertise', cardText: 'Knowing your craft well enough to be trusted when it counts', category: 'learning' },

  // Institutional Mores
  { id: 'safety-wellbeing', name: 'Safety & Wellbeing', cardText: 'Making sure people are protected and free to speak the truth', category: 'institutional' },
  { id: 'responsibility-accountability', name: 'Responsibility & Accountability', cardText: 'Owning what you did and not letting others off the hook for what they did', category: 'institutional' },
  { id: 'fairness-justice', name: 'Fairness & Justice', cardText: 'Treating people the same regardless, and making sure consequences match conduct', category: 'institutional' },
  { id: 'teamwork-collaboration', name: 'Teamwork & Collaboration', cardText: 'Getting more done together than anyone could alone', category: 'institutional' },

  // Purpose
  { id: 'service', name: 'Service', cardText: "Putting someone else's need ahead of your own, especially when it costs you", category: 'purpose' },
  { id: 'purpose', name: 'Purpose', cardText: 'Doing work that means something beyond yourself', category: 'purpose' },
  { id: 'duty', name: 'Duty', cardText: 'Fulfilling what your role demands, especially when no one would blame you for walking away', category: 'purpose' },

  // Ethical Identity
  { id: 'integrity', name: 'Integrity', cardText: 'What you believe, what you say, and what you do all point the same direction', category: 'ethical' },
  { id: 'moral-identity', name: 'Moral Identity', cardText: "Knowing who you are as a moral person — and feeling it when that's threatened", category: 'ethical' },
  { id: 'humility', name: 'Humility', cardText: 'Knowing you could be wrong and staying open when someone shows you', category: 'ethical' },
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
