// ============================================================================
// TODO: replace with real testimonials once approved by client
// ============================================================================

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarText: string;
  rating: number;
  highlight: string;
  quote: string;
  metrics: string;
}

export const testimonialsData: TestimonialItem[] = [
  // TODO: replace with real testimonials
  {
    id: 't-1',
    name: 'Vikram Malhotra',
    role: 'Managing Director',
    company: 'Skyline Urban Living (Real Estate)',
    avatarText: 'VM',
    rating: 5,
    highlight: 'Over 1,200 verified site visits delivered in 90 days',
    quote:
      'LeadsGrow revolutionized our project launches. Their performance campaigns consistently bring pre-qualified property buyers who actually show up for physical site walkthroughs. Our sales team closed 42 luxury units in Q3 alone!',
    metrics: '+340% Sales Velocity',
  },
  // TODO: replace with real testimonials
  {
    id: 't-2',
    name: 'Ananya Deshmukh',
    role: 'Head of Growth & D2C',
    company: 'Aura Naturals (Cosmetics & Wellness)',
    avatarText: 'AD',
    rating: 5,
    highlight: 'Scaled our ROAS from 1.8x to 4.6x in 4 months',
    quote:
      'The creative team and media buyers at LeadsGrow operate as a true extension of our brand. They revamped our landing pages, rebuilt our Meta ad funnels, and automated WhatsApp abandoned cart recovery seamlessly.',
    metrics: '4.6x Sustained ROAS',
  },
  // TODO: replace with real testimonials
  {
    id: 't-3',
    name: 'Rajesh Sen',
    role: 'Chief Operating Officer',
    company: 'ConnectFiber Telecom (ISP)',
    avatarText: 'RS',
    rating: 5,
    highlight: 'Reduced Cost Per Acquisition by 42%',
    quote:
      'In a competitive fiber broadband market, hyper-local lead generation is tough. LeadsGrow pinned down neighborhood-specific campaigns that delivered steady daily installations at half our historical cost.',
    metrics: '42% Lower CAC',
  },
  // TODO: replace with real testimonials
  {
    id: 't-4',
    name: 'Dr. Priya Sharma',
    role: 'Founder & Medical Director',
    company: 'Apex Aesthetic Clinics (Healthcare)',
    avatarText: 'PS',
    rating: 5,
    highlight: 'Clinic calendars booked solid weeks in advance',
    quote:
      'Before LeadsGrow, our clinics struggled with high ad spend and low-intent patient inquiries. Their qualified lead generation funnel brought genuine patients seeking premium dermatological and dental consultations.',
    metrics: '85% Show-Up Rate',
  },
  // TODO: replace with real testimonials
  {
    id: 't-5',
    name: 'Gaurav Singhal',
    role: 'VP Marketing & Admissions',
    company: 'NextGen International Academy (Education)',
    avatarText: 'GS',
    rating: 5,
    highlight: 'Exceeded student enrollment target by 135%',
    quote:
      'The entire omnichannel strategy from Google search ads to interactive WhatsApp counseling automations was executed with surgical precision. We closed our annual admissions cycle 2 months earlier than scheduled.',
    metrics: '1,800+ Admissions',
  },
  // TODO: replace with real testimonials
  {
    id: 't-6',
    name: 'Sunil Nair',
    role: 'Co-Founder & CEO',
    company: 'CloudSphere Solutions (B2B SaaS)',
    avatarText: 'SN',
    rating: 5,
    highlight: 'Generated 220+ enterprise enterprise demo bookings',
    quote:
      'LeadsGrow understands B2B LinkedIn funnels better than any agency we have worked with. Their content creatives and targeted outreach gave us warm access to Fortune 500 decision makers with zero wasted budget.',
    metrics: '$1.4M Pipeline Generated',
  },
];

