export type AppDevelopmentSection = 'hero' | 'why' | 'services' | 'process' | 'whyChoose' | 'industries' | 'counters';

export interface AppDevelopmentContent {
  slug: 'app-development';
  sections: readonly AppDevelopmentSection[];
  showSubLabels: true;
  hero: { eyebrow: string; title: string; text: string };
  why: { title: string; text: string; benefits: readonly string[]; subLabel: string };
  services: { eyebrow: string; title: string; text: string; items: readonly string[]; features: readonly string[]; servicesSubLabel: string; featuresSubLabel: string };
  process: { eyebrow: string; title: string; text: string; steps: readonly { title: string; text: string }[]; subLabel: string };
  whyChoose: { eyebrow: string; title: string; points: readonly string[] };
  industries: { title: string };
}

export const appDevelopment = {
  slug: 'app-development',
  sections: ['hero', 'why', 'services', 'process', 'whyChoose', 'industries', 'counters'],
  showSubLabels: true,
  hero: {
    eyebrow: 'App Development',
    title: 'We Turn Your Ideas into Powerful Apps.',
    text: 'From your idea to the app store, we create powerful mobile applications that are easy to use, built to perform and designed to grow with your business.',
  },
  why: {
    title: 'Why Does Your Business Need a Mobile App?',
    text: 'A mobile app makes it easier for customers to connect with your business anytime, anywhere. It keeps your brand within reach, simplifies customer interactions and creates a more convenient experience that encourages people to stay connected with you.',
    benefits: [
      'Stay Connected with Customers',
      'Build Customer Loyalty',
      'Make Business More Convenient',
      'Improve Customer Engagement',
    ],
    subLabel: 'Key Benefits',
  },
  services: {
    eyebrow: 'Our App Development Services',
    title: 'Apps Designed Around Your Business Needs.',
    text: 'From customer-facing mobile apps to powerful business applications, we develop apps that simplify processes, improve user experiences and help your business stay connected in a mobile-first world.',
    items: [
      'Android App Development',
      'iOS App Development',
      'Cross-Platform App Development',
      'Custom Mobile App Development',
      'E-commerce App Development',
      'Business & Enterprise Apps',
      'UI/UX Design for Mobile Apps',
      'App Maintenance & Support',
    ],
    features: [
      'Smooth & Responsive UI',
      'Secure Data & User Authentication',
      'Push Notifications',
      'API & Third-Party Integrations',
      'Real-Time Updates',
      'Scalable App Architecture',
      'High-Performance Functionality',
      'User-Friendly Navigation',
    ],
    servicesSubLabel: 'Services to Showcase',
    featuresSubLabel: 'Features to Highlight',
  },
  process: {
    eyebrow: 'Our App Development Process',
    title: 'From Concept to App Store. We Build It All.',
    text: 'We follow a structured development process to turn your app idea into a fully functional, reliable and user-friendly mobile application.',
    steps: [
      { title: 'Idea & Requirement Analysis', text: 'Understanding your vision, business goals and app requirements.' },
      { title: 'Planning & Strategy', text: 'Defining features, functionality and the app roadmap.' },
      { title: 'UI/UX Design', text: 'Designing intuitive, attractive and user-friendly app experiences.' },
      { title: 'App Development', text: 'Building your app with powerful features and reliable technology.' },
      { title: 'Testing & Quality Assurance', text: 'Testing performance, security, compatibility and functionality.' },
      { title: 'Launch & Deployment', text: 'Publishing your app and helping you get it ready for users.' },
    ],
    subLabel: 'Our 6-Step Process',
  },
  whyChoose: {
    eyebrow: 'Why Choose Leads Grow for App Development?',
    title: 'We Build Apps That Move Your Business Forward.',
    points: [
      'User-Centric App Design',
      'Latest Development Technologies',
      'Secure & Reliable Applications',
      'Smooth & Seamless Performance',
      'Custom-Built Solutions',
      'Scalable App Architecture',
      'On-Time Project Delivery',
      'Ongoing Support & Maintenance',
    ],
  },
  industries: { title: 'Industries We Serve' },
} as const satisfies AppDevelopmentContent;
