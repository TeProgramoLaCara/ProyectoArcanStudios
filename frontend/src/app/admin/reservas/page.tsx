"use client";

import { useMemo, useState } from "react";
import type { Reserva, ReservationCommunication } from "@/resources/data";
import ReservaFilters from "@/components/reservations/ReservaFilters";
import { ReviewMetrics } from "@/components/reservation-review/ReviewMetrics";
import { ReviewQueue } from "@/components/reservation-review/ReviewQueue";
import { ReservationReviewPanel } from "@/components/reservation-review/ReservationReviewPanel";
import { useReservationWorkflow } from "@/hooks/useReservationWorkflow";
import type { ReservationAssignment } from "@/resources/data";

type AssignmentDraft = Omit<ReservationAssignment, "id" | "professorName" | "professorColor">;

export default function ReservasPage() {
  const { reservas, approveReservation, addCommunication } = useReservationWorkflow();
  const [company, setCompany] = useState("all");
  const [status, setStatus] = useState("Pendiente");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const companies = useMemo(
    () => Array.from(new Set(reservas.map((reserva) => reserva.company))),
    [reservas],
  );

  const filtered = useMemo(() => {
    return reservas.filter((reserva) => {
      const matchCompany = company === "all" || reserva.company === company;
      const matchStatus = status === "all" || reserva.status === status;
      return matchCompany && matchStatus;
    });
  }, [company, reservas, status]);

  const selectedReserva = useMemo<Reserva | null>(() => {
    const current = reservas.find((reserva) => reserva.id === selectedId);
    return current ?? filtered[0] ?? null;
  }, [filtered, reservas, selectedId]);

  function handleApprove(reservationId: string, assignments: AssignmentDraft[], message: string) {
    approveReservation(reservationId, assignments, message);
    setStatus("Confirmada");
    setSelectedId(reservationId);
  }

  function handleSendCommunication(
    reservationId: string,
    message: string,
    channel: ReservationCommunication["channel"],
  ) {
    addCommunication(reservationId, message, channel, true);
  }

  return (
    <section className="min-h-full bg-background p-6">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-6">
        <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-72 bg-linear-to-l from-[#267F6B]/10 to-transparent" />
          <p className="text-sm font-semibold text-[#2fa58a]">Centro de revisión</p>
          <h1 className="mt-1 text-3xl font-bold text-(--text-primary)">Reservas y asignación docente</h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-(--text-secondary)">
            Revisa cada solicitud, asigna el profesor responsable de cada capacitación, confirma la planificación y comunica al cliente el estado de su reserva.
          </p>
        </div>

        <ReviewMetrics reservas={reservas} />

        <div className="rounded-2xl border border-(--border) bg-surface p-4">
          <ReservaFilters
            company={company}
            status={status}
            companies={companies}
            onCompanyChange={setCompany}
            onStatusChange={setStatus}
            onReset={() => {
              setCompany("all");
              setStatus("all");
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
          <ReviewQueue
            reservas={filtered}
            selectedId={selectedReserva?.id}
            onSelect={(reserva) => setSelectedId(reserva.id)}
          />
          <ReservationReviewPanel
            reserva={selectedReserva}
            onApprove={handleApprove}
            onSendCommunication={handleSendCommunication}
          />
        </div>
      </div>
    </section>
  );
}
