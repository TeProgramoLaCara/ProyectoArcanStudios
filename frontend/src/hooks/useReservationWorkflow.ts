"use client";

import { useCallback, useEffect, useState } from "react";
import type { Reserva, ReservationCommunication } from "@/resources/data";
import {
  addWorkflowCommunication,
  approveWorkflowReservation,
  createWorkflowReservation,
  getWorkflowReservations,
  RESERVATION_WORKFLOW_EVENT,
} from "@/services/reservation-workflow.service";

type AssignmentDraft = Parameters<typeof approveWorkflowReservation>[1][number];

export function useReservationWorkflow() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  const refresh = useCallback(() => {
    setReservas(getWorkflowReservations());
  }, []);

  useEffect(() => {
    refresh();

    const onUpdate = () => refresh();
    window.addEventListener(RESERVATION_WORKFLOW_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);

    return () => {
      window.removeEventListener(RESERVATION_WORKFLOW_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const createReservation = useCallback(
    (reserva: Reserva) => {
      const created = createWorkflowReservation(reserva);
      refresh();
      return created;
    },
    [refresh],
  );

  const approveReservation = useCallback(
    (reservationId: string, assignments: AssignmentDraft[], message: string) => {
      const updated = approveWorkflowReservation(reservationId, assignments, message);
      refresh();
      return updated;
    },
    [refresh],
  );

  const addCommunication = useCallback(
    (
      reservationId: string,
      message: string,
      channel: ReservationCommunication["channel"] = "email",
      visibleToClient = true,
    ) => {
      addWorkflowCommunication(reservationId, message, channel, visibleToClient);
      refresh();
    },
    [refresh],
  );

  return {
    reservas,
    refresh,
    createReservation,
    approveReservation,
    addCommunication,
  };
}
