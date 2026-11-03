export type TechCategoryKey =
  | 'web'
  | 'cloud-db'
  | 'mobile'
  | 'design'
  | 'marketplaces'
  | 'payments';

export interface TechItem {
  name: string;
  category: TechCategoryKey;
  iconName: string;
  color?: string;
  brandHex?: string;
}

export interface TechTab {
  key: TechCategoryKey;
  label: string;
}

export const techTabs: TechTab[] = [
  { key: 'web', label: 'Web Platform' },
  { key: 'cloud-db', label: 'Cloud, DevOps & DB' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'design', label: 'Design' },
  { key: 'marketplaces', label: 'Marketplaces' },
  { key: 'payments', label: 'Payments' },
];

export const techStackData: Record<TechCategoryKey, TechItem[]> = {
  web: [
    { name: 'HTML', category: 'web', iconName: 'SiHtml5', color: '#E34F26' },
    { name: 'CSS', category: 'web', iconName: 'FaCss3Alt', color: '#1572B6' },
    { name: 'Tailwind CSS', category: 'web', iconName: 'SiTailwindcss', color: '#06B6D4' },
    { name: 'JavaScript', category: 'web', iconName: 'SiJavascript', color: '#F7DF1E' },
    { name: 'TypeScript', category: 'web', iconName: 'SiTypescript', color: '#3178C6' },
    { name: 'React JS', category: 'web', iconName: 'SiReact', color: '#61DAFB' },
    { name: 'Next.js', category: 'web', iconName: 'SiNextdotjs', color: '#000000' },
    { name: 'Node JS', category: 'web', iconName: 'SiNodedotjs', color: '#339933' },
    { name: 'Java', category: 'web', iconName: 'FaJava', color: '#ED8B00' },
    { name: 'Python', category: 'web', iconName: 'SiPython', color: '#3776AB' },
    { name: 'PHP', category: 'web', iconName: 'SiPhp', color: '#777BB4' },
    { name: 'Laravel', category: 'web', iconName: 'SiLaravel', color: '#FF2D20' },
    // { name: 'CodeIgniter', category: 'web', iconName: 'SiCodeigniter', color: '#EE4326' },
    { name: 'WordPress', category: 'web', iconName: 'SiWordpress', color: '#21759B' },
    { name: 'Shopify', category: 'web', iconName: 'SiShopify', color: '#7AB55C' },
    // { name: 'Opencart', category: 'web', iconName: 'FaOpencart', color: '#239FD8' },
    { name: 'Git / GitHub', category: 'web', iconName: 'SiGithub', color: '#24292E' },
    { name: 'Docker', category: 'web', iconName: 'SiDocker', color: '#2496ED' },
    { name: 'Automation', category: 'web', iconName: 'TbAutomation', color: '#16A34A' },
    { name: 'OG Graph', category: 'web', iconName: 'FaShareNodes', color: '#1877F2' },
    { name: 'Angular JS', category: 'web', iconName: 'SiAngular', color: '#DD0031' },
  ],
  'cloud-db': [
    { name: 'PostgreSQL', category: 'cloud-db', iconName: 'SiPostgresql', color: '#4169E1' },
    { name: 'MySQL', category: 'cloud-db', iconName: 'SiMysql', color: '#4479A1' },
    { name: 'MongoDB', category: 'cloud-db', iconName: 'SiMongodb', color: '#47A248' },
    { name: 'AWS', category: 'cloud-db', iconName: 'FaAws', color: '#FF9900' },
    { name: 'Google Cloud', category: 'cloud-db', iconName: 'SiGooglecloud', color: '#4285F4' },
    { name: 'Firebase', category: 'cloud-db', iconName: 'SiFirebase', color: '#FFCA28' },
    { name: 'Docker', category: 'cloud-db', iconName: 'SiDocker', color: '#2496ED' },
    { name: 'Java', category: 'cloud-db', iconName: 'FaJava', color: '#ED8B00' },
    { name: 'Git / GitHub', category: 'cloud-db', iconName: 'SiGithub', color: '#24292E' },
    { name: 'Automation', category: 'cloud-db', iconName: 'TbAutomation', color: '#16A34A' },
  ],
  mobile: [
    { name: 'Android Studio', category: 'mobile', iconName: 'SiAndroidstudio', color: '#3DDC84' },
    { name: 'Apple Developer', category: 'mobile', iconName: 'SiApple', color: '#A2AAAD' },
    { name: 'Flutter', category: 'mobile', iconName: 'SiFlutter', color: '#02569B' },
    { name: 'React Native', category: 'mobile', iconName: 'SiReact', color: '#61DAFB' },
    { name: 'WebView', category: 'mobile', iconName: 'MdMobileFriendly', color: '#16A34A' },
  ],
  design: [
    { name: 'Photoshop', category: 'design', iconName: 'TbBrandAdobePhotoshop', color: '#31A8FF' },
    { name: 'Illustrator', category: 'design', iconName: 'TbBrandAdobeIllustrator', color: '#FF9A00' },
    { name: 'Premiere Pro', category: 'design', iconName: 'TbBrandAdobePremiere', color: '#9999FF' },
    { name: 'After Effects', category: 'design', iconName: 'TbBrandAdobeAfterEffect', color: '#9999FF' },
    { name: 'CorelDRAW', category: 'design', iconName: 'MdBrush', color: '#00AF41' },
    { name: 'Figma', category: 'design', iconName: 'SiFigma', color: '#F24E1E' },
  ],
  marketplaces: [
    { name: 'Amazon', category: 'marketplaces', iconName: 'TbBrandAmazon', color: '#FF9900' },
    { name: 'Flipkart', category: 'marketplaces', iconName: 'MdShoppingCart', color: '#2874F0' },
    { name: 'Shopify', category: 'marketplaces', iconName: 'SiShopify', color: '#7AB55C' },
    { name: 'Meesho', category: 'marketplaces', iconName: 'MdStore', color: '#F43397' },
    { name: 'Myntra', category: 'marketplaces', iconName: 'MdLocalMall', color: '#E42575' },
    { name: 'Snapdeal', category: 'marketplaces', iconName: 'MdShoppingBag', color: '#E40046' },
  ],
  payments: [
    { name: 'Razorpay', category: 'payments', iconName: 'SiRazorpay', color: '#0C2340' },
    { name: 'PayU', category: 'payments', iconName: 'MdPayment', color: '#A5C800' },
    { name: 'PayPal', category: 'payments', iconName: 'SiPaypal', color: '#00457C' },
    { name: 'CCAvenue', category: 'payments', iconName: 'MdAccountBalance', color: '#ED1C24' },
    { name: 'Stripe', category: 'payments', iconName: 'SiStripe', color: '#008CDD' },
    { name: 'Cashfree', category: 'payments', iconName: 'MdAccountBalanceWallet', color: '#1A56DB' },
    { name: 'PhonePe', category: 'payments', iconName: 'SiPhonepe', color: '#5F259F' },
  ],
};
