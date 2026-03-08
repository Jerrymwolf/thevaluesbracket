export const FALLBACK_TAGLINES: Record<string, string> = {
  'Benevolent Power': 'Lift as you lead',
  'Autonomy': 'Your path, your call',
  'Courage': 'Fear into forward',
  'Compassion, Care, & Empathy': 'Feel it, then fix it',
  'Respect for Human Dignity': 'Worth in everyone',
  'Trust': 'Counted on',
  'Belonging': 'Where you matter',
  'Development & Growth': 'Always becoming',
  'Achievement & Excellence': 'Never settling',
  'Recognition': 'Seen and valued',
  'Competence & Expertise': 'Know your craft',
  'Safety & Wellbeing': 'People protected',
  'Responsibility & Accountability': 'Own every outcome',
  'Fairness & Justice': 'Right made real',
  'Teamwork & Collaboration': 'Better together',
  'Service': 'Others before self',
  'Purpose': 'Knowing your why',
  'Duty': 'Honor the commitment',
  'Integrity': 'Right when unseen',
  'Moral Identity': 'Character you defend',
  'Humility': 'Room to learn',
};

export const getFallbackTagline = (valueName: string): string => {
  return FALLBACK_TAGLINES[valueName] || 'A value you stand for';
};
