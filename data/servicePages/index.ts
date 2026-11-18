import { digitalMarketing } from './digital-marketing';
import { websiteDevelopment, type WebsiteDevelopmentContent } from './website-development';
import type { ServicePageContent as LegacyServicePageContent } from './types';

export type DigitalMarketingContent = Omit<LegacyServicePageContent, 'slug'> & { slug: 'digital-marketing' };
export type ServicePageContent = DigitalMarketingContent | WebsiteDevelopmentContent;

export const servicePages: Record<string, ServicePageContent> = {
  [digitalMarketing.slug]: digitalMarketing,
  [websiteDevelopment.slug]: websiteDevelopment,
};

export { digitalMarketing, websiteDevelopment };
export type { WebsiteDevelopmentContent };
