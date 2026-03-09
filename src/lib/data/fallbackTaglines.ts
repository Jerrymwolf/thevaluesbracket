export const FALLBACK_TAGLINES: Record<string, string> = {
  'Benevolent Power': 'Using your authority to make others stronger, not smaller',
  'Autonomy': 'Trusting your own judgment and standing behind the call you make',
  'Courage': 'Acting on what you believe is right despite fear, risk, or personal cost',
  'Compassion, Care, & Empathy': "Noticing someone's pain and moving toward it, not away",
  'Respect for Human Dignity': 'Seeing the whole person in front of you and treating them like they matter',
  'Trust': 'Believing that those with power over you will use it for your good, not your destruction',
  'Belonging': "Being part of something where you're known, needed, and not alone",
  'Development & Growth': 'Becoming sharper through challenge and pulling others forward with you',
  'Achievement & Excellence': "Holding a standard for yourself that won't bend to what's easy",
  'Recognition': 'Being seen and valued for the work you actually did',
  'Competence & Expertise': 'Knowing your craft well enough to be trusted when it counts',
  'Safety & Wellbeing': 'Making sure people are protected and free to speak the truth',
  'Responsibility & Accountability': 'Owning what you did and not letting others off the hook for what they did',
  'Fairness & Justice': 'Treating people the same regardless, and making sure consequences match conduct',
  'Teamwork & Collaboration': 'Getting more done together than anyone could alone',
  'Service': "Putting someone else's need ahead of your own, especially when it costs you",
  'Purpose': 'Doing work that means something beyond yourself',
  'Duty': 'Fulfilling what your role demands, especially when no one would blame you for walking away',
  'Integrity': 'What you believe, what you say, and what you do all point the same direction',
  'Moral Identity': "Knowing who you are as a moral person — and feeling it when that's threatened",
  'Humility': 'Knowing you could be wrong and staying open when someone shows you',
};

export const getFallbackTagline = (valueName: string): string => {
  return FALLBACK_TAGLINES[valueName] || 'A value you stand for';
};
