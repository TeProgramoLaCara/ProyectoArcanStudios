'use client';

import { useTheme } from '@/context/ThemeContext';
import CategoryBadge from './CategoryBadge';
import type { Capacitacion } from '@/resources/data';

type Props = {
  cap: Capacitacion;
};

export default function CapacitacionCard({ cap }: Props) {
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col gap-3 rounded-[24px] border p-5 transition ${
      isDark
        ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-[#267F6B]/30'
        : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)] hover:border-[#267F6B]/40'
    }`}>

      {/* Header row: icon · title + description · badge */}
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg ${
          isDark ? 'border-white/10 bg-white/5' : 'border-black/[0.08] bg-black/[0.04]'
        }`}>
          📦
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{cap.title}</h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-white/45' : 'text-[#475569]'}`}>{cap.description}</p>
        </div>
        <CategoryBadge category={cap.category} />
      </div>
    </div>
  );
}
