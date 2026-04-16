type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  onReset: () => void;
};

export default function ClientesFilters({ search, onSearchChange, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-white/40">
          Buscar empresa
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nombre de empresa..."
          className="rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm text-white outline-none transition placeholder-white/20 focus:border-[#267F6B]/50 min-w-[220px]" /* colors.ts: surfaceElevated, accent */
        />
      </div>

      <button
        onClick={onReset}
        className="rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
      >
        Reset
      </button>
    </div>
  );
}
