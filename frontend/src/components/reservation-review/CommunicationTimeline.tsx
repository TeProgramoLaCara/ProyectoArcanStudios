import type { Reserva, ReservationCommunication } from "@/resources/data";

type CommunicationTimelineProps = {
  reserva: Reserva;
  message: string;
  channel: ReservationCommunication["channel"];
  onMessageChange: (message: string) => void;
  onChannelChange: (channel: ReservationCommunication["channel"]) => void;
  onSend: () => void;
};

export function CommunicationTimeline({
  reserva,
  message,
  channel,
  onMessageChange,
  onChannelChange,
  onSend,
}: CommunicationTimelineProps) {
  const communications = reserva.communications ?? [];

  return (
    <div className="rounded-2xl border border-(--border) bg-surface p-4">
      <h3 className="text-base font-bold text-(--text-primary)">Comunicación con cliente</h3>
      <p className="text-sm text-(--text-muted)">
        Registra mensajes y notificaciones visibles para la empresa.
      </p>

      <div className="mt-4 grid gap-3">
        <textarea
          rows={4}
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Mensaje para el cliente..."
          className="w-full resize-none rounded-xl border border-(--border) bg-surface-input px-3 py-2.5 text-sm outline-none focus:border-[#267F6B]"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <select
            value={channel}
            onChange={(event) => onChannelChange(event.target.value as ReservationCommunication["channel"])}
            className="rounded-xl border border-(--border) bg-surface-input px-3 py-2 text-sm outline-none focus:border-[#267F6B]"
          >
            <option value="email">Email</option>
            <option value="panel">Panel cliente</option>
            <option value="telefono">Teléfono</option>
          </select>
          <button
            type="button"
            onClick={onSend}
            disabled={!message.trim()}
            className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a] disabled:opacity-50"
          >
            Enviar comunicación
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {communications.map((communication) => (
          <div key={communication.id} className="rounded-xl border border-(--border-subtle) bg-surface-elevated p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2fa58a]">
                {communication.author} · {communication.channel}
              </p>
              <p className="text-[11px] text-(--text-muted)">
                {new Date(communication.createdAt).toLocaleString("es-ES")}
              </p>
            </div>
            <p className="mt-2 text-sm text-(--text-secondary)">{communication.message}</p>
          </div>
        ))}

        {communications.length === 0 && (
          <p className="rounded-xl border border-(--border-subtle) bg-surface-elevated p-4 text-sm text-(--text-muted)">
            Todavía no hay comunicaciones registradas.
          </p>
        )}
      </div>
    </div>
  );
}
