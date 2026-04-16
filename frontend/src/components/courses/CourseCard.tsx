'use client';

import { useTheme } from '@/context/ThemeContext';
import CategoryBadge from './CategoryBadge';
import type { Capacitacion, Curso } from '@/resources/data';

// Re-exportados para compatibilidad con importaciones existentes
export type { Capacitacion, Curso };

type Props = {
  course: Curso;
  capacitaciones: Capacitacion[];
};

export default function CourseCard({ course, capacitaciones }: Props) {
  const { isDark } = useTheme();
  const caps = course.capacitaciones.map((id) => capacitaciones.find((c) => c.id === id)!);

  return (
    <div className={`flex flex-col gap-4 rounded-[24px] border p-2 transition ${
      isDark
        ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-[#267F6B]/30'
        : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)] hover:border-[#267F6B]/40'
    }`}>

      {/* Header row: icon · title + description · badge */}
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg ${
          isDark ? 'border-white/10 bg-white/5' : 'border-black/[0.08] bg-black/[0.04]'
        }`}>
          🎮
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{course.title}</h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-white/45' : 'text-[#475569]'}`}>{course.description}</p>
        </div>
        <CategoryBadge category={course.category} />
      </div>

      <div className={`h-px ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]'}`} />

      {/* Capacitaciones incluidas */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#267F6B]/80">
          Capacitaciones incluidas
        </span>
        <div className="flex flex-col gap-2">
          {caps.map((cap, i) => (
            <div
              key={cap.id}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${
                isDark ? 'border-white/[0.07] bg-white/[0.03]' : 'border-black/[0.06] bg-black/[0.02]'
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#267F6B]/70 bg-[#267F6B]/10 text-[10px] font-bold text-[#2fa58a]">
                {i + 1}
              </span>
              <span className={`text-sm ${isDark ? 'text-white/75' : 'text-[#475569]'}`}>{cap.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
