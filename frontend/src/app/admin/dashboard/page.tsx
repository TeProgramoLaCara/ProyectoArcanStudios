function DashboardCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 text-white shadow-sm">
      <p className="text-sm text-white/50">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
      <p className="mt-2 text-sm text-white/40">{subtitle}</p>
    </div>
  );
}

export default function Page() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-white/50">
          Vista general de reservas, cursos y actividad.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <DashboardCard
          title="Reservas activas"
          value="128"
          subtitle="12 nuevas esta semana"
        />
        <DashboardCard
          title="Cursos publicados"
          value="24"
          subtitle="3 pendientes de revisión"
        />
        <DashboardCard
          title="Profes registrados"
          value="18"
          subtitle="2 incorporaciones recientes"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">Actividad reciente</h2>
          <div className="mt-5 space-y-3">
            {[
              "Nueva reserva creada para Curso de Photoshop",
              "El profesor Laura Pérez actualizó su disponibilidad",
              "Se añadió un nuevo cliente: Nova Empresa",
              "Se confirmó una reserva para UX Fundamentals",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/75"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <h2 className="text-lg font-semibold text-white">Próximos cursos</h2>
          <div className="mt-5 space-y-3">
            {[
              "React Essentials - 12 Mar",
              "Figma for Teams - 14 Mar",
              "Marketing Automation - 15 Mar",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/75"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[360px] rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h2 className="text-lg font-semibold text-white">Panel principal</h2>
        <p className="mt-2 text-sm text-white/45">
          Aquí puedes colocar una tabla de reservas, un calendario o estadísticas.
        </p>

        <div className="mt-6 flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-sm text-white/30">
          Espacio para tabla, gráfico o calendario
        </div>
      </div>
    </section>
  );
}