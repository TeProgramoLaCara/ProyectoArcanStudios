"use client";

type CalendarFiltersProps = {
  professor: string;
  company: string;
  professorLegend: { id: string; name: string; color: string }[];
  onProfessorChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onReset: () => void;
};

const legend = [
  { label: "Mañana — turno de mañana" },
  { label: "Tarde — turno de tarde" },
];

export default function CalendarFilters({
  professor,
  company,
  professorLegend,
  onProfessorChange,
  onCompanyChange,
  onReset,
}: CalendarFiltersProps) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendario</h1>
          <p className="mt-1 text-sm text-white/55">
            Calendario de cursos en las aulas de la academia.
          </p>
          {/* Leyenda de turnos */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {legend.map(({ label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="h-2.5 w-8 rounded-sm bg-black/30 dark:bg-white/40" />
                <span className="text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div>
          {/* Leyenda de profesores */}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {professorLegend.map((prof) => (
              <div key={prof.id} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: prof.color }}
                />
                <span className="text-xs text-white/50">{prof.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="professor-filter"
              className="text-sm font-medium text-white/75"
            >
              Profesor
            </label>
            <select
              id="professor-filter"
              value={professor}
              onChange={(e) => onProfessorChange(e.target.value)}
              className="min-w-[220px] rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
            >
              <option value="all">Todos los profesores</option>
              <option value="p1">Profesor 1</option>
              <option value="p2">Profesor 2</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="company-filter"
              className="text-sm font-medium text-white/75"
            >
              Empresa
            </label>
            <select
              id="company-filter"
              value={company}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="min-w-[220px] rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
            >
              <option value="all">Todas las empresas</option>
              <option value="e1">Nova</option>
              <option value="e2">Acme</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Restaurar filtros
          </button>
        </div>
      </div>
    </div>
  );
}