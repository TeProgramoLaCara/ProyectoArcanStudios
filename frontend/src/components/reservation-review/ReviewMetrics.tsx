import type { Reserva } from "@/resources/data";

export function ReviewMetrics({ reservas }: { reservas: Reserva[] }) {
  const pending = reservas.filter((reserva) => reserva.status === "Pendiente").length;
  const confirmed = reservas.filter((reserva) => reserva.status === "Confirmada").length;
  const assigned = reservas.filter((reserva) => (reserva.assignments ?? []).length > 0).length;
  const messages = reservas.reduce((total, reserva) => total + (reserva.communications ?? []).length, 0);

  const items = [
    { label: "Pendientes de revisión", value: pending, color: "text-amber-200", bg: "bg-amber-500/10" },
    { label: "Confirmadas", value: confirmed, color: "text-emerald-200", bg: "bg-emerald-500/10" },
    { label: "Con profes asignados", value: assigned, color: "text-sky-200", bg: "bg-sky-500/10" },
    { label: "Comunicaciones", value: messages, color: "text-violet-200", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={`rounded-2xl border border-(--border) ${item.bg} p-4`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)">{item.label}</p>
          <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
