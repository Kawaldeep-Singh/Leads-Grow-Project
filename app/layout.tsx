import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Sora, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CursorFollower } from '@/components/layout/CursorFollower';
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar';
import { Preloader } from '@/components/layout/Preloader';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://leadsgrow.com'),
  title: 'LeadsGrow — Digital Marketing, Web & App Development, Lead Generation',
  description:
    'LeadsGrow™ is an award-winning full-service digital marketing agency. We engineer high-converting sales pipelines, performance ads, custom web & app development, and marketing automation. You Believe. We Achieve.',
  keywords: [
    'Digital Marketing Agency',
    'Lead Generation Services',
    'Performance Marketing',
    'Website Development',
    'App Development',
    'B2B Leads',
    'Google Ads Specialist',
    'Meta Ads Agency',
    'Marketing Automation',
    'LeadsGrow',
  ],
  authors: [{ name: 'LeadsGrow Team', url: 'https://leadsgrow.com' }],
  creator: 'LeadsGrow',
  publisher: 'LeadsGrow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://leadsgrow.com',
    title: 'LeadsGrow — You Believe. We Achieve.',
    description:
      'Everything under one roof to grow your brand. Quality leads, custom software, and full-funnel digital marketing.',
    siteName: 'LeadsGrow™',
    images: [
      {
        url: '/logo/leadsgrow-logo.png',
        width: 1200,
        height: 630,
        alt: 'LeadsGrow™ — Digital Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadsGrow — Digital Marketing, Web & App Development, Lead Generation',
    description: 'You Believe. We Achieve. Full-service digital marketing and lead generation agency.',
    images: ['/logo/leadsgrow-logo.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://leadsgrow.com/#organization',
        name: 'LeadsGrow',
        url: 'https://leadsgrow.com',
        logo: 'https://leadsgrow.com/logo/leadsgrow-logo.png',
        slogan: 'You Believe. We Achieve.',
        description:
          'Full-service digital marketing agency providing lead generation, web development, app development, and performance advertising.',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91 98915 05081',
            contactType: 'sales',
            email: 'info@leadsgrow.in',
            areaServed: 'Worldwide',
            availableLanguage: ['English', 'Hindi'],
          },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://leadsgrow.com/#service',
        name: 'LeadsGrow Digital Growth Agency',
        url: 'https://leadsgrow.com',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'LeadsGrow Towers, Cyber City, Phase 2',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122002',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 28.4908,
          longitude: 77.0898,
        },
        openingHours: 'Mo-Sa 09:30-19:30',
        telephone: '+91 98915 05081',
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${sora.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#0B0F0D] text-[#0B0F0D]">
        <Preloader />
        <ScrollProgressBar />
        <CursorFollower />
        <SmoothScroll>
          <Providers>{children}</Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}

