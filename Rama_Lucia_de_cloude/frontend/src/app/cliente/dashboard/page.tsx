"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ESTADO_LABEL,
  formatFecha,
  listReservas,
  type ApiReserva,
} from "@/services/reserva.service";

export default function ClienteDashboardPage() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<ApiReserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listReservas()
      .then(setReservas)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Error cargando datos"),
      )
      .finally(() => setLoading(false));
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const counts = useMemo(() => {
    let confirmadas = 0;
    let pendientes = 0;
    let pasadas = 0;
    for (const r of reservas) {
      const fin = r.fecha_fin ? new Date(r.fecha_fin) : null;
      const past = fin ? fin < today : false;
      if (
        past ||
        r.estado === "completada" ||
        r.estado === "cancelada"
      ) {
        pasadas += 1;
      } else if (r.estado === "pendiente") {
        pendientes += 1;
      } else if (r.estado === "confirmada") {
        confirmadas += 1;
      }
    }
    return { confirmadas, pendientes, pasadas };
  }, [reservas, today]);

  const empresaNombre = user?.empresa?.nombre ?? "tu empresa";

  return (
    <section>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <div className="rounded-2xl border border-(--border) bg-surface p-6">
          <h1 className="text-3xl font-bold text-(--text-primary)">
            ¡Hola, {user?.nombre ?? "cliente"}!
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Estado de tus reservas en {empresaNombre}.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200/80">
              Confirmadas
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-100">
              {counts.confirmadas}
            </p>
          </div>
          <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200/80">
              Por aceptar
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-100">
              {counts.pendientes}
            </p>
          </div>
          <div className="rounded-xl border border-slate-300/30 bg-slate-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-200/80">
              Pasadas / canceladas
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-100">
              {counts.pasadas}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-(--border) bg-surface p-5">
          <h2 className="text-lg font-semibold text-(--text-primary)">
            Mis reservas
          </h2>
          {loading && (
            <p className="mt-3 text-sm text-(--text-muted)">Cargando…</p>
          )}
          {error && !loading && (
            <p className="mt-3 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {!loading && !error && reservas.length === 0 && (
            <p className="mt-3 text-sm text-(--text-muted)">
              Aún no has hecho ninguna reserva. Ve a “Reservas” para crear la primera.
            </p>
          )}
          {!loading && reservas.length > 0 && (
            <div className="mt-4 grid gap-3">
              {reservas.map((r) => {
                const fin = r.fecha_fin ? new Date(r.fecha_fin) : null;
                const past = fin ? fin < today : false;
                const visual = past
                  ? "Pasada"
                  : r.estado === "pendiente"
                    ? "Por aceptar"
                    : ESTADO_LABEL[r.estado];
                const stateClass = past
                  ? "bg-slate-500/20 text-slate-700 dark:text-slate-200"
                  : r.estado === "confirmada"
                    ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-200"
                    : r.estado === "pendiente"
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-200"
                      : "bg-(--border-subtle) text-(--text-muted)";
                return (
                  <article
                    key={r.id_reserva}
                    className="rounded-xl border border-(--border-subtle) bg-surface-elevated p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-(--text-primary)">
                          {r.curso?.nombre ?? "Reserva"}
                        </h3>
                        <p className="mt-1 text-xs text-(--text-muted)">
                          {formatFecha(r.fecha_ini)} —{" "}
                          {formatFecha(r.fecha_fin)}
                        </p>
                        {r.observaciones && (
                          <p className="mt-1 text-xs text-(--text-secondary)">
                            {r.observaciones}
                          </p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${stateClass}`}
                      >
                        {visual}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
