"use client";

import { useMemo, useState } from "react";
import MetricCard from "@/components/reservations/MetriCard";
import ReservaFilters from "@/components/reservations/ReservaFilters";
import ReservaRow from "@/components/reservations/ReservaRow";
import { allReservas } from "@/resources/data";

const companies = [...new Set(allReservas.map((r) => r.company))];

export default function ReservasPage() {
  const [company, setCompany] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return allReservas.filter((r) => {
      const matchCompany = company === "all" || r.company === company;
      const matchStatus = status === "all" || r.status === status;
      return matchCompany && matchStatus;
    });
  }, [company, status]);

  const total       = allReservas.length;
  const pendientes  = allReservas.filter((r) => r.status === "Pendiente").length;
  const enCurso     = allReservas.filter((r) => r.status === "En curso").length;
  const confirmadas = allReservas.filter((r) => r.status === "Confirmada").length;
  const completadas = allReservas.filter((r) => r.status === "Completada").length;
  const canceladas  = allReservas.filter((r) => r.status === "Cancelada").length;

  return (
    <section className="p-6 bg-background">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">

        {/* Page header */}
        <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-linear-to-l from-[#267F6B]/10 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[#267F6B]/0 via-[#267F6B]/60 to-[#267F6B]/0" />
          <h1 className="text-3xl font-bold text-(--text-primary)">Reservas</h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Gestión y seguimiento de todas las reservas de cursos.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
          <MetricCard label="Total reservas" value={total}       icon="📋" accent />
          <MetricCard label="Pendientes"     value={pendientes}  icon="⏳" />
          <MetricCard label="Confirmadas"    value={confirmadas} icon="✅" />
          <MetricCard label="En curso"       value={enCurso}     icon="▶️" />
          <MetricCard label="Completadas"    value={completadas} icon="🏁" />
          <MetricCard label="Canceladas"     value={canceladas}  icon="✕" />
        </div>

        {/* Separator */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#267F6B]/40 to-transparent" />
        </div>

        {/* Filters + list */}
        <div className="flex flex-col gap-5 rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-(--text-primary)">Lista de reservas</h2>
              <p className="mt-0.5 text-sm text-(--text-muted)">
                {filtered.length} reserva{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ReservaFilters
              company={company}
              status={status}
              companies={companies}
              onCompanyChange={setCompany}
              onStatusChange={setStatus}
              onReset={() => { setCompany("all"); setStatus("all"); }}
            />
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1.5fr_1.5fr_130px_100px] gap-4 px-5">
            {["Cliente", "Empresa", "Curso", "Capacitaciones", "Estado", "Fecha"].map((col) => (
              <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-(--text-muted)">
                No se encontraron reservas con los filtros aplicados.
              </div>
            ) : (
              filtered.map((r) => <ReservaRow key={r.id} reserva={r} />)
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
