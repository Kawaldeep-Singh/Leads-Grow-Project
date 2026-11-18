export type WebsiteDevelopmentSection = 'hero' | 'why' | 'services' | 'process' | 'techStack' | 'whyLeadsGrow' | 'counters';

export interface WebsiteDevelopmentContent {
  slug: 'website-development';
  sections: readonly WebsiteDevelopmentSection[];
  hero: { eyebrow: string; title: string; text: string };
  why: { eyebrow: string; title: string; text: string; benefits: readonly string[] };
  services: { eyebrow: string; title: string; text: string; items: readonly string[] };
  process: { eyebrow: string; title: string; text: string; steps: readonly { title: string; text: string }[] };
}

export const websiteDevelopment = {
  slug: 'website-development',
  sections: ['hero', 'why', 'services', 'process', 'techStack', 'whyLeadsGrow', 'counters'],
  hero: {
    eyebrow: 'Website Development',
    title: 'We Turn Your Ideas into Powerful Websites.',
    text: 'Get a website that looks stunning, works smoothly and keeps your business secure. We combine smart design, powerful development and mobile-friendly experiences to help your brand grow.',
  },
  why: {
    eyebrow: 'Why Does Your Business Need a Professional Website?',
    title: 'Your Website Is More Than Just an Online Address. It’s Your Digital Storefront.',
    text: 'Today, customers often visit your website before choosing your business. A professional website helps you make a great first impression, build trust, showcase your products and services, and connect with potential customers.',
    benefits: [
      'Build Trust & Credibility',
      'Create a Strong Online Presence',
      'Reach More Potential Customers',
      'Generate More Business Opportunities',
    ],
  },
  services: {
    eyebrow: 'Our Website Development Services',
    title: 'Every Website Your Business Needs, We Build It.',
    text: 'From simple business websites to advanced e-commerce platforms, we develop websites that match your brand, business goals and customer needs.',
    items: [
      'Business Website Development',
      'Corporate Website Development',
      'E-commerce Website Development',
      'Custom Website Development',
      'WordPress Website Development',
      'Landing Page Development',
      'Portfolio Website Development',
      'Website Redesign & Revamp',
      'Web Portal Development',
      'Website Maintenance & Support',
    ],
  },
  process: {
    eyebrow: 'Our Development Process',
    title: 'From Your Idea to a Powerful Website.',
    text: 'We follow a simple and structured process to turn your vision into a fully functional website.',
    steps: [
      { title: 'Understand Your Requirements', text: 'We learn about your business, goals and expectations.' },
      { title: 'Planning & Strategy', text: 'We plan the website structure, features and user journey.' },
      { title: 'UI/UX Design', text: 'We create an attractive and user-friendly design.' },
      { title: 'Website Development', text: 'We turn the approved design into a working website.' },
      { title: 'Testing & Quality Check', text: 'We check speed, responsiveness, security and functionality.' },
      { title: 'Launch & Support', text: 'We launch your website and provide ongoing support.' },
    ],
  },
} as const satisfies WebsiteDevelopmentContent;
