import type { DashboardViewModel } from './dashboard.mapper';

type ProfessorsPanelProps = {
  professors: DashboardViewModel['professorLoad'];
};

export default function ProfessorsPanel({ professors }: ProfessorsPanelProps) {
  return (
    <div className="flex h-[360px] flex-col overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[400px]">
      <div>
        <h2 className="text-lg font-semibold text-(--text-primary)">
          Equipo docente
        </h2>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2 hide-scrollbar">
        <div className="flex flex-col gap-3">
          {professors.map((profesor) => (
            <div
              key={profesor.name}
              className="rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-(--text-primary)">
                    {profesor.name}
                  </p>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    Profesor registrado
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-(--text-primary)">
                    {profesor.bloques}
                  </p>
                  <p className="text-xs text-(--text-muted)">relaciones</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}