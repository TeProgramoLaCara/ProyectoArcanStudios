'use client';

import { useTheme } from '@/context/ThemeContext';

type Props = {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
};

export default function MonthNavigator({ currentDate, onPrev, onNext }: Props) {
  const { isDark } = useTheme();

  const raw = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const label = raw.charAt(0).toUpperCase() + raw.slice(1);

  const btnClass = `px-4 py-2 rounded-xl border transition ${
    isDark
      ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
      : 'border-black/[0.08] bg-black/[0.04] text-[#0f172a] hover:bg-black/[0.08]'
  }`;

  return (
    <div className="flex items-center justify-center gap-6">
      <button onClick={onPrev} className={btnClass} aria-label="Mes anterior">
        ←
      </button>
      <span className={`min-w-[200px] text-center text-lg font-semibold ${
        isDark ? 'text-white' : 'text-[#0f172a]'
      }`}>
        {label}
      </span>
      <button onClick={onNext} className={btnClass} aria-label="Mes siguiente">
        →
      </button>
    </div>
  );
}
