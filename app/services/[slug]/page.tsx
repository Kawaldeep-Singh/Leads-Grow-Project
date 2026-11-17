import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicePages } from '@/data/servicePages';
import { ServiceLandingPage } from '@/components/service-page/ServiceLandingPage';

export function generateStaticParams() {
  return Object.values(servicePages).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = servicePages[slug];
  if (!content) return {};
  return {
    title: `${content.hero.eyebrow} | LeadsGrow`,
    description: content.hero.text,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = servicePages[slug];
  if (!content) notFound();

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.hero.eyebrow,
    description: content.hero.text,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ServiceLandingPage content={content} />
    </>
  );
}
