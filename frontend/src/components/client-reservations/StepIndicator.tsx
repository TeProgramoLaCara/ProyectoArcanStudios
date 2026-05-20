type StepIndicatorProps = {
  step: number;
  isDark: boolean;
};

export function StepIndicator({ step, isDark }: StepIndicatorProps) {
  const steps = ["Curso", "Fechas", "Resumen"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((label, index) => {
        const current = index + 1;
        const active = current <= step;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                active
                  ? "border-[#267F6B] bg-[#267F6B] text-white"
                  : isDark
                    ? "border-white/10 bg-white/[0.03] text-white/45"
                    : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              {current}
            </span>
            <span className={`hidden text-sm font-semibold sm:inline ${active ? (isDark ? "text-white" : "text-slate-950") : isDark ? "text-white/45" : "text-slate-500"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
