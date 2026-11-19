import type { ServicePageContent } from './types';

export const digitalMarketing = {
  slug: 'digital-marketing',
  hero: {
    eyebrow: 'Digital Marketing',
    title: 'More Leads. More Customers. More Revenue.',
    text: 'We create result-driven digital marketing strategies that increase your brand visibility, attract quality leads, bring in more customers, boost sales and grow your revenue.',
    flow: ['Visibility', 'Leads', 'Customers', 'Sales', 'Revenue'],
  },
  what: {
    title: 'What Is Digital Marketing and Why Does Your Business Need It?',
    paragraphs: [
      'Digital marketing is the way businesses promote their products and services online through search engines, social media, websites, email and digital advertising. It helps your brand connect with potential customers, reach a wider audience and build a strong online presence.',
      'With the right digital marketing strategy, your business can attract quality leads, convert more prospects into customers, increase sales and achieve consistent revenue growth.',
    ],
  },
  services: {
    eyebrow: 'Our Digital Marketing Services',
    title: 'Everything Your Brand Needs to Grow Online.',
    count: '9 Core Growth Channels',
    items: [
      { n: '01', tag: 'Organic Search', name: 'Search Engine Optimization (SEO)' },
      { n: '02', tag: 'Brand & Social', name: 'Social Media Marketing (SMM)' },
      { n: '03', tag: 'High-Intent ROI', name: 'Google Ads' },
      { n: '04', tag: 'Targeted Funnels', name: 'Meta Ads (Facebook & Instagram)' },
      { n: '05', tag: 'B2B Pipeline', name: 'LinkedIn Ads' },
      { n: '06', tag: 'Inbound Authority', name: 'Content Marketing' },
      { n: '07', tag: 'Instant Outreach', name: 'Bulk SMS Marketing' },
      { n: '08', tag: 'Drip & Retention', name: 'Bulk Email Marketing' },
      { n: '09', tag: 'Direct Chat Ops', name: 'WhatsApp Marketing' },
    ],
  },
  why: {
    eyebrow: 'Why Choose LeadsGrow?',
    title: 'More Than Marketing. A Partner in Your Growth.',
    stats: [
      { value: '360°', label: 'Digital Marketing Solutions' },
      { value: '1,000+', label: 'Keywords Ranked' },
      { value: 'Up to 50%', label: 'Reduction in CPL' },
      { value: '50L+', label: 'Quality Leads Delivered' },
      { value: '10+', label: 'Industries Served' },
    ],
  },
  process: {
    eyebrow: 'Our Digital Marketing Process',
    title: 'From Strategy to Success, We Make It Happen.',
    steps: [
      { title: 'Understand Your Business', text: 'Goals, audience and market.' },
      { title: 'Build the Strategy', text: 'Choose the right channels and marketing approach.' },
      { title: 'Launch Campaigns', text: 'Execute SEO, social media and paid campaigns.' },
      { title: 'Track & Optimise', text: 'Monitor performance and improve results.' },
      { title: 'Scale Your Growth', text: 'Focus on more leads, conversions and revenue.' },
    ],
  },
  industries: { title: 'Industries We Serve' },
  cta: {
    eyebrow: 'Let’s Grow Together',
    title: 'Ready to Turn Your Digital Presence into Business Growth?',
    text: 'Let’s build a digital marketing strategy that brings your brand more visibility, quality leads, customers and revenue.',
    button: 'Talk to Our Experts',
  },
} as const satisfies ServicePageContent;
