"use client";

import { useMemo, useState } from "react";
import MetricCard from "@/components/reservations/MetriCard";
import ReservaFilters from "@/components/reservations/ReservaFilters";
import ReservaRow, { type Reserva } from "@/components/reservations/ReservaRow";
import type { ReservaStatus } from "@/components/reservations/ReservaBadge";

// ─── Mock data ────────────────────────────────────────────────────────────────

const allReservas: Reserva[] = [
  {
    id: "r1",
    clientName: "Alejandro Vega",
    company: "Nova",
    curso: "Creación de Assets para Videojuegos",
    capacitaciones: ["Modelado 3D en Blender", "Texturizado y UV Mapping"],
    status: "Confirmada",
    fecha: "02 abr 2026",
  },
  {
    id: "r2",
    clientName: "María Torres",
    company: "Acme",
    curso: "Desarrollo de Videojuegos con Unity",
    capacitaciones: ["Introducción a Unity", "Scripting con C# en Unity"],
    status: "Pendiente",
    fecha: "03 abr 2026",
  },
  {
    id: "r3",
    clientName: "Carlos Ruiz",
    company: "Nova",
    curso: "Personajes Animados para Unity",
    capacitaciones: ["Rigging y Animación", "Scripting con C# en Unity"],
    status: "En curso",
    fecha: "28 mar 2026",
  },
  {
    id: "r4",
    clientName: "Laura Méndez",
    company: "Pixel Corp",
    curso: "Entornos y Niveles Interactivos",
    capacitaciones: ["Texturizado y UV Mapping", "Diseño de Niveles"],
    status: "Completada",
    fecha: "15 mar 2026",
  },
  {
    id: "r5",
    clientName: "Javier Ibáñez",
    company: "Acme",
    curso: "Creación de Assets para Videojuegos",
    capacitaciones: ["Modelado 3D en Blender", "Texturizado y UV Mapping"],
    status: "Cancelada",
    fecha: "10 mar 2026",
  },
  {
    id: "r6",
    clientName: "Sofía Navarro",
    company: "Pixel Corp",
    curso: "Desarrollo de Videojuegos con Unity",
    capacitaciones: ["Introducción a Unity", "Scripting con C# en Unity"],
    status: "Confirmada",
    fecha: "05 abr 2026",
  },
  {
    id: "r7",
    clientName: "Pablo Guerrero",
    company: "Nova",
    curso: "Entornos y Niveles Interactivos",
    capacitaciones: ["Texturizado y UV Mapping", "Diseño de Niveles"],
    status: "Pendiente",
    fecha: "07 abr 2026",
  },
  {
    id: "r8",
    clientName: "Elena Castillo",
    company: "Acme",
    curso: "Personajes Animados para Unity",
    capacitaciones: ["Rigging y Animación", "Scripting con C# en Unity"],
    status: "En curso",
    fecha: "01 abr 2026",
  },
];

const companies = [...new Set(allReservas.map((r) => r.company))];

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  // Métricas
  const total = allReservas.length;
  const pendientes = allReservas.filter((r) => r.status === "Pendiente").length;
  const enCurso = allReservas.filter((r) => r.status === "En curso").length;
  const confirmadas = allReservas.filter((r) => r.status === "Confirmada").length;
  const completadas = allReservas.filter((r) => r.status === "Completada").length;
  const canceladas = allReservas.filter((r) => r.status === "Cancelada").length;

  return (
    <section className="bg-[#050505] p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">

        {/* ── Page header ── */}
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          {/* Gradient accent */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-[#267F6B]/10 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B]/60 to-[#267F6B]/0" />
          <h1 className="text-3xl font-bold text-white">Reservas</h1>
          <p className="mt-1 text-sm text-white/55">
            Gestión y seguimiento de todas las reservas de cursos.
          </p>
        </div>

        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
          <MetricCard label="Total reservas" value={total} icon="📋" accent />
          <MetricCard label="Pendientes" value={pendientes} icon="⏳" />
          <MetricCard label="Confirmadas" value={confirmadas} icon="✅" />
          <MetricCard label="En curso" value={enCurso} icon="▶️" />
          <MetricCard label="Completadas" value={completadas} icon="🏁" />
          <MetricCard label="Canceladas" value={canceladas} icon="✕" />
        </div>

        {/* ── Separator ── */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#267F6B]/40 to-transparent" />
        </div>

        {/* ── Filters + list ── */}
        <div className="flex flex-col gap-5 rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          {/* Header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Lista de reservas
              </h2>
              <p className="mt-0.5 text-sm text-white/40">
                {filtered.length} reserva{filtered.length !== 1 ? "s" : ""} encontrada
                {filtered.length !== 1 ? "s" : ""}
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
            {["Cliente", "Empresa", "Curso", "Capacitaciones", "Estado", "Fecha"].map(
              (col) => (
                <span
                  key={col}
                  className="text-[15px] font-semibold uppercase tracking-wider text-white/25"
                >
                  {col}
                </span>
              )
            )}
          </div>



          {/* Rows */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-white/30">
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