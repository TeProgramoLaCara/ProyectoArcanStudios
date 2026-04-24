'use client';

import CategoryBadge from './CategoryBadge';
import type { Capacitacion, Curso } from '@/resources/data';

export type { Capacitacion, Curso };

type Props = {
  course: Curso;
  capacitaciones: Capacitacion[];
  onEdit?: () => void;
  onRemove?: () => void;
};

<<<<<<< HEAD
export default function CourseCard({ course, capacitaciones, onEdit, onRemove }: Props) {
  const { isDark } = useTheme();
=======
export default function CourseCard({ course, capacitaciones }: Props) {
>>>>>>> 091f9e1006d61a297c02083a28a6b8cfdab471ca
  const caps = course.capacitaciones.map((id) => capacitaciones.find((c) => c.id === id)!);

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-(--border) bg-surface p-2 shadow-sm transition hover:border-[#267F6B]/30">

      {/* Header row: icon · title + description · badge */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border) bg-surface-elevated text-lg">
          🎮
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-base font-semibold text-(--text-primary)">{course.title}</h3>
          <p className="text-sm leading-relaxed text-(--text-secondary)">{course.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <CategoryBadge category={course.category} />
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  : 'border-black/[0.08] bg-black/[0.04] text-[#475569] hover:text-[#0f172a]'
              }`}
              title="Editar curso"
              aria-label="Editar curso"
            >
              ✎
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition ${
                isDark
                  ? 'border-rose-300/35 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30'
                  : 'border-rose-300/50 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20'
              }`}
              title="Eliminar de mis cursos"
              aria-label="Eliminar de mis cursos"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-(--border-subtle)" />

      {/* Capacitaciones incluidas */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#267F6B]/80">
          Capacitaciones incluidas
        </span>
        <div className="flex flex-col gap-2">
          {caps.map((cap, i) => (
            <div key={cap.id} className="flex items-center gap-2.5 rounded-xl border border-(--border-subtle) bg-(--border-subtle) px-3 py-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#267F6B]/70 bg-[#267F6B]/10 text-[10px] font-bold text-[#2fa58a]">
                {i + 1}
              </span>
              <span className="text-sm text-(--text-secondary)">{cap.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
