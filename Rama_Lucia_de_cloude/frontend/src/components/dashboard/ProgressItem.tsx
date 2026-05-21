type ProgressItemProps = {
  label: string;
  value: number;
  total: number;
  icon: string;
  barColor: string;
};

export default function ProgressItem({
  label,
  value,
  total,
  icon,
  barColor,
}: ProgressItemProps) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--border-subtle) p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${barColor} 0%, transparent 100%)`,
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-(--text-primary)">
            {icon} {label}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-(--text-muted)">
            {percent}% del total
          </p>
        </div>

        <span className="text-lg font-semibold text-(--text-primary)">
          {value}
        </span>
      </div>

      <div className="mt-3 h-2 rounded-full bg-background">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${percent}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}