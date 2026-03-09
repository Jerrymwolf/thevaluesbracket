import type { Value } from '@/lib/types';

export const ALL_VALUES: Value[] = [
  // Autonomy, Agency, Power
  { id: 'benevolent-power', name: 'Benevolent Power', cardText: 'The understanding that your authority exists to enable others — and the felt responsibility to use it that way', category: 'autonomy' },
  { id: 'autonomy', name: 'Autonomy', cardText: 'The belief that your judgment is yours to exercise — and the resolve to own what follows from it', category: 'autonomy' },
  { id: 'courage', name: 'Courage', cardText: 'The felt demand to act on what you know is right when fear urges you not to', category: 'autonomy' },

  // Care, Belonging, Relatedness
  { id: 'compassion-care-empathy', name: 'Compassion, Care, & Empathy', cardText: "Feeling another person's struggle as real and present — and the pull to respond rather than turn away", category: 'care' },
  { id: 'respect-human-dignity', name: 'Respect for Human Dignity', cardText: 'The recognition that every person carries worth that is not yours to grant or diminish', category: 'care' },
  { id: 'trust', name: 'Trust', cardText: 'The vulnerable belief that those who hold power over you will use it for your good, not your harm', category: 'care' },
  { id: 'belonging', name: 'Belonging', cardText: 'The assurance that you are known, needed, and not alone — and that your absence would matter', category: 'care' },
  { id: 'loyalty', name: 'Loyalty', cardText: "The felt bond of allegiance to those you've committed to — and the understanding that it holds especially when tested", category: 'care' },

  // Learning & Mastery
  { id: 'development-growth', name: 'Development & Growth', cardText: "The belief that people are meant to grow through challenge — and the felt investment in your own and others' becoming", category: 'learning' },
  { id: 'achievement-excellence', name: 'Achievement & Excellence', cardText: 'An internal standard so clear you feel it when you fall short', category: 'learning' },
  { id: 'recognition', name: 'Recognition', cardText: 'The need to know that what you contributed mattered — and the hurt when it goes unseen', category: 'learning' },
  { id: 'competence-expertise', name: 'Competence & Expertise', cardText: 'The understanding of what your knowledge can and cannot do — and the felt readiness to apply it when the stakes are real', category: 'learning' },

  // Institutional Mores
  { id: 'safety-wellbeing', name: 'Safety & Wellbeing', cardText: 'The understanding that people cannot thrive where they feel unsafe — and the unease of sensing someone near you is not okay', category: 'institutional' },
  { id: 'responsibility-accountability', name: 'Responsibility & Accountability', cardText: 'The acceptance that your choices carry consequences — and the demand that others answer for theirs', category: 'institutional' },
  { id: 'fairness-justice', name: 'Fairness & Justice', cardText: "The conviction that the rules should hold the same for everyone — and the frustration when they don't", category: 'institutional' },
  { id: 'teamwork-collaboration', name: 'Teamwork & Collaboration', cardText: 'The conviction that we accomplish more together than any of us can alone — and the felt commitment to shared effort', category: 'institutional' },

  // Purpose
  { id: 'service', name: 'Service', cardText: "The willingness to bear a cost that isn't yours because someone else's need is real to you", category: 'purpose' },
  { id: 'purpose', name: 'Purpose', cardText: 'The sense that your work connects to something larger than yourself — and the emptiness when that connection breaks', category: 'purpose' },
  { id: 'duty', name: 'Duty', cardText: 'The acceptance that your role carries obligations — and the resolve to meet them when you have every reason to stop', category: 'purpose' },

  // Ethical Identity
  { id: 'integrity', name: 'Integrity', cardText: 'The alignment between what you believe, what you say, and what you do — and the discomfort when they come apart', category: 'ethical' },
  { id: 'moral-identity', name: 'Moral Identity', cardText: 'The sense of yourself as someone who does right — and the wound when that self-concept is threatened', category: 'ethical' },
  { id: 'humility', name: 'Humility', cardText: "The honest awareness that you don't see everything — and the willingness to be corrected without defending yourself", category: 'ethical' },
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
