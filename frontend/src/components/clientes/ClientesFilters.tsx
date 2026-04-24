'use client';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  onReset: () => void;
};

export default function ClientesFilters({ search, onSearchChange, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          Buscar empresa
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nombre de empresa..."
          className="rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition min-w-55 focus:border-[#267F6B]/50"
        />
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
