'use client';

import type { ReservaStatus } from '@/resources/data';

export type { ReservaStatus };

const STATUS_VARS: Record<ReservaStatus, { color: string; bg: string; border: string }> = {
  Pendiente: {
    color:  'var(--status-pendiente-color)',
    bg:     'var(--status-pendiente-bg)',
    border: 'var(--status-pendiente-border)',
  },
  Confirmada: {
    color:  'var(--status-confirmada-color)',
    bg:     'var(--status-confirmada-bg)',
    border: 'var(--status-confirmada-border)',
  },
  'En curso': {
    color:  'var(--status-encurso-color)',
    bg:     'var(--status-encurso-bg)',
    border: 'var(--status-encurso-border)',
  },
  Completada: {
    color:  'var(--text-muted)',
    bg:     'var(--border-subtle)',
    border: 'var(--border)',
  },
  Cancelada: {
    color:  'var(--status-cancelada-color)',
    bg:     'var(--status-cancelada-bg)',
    border: 'var(--status-cancelada-border)',
  },
};

export default function ReservaBadge({ status }: { status: ReservaStatus }) {
  const s = STATUS_VARS[status];
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border }}
    >
      {status}
    </span>
  );
}
