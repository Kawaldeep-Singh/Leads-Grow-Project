'use client';

import React from 'react';
import { useLenis } from '@/hooks/useLenis';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useLenis();
  return <>{children}</>;
};

