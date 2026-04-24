'use client';

import { useTheme } from '@/context/ThemeContext';
import CategoryBadge from './CategoryBadge';
import type { Capacitacion } from '@/resources/data';

type Props = {
  cap: Capacitacion;
  onEdit?: () => void;
  onRemove?: () => void;
};

export default function CapacitacionCard({ cap, onEdit, onRemove }: Props) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-surface p-5 shadow-sm transition hover:border-[#267F6B]/30">

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border) bg-surface-elevated text-lg">
          📦
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-base font-semibold text-(--text-primary)">{cap.title}</h3>
          <p className="text-sm leading-relaxed text-(--text-secondary)">{cap.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <CategoryBadge category={cap.category} />
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  : 'border-black/[0.08] bg-black/[0.04] text-[#475569] hover:text-[#0f172a]'
              }`}
              title="Editar capacitación"
              aria-label="Editar capacitación"
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
              title="Eliminar de mis capacitaciones"
              aria-label="Eliminar de mis capacitaciones"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
