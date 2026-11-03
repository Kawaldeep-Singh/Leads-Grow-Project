'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import clsx from 'clsx';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      withArrow = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-xs font-semibold gap-1.5',
      md: 'px-6 py-3 text-sm font-bold gap-2',
      lg: 'px-8 py-4 text-base font-bold gap-2.5',
    };

    const variantClasses = {
      primary:
        'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-lg shadow-[#16A34A]/25 border border-[#22C55E]/40',
      glow:
        'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-[0_0_25px_rgba(34,197,94,0.45)] border border-[#22C55E]/60',
      secondary:
        'bg-[#111815] hover:bg-[#1A2420] text-white border border-[#1A2420] hover:border-[#22C55E]/40',
      outline:
        'bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-[#22C55E] hover:text-[#22C55E]',
      ghost:
        'bg-transparent hover:bg-white/5 text-[#9FB0A7] hover:text-white',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={disabled}
        className={clsx(
          'group relative inline-flex items-center justify-center rounded-full transition-all duration-300 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {withArrow && (
            <HiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

