export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  iconName: string;
}

export const statsData: StatItem[] = [
  {
    id: 'exp',
    value: 7,
    suffix: '+',
    label: 'Years Experience',
    description: 'Proven track record of building and scaling brands',
    iconName: 'FaHistory',
  },
  {
    id: 'leads',
    value: 50,
    suffix: 'L+',
    label: 'Quality Leads Delivered',
    description: 'High-intent prospects converted for our clients',
    iconName: 'FaUsers',
  },
  {
    id: 'campaigns',
    value: 5,
    suffix: 'K+',
    label: 'Campaigns Managed',
    description: 'Multi-channel high-converting campaigns deployed',
    iconName: 'FaBullhorn',
  },
  {
    id: 'industries',
    value: 10,
    suffix: '+',
    label: 'Industries Served',
    description: 'Deep sector-specific domain understanding',
    iconName: 'FaBuilding',
  },
];

