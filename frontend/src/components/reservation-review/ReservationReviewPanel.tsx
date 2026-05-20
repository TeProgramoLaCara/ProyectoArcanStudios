import { useEffect, useMemo, useState } from "react";
import type { Reserva, ReservationCommunication } from "@/resources/data";
import { AssignmentEditor, createAssignmentDrafts } from "./AssignmentEditor";
import { CommunicationTimeline } from "./CommunicationTimeline";
import type { ReservationAssignment } from "@/resources/data";

type AssignmentDraft = Omit<ReservationAssignment, "id" | "professorName" | "professorColor">;

type ReservationReviewPanelProps = {
  reserva: Reserva | null;
  onApprove: (reservationId: string, assignments: AssignmentDraft[], message: string) => void;
  onSendCommunication: (
    reservationId: string,
    message: string,
    channel: ReservationCommunication["channel"],
  ) => void;
};

function defaultConfirmationMessage(reserva: Reserva) {
  return `Hola ${reserva.clientName}, tu reserva para "${reserva.curso}" ha sido revisada y se va a llevar a cabo en las fechas solicitadas. Te hemos asignado el equipo docente por capacitación y podrás consultar la planificación desde tu panel.`;
}

export function ReservationReviewPanel({
  reserva,
  onApprove,
  onSendCommunication,
}: ReservationReviewPanelProps) {
  const [assignments, setAssignments] = useState<AssignmentDraft[]>([]);
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<ReservationCommunication["channel"]>("email");

  useEffect(() => {
    if (!reserva) return;
    setAssignments(createAssignmentDrafts(reserva));
    setMessage(defaultConfirmationMessage(reserva));
    setChannel("email");
  }, [reserva]);

  const canApprove = useMemo(
    () => Boolean(reserva && assignments.length === reserva.capacitaciones.length && message.trim()),
    [assignments.length, message, reserva],
  );

  if (!reserva) {
    return (
      <section className="rounded-2xl border border-(--border) bg-surface p-8 text-center text-(--text-muted)">
        Selecciona una solicitud para revisar asignaciones y comunicaciones.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border border-(--border) bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#2fa58a]">Revisión de reserva</p>
            <h2 className="mt-1 text-2xl font-bold text-(--text-primary)">{reserva.curso}</h2>
            <p className="mt-1 text-sm text-(--text-secondary)">
              {reserva.company} · {reserva.clientName} · {reserva.alumnos ?? 0} alumnos
            </p>
          </div>
          <div className="rounded-xl border border-(--border-subtle) bg-surface-elevated px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-wide text-(--text-muted)">Fechas solicitadas</p>
            <p className="mt-1 text-sm font-semibold text-(--text-primary)">
              {reserva.requestedStart} - {reserva.requestedEnd}
            </p>
            <p className="text-xs text-(--text-muted)">
              Turno {reserva.turno === "tarde" ? "tarde" : "mañana"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {reserva.capacitaciones.map((capacitacion) => (
            <span key={capacitacion} className="rounded-full bg-[#267F6B]/15 px-3 py-1 text-xs font-semibold text-[#2fa58a]">
              {capacitacion}
            </span>
          ))}
        </div>
      </div>

      <AssignmentEditor reserva={reserva} assignments={assignments} onChange={setAssignments} />

      <CommunicationTimeline
        reserva={reserva}
        message={message}
        channel={channel}
        onMessageChange={setMessage}
        onChannelChange={setChannel}
        onSend={() => {
          onSendCommunication(reserva.id, message, channel);
        }}
      />

      <div className="sticky bottom-4 z-10 rounded-2xl border border-[#267F6B]/40 bg-[#10241f]/95 p-4 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-white">Confirmar planificación</p>
            <p className="text-sm text-emerald-100/80">
              Se notificará al cliente y se crearán los bloques en el calendario personal de cada profesor.
            </p>
          </div>
          <button
            type="button"
            disabled={!canApprove}
            onClick={() => onApprove(reserva.id, assignments, message)}
            className="rounded-xl bg-[#267F6B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2fa58a] disabled:opacity-50"
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    </section>
  );
}
