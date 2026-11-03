'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  /**
   * 'light': White text "Leads" + green "Grow" (Best on dark backgrounds #0B0F0D / glass-nav)
   * 'dark': Dark/Black text "Leads" + green "Grow" (Best on white / light backgrounds)
   * 'auto': Uses CSS to switch or display correctly
   */
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  className = '',
  width = 240,
  height = 38,
  priority = false,
}) => {
  // Exact aspect ratio of official logo is ~6.22 : 1
  const calculatedHeight = Math.round(width / 6.22);
  const finalHeight = height || calculatedHeight;

  if (variant === 'auto') {
    return (
      <div className={`relative inline-block ${className}`} style={{ width, height: finalHeight }}>
        {/* On dark backgrounds (default) show Light logo */}
        <Image
          src="/Logo-Light.webp"
          alt="LeadsGrow™ — You Believe. We Achieve."
          width={width}
          height={finalHeight}
          priority={priority}
          className="object-contain object-left dark:block hidden"
        />
        {/* On light backgrounds show Dark logo */}
        <Image
          src="/Logo-dark.webp"
          alt="LeadsGrow™ — You Believe. We Achieve."
          width={width}
          height={finalHeight}
          priority={priority}
          className="object-contain object-left dark:hidden block"
        />
      </div>
    );
  }

  const src = variant === 'dark' ? '/Logo-dark.webp' : '/Logo-Light.webp';

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width, height: finalHeight }}
    >
      <Image
        src={src}
        alt="LeadsGrow™ — You Believe. We Achieve."
        width={width}
        height={finalHeight}
        priority={priority}
        className="object-contain object-left w-full h-full"
      />
    </div>
  );
};

