import { digitalMarketing } from './digital-marketing';
import { websiteDevelopment, type WebsiteDevelopmentContent } from './website-development';
import { appDevelopment, type AppDevelopmentContent } from './app-development';
import { creativeDesigning, type CreativeDesigningContent } from './creative-designing';
import { performanceMarketing, type PerformanceMarketingContent } from './performance-marketing';
import type { ServicePageContent as LegacyServicePageContent } from './types';

export type DigitalMarketingContent = Omit<LegacyServicePageContent, 'slug'> & { slug: 'digital-marketing' };
export type ServicePageContent = DigitalMarketingContent | WebsiteDevelopmentContent | AppDevelopmentContent | CreativeDesigningContent | PerformanceMarketingContent;

export const servicePages: Record<string, ServicePageContent> = {
  [digitalMarketing.slug]: digitalMarketing,
  [websiteDevelopment.slug]: websiteDevelopment,
  [appDevelopment.slug]: appDevelopment,
  [creativeDesigning.slug]: creativeDesigning,
  [performanceMarketing.slug]: performanceMarketing,
};

export { digitalMarketing, websiteDevelopment, appDevelopment, creativeDesigning, performanceMarketing };
export type { WebsiteDevelopmentContent, AppDevelopmentContent, CreativeDesigningContent, PerformanceMarketingContent };
