import type { Metadata } from 'next';
import { AboutPage } from '@/components/sections/about/AboutPage';

export const metadata: Metadata = {
  title: 'About LeadsGrow',
  description:
    'We are a 360° marketing and business growth agency helping brands build their identity, reach the right audience, generate quality leads and drive meaningful business results.',
  openGraph: {
    title: 'About LeadsGrow',
    description:
      'We are a 360° marketing and business growth agency helping brands build their identity, reach the right audience, generate quality leads and drive meaningful business results.',
  },
};

export default function Page() {
  return <AboutPage />;
}
