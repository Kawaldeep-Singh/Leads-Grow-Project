export interface HeadlineSlide {
  id: number;
  line1: string;
  line2: string;
  em: string;
  countUp?: { to: number; suffix: string };
}

export const headlineSlides: readonly HeadlineSlide[] = [
  {
    id: 1,
    line1: 'Everything Under One',
    line2: 'Roof to Grow Your Brand.',
    em: 'Grow Your Brand.',
  },
  {
    id: 2,
    line1: 'We Don’t Just Generate Leads.',
    line2: 'We Generate Business.',
    em: 'Business.',
  },
  {
    id: 3,
    line1: '15+ Years of Marketing Expertise',
    line2: 'To Make Your Business Bigger.',
    em: 'Bigger.',
    countUp: { to: 15, suffix: '+' },
  },
] as const;
