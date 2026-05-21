'use client';

type Props = {
  label: string;
  value: number | string;
  icon: string;
  accent?: boolean;
};

export default function MetricCard({ label, value, icon, accent }: Props) {
  return (
    <div className={`flex flex-col gap-3 rounded-[22px] border p-5 shadow-sm ${
      accent
        ? 'border-[#267F6B]/30 bg-[#267F6B]/8'
        : 'border-(--border) bg-surface'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--border) bg-surface-elevated text-base">
          {icon}
        </span>
      </div>
      <span className={`text-3xl font-bold ${accent ? 'text-[#2fa58a]' : 'text-(--text-primary)'}`}>
        {value}
      </span>
    </div>
  );
}
