export type CreativeDesigningSection = 'hero' | 'why' | 'services' | 'different' | 'process' | 'whyLeadsGrow' | 'industries';

export const creativeDesigning = {
  slug: 'creative-designing',
  hero: {
    eyebrow: 'Creative & Designing',
    title: 'We Think. We Write. We Design.',
    subtitle: 'Make Your Brand Speak Louder.',
    text: 'We bring together creativity, content and design to make your brand more visible, memorable and impossible to ignore.',
  },
  why: {
    title: 'Your Brand Needs More Than Just a Good Product.',
    text: 'In a crowded market, the way you present your business matters. Creative designs and the right content help people notice your brand, understand what you offer and remember you when it matters.',
    points: [
      'Create a Strong First Impression',
      'Build Trust & Credibility',
      'Connect with Your Audience',
      'Stand Out from Competitors',
    ],
  },
  services: {
    eyebrow: 'Our Creative & Designing Services',
    title: 'Ideas That Inspire. Designs That Connect.',
    text: 'We create impactful visuals, engaging content and creative designs that help your brand communicate, connect and leave a lasting impression.',
    items: [
      'Brand Identity & Logo Design',
      'Graphic Design',
      'Social Media Creatives',
      'Ad & Campaign Creatives',
      'Content Writing',
      'UI/UX Design',
      'Website & App Design',
      'Brochure & Flyer Design',
      'Presentation Design',
      'Video Editing & Motion Graphics',
    ],
  },
  different: {
    eyebrow: 'What Makes Our Creative Work Different?',
    title: 'Designs That Do More Than Look Good.',
    points: [
      'Unique & Creative Designs',
      'Designs That Match Your Brand',
      'Clear & Impactful Messaging',
      'Right Design for the Right Audience',
      'Creative Ideas That Grab Attention',
      'Consistency Across Every Platform',
    ],
  },
  process: {
    eyebrow: 'Our Creative Process',
    title: 'From Ideas to Impactful Creatives.',
    steps: [
      { title: 'Understand Your Brand', text: 'We understand your brand, audience and goals.' },
      { title: 'Brainstorm Ideas', text: 'We develop creative concepts and fresh ideas.' },
      { title: 'Create & Design', text: 'We turn ideas into engaging visuals and content.' },
      { title: 'Review & Refine', text: 'We polish the creatives to get them right.' },
      { title: 'Deliver & Execute', text: 'We deliver ready-to-use creatives for your brand.' },
    ],
  },
  sections: ['hero', 'why', 'services', 'different', 'process', 'whyLeadsGrow', 'industries'],
} as const;

export type CreativeDesigningContent = typeof creativeDesigning;
