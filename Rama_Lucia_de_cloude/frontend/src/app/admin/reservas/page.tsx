"use client";

import { useEffect, useMemo, useState } from "react";
import MetricCard from "@/components/reservations/MetriCard";
import ReservaFilters from "@/components/reservations/ReservaFilters";
import ReservaRow from "@/components/reservations/ReservaRow";
import type { Reserva as ReservaUI, ReservaStatus } from "@/resources/data";
import {
  changeEstado,
  ESTADO_LABEL,
  formatFecha,
  listReservas,
  uniqueCapacitaciones,
  type ApiReserva,
  type ReservaEstado,
} from "@/services/reserva.service";

const NEXT_STATES: Record<ReservaEstado, ReservaEstado[]> = {
  pendiente: ["confirmada", "cancelada"],
  confirmada: ["completada", "cancelada"],
  completada: [],
  cancelada: [],
};

const ACTION_STYLE: Record<ReservaEstado, string> = {
  confirmada: "border-emerald-400/50 text-emerald-700 hover:bg-emerald-500/10",
  completada: "border-(--border) text-(--text-secondary) hover:bg-surface-elevated",
  cancelada: "border-red-400/50 text-red-600 hover:bg-red-500/10",
  pendiente: "border-(--border) text-(--text-secondary) hover:bg-surface-elevated",
};

const ACTION_LABEL: Record<ReservaEstado, string> = {
  confirmada: "Confirmar",
  completada: "Completar",
  cancelada: "Cancelar",
  pendiente: "Pendiente",
};

function mapReservaApi(r: ApiReserva): ReservaUI {
  return {
    id: String(r.id_reserva),
    clientName: r.usuario?.nombre ?? "—",
    company: r.usuario?.empresa?.nombre ?? "—",
    curso: r.curso?.nombre ?? "—",
    capacitaciones: uniqueCapacitaciones(r),
    status: ESTADO_LABEL[r.estado] as ReservaStatus,
    fecha: formatFecha(r.fecha_ini ?? r.created_at),
  };
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<ApiReserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [empresa, setEmpresa] = useState("all");
  const [estado, setEstado] = useState<"all" | ReservaEstado>("all");

  async function refresh() {
    setError(null);
    try {
      const data = await listReservas();
      setReservas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando reservas");
    }
  }

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, []);

  const empresas = useMemo(() => {
    const set = new Set<string>();
    reservas.forEach((r) => {
      const name = r.usuario?.empresa?.nombre;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [reservas]);

  const filtered = useMemo(() => {
    return reservas.filter((r) => {
      const empOk =
        empresa === "all" || r.usuario?.empresa?.nombre === empresa;
      const estOk = estado === "all" || r.estado === estado;
      return empOk && estOk;
    });
  }, [reservas, empresa, estado]);

  const counts = useMemo(() => {
    const c: Record<ReservaEstado, number> = {
      pendiente: 0,
      confirmada: 0,
      completada: 0,
      cancelada: 0,
    };
    reservas.forEach((r) => {
      c[r.estado] += 1;
    });
    return c;
  }, [reservas]);

  async function handleChangeEstado(r: ApiReserva, next: ReservaEstado) {
    let motivo: string | undefined;
    if (next === "cancelada") {
      const input = window.prompt(
        "Motivo de la cancelación (opcional):",
        "",
      );
      if (input === null) return;
      motivo = input.trim() || undefined;
    }
    setActionId(r.id_reserva);
    try {
      await changeEstado(r.id_reserva, next, motivo);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">

        <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-linear-to-l from-[#267F6B]/10 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[#267F6B]/0 via-[#267F6B]/60 to-[#267F6B]/0" />
          <h1 className="text-3xl font-bold text-(--text-primary)">Reservas</h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Gestión y seguimiento de todas las reservas de cursos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-5">
          <MetricCard label="Total reservas" value={reservas.length} icon="📋" accent />
          <MetricCard label="Pendientes" value={counts.pendiente} icon="⏳" />
          <MetricCard label="Confirmadas" value={counts.confirmada} icon="✅" />
          <MetricCard label="Completadas" value={counts.completada} icon="🏁" />
          <MetricCard label="Canceladas" value={counts.cancelada} icon="✕" />
        </div>

        <div className="relative h-px">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#267F6B]/40 to-transparent" />
        </div>

        <div className="flex flex-col gap-5 rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">Lista de reservas</h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                {filtered.length} reserva{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ReservaFilters
              company={empresa}
              status={estado === "all" ? "all" : ESTADO_LABEL[estado]}
              companies={empresas}
              onCompanyChange={setEmpresa}
              onStatusChange={(v) => {
                if (v === "all") return setEstado("all");
                const found = (Object.keys(ESTADO_LABEL) as ReservaEstado[]).find(
                  (k) => ESTADO_LABEL[k] === v,
                );
                if (found) setEstado(found);
              }}
              onReset={() => { setEmpresa("all"); setEstado("all"); }}
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_130px_100px] gap-4 px-5">
            {["Cliente", "Empresa", "Curso", "Capacitaciones", "Estado", "Fecha"].map((col) => (
              <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                {col}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="py-12 text-center text-sm text-(--text-muted)">
                Cargando reservas…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-(--text-muted)">
                No se encontraron reservas con los filtros aplicados.
              </div>
            ) : (
              filtered.map((r) => {
                const acciones = NEXT_STATES[r.estado];
                return (
                  <div key={r.id_reserva} className="flex flex-col gap-1">
                    <ReservaRow reserva={mapReservaApi(r)} />
                    {acciones.length > 0 && (
                      <div className="flex justify-end gap-1.5 px-5">
                        {acciones.map((next) => (
                          <button
                            key={next}
                            type="button"
                            disabled={actionId === r.id_reserva}
                            onClick={() => void handleChangeEstado(r, next)}
                            className={`rounded-md border px-2 py-1 text-[11px] font-medium transition disabled:opacity-40 ${ACTION_STYLE[next]}`}
                          >
                            {ACTION_LABEL[next]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
