'use client';

import { useTheme } from '@/context/ThemeContext';

type Props = {
  label: string;
  value: number | string;
  icon: string;
  accent?: boolean;
};

export default function MetricCard({ label, value, icon, accent }: Props) {
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col gap-3 rounded-[22px] border p-5 ${
      accent
        ? isDark
          ? 'border-[#267F6B]/30 bg-[#267F6B]/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
          : 'border-[#267F6B]/25 bg-[#267F6B]/[0.08] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
        : isDark
          ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
          : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
    }`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`}>
          {label}
        </span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl border text-base ${
          isDark ? 'border-white/10 bg-white/5' : 'border-black/[0.08] bg-black/[0.04]'
        }`}>
          {icon}
        </span>
      </div>
      <span className={`text-3xl font-bold ${accent ? 'text-[#2fa58a]' : isDark ? 'text-white' : 'text-[#0f172a]'}`}>
        {value}
      </span>
    </div>
  );
}
