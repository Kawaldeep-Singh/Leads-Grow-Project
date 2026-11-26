export const affiliateMarketing = {
  slug: 'affiliate-marketing',
  hero: {
    eyebrow: 'Affiliate Marketing',
    title: 'Grow Your Sales Through the Power of Partnerships.',
    text: 'We connect your business with the right affiliates and partners who promote your products or services, helping you reach new audiences, generate sales and grow through performance-based marketing.',
  },
  what: {
    title: 'What Is Affiliate Marketing?',
    text: 'Affiliate marketing is a performance-based marketing strategy where businesses partner with affiliates to promote their products or services. Affiliates earn a commission for every sale, lead or action they generate, helping businesses reach more customers and grow their revenue.',
  },
  benefits: {
    title: 'Benefits of Affiliate Marketing',
    points: ['Reach a Wider Audience', 'Increase Brand Visibility', 'Generate More Leads & Sales', 'Cost-Effective Marketing', 'Pay for Performance', 'Expand Business Growth'],
  },
  services: {
    title: 'Our Affiliate Marketing Services',
    text: 'From finding the right affiliates to managing campaigns and tracking conversions, we handle every aspect of affiliate marketing to help your business grow through strategic partnerships.',
    items: ['Affiliate Program Setup', 'Affiliate Partner Recruitment', 'Influencer & Creator Partnerships', 'Affiliate Network Management', 'Commission & Incentive Planning', 'Affiliate Campaign Management', 'Affiliate Tracking & Reporting', 'Performance Analysis & Optimisation', 'Affiliate Payments & Management'],
  },
  channels: {
    title: 'Connect with the Right Affiliates. Reach the Right Audience.',
    text: 'We work across different affiliate channels to connect your brand with potential customers. From content creators and influencers to publishers and affiliate networks, we help you build partnerships that drive awareness, traffic and sales.',
    items: ['Influencer & Creator Partnerships', 'Bloggers & Content Publishers', 'Coupon & Deal Websites', 'Social Media Affiliates', 'Cashback & Rewards Platforms'],
  },
  sections: ['hero', 'what', 'benefits', 'services', 'channels', 'whyLeadsGrow', 'industries'],
} as const;

export type AffiliateMarketingContent = typeof affiliateMarketing;
