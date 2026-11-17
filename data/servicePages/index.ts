import { digitalMarketing } from './digital-marketing';
import type { ServicePageContent } from './types';

export const servicePages: Record<string, ServicePageContent> = {
  [digitalMarketing.slug]: digitalMarketing,
};

export { digitalMarketing };
export type { ServicePageContent } from './types';
