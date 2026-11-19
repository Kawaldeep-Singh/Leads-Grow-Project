export interface WebsiteDevelopmentMedia {
  src: string;
  width: 1600;
  height: 1000;
  href?: string;
  available: boolean;
}

export const websiteDevelopmentMedia: Record<number, WebsiteDevelopmentMedia> = {
  1: { src: '/images/website-development/01-business.webp', width: 1600, height: 1000, available: false },
  2: { src: '/images/website-development/02-corporate.webp', width: 1600, height: 1000, available: false },
  3: { src: '/images/website-development/03-ecommerce.webp', width: 1600, height: 1000, available: false },
  4: { src: '/images/website-development/04-custom.webp', width: 1600, height: 1000, available: false },
  5: { src: '/images/website-development/05-wordpress.webp', width: 1600, height: 1000, available: false },
  6: { src: '/images/website-development/06-landing.webp', width: 1600, height: 1000, available: false },
  7: { src: '/images/website-development/07-portfolio.webp', width: 1600, height: 1000, available: false },
  8: { src: '/images/website-development/08-redesign.webp', width: 1600, height: 1000, available: false },
  9: { src: '/images/website-development/09-portal.webp', width: 1600, height: 1000, available: false },
  10: { src: '/images/website-development/10-maintenance.webp', width: 1600, height: 1000, available: false },
};
