import type { DashboardViewModel } from './dashboard.mapper';

type CompaniesPanelProps = {
  companies: DashboardViewModel['companySummary'];
};

export default function CompaniesPanel({ companies }: CompaniesPanelProps) {
  return (
    <div className="flex h-[360px] flex-col overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[400px]">
      <div>
        <h2 className="text-lg font-semibold text-(--text-primary)">
          Empresas
        </h2>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2 hide-scrollbar">
        <div className="flex flex-col gap-3">
          {companies.map((empresa) => (
            <div
              key={empresa.id}
              className="rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-(--text-primary)">
                    {empresa.name}
                  </p>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    {empresa.usuarios} usuarios relacionados
                  </p>
                </div>

                <div className="rounded-full border border-[#267F6B]/15 bg-[#267F6B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--text-secondary)">
                  {empresa.reservas} reservas
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}