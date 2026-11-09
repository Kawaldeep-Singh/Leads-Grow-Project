import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — LeadsGrow™ | 15+ Years of Marketing & Tech Growth',
  description:
    'Discover the story, philosophy, and cross-functional team behind LeadsGrow™. From performance marketing to full-stack engineering, learn how we engineer predictable growth engines for category leaders.',
  openGraph: {
    title: 'About Us — LeadsGrow™ | 15+ Years of Marketing & Tech Growth',
    description:
      'We don’t just run campaigns. We engineer predictable growth. Learn about our 15+ year journey, four core pillars, and multidisciplinary squad.',
    url: 'https://leadsgrow.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

