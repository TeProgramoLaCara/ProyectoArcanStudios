'use client';

import CategoryBadge from './CategoryBadge';
import type { Capacitacion } from '@/resources/data';

type Props = {
  cap: Capacitacion;
};

export default function CapacitacionCard({ cap }: Props) {
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
        <CategoryBadge category={cap.category} />
      </div>
    </div>
  );
}
