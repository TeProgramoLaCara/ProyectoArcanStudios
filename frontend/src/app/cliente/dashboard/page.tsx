import { useMemo } from "react";
import { allReservas, empresas, type Reserva } from "@/resources/data";

const CURRENT_CLIENT = "Alejandro Vega";

function parseReservaHumanDate(value: string): Date | null {
  const rangeStart = value.split(" - ")[0]?.trim() ?? value;
  const months: Record<string, number> = {
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

  const normalized = rangeStart.toLowerCase();
  const parts = normalized.split(" ");
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = months[parts[1]];
  const year = Number(parts[2]);
  if (!day || month === undefined || !year) return null;
  return new Date(year, month, day);
}

function parseReservaDateRange(value: string): { start: Date; endInclusive: Date } | null {
  const [rawStart, rawEnd] = value.split(" - ").map((part) => part.trim());
  const start = parseReservaHumanDate(rawStart);
  if (!start) return null;
  const endInclusive = rawEnd ? parseReservaHumanDate(rawEnd) ?? start : start;
  return { start, endInclusive };
}

function isActiveReservation(reserva: Reserva) {
  return (
    reserva.status === "Pendiente" ||
    reserva.status === "Confirmada" ||
    reserva.status === "En curso"
  );
}

export default function Page() {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const myReservations = useMemo(
    () => allReservas.filter((reserva) => reserva.clientName === CURRENT_CLIENT),
    [],
  );

  const myCompany = useMemo(
    () => myReservations[0]?.company ?? "Nova",
    [myReservations],
  );

  const myCompanyData = useMemo(
    () => empresas.find((empresa) => empresa.name === myCompany),
    [myCompany],
  );

  const reservationsByState = useMemo(() => {
    let confirmed = 0;
    let pending = 0;
    let past = 0;

    for (const reserva of myReservations) {
      const range = parseReservaDateRange(reserva.fecha);
      const isPast = range ? range.endInclusive < today : false;

      if (isPast || reserva.status === "Completada" || reserva.status === "Cancelada") {
        past += 1;
      } else if (reserva.status === "Pendiente") {
        pending += 1;
      } else if (reserva.status === "Confirmada" || reserva.status === "En curso") {
        confirmed += 1;
      }
    }

    return { confirmed, pending, past };
  }, [myReservations, today]);

  const companyMembersWithActiveReservations = useMemo(
    () =>
      (myCompanyData?.usuarios ?? []).map((member) => {
        const fullName = member.username
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

        const activeReservations = allReservas.filter(
          (reserva) => reserva.company === myCompany && reserva.clientName === fullName && isActiveReservation(reserva),
        );

        return {
          id: member.id,
          username: member.username,
          fullName,
          activeReservations,
        };
      }),
    [myCompany, myCompanyData],
  );

  return (
    <section className="p-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111111]">
          <h1 className="text-3xl font-bold text-[#0f172a] dark:text-white">Dashboard de cliente</h1>
          <p className="mt-1 text-sm text-[#475569] dark:text-white/60">
            Estado de tus reservas y actividad de tu empresa ({myCompany}).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200/80">Confirmadas</p>
            <p className="mt-1 text-2xl font-bold text-emerald-100">{reservationsByState.confirmed}</p>
          </div>
          <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-amber-200/80">Por aceptar</p>
            <p className="mt-1 text-2xl font-bold text-amber-100">{reservationsByState.pending}</p>
          </div>
          <div className="rounded-xl border border-slate-300/30 bg-slate-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-200/80">Pasadas</p>
            <p className="mt-1 text-2xl font-bold text-slate-100">{reservationsByState.past}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
            <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white">Mis reservas</h2>
            <div className="mt-4 grid gap-3">
              {myReservations.map((reserva) => {
                const range = parseReservaDateRange(reserva.fecha);
                const isPast = range ? range.endInclusive < today : false;
                const visualState = isPast
                  ? "Pasada"
                  : reserva.status === "Pendiente"
                    ? "Por aceptar"
                    : "Confirmada";

                const stateClass =
                  visualState === "Confirmada"
                    ? "bg-emerald-500/20 text-emerald-200"
                    : visualState === "Por aceptar"
                      ? "bg-amber-500/20 text-amber-200"
                      : "bg-slate-500/20 text-slate-200";

                return (
                  <article
                    key={reserva.id}
                    className="rounded-xl border border-black/10 bg-[#f8fafc] p-3 dark:border-white/10 dark:bg-[#0d0d0d]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-[#0f172a] dark:text-white">
                          {reserva.curso}
                        </h3>
                        <p className="mt-1 text-xs text-[#64748b] dark:text-white/55">
                          Fecha: {reserva.fecha}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${stateClass}`}>
                        {visualState}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
            <h2 className="text-lg font-semibold text-[#0f172a] dark:text-white">
              Miembros de {myCompany} y reservas activas
            </h2>
            <div className="mt-4 grid gap-3">
              {companyMembersWithActiveReservations.map((member) => (
                <article
                  key={member.id}
                  className="rounded-xl border border-black/10 bg-[#f8fafc] p-3 dark:border-white/10 dark:bg-[#0d0d0d]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{member.fullName}</p>
                    <span className="rounded-full bg-sky-500/20 px-2 py-1 text-xs font-semibold text-sky-200">
                      {member.activeReservations.length} activa(s)
                    </span>
                  </div>
                  {member.activeReservations.length > 0 ? (
                    <ul className="mt-2 grid gap-1.5 text-xs text-[#64748b] dark:text-white/60">
                      {member.activeReservations.map((reserva) => (
                        <li key={reserva.id}>
                          {reserva.curso} · {reserva.status} · {reserva.fecha}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-[#64748b] dark:text-white/45">
                      Sin reservas activas.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}