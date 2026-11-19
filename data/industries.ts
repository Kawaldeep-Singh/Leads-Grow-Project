export interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  benefit: string;
  statBadge: string;
}

export const industriesData: IndustryItem[] = [
  { id: 'ecommerce', name: 'E-Commerce', slug: 'ecommerce', iconName: 'FaShoppingBag', benefit: 'Scaling profitable ROAS with aggressive retention and cart recovery.', statBadge: '4.2x Avg ROAS' },
  { id: 'b2b', name: 'B2B', slug: 'b2b', iconName: 'FaBriefcase', benefit: 'Reach decision-makers, build sales pipelines and generate qualified enterprise opportunities.', statBadge: 'Qualified B2B Leads' },
  { id: 'fintech-finance', name: 'Fintech, Finance', slug: 'fintech-finance', iconName: 'FaCoins', benefit: 'High-net-worth investor inquiries, commercial loans, and wealth advisory leads.', statBadge: '5.4x Inquiries' },
  { id: 'real-estate', name: 'Real Estate', slug: 'real-estate', iconName: 'FaHome', benefit: 'Qualified buyer leads that book verified site visits and boost project sales.', statBadge: '3.8x Site Visits' },
  { id: 'healthcare', name: 'Healthcare', slug: 'healthcare', iconName: 'FaHeartbeat', benefit: 'Targeted patient appointments, elective procedure queries, and brand trust.', statBadge: '65% Patient Growth' },
  { id: 'legal-law', name: 'Legal & Law', slug: 'legal-law', iconName: 'FaBalanceScale', benefit: 'Generate high-intent case inquiries and build trust for legal services.', statBadge: 'Qualified Consultations' },
  { id: 'education', name: 'Education', slug: 'education', iconName: 'FaGraduationCap', benefit: 'Direct student enrollments, course signups, and parent counseling sessions.', statBadge: '10K+ Admissions' },
  { id: 'travel-tourism', name: 'Travel and Tourism', slug: 'travel-tourism', iconName: 'FaPlane', benefit: 'Direct resort bookings, luxury travel packages, and banquet lead pipelines.', statBadge: '3.2x Booking Surge' },
  { id: 'fmcg', name: 'FMCG', slug: 'fmcg', iconName: 'FaStore', benefit: 'Build product awareness, support retail distribution and encourage repeat purchases.', statBadge: 'Retail Reach' },
  { id: 'government-public-sector', name: 'Government & Public Sector', slug: 'government-public-sector', iconName: 'FaUniversity', benefit: 'Increase citizen awareness, service engagement and outreach across communities.', statBadge: 'Public Reach' },
  { id: 'recruitment', name: 'Recruitment', slug: 'recruitment', iconName: 'FaUserTie', benefit: 'Corporate client acquisition and steady pipelines of qualified talent pools.', statBadge: '120+ Retainers' },
  { id: 'gym-fitness', name: 'Gym and Fitness', slug: 'gym-fitness', iconName: 'FaDumbbell', benefit: 'Drive trial bookings, new gym memberships and long-term member retention.', statBadge: 'More Memberships' },
  { id: 'it-software', name: 'IT & Software', slug: 'it-software', iconName: 'FaLaptopCode', benefit: 'B2B software demo bookings, trial signups, and enterprise RFP pipeline.', statBadge: '300+ Qualified Demos' },
  { id: 'saas', name: 'SaaS', slug: 'saas', iconName: 'FaLaptopCode', benefit: 'Convert the right audiences into product trials, demos and recurring customers.', statBadge: 'More Trial Signups' },
  { id: 'startup-marketing', name: 'Startup Marketing', slug: 'startup-marketing', iconName: 'FaRocket', benefit: 'Build early awareness, attract first customers and create a repeatable growth pipeline.', statBadge: 'Startup Growth' },
];
export const moreIndustriesData: IndustryItem[] = [
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    slug: 'hospitality',
    iconName: 'FaHotel',
    benefit: 'Direct resort bookings, luxury travel packages, and banquet lead pipelines.',
    statBadge: '3.2x Booking Surge',
  },
  {
    id: 'finance',
    name: 'Finance & Fintech',
    slug: 'finance',
    iconName: 'FaCoins',
    benefit: 'High-net-worth investor inquiries, commercial loans, and wealth advisory leads.',
    statBadge: '5.4x Inquiries',
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    slug: 'logistics',
    iconName: 'FaTruckMoving',
    benefit: 'B2B commercial contracts, warehouse leases, and fleet management RFPs.',
    statBadge: '200+ Enterprise RFPs',
  },
  {
    id: 'automotive',
    name: 'Automotive & Dealerships',
    slug: 'automotive',
    iconName: 'FaCar',
    benefit: 'High-intent test-drive bookings, showroom walk-ins, and EV fleet acquisitions.',
    statBadge: '70% Test Drives',
  },
];
