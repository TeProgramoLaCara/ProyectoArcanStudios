import type { ReservaStatus } from "@/resources/data";

// Re-exportado para compatibilidad con importaciones existentes
export type { ReservaStatus };

const STATUS_STYLES: Record<ReservaStatus, string> = {
  Pendiente:  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  Confirmada: "border-[#267F6B]/40 bg-[#267F6B]/10 text-[#2fa58a]", // TODO: migrate to COLORS.accent, COLORS.accentLight
  "En curso": "border-sky-500/30 bg-sky-500/10 text-sky-400",
  Completada: "border-white/10 bg-white/5 text-white/50",
  Cancelada:  "border-red-500/30 bg-red-500/10 text-red-400",
};

export default function ReservaBadge({ status }: { status: ReservaStatus }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}



