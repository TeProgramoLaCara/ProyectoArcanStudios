'use client';

import { useTheme } from '@/context/ThemeContext';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  onReset: () => void;
};

export default function ClientesFilters({ search, onSearchChange, onReset }: Props) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`}>
          Buscar empresa
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nombre de empresa..."
          className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition min-w-[220px] ${
            isDark
              ? 'border-white/10 bg-[#1a1a1a] text-white placeholder-white/20 focus:border-[#267F6B]/50'
              : 'border-black/[0.08] bg-[#e8edf2] text-[#0f172a] placeholder-[#94a3b8] focus:border-[#267F6B]/50'
          }`}
        />
      </div>

      <button
        onClick={onReset}
        className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 ${
          isDark ? 'border-white/10 bg-white text-black' : 'border-black/10 bg-[#0f172a] text-white'
        }`}
      >
        Reset
      </button>
    </div>
  );
}
