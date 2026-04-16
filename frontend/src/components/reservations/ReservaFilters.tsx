'use client';

import { useTheme } from '@/context/ThemeContext';

type Props = {
  company: string;
  status: string;
  companies: string[];
  onCompanyChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onReset: () => void;
};

export default function ReservaFilters({
  company,
  status,
  companies,
  onCompanyChange,
  onStatusChange,
  onReset,
}: Props) {
  const { isDark } = useTheme();

  const selectClass = isDark
    ? 'rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#267F6B]/50 min-w-[180px]'
    : 'rounded-xl border border-black/[0.08] bg-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#267F6B]/50 min-w-[180px]';

  const labelClass = `text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Empresa</label>
        <select value={company} onChange={(e) => onCompanyChange(e.target.value)} className={selectClass}>
          <option value="all">Todas las empresas</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Estado</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={selectClass}>
          <option value="all">Todos los estados</option>
          {['Pendiente', 'Confirmada', 'En curso', 'Completada', 'Cancelada'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
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
