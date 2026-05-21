import type { DashboardViewModel } from './dashboard.mapper';

type DashboardHeroProps = {
  totals: DashboardViewModel['totals'];
};

export default function DashboardHero({ totals }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(38,127,107,0.10) 0%, rgba(47,165,138,0.08) 32%, transparent 68%)',
        }}
      />

      <div className="pointer-events-none absolute left-6 top-0 h-1 w-36 rounded-b-full bg-linear-to-r from-[#267F6B] to-[#2fa58a]" />

      <div className="relative grid gap-6 xl:grid-cols-[1.35fr_.95fr]">
        <div className="min-w-0">
          <h1 className="mt-4 text-3xl font-bold text-(--text-primary)">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-(--text-secondary)">
            Control central de reservas, catálogo formativo, personal docente y
            actividad de empresas cliente.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-[#267F6B]/15 bg-[#267F6B]/8 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                Oferta activa
              </p>
              <p className="mt-1 text-sm text-(--text-primary)">
                {totals.totalCursos} cursos · {totals.totalCapacitaciones}{' '}
                capacitaciones
              </p>
            </div>

            <div className="rounded-2xl border border-[#2fa58a]/15 bg-[#2fa58a]/8 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                Capacidad operativa
              </p>
              <p className="mt-1 text-sm text-(--text-primary)">
                {totals.totalAulas} aulas · {totals.totalProfesores} docentes
                registrados
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#267F6B]/15 bg-background p-4">
            <div className="h-1 w-16 rounded-full bg-linear-to-r from-[#267F6B] to-[#2fa58a]" />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
              Reservas abiertas
            </p>
            <p className="mt-3 text-2xl font-semibold text-(--text-primary)">
              {totals.reservasAbiertas}
            </p>
            <p className="mt-1 text-sm text-(--text-secondary)">
              {totals.pendientes} pendientes de revisión
            </p>
          </div>

          <div className="rounded-2xl border border-[#2fa58a]/15 bg-background p-4">
            <div className="h-1 w-16 rounded-full bg-linear-to-r from-[#2fa58a] to-[#267F6B]" />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
              Conversión operativa
            </p>
            <p className="mt-3 text-2xl font-semibold text-(--text-primary)">
              {totals.tasaGestion}%
            </p>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Confirmadas, en curso o cerradas
            </p>
          </div>

          <div className="rounded-2xl border border-[#267F6B]/15 bg-background p-4 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
              Base de clientes
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-(--text-primary)">
                  {totals.totalUsuarios} usuarios
                </p>
                <p className="mt-1 text-sm text-(--text-secondary)">
                  distribuidos en {totals.totalEmpresas} empresas
                </p>
              </div>

              <div className="rounded-2xl border border-[#2fa58a]/15 bg-[#2fa58a]/8 px-3 py-2 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                  Media
                </p>
                <p className="mt-1 text-sm font-medium text-(--text-primary)">
                  {totals.promedioUsuariosPorEmpresa} por empresa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}