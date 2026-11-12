export const aboutContent = {
  hero: {
    eyebrow: 'ABOUT LEADSGROW',
    title: 'We Don’t Just Build Brands. We Grow Businesses.',
    paragraphs: [
      'At Leads Grow, we believe every business has the potential to grow bigger. We are a 360° marketing and business growth agency helping brands build their identity, reach the right audience, generate quality leads and drive meaningful business results.',
      'From digital marketing and branding to website development, performance marketing and offline promotions, we bring everything together under one roof.',
      'Our approach combines creativity, technology and marketing strategies to help businesses build a strong market presence, attract customers and achieve sustainable growth.',
      'Whether you’re a startup looking to establish your brand or an established business aiming to expand, Leads Grow is your partner in turning marketing opportunities into business success.',
    ],
  },
  story: {
    eyebrow: 'Our Story',
    title: 'Every Brand Has a Story. We Help It Grow.',
    paragraphs: [
      'Leads Grow was built with a simple idea: businesses need more than just marketing; they need the right strategy, creative thinking and consistent execution to grow.',
      'We bring together different marketing capabilities, from traditional advertising to modern digital solutions, making it easier for businesses to manage their marketing needs through one growth partner.',
      'Our focus is simple: understand every business, create the right strategy and deliver solutions that make a difference.',
    ],
  },
  mission: {
    eyebrow: 'Our Mission',
    title: 'Making Business Growth Easier.',
    text: 'Our mission is to help businesses grow through innovative marketing strategies, creative solutions and result-driven execution. We aim to make professional marketing accessible, effective and valuable for businesses of every size.',
  },
  vision: {
    eyebrow: 'Our Vision',
    title: 'Building Brands Without Boundaries.',
    text: 'Our vision is to become a trusted global marketing and business growth partner, empowering brands to reach new markets, connect with more customers and create lasting business impact.',
  },
  approach: {
    eyebrow: 'Our Approach',
    title: 'From Strategy to Success.',
    intro: 'We follow a structured approach to help brands move forward:',
    steps: [
      { number: '01', title: 'Understand', text: 'We understand your business, goals and target audience.' },
      { number: '02', title: 'Strategize', text: 'We create marketing strategies aligned with your objectives.' },
      { number: '03', title: 'Execute', text: 'We bring ideas to life through creative and marketing campaigns.' },
      { number: '04', title: 'Optimize', text: 'We track performance and continuously improve our efforts.' },
      { number: '05', title: 'Grow', text: 'We focus on building stronger brands, generating opportunities and supporting business growth.' },
    ],
  },
  cta: {
    title: 'Ready to Take Your Business to the Next Level?',
    text: 'Let’s bring your ideas to life, build your brand and create new growth opportunities.',
    button: 'Let’s Grow Together with LeadsGrow.',
  },
} as const;

export type AboutContent = typeof aboutContent;

