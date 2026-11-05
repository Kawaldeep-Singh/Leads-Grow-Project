export interface HeadlineSlide {
  id: number;
  line1?: string;
  line1a?: string;
  line1b?: string;
  em: string;
  line2: string;
  line2Size: 'sm' | 'lg';
  countUp?: { to: number; suffix: string };
}

export const headlineSlides: readonly HeadlineSlide[] = [
  {
    id: 1,
    line1: 'Everything Under One Roof to Grow Your Brand.',
    em: 'Grow Your Brand.',                       // gets the highlighter + biggest splash
    line2: 'From Branding to Business Growth.',   // supporting line (smaller)
    line2Size: 'sm',
  },
  {
    id: 2,
    line1a: 'We Don’t Just Generate Leads.',       // lands first, in white
    line1b: 'We Generate Business.',               // lands second, bigger splash
    em: 'Business.',
    line2: 'From Leads to Sales, We Do It All.',
    line2Size: 'sm',
  },
  {
    id: 3,
    line1: '15+ Years of Marketing Expertise',
    countUp: { to: 15, suffix: '+' },
    line2: 'To Make Your Business Bigger.',        // slide 3: line2 is BIG, same size as line1
    em: 'Bigger.',
    line2Size: 'lg',
  },
] as const;

