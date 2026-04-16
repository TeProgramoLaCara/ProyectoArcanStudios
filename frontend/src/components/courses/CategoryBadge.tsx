'use client';

import { useTheme } from '@/context/ThemeContext';

const DARK_STYLES: Record<string, string> = {
  Blender: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  Unity:   'border-sky-500/30 bg-sky-500/10 text-sky-400',
};

const LIGHT_STYLES: Record<string, string> = {
  Blender: 'border-[#ea580c]/30 bg-[#ea580c]/10 text-[#ea580c]',
  Unity:   'border-[#0284c7]/30 bg-[#0284c7]/10 text-[#0284c7]',
};

export default function CategoryBadge({ category }: { category: string }) {
  const { isDark } = useTheme();
  const styles = isDark ? DARK_STYLES : LIGHT_STYLES;

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        styles[category] ??
        (isDark ? 'border-white bg-white/5 text-white' : 'border-black/[0.08] bg-black/[0.04] text-[#475569]')
      }`}
    >
      {category}
    </span>
  );
}
