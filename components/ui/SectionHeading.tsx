import React from 'react';
import { Badge } from './Badge';
import clsx from 'clsx';

export interface SectionHeadingProps {
  badge?: string;
  plainText: string;
  highlightText?: string;
  postText?: string;
  subtext?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'dark' | 'light';
  className?: string;
  headingTag?: 'h1' | 'h2' | 'h3';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  plainText,
  highlightText,
  postText,
  subtext,
  align = 'center',
  theme = 'dark',
  className,
  headingTag = 'h2',
}) => {
  const HeadingTag = headingTag;

  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const isLight = theme === 'light';

  return (
    <div className={clsx('flex flex-col mb-12 md:mb-16', alignStyles[align], className)}>
      {badge && (
        <div className="mb-4">
          <Badge variant={isLight ? 'green' : 'green'}>{badge}</Badge>
        </div>
      )}

      <HeadingTag
        className={clsx(
          'text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]',
          isLight ? 'text-[#0B0F0D]' : 'text-white'
        )}
      >
        <span>{plainText} </span>
        {highlightText && <span className="text-gradient">{highlightText}</span>}
        {postText && <span> {postText}</span>}
      </HeadingTag>

      {subtext && (
        <p
          className={clsx(
            'mt-4 text-base sm:text-lg max-w-2xl font-normal leading-relaxed',
            isLight ? 'text-[#5B6B63]' : 'text-[#9FB0A7]'
          )}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

