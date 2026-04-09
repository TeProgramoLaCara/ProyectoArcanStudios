import CategoryBadge from "./CategoryBadge";
import type { Capacitacion } from "./CourseCard";

type Props = {
  cap: Capacitacion;
};

export default function CapacitacionCard({ cap }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition hover:border-[#267F6B]/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
          📦
        </div>
        <CategoryBadge category={cap.category} />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-white">{cap.title}</h3>
        <p className="text-sm leading-relaxed text-white/45">{cap.description}</p>
      </div>
    </div>
  );
}