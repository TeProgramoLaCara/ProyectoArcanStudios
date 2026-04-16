'use client';

import { useTheme } from '@/context/ThemeContext';

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function SettingsSection({ title, description, children }: Props) {
  const { isDark } = useTheme();

  return (
    <div className={`overflow-hidden rounded-[26px] border ${
      isDark
        ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
        : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
    }`}>
      <div className="px-6 py-5">
        <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{title}</h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>{description}</p>
      </div>
      <div className={`h-px ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]'}`} />
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
