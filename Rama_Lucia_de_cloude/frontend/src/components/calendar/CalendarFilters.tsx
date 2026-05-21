"use client";

import type {
  CalendarCompanyOption,
  CalendarProfessorOption,
} from "./types";

type CalendarFiltersProps = {
  professor: string;
  company: string;
  professorLegend: CalendarProfessorOption[];
  companyLegend: CalendarCompanyOption[];
  onProfessorChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onReset: () => void;
};

const legend = [
  { icon: "☀", label: "Mañana" },
  { icon: "☾", label: "Tarde" },
];

export default function CalendarFilters({
  professor,
  company,
  professorLegend,
  companyLegend,
  onProfessorChange,
  onCompanyChange,
  onReset,
}: CalendarFiltersProps) {
  return (
    <div className="rounded-[26px] border border-(--border) bg-surface p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-(--text-primary)">
            Calendario
          </h1>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Calendario de cursos en las aulas de la academia.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            {legend.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="h-2.5 w-8 rounded-sm bg-(--border)" />
                <span className="text-xs text-(--text-secondary)" aria-hidden>
                  {icon}
                </span>
                <span className="text-xs text-(--text-primary)">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            {professorLegend.map((prof) => (
              <div key={prof.id} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: prof.color }}
                />
                <span className="text-xs text-(--text-muted)">
                  {prof.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="professor-filter"
              className="text-sm font-medium text-(--text-secondary)"
            >
              Profesor
            </label>

            <select
              id="professor-filter"
              value={professor}
              onChange={(event) => onProfessorChange(event.target.value)}
              className="min-w-55 rounded-2xl border border-(--border) bg-surface-elevated px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-(--border)"
            >
              <option value="all">Todos los profesores</option>
              {professorLegend.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="company-filter"
              className="text-sm font-medium text-(--text-secondary)"
            >
              Empresa
            </label>

            <select
              id="company-filter"
              value={company}
              onChange={(event) => onCompanyChange(event.target.value)}
              className="min-w-55 rounded-2xl border border-(--border) bg-surface-elevated px-4 py-3 text-sm text-(--text-primary) outline-none transition focus:border-(--border)"
            >
              <option value="all">Todas las empresas</option>
              {companyLegend.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-(--border) bg-(--text-primary) px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
          >
            Restaurar filtros
          </button>
        </div>
      </div>
    </div>
  );
}