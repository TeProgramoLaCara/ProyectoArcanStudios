import { hexToRgba } from './dashboard.utils';

type DashboardMetricCardProps = {
  label: string;
  value: number | string;
  helper: string;
  icon: string;
  tone: string;
  accent?: boolean;
};

export default function DashboardMetricCard({
  label,
  value,
  helper,
  icon,
  tone,
  accent = false,
}: DashboardMetricCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-(--border) bg-surface p-5 shadow-sm ${
        accent ? 'translate-y-[-1px]' : ''
      }`}
      style={{
        boxShadow: `0 18px 40px -32px ${hexToRgba(tone, 0.65)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(
            tone,
            0.12
          )} 0%, transparent 70%)`,
        }}
      />

      <div
        className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full border"
        style={{
          backgroundColor: hexToRgba(tone, 0.12),
          borderColor: hexToRgba(tone, 0.22),
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-5 bottom-0 h-1 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${tone} 0%, ${hexToRgba(
            tone,
            0.28
          )} 45%, transparent 100%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tone }}
            />
            <p className="text-sm text-(--text-secondary)">{label}</p>
          </div>

          <h3 className="mt-3 text-3xl font-semibold text-(--text-primary)">
            {value}
          </h3>
          <p className="mt-2 text-sm text-(--text-muted)">{helper}</p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl border text-lg"
          style={{
            backgroundColor: hexToRgba(tone, 0.12),
            borderColor: hexToRgba(tone, 0.22),
            color: tone,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}