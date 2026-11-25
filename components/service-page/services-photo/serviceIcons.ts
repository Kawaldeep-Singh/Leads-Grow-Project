import { AppWindow, BookOpenText, Clapperboard, Heart, Megaphone, MousePointerClick, Palette, PenLine, PenTool, Presentation } from 'lucide-react';

export type ServiceIconMotion = 'draw' | 'spin' | 'pulse' | 'shake' | 'write' | 'click' | 'slide' | 'flip' | 'grow' | 'clap';

export const serviceIcons = {
  1: { Icon: PenTool, motion: 'draw' },
  2: { Icon: Palette, motion: 'spin' },
  3: { Icon: Heart, motion: 'pulse' },
  4: { Icon: Megaphone, motion: 'shake' },
  5: { Icon: PenLine, motion: 'write' },
  6: { Icon: MousePointerClick, motion: 'click' },
  7: { Icon: AppWindow, motion: 'slide' },
  8: { Icon: BookOpenText, motion: 'flip' },
  9: { Icon: Presentation, motion: 'grow' },
  10: { Icon: Clapperboard, motion: 'clap' },
} as const satisfies Record<number, { Icon: typeof PenTool; motion: ServiceIconMotion }>;
