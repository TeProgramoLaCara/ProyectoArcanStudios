type Props = {
  label: string;
  value: number | string;
  icon: string;
  accent?: boolean;
};

export default function MetricCard({ label, value, icon, accent }: Props) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[22px] border p-5 ${
        accent
          ? "border-[#267F6B]/30 bg-[#267F6B]/10" // TODO: migrate to COLORS.accent
          : "border-white/10 bg-[#0d0d0d]" // TODO: migrate to COLORS.surface
      } shadow-[0_8px_30px_rgba(0,0,0,0.2)]`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base">
          {icon}
        </span>
      </div>
      <span
        className={`text-3xl font-bold ${
          accent ? "text-[#2fa58a]" : "text-white" // TODO: migrate to COLORS.accentLight
        }`}
      >
        {value}
      </span>
    </div>
  );
}