export const performanceMarketing = {
  slug: 'performance-marketing',
  hero: {
    eyebrow: 'Performance Marketing',
    title: 'We Drive Campaigns. You See Results.',
    text: 'We create, manage and track marketing campaigns to generate quality leads, drive sales and measure business growth - from campaign performance to ROI.',
  },
  why: {
    title: 'We Don’t Just Generate Leads. We Grow Businesses.',
    text: 'Performance marketing helps businesses reach the right audience through targeted campaigns with measurable results. From attracting potential customers and generating leads to driving sales and tracking ROI, we focus on making your marketing investment count and helping your business grow.',
    label: 'Why Performance Marketing?',
    points: [
      'Reach the Right Audience',
      'Generate Quality Leads',
      'Increase Sales & Conversions',
      'Track Campaign Performance',
      'Make Smarter Budget Decisions',
      'Measure ROI & Business Growth',
    ],
  },
  approach: {
    eyebrow: 'OUR APPROACH',
    title: 'We Don’t Believe in One Strategy for Every Business.',
    text: 'Every business is different, and so are its customers, goals and marketing needs. We understand your business first, then identify the right platforms, audience, budget and strategy to create campaigns that attract potential customers and deliver measurable results.',
    points: [
      'Understand Your Business & Goals',
      'Identify the Right Marketing Channels',
      'Define Your Target Audience',
      'Plan Your Marketing Budget',
      'Create the Right Content & Creatives',
      'Optimise Landing Pages for Conversions',
      'Track Campaigns, Sales & ROI',
    ],
  },
  whatWeDo: {
    eyebrow: 'WHAT WE DO',
    title: 'Everything You Need to Turn Marketing into Growth.',
    text: 'From planning the right strategy to managing campaigns and tracking results, we handle every aspect of performance marketing to help your business attract customers and grow.',
    items: [
      { title: 'Business & Market Analysis', text: 'Understanding your business, competitors and growth opportunities.' },
      { title: 'Marketing Strategy', text: 'Identifying the right marketing channels and strategies for your business.' },
      { title: 'Audience Targeting', text: 'Reaching people most likely to become your customers.' },
      { title: 'Budget Planning', text: 'Allocating your marketing budget across the right platforms.' },
      { title: 'Creative & Content Strategy', text: 'Planning the right messaging, content and creatives to attract customers.' },
      { title: 'Campaign Management', text: 'Setting up, running and managing campaigns across selected platforms.' },
      { title: 'Landing Page Optimisation', text: 'Improving landing pages to turn visitors into leads and customers.' },
      { title: 'Tracking & Performance Analysis', text: 'Monitoring leads, conversions, sales, cost and ROI.' },
      { title: 'Campaign Optimisation', text: 'Improving performance based on data, insights and actual results.' },
    ],
  },
  platforms: {
    eyebrow: 'PLATFORMS WE WORK ON',
    title: 'Your Audience Is Everywhere. So Are We.',
    text: 'We work across leading advertising and marketing platforms to help your business reach the right audience, attract customers and drive growth.',
    items: [
      'Google Ads',
      'Meta Ads (Facebook & Instagram)',
      'YouTube Ads',
      'LinkedIn Ads',
      'Email Marketing',
      'WhatsApp Marketing',
      'SMS Marketing',
      'Affiliate Marketing',
    ],
  },
  sections: ['hero', 'why', 'approach', 'whatWeDo', 'platforms', 'whyLeadsGrow', 'industries'],
} as const;

export type PerformanceMarketingContent = typeof performanceMarketing;
