export const FALLBACK_TAGLINES: Record<string, string> = {
  'Benevolent Power': 'The understanding that your authority exists to enable others — and the felt responsibility to use it that way',
  'Autonomy': 'The belief that your judgment is yours to exercise — and the resolve to own what follows from it',
  'Courage': 'The felt demand to act on what you know is right when fear urges you not to',
  'Compassion, Care, & Empathy': "Feeling another person's struggle as real and present — and the pull to respond rather than turn away",
  'Respect for Human Dignity': 'The recognition that every person carries worth that is not yours to grant or diminish',
  'Trust': 'The vulnerable belief that those who hold power over you will use it for your good, not your harm',
  'Belonging': 'The assurance that you are known, needed, and not alone — and that your absence would matter',
  'Loyalty': "The felt bond of allegiance to those you've committed to — and the understanding that it holds especially when tested",
  'Development & Growth': "The belief that people are meant to grow through challenge — and the felt investment in your own and others' becoming",
  'Achievement & Excellence': 'An internal standard so clear you feel it when you fall short',
  'Recognition': 'The need to know that what you contributed mattered — and the hurt when it goes unseen',
  'Competence & Expertise': 'The understanding of what your knowledge can and cannot do — and the felt readiness to apply it when the stakes are real',
  'Safety & Wellbeing': 'The understanding that people cannot thrive where they feel unsafe — and the unease of sensing someone near you is not okay',
  'Responsibility & Accountability': 'The acceptance that your choices carry consequences — and the demand that others answer for theirs',
  'Fairness & Justice': "The conviction that the rules should hold the same for everyone — and the frustration when they don't",
  'Teamwork & Collaboration': 'The conviction that we accomplish more together than any of us can alone — and the felt commitment to shared effort',
  'Service': "The willingness to bear a cost that isn't yours because someone else's need is real to you",
  'Purpose': 'The sense that your work connects to something larger than yourself — and the emptiness when that connection breaks',
  'Duty': 'The acceptance that your role carries obligations — and the resolve to meet them when you have every reason to stop',
  'Integrity': 'The alignment between what you believe, what you say, and what you do — and the discomfort when they come apart',
  'Moral Identity': 'The sense of yourself as someone who does right — and the wound when that self-concept is threatened',
  'Humility': "The honest awareness that you don't see everything — and the willingness to be corrected without defending yourself",
};

export const getFallbackTagline = (valueName: string): string => {
  return FALLBACK_TAGLINES[valueName] || 'A value you stand for';
};
