export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  shortDescription: string;
  subServices: string[];
  iconKey: 'digital-marketing' | 'web-dev' | 'app-dev' | 'design' | 'performance' | 'lead-gen' | 'automation' | 'offline';
  badge?: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: '01',
    number: '01/08',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    shortDescription: 'Dominating search engines and social platforms to put your brand in front of high-intent prospects.',
    subServices: [
      'SEO (Search Engine Optimization)',
      'SMO (Social Media Optimization)',
      'Google Ads & SEM',
      'Meta Ads (Facebook & Instagram)',
      'LinkedIn B2B Advertising',
    ],
    iconKey: 'digital-marketing',
    badge: 'High ROI',
  },
  {
    id: '02',
    number: '02/08',
    title: 'Website Development',
    slug: 'website-development',
    shortDescription: 'High-speed, conversion-focused websites engineered to turn casual visitors into paying customers.',
    subServices: [
      'Business Websites',
      'E-commerce Websites',
      'High-Converting Landing Pages',
      'Custom Web Development',
    ],
    iconKey: 'web-dev',
    badge: 'Fast & Secure',
  },
  {
    id: '03',
    number: '03/08',
    title: 'App Development',
    slug: 'app-development',
    shortDescription: 'Robust native and cross-platform mobile apps with frictionless user journeys and high retention.',
    subServices: [
      'Android App Development',
      'iOS App Development',
      'Custom Mobile Apps',
      'Mobile App UI/UX',
    ],
    iconKey: 'app-dev',
    badge: 'Fast & Secure',
  },
  {
    id: '04',
    number: '04/08',
    title: 'Creative & Designing',
    slug: 'creative-designing',
    shortDescription: 'Compelling visual narratives, brand assets, and creative design that make your business unforgettable.',
    subServices: [
      'Graphic Design',
      'UI/UX Design',
      'Brand Identity & Guidelines',
      'Social Media Creatives',
    ],
    iconKey: 'design',
    badge: 'Core Focus',
  },
  {
    id: '05',
    number: '05/08',
    title: 'Performance Marketing',
    slug: 'performance-marketing',
    shortDescription: 'Data-driven acquisition campaigns with granular attribution, high ROAS, and scalable funnel economics.',
    subServices: [
      'PPC Campaigns',
      'Conversion Rate Optimization (CRO)',
      'Omnichannel Retargeting',
      'End-to-End Campaign Management',
    ],
    iconKey: 'performance',
    badge: 'Scale ROAS',
  },
  {
    id: '06',
    number: '06/08',
    title: 'Lead Generation',
    slug: 'lead-generation',
    shortDescription: 'Predictable, pre-qualified pipeline generation tailored to fuel your sales team with ready-to-buy leads.',
    subServices: [
      'B2B Lead Generation',
      'B2C Lead Generation',
      'Sales-Qualified Leads (SQLs)',
      'Customer Acquisition Funnels',
    ],
    iconKey: 'lead-gen',
    badge: 'Core Focus',
  },
  {
    id: '07',
    number: '07/08',
    title: 'Marketing Automation',
    slug: 'marketing-automation',
    shortDescription: 'Automated lifecycle journeys, chatbots, and instant trigger messages that nurture prospects 24/7.',
    subServices: [
      'WhatsApp Marketing & Chatbots',
      'Email Marketing Automation',
      'SMS Marketing & Alerts',
      'Affiliate & Referral Marketing',
    ],
    iconKey: 'automation',
    badge: 'Scale ROAS',
  },
  {
    id: '08',
    number: '08/08',
    title: 'Offline Marketing',
    slug: 'offline-marketing',
    shortDescription: 'Strategic physical visibility, on-ground customer touchpoints, and high-impact outdoor collateral.',
    subServices: [
      'Ground Branding & Activations',
      'Commercial Printing Solutions',
      'Outdoor Advertising (Hoardings/OOH)',
      'B2B Promotional Activities & Events',
    ],
    iconKey: 'offline',
    badge: 'High ROI',
  },
];

