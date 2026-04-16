'use client';

import { useTheme } from '@/context/ThemeContext';

function DashboardCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-2xl border p-5 ${
      isDark
        ? 'border-white/10 bg-[#0d0d0d] text-white shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
        : 'border-black/[0.08] bg-[#f1f5f9] text-[#0f172a] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
    }`}>
      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-[#475569]'}`}>{title}</p>
      <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
      <p className={`mt-2 text-sm ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`}>{subtitle}</p>
    </div>
  );
}

export default function Page() {
  const { isDark } = useTheme();

  const cardClass = `rounded-2xl border p-5 ${
    isDark
      ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
      : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
  }`;

  const itemClass = `rounded-xl border px-4 py-3 text-sm ${
    isDark
      ? 'border-white/[0.06] bg-[#111111] text-white/75'
      : 'border-black/[0.05] bg-[#e2e8f0] text-[#475569]'
  }`;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Dashboard</h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-white/50' : 'text-[#475569]'}`}>
          Vista general de reservas, cursos y actividad.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <DashboardCard title="Reservas activas" value="128" subtitle="12 nuevas esta semana" />
        <DashboardCard title="Cursos publicados" value="24" subtitle="3 pendientes de revisión" />
        <DashboardCard title="Profes registrados" value="18" subtitle="2 incorporaciones recientes" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={`${cardClass} xl:col-span-2`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Actividad reciente</h2>
          <div className="mt-5 space-y-3">
            {[
              'Nueva reserva creada para Curso de Photoshop',
              'El profesor Laura Pérez actualizó su disponibilidad',
              'Se añadió un nuevo cliente: Nova Empresa',
              'Se confirmó una reserva para UX Fundamentals',
            ].map((item) => (
              <div key={item} className={itemClass}>{item}</div>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Próximos cursos</h2>
          <div className="mt-5 space-y-3">
            {[
              'React Essentials - 12 Mar',
              'Figma for Teams - 14 Mar',
              'Marketing Automation - 15 Mar',
            ].map((item) => (
              <div key={item} className={itemClass}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={`min-h-90 rounded-2xl border p-5 ${
        isDark
          ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
          : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
      }`}>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Panel principal</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-white/45' : 'text-[#475569]'}`}>
          Aquí puedes colocar una tabla de reservas, un calendario o estadísticas.
        </p>
        <div className={`mt-6 flex h-65 items-center justify-center rounded-2xl border border-dashed text-sm ${
          isDark
            ? 'border-white/[0.06] bg-[#0a0a0a] text-white/20'
            : 'border-black/[0.05] bg-[#e2e8f0] text-[#94a3b8]'
        }`}>
          Espacio para tabla, gráfico o calendario
        </div>
      </div>
    </section>
  );
}
