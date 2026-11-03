import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'dark' | 'outline';
  className?: string;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  className,
  withDot = true,
}) => {
  const variantStyles = {
    green:
      'bg-[#16A34A]/10 text-[#16A34A] dark:text-[#22C55E] border border-[#16A34A]/25',
    dark:
      'bg-[#111815] text-[#9FB0A7] border border-[#1A2420]',
    outline:
      'bg-transparent text-[#22C55E] border border-[#22C55E]/40',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase',
        variantStyles[variant],
        className
      )}
    >
      {withDot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
        </span>
      )}
      <span>{children}</span>
    </div>
  );
};

