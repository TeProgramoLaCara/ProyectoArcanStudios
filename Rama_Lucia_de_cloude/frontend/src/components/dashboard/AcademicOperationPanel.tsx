import type { DashboardViewModel } from './dashboard.mapper';
import { hexToRgba } from './dashboard.utils';
import ProgressItem from './ProgressItem';

type AcademicOperationPanelProps = {
  viewModel: DashboardViewModel;
};

export default function AcademicOperationPanel({
  viewModel,
}: AcademicOperationPanelProps) {
  const {
    totals,
    turnoLoad,
    aulaLoad,
    maxAulaLoad,
  } = viewModel;

  return (
    <div className="flex h-[520px] flex-col gap-5 overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[560px] ">
      <div>
        <h2 className="text-lg font-semibold text-(--text-primary)">
          Operación académica
        </h2>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-2 hide-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#267F6B]/15 bg-[#267F6B]/8 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
              Tasa de cierre
            </p>
            <p className="mt-2 text-2xl font-semibold text-(--text-primary)">
              {totals.tasaCierre}%
            </p>
          </div>

          <div className="rounded-2xl border border-[#2fa58a]/15 bg-[#2fa58a]/8 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
              Aulas registradas
            </p>
            <p className="mt-2 text-2xl font-semibold text-(--text-primary)">
              {totals.totalAulas}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <ProgressItem
            label="Pendientes"
            value={totals.pendientes}
            total={totals.totalReservas}
            icon="⏳"
            barColor="#f59e0b"
          />
          <ProgressItem
            label="Confirmadas"
            value={totals.confirmadas}
            total={totals.totalReservas}
            icon="✅"
            barColor="#267F6B"
          />
          <ProgressItem
            label="En curso"
            value={totals.enCurso}
            total={totals.totalReservas}
            icon="▶️"
            barColor="#2fa58a"
          />
          <ProgressItem
            label="Completadas"
            value={totals.completadas}
            total={totals.totalReservas}
            icon="🏁"
            barColor="#8b5cf6"
          />
          <ProgressItem
            label="Canceladas"
            value={totals.canceladas}
            total={totals.totalReservas}
            icon="✕"
            barColor="#ef4444"
          />
        </div>

        <div className="h-px rounded-full bg-linear-to-r from-transparent via-[#2fa58a]/45 to-transparent" />

        <div className="grid grid-cols-2 gap-3">
          {turnoLoad.map((turno) => (
            <div
              key={turno.label}
              className="rounded-2xl border p-4"
              style={{
                borderColor: hexToRgba(turno.color, 0.18),
                backgroundColor: hexToRgba(turno.color, 0.08),
              }}
            >
              <p className="text-sm font-medium text-(--text-primary)">
                {turno.icon} {turno.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-(--text-primary)">
                {turno.value}
              </p>
              <p className="mt-1 text-xs text-(--text-muted)">
                sesiones detectadas
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-(--text-primary)">
              Uso por aula
            </h3>
          </div>

          {aulaLoad.map((aula) => {
            const width = Math.max(
              8,
              Math.round((aula.value / maxAulaLoad) * 100)
            );

            return (
              <div
                key={aula.label}
                className="rounded-2xl border p-4"
                style={{
                  borderColor: hexToRgba(aula.color, 0.18),
                  backgroundColor: hexToRgba(aula.color, 0.08),
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-(--text-primary)">
                    {aula.label}
                  </span>
                  <span className="text-sm text-(--text-secondary)">
                    {aula.value} sesiones
                  </span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-background">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${width}%`,
                      backgroundColor: aula.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}