import { type ComponentType, type SVGProps } from "react";

type StatCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
  detail: string;
  tone: "emerald" | "amber" | "sky";
  isDark: boolean;
};

export function StatCard({ icon: Icon, label, value, detail, tone, isDark }: StatCardProps) {
  const toneClass = {
    emerald: isDark ? "bg-emerald-400/12 text-emerald-200" : "bg-emerald-50 text-emerald-700",
    amber: isDark ? "bg-amber-400/12 text-amber-200" : "bg-amber-50 text-amber-700",
    sky: isDark ? "bg-sky-400/12 text-sky-200" : "bg-sky-50 text-sky-700",
  }[tone];

  return (
    <article
      className={`rounded-2xl border p-4 ${
        isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className={`mt-3 text-sm ${isDark ? "text-white/55" : "text-slate-600"}`}>{detail}</p>
    </article>
  );
}
