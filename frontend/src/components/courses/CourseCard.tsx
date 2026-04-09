import CategoryBadge from "./CategoryBadge";

export type Capacitacion = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type Curso = {
  id: string;
  title: string;
  description: string;
  category: string;
  capacitaciones: string[];
};

type Props = {
  course: Curso;
  capacitaciones: Capacitacion[];
};

export default function CourseCard({ course, capacitaciones }: Props) {
  const caps = course.capacitaciones.map(
    (id) => capacitaciones.find((c) => c.id === id)!
  );

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#0d0d0d] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition hover:border-[#267F6B]/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
          🎮
        </div>
        <CategoryBadge category={course.category} />
      </div>

      <div className="flex flex-col gap-1.5 ">
        <h3 className="text-base font-semibold text-white">{course.title}</h3>
        <p className="text-s leading-relaxed text-white/45 h-25">{course.description}</p>
      </div>

      <div className="h-px bg-white/[0.06]" />

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#267F6B]">
          Capacitaciones incluidas
        </span>
        <div className="flex flex-col gap-2">
          {caps.map((cap, i) => (
            <div
              key={cap.id}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#267F6B]/70 bg-[#267F6B]/10 text-[10px] font-bold text-[#2fa58a]">
                {i + 1}
              </span>
              <span className="text-sm text-white/75">{cap.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}