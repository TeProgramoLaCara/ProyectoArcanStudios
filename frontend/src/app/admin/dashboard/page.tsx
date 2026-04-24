'use client';

import { allEvents, allReservas, capacitaciones, cursos, empresas } from '@/resources/data';

type DashboardMetricCardProps = {
  label: string;
  value: number | string;
  helper: string;
  icon: string;
  tone: string;
  accent?: boolean;
};

type ProgressItemProps = {
  label: string;
  value: number;
  total: number;
  icon: string;
  barColor: string;
};

const MONTH_INDEX: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

const METRIC_TONES = ['#267F6B', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#2fa58a'];

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function DashboardMetricCard({
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
          background: `linear-gradient(180deg, ${hexToRgba(tone, 0.12)} 0%, transparent 70%)`,
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
          background: `linear-gradient(90deg, ${tone} 0%, ${hexToRgba(tone, 0.28)} 45%, transparent 100%)`,
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

          <h3 className="mt-3 text-3xl font-semibold text-(--text-primary)">{value}</h3>
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

function ProgressItem({ label, value, total, icon, barColor }: ProgressItemProps) {
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

        <span className="text-lg font-semibold text-(--text-primary)">{value}</span>
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

function parseReservaDate(raw: string) {
  const [day, month, year] = raw.toLowerCase().split(' ');
  return new Date(Number(year), MONTH_INDEX[month] ?? 0, Number(day));
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Pendiente':
      return '⏳';
    case 'Confirmada':
      return '✅';
    case 'En curso':
      return '▶️';
    case 'Completada':
      return '🏁';
    case 'Cancelada':
      return '✕';
    default:
      return '•';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Pendiente':
      return '#f59e0b';
    case 'Confirmada':
      return '#267F6B';
    case 'En curso':
      return '#2fa58a';
    case 'Completada':
      return '#8b5cf6';
    case 'Cancelada':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
}

export default function Page() {
  const pendientes = allReservas.filter((r) => r.status === 'Pendiente').length;
  const confirmadas = allReservas.filter((r) => r.status === 'Confirmada').length;
  const enCurso = allReservas.filter((r) => r.status === 'En curso').length;
  const completadas = allReservas.filter((r) => r.status === 'Completada').length;
  const canceladas = allReservas.filter((r) => r.status === 'Cancelada').length;

  const totalReservas = allReservas.length;
  const reservasAbiertas = pendientes + confirmadas + enCurso;
  const empresasActivas = new Set([
    ...allReservas.map((r) => r.company),
    ...allEvents.map((e) => e.companyName),
  ]).size;
  const usuariosRegistrados = empresas.reduce((acc, empresa) => acc + empresa.usuarios.length, 0);
  const docentesActivos = new Set(allEvents.map((e) => e.professorId)).size;
  const aulasUtilizadas = new Set(allEvents.map((e) => e.aula)).size;

  const tasaGestion =
    totalReservas > 0
      ? Math.round(((confirmadas + enCurso + completadas) / totalReservas) * 100)
      : 0;

  const tasaCierre =
    totalReservas > 0 ? Math.round((completadas / totalReservas) * 100) : 0;

  const promedioUsuariosPorEmpresa =
    empresas.length > 0 ? (usuariosRegistrados / empresas.length).toFixed(1) : '0.0';

  const recentReservas = [...allReservas]
    .sort((a, b) => parseReservaDate(b.fecha).getTime() - parseReservaDate(a.fecha).getTime())
    .slice(0, 8);

  const courseDemand = cursos
    .map((curso) => ({
      id: curso.id,
      title: curso.title,
      category: curso.category,
      reservas: allReservas.filter((r) => r.curso === curso.title).length,
      modulos: curso.capacitaciones.length,
    }))
    .sort((a, b) => b.reservas - a.reservas || a.title.localeCompare(b.title));

  const companySummary = empresas
    .map((empresa) => ({
      id: empresa.id,
      name: empresa.name,
      usuarios: empresa.usuarios.length,
      reservas: allReservas.filter((r) => r.company === empresa.name).length,
      agenda: allEvents.filter((e) => e.companyName === empresa.name).length,
    }))
    .sort((a, b) => b.usuarios - a.usuarios || b.reservas - a.reservas);

  const professorLoadMap = new Map<
    string,
    {
      name: string;
      bloques: number;
      empresas: Set<string>;
      aulas: Set<string>;
    }
  >();

  allEvents.forEach((event) => {
    const current = professorLoadMap.get(event.professorId) ?? {
      name: event.professorName,
      bloques: 0,
      empresas: new Set<string>(),
      aulas: new Set<string>(),
    };

    current.bloques += 1;
    current.empresas.add(event.companyName);
    current.aulas.add(event.aula);

    professorLoadMap.set(event.professorId, current);
  });

  const professorLoad = Array.from(professorLoadMap.values())
    .map((item) => ({
      name: item.name,
      bloques: item.bloques,
      empresas: item.empresas.size,
      aulas: item.aulas.size,
    }))
    .sort((a, b) => b.bloques - a.bloques);

  const turnoLoad = [
    {
      label: 'Mañana',
      value: allEvents.filter((e) => e.turno === 'manana').length,
      icon: '☀️',
      color: '#f59e0b',
    },
    {
      label: 'Tarde',
      value: allEvents.filter((e) => e.turno === 'tarde').length,
      icon: '🌙',
      color: '#267F6B',
    },
  ];

  const aulaLoad = [
    { label: 'Aula 1', value: allEvents.filter((e) => e.aula === 'aula1').length, color: '#267F6B' },
    { label: 'Aula 2', value: allEvents.filter((e) => e.aula === 'aula2').length, color: '#2fa58a' },
    { label: 'Aula 3', value: allEvents.filter((e) => e.aula === 'aula3').length, color: '#8b5cf6' },
  ];

  const maxAulaLoad = Math.max(...aulaLoad.map((item) => item.value), 1);

  return (
    <section className="bg-background p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">
        <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(38,127,107,0.10) 0%, rgba(47,165,138,0.08) 32%, transparent 68%)',
            }}
          />
          <div className="pointer-events-none absolute left-6 top-0 h-1 w-36 rounded-b-full bg-linear-to-r from-[#267F6B] to-[#2fa58a]" />
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border"
            style={{
              backgroundColor: 'rgba(47,165,138,0.10)',
              borderColor: 'rgba(47,165,138,0.18)',
            }}
          />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[#267F6B]/0 via-[#2fa58a]/70 to-[#267F6B]/0" />

          <div className="relative grid gap-6 xl:grid-cols-[1.35fr_.95fr]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                
              </div>

              <h1 className="mt-4 text-3xl font-bold text-(--text-primary)">Dashboard</h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-(--text-secondary)">
                Control central de reservas, catálogo formativo, personal docente y actividad de
                empresas cliente. Diseñado para tener una lectura rápida, útil y accionable desde la
                dirección de la academia.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-[#267F6B]/15 bg-[#267F6B]/8 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                    Oferta activa
                  </p>
                  <p className="mt-1 text-sm text-(--text-primary)">
                    {cursos.length} cursos · {capacitaciones.length} capacitaciones
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2fa58a]/15 bg-[#2fa58a]/8 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                    Capacidad operativa
                  </p>
                  <p className="mt-1 text-sm text-(--text-primary)">
                    {aulasUtilizadas}/3 aulas en uso · {docentesActivos} docentes con agenda
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
                  {reservasAbiertas}
                </p>
                <p className="mt-1 text-sm text-(--text-secondary)">
                  {pendientes} pendientes de revisión
                </p>
              </div>

              <div className="rounded-2xl border border-[#2fa58a]/15 bg-background p-4">
                <div className="h-1 w-16 rounded-full bg-linear-to-r from-[#2fa58a] to-[#267F6B]" />
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                  Conversión operativa
                </p>
                <p className="mt-3 text-2xl font-semibold text-(--text-primary)">{tasaGestion}%</p>
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
                      {usuariosRegistrados} usuarios
                    </p>
                    <p className="mt-1 text-sm text-(--text-secondary)">
                      distribuidos en {empresas.length} empresas
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#2fa58a]/15 bg-[#2fa58a]/8 px-3 py-2 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                      Media
                    </p>
                    <p className="mt-1 text-sm font-medium text-(--text-primary)">
                      {promedioUsuariosPorEmpresa} por empresa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
          <DashboardMetricCard
            label="Total reservas"
            value={totalReservas}
            helper="Vista completa del embudo comercial"
            icon="📋"
            tone={METRIC_TONES[0]}
            accent
          />
          <DashboardMetricCard
            label="Pendientes"
            value={pendientes}
            helper="Reservas esperando gestión"
            icon="⏳"
            tone={METRIC_TONES[1]}
          />
          <DashboardMetricCard
            label="Cursos publicados"
            value={cursos.length}
            helper={`${capacitaciones.length} módulos asociados`}
            icon="🎓"
            tone={METRIC_TONES[2]}
          />
          <DashboardMetricCard
            label="Empresas activas"
            value={empresasActivas}
            helper="Clientes con actividad o agenda"
            icon="🏢"
            tone={METRIC_TONES[3]}
          />
          <DashboardMetricCard
            label="Usuarios registrados"
            value={usuariosRegistrados}
            helper="Contactos operativos en plataforma"
            icon="👥"
            tone={METRIC_TONES[4]}
          />
          <DashboardMetricCard
            label="Docentes con agenda"
            value={docentesActivos}
            helper={`${allEvents.length} bloques formativos programados`}
            icon="🧑‍🏫"
            tone={METRIC_TONES[5]}
          />
        </div>

        <div className="h-px rounded-full bg-linear-to-r from-transparent via-[#267F6B]/45 to-transparent" />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
          <div className="flex h-[520px] flex-col gap-5 overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[560px]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-(--text-primary)">Últimas reservas</h2>
                <p className="mt-0.5 text-sm text-(--text-muted)">
                  Movimiento reciente del área comercial y académica
                </p>
              </div>

              <div className="rounded-full border border-[#267F6B]/15 bg-[#267F6B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--text-secondary)">
                {recentReservas.length} registros visibles
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-2">
              <div className="sticky top-0 z-10 grid grid-cols-[1fr_1fr_1.55fr_130px_100px] gap-4 bg-surface px-5 pb-3">
                {['Cliente', 'Empresa', 'Curso', 'Estado', 'Fecha'].map((col) => (
                  <span
                    key={col}
                    className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)"
                  >
                    {col}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {recentReservas.map((reserva) => {
                  const statusColor = getStatusColor(reserva.status);

                  return (
                    <div
                      key={reserva.id}
                      className="grid grid-cols-[1fr_1fr_1.55fr_130px_100px] items-center gap-4 rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-(--text-primary)">
                          {reserva.clientName}
                        </p>
                        <p className="mt-1 text-xs text-(--text-muted)">
                          {reserva.capacitaciones.length} capacitaciones
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm text-(--text-secondary)">{reserva.company}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-(--text-primary)">
                          {reserva.curso}
                        </p>
                        <p className="mt-1 truncate text-xs text-(--text-muted)">
                          {reserva.capacitaciones.join(' · ')}
                        </p>
                      </div>

                      <div>
                        <span
                          className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold"
                          style={{
                            borderColor: hexToRgba(statusColor, 0.24),
                            backgroundColor: hexToRgba(statusColor, 0.12),
                            color: statusColor,
                          }}
                        >
                          {getStatusIcon(reserva.status)} {reserva.status}
                        </span>
                      </div>

                      <span className="text-sm text-(--text-secondary)">{reserva.fecha}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex h-[520px] flex-col gap-5 overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[560px]">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">Operación académica</h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                Estado del pipeline, uso de turnos y distribución de aulas
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#267F6B]/15 bg-[#267F6B]/8 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                    Tasa de cierre
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-(--text-primary)">{tasaCierre}%</p>
                </div>

                <div className="rounded-2xl border border-[#2fa58a]/15 bg-[#2fa58a]/8 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                    Uso de aulas
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-(--text-primary)">
                    {aulasUtilizadas}/3
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <ProgressItem
                  label="Pendientes"
                  value={pendientes}
                  total={totalReservas}
                  icon="⏳"
                  barColor="#f59e0b"
                />
                <ProgressItem
                  label="Confirmadas"
                  value={confirmadas}
                  total={totalReservas}
                  icon="✅"
                  barColor="#267F6B"
                />
                <ProgressItem
                  label="En curso"
                  value={enCurso}
                  total={totalReservas}
                  icon="▶️"
                  barColor="#2fa58a"
                />
                <ProgressItem
                  label="Completadas"
                  value={completadas}
                  total={totalReservas}
                  icon="🏁"
                  barColor="#8b5cf6"
                />
                <ProgressItem
                  label="Canceladas"
                  value={canceladas}
                  total={totalReservas}
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
                    <p className="mt-1 text-xs text-(--text-muted)">bloques programados</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-(--text-primary)">Uso por aula</h3>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    Distribución actual de bloques formativos
                  </p>
                </div>

                {aulaLoad.map((aula) => {
                  const width = Math.max(20, Math.round((aula.value / maxAulaLoad) * 100));

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
                        <span className="text-sm font-medium text-(--text-primary)">{aula.label}</span>
                        <span className="text-sm text-(--text-secondary)">{aula.value} bloques</span>
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
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="flex h-[360px] flex-col overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[400px]">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">Cursos con más demanda</h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                Prioridad comercial según reservas actuales
              </p>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {courseDemand.map((curso, index) => (
                  <div
                    key={curso.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                        #{index + 1} · {curso.category}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-(--text-primary)">
                        {curso.title}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-(--text-primary)">{curso.reservas}</p>
                      <p className="text-xs text-(--text-muted)">{curso.modulos} módulos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex h-[360px] flex-col overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[400px]">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">Empresas y usuarios</h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                Peso de cada cliente en la plataforma
              </p>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {companySummary.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-(--text-primary)">{empresa.name}</p>
                        <p className="mt-1 text-xs text-(--text-muted)">
                          {empresa.usuarios} usuarios registrados
                        </p>
                      </div>

                      <div className="rounded-full border border-[#267F6B]/15 bg-[#267F6B]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-(--text-secondary)">
                        {empresa.reservas} reservas
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-(--text-secondary)">
                      <span>Agenda asignada</span>
                      <span>{empresa.agenda} bloques</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex h-[360px] flex-col overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm md:h-[400px]">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">Equipo docente</h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                Carga académica y cobertura por profesor
              </p>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {professorLoad.map((profesor) => (
                  <div
                    key={profesor.name}
                    className="rounded-2xl border border-(--border-subtle) bg-(--border-subtle) px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-(--text-primary)">{profesor.name}</p>
                        <p className="mt-1 text-xs text-(--text-muted)">
                          {profesor.empresas} empresas · {profesor.aulas} aulas
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-(--text-primary)">
                          {profesor.bloques}
                        </p>
                        <p className="text-xs text-(--text-muted)">bloques</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}