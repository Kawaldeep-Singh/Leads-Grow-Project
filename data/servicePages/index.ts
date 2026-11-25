import { digitalMarketing } from './digital-marketing';
import { websiteDevelopment, type WebsiteDevelopmentContent } from './website-development';
import { appDevelopment, type AppDevelopmentContent } from './app-development';
import { creativeDesigning, type CreativeDesigningContent } from './creative-designing';
import type { ServicePageContent as LegacyServicePageContent } from './types';

export type DigitalMarketingContent = Omit<LegacyServicePageContent, 'slug'> & { slug: 'digital-marketing' };
export type ServicePageContent = DigitalMarketingContent | WebsiteDevelopmentContent | AppDevelopmentContent | CreativeDesigningContent;

export const servicePages: Record<string, ServicePageContent> = {
  [digitalMarketing.slug]: digitalMarketing,
  [websiteDevelopment.slug]: websiteDevelopment,
  [appDevelopment.slug]: appDevelopment,
  [creativeDesigning.slug]: creativeDesigning,
};

export { digitalMarketing, websiteDevelopment, appDevelopment, creativeDesigning };
export type { WebsiteDevelopmentContent, AppDevelopmentContent, CreativeDesigningContent };
