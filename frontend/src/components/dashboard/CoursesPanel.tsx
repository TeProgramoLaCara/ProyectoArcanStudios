import type { DashboardViewModel } from './dashboard.mapper';

type CoursesPanelProps = {
  courses: DashboardViewModel['courseDemand'];
};

export default function CoursesPanel({ courses }: CoursesPanelProps) {
  return (
    <div className="flex h-[360px] flex-col overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[400px]">
      <div>
        <h2 className="text-lg font-semibold text-(--text-primary)">
          Cursos
        </h2>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2 hide-scrollbar">
        <div className="flex flex-col gap-3">
          {courses.map((curso, index) => (
            <div
              key={curso.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-4 py-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  #{index + 1} · {curso.category}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-(--text-primary)">
                  {curso.title}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-(--text-primary)">
                  {curso.reservas}
                </p>
                <p className="text-xs text-(--text-muted)">relaciones</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}