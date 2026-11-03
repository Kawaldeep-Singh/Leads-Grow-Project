export interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  benefit: string;
  statBadge: string;
}

export const industriesData: IndustryItem[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    slug: 'real-estate',
    iconName: 'FaHome',
    benefit: 'Qualified buyer leads that book verified site visits and boost project sales.',
    statBadge: '3.8x Site Visits',
  },
  {
    id: 'isp',
    name: 'ISP & Telecom',
    slug: 'isp',
    iconName: 'FaWifi',
    benefit: 'Hyperlocal residential connection leads and enterprise fiber contracts.',
    statBadge: '45% Lower CPL',
  },
  {
    id: 'retail',
    name: 'Retail & Stores',
    slug: 'retail',
    iconName: 'FaShoppingBag',
    benefit: 'Driving local footfall and loyalty member acquisition across store chains.',
    statBadge: '2.5x Store Sales',
  },
  {
    id: 'hr',
    name: 'HR & Staffing',
    slug: 'hr',
    iconName: 'FaUserTie',
    benefit: 'Corporate client acquisition and steady pipelines of qualified talent pools.',
    statBadge: '120+ Retainers',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Clinics',
    slug: 'healthcare',
    iconName: 'FaHeartbeat',
    benefit: 'Targeted patient appointments, elective procedure queries, and brand trust.',
    statBadge: '65% Patient Growth',
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    slug: 'education',
    iconName: 'FaGraduationCap',
    benefit: 'Direct student enrollments, course signups, and parent counseling sessions.',
    statBadge: '10K+ Admissions',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & D2C',
    slug: 'ecommerce',
    iconName: 'FaStore',
    benefit: 'Scaling profitable ROAS with aggressive retention and cart recovery.',
    statBadge: '4.2x Avg ROAS',
  },
  {
    id: 'it',
    name: 'IT & Software (SaaS)',
    slug: 'it',
    iconName: 'FaLaptopCode',
    benefit: 'B2B software demo bookings, trial signups, and enterprise RFP pipelines.',
    statBadge: '300+ Qualified Demos',
  },
];
