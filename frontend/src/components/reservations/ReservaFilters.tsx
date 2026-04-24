'use client';

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
  const selectClass =
    'rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-[#267F6B]/50 min-w-[180px]';

  const labelClass = 'text-xs font-medium uppercase tracking-wider text-(--text-muted)';

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
        className="rounded-xl border border-(--border) bg-(--text-primary) px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-80"
      >
        Reset
      </button>
    </div>
  );
}
