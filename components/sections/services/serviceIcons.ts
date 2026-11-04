import React from 'react';
import {
  HiGlobeAlt,
  HiCodeBracket,
  HiDevicePhoneMobile,
  HiPaintBrush,
  HiChartBar,
  HiBolt,
  HiChatBubbleBottomCenterText,
  HiBuildingStorefront,
} from 'react-icons/hi2';
import { ServiceItem } from '@/data/services';

export const serviceIcons: Record<ServiceItem['iconKey'], React.ElementType> = {
  'digital-marketing': HiGlobeAlt,
  'web-dev': HiCodeBracket,
  'app-dev': HiDevicePhoneMobile,
  design: HiPaintBrush,
  performance: HiChartBar,
  'lead-gen': HiBolt,
  automation: HiChatBubbleBottomCenterText,
  offline: HiBuildingStorefront,
};

