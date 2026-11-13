import type { Metadata } from 'next';
import { AboutPage } from '@/components/sections/about/AboutPage';

const ABOUT_HERO_VARIANT: 'v1' | 'v2' = 'v2';

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

export default async function Page({ searchParams }: { searchParams: Promise<{ hero?: string }> }) {
  const params = await searchParams;
  const variant = params.hero === 'v1' || params.hero === 'v2' ? params.hero : ABOUT_HERO_VARIANT;
  return <AboutPage heroVariant={variant} />;
}
