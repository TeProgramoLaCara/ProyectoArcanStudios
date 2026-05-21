import DashboardMetricCard from './DashboardMetricCard';
import type { DashboardViewModel } from './dashboard.mapper';

type DashboardMetricsGridProps = {
  metrics: DashboardViewModel['metrics'];
};

export default function DashboardMetricsGrid({
  metrics,
}: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => (
        <DashboardMetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          helper={metric.helper}
          icon={metric.icon}
          tone={metric.tone}
          accent={metric.accent}
        />
      ))}
    </div>
  );
}