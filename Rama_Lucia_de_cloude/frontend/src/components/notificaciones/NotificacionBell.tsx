"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineBell } from "react-icons/hi2";
import { useNotificaciones } from "@/hooks/useNotificaciones";
import type { Notificacion } from "@/services/notificacion.service";

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "hace unos segundos";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)} d`;
  return date.toLocaleDateString();
}

export default function NotificacionBell() {
  const { items, unread, markAsRead, markAllAsRead } = useNotificaciones();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleItemClick(n: Notificacion) {
    if (!n.leida) {
      try {
        await markAsRead(n.id_notificacion);
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones${unread > 0 ? ` (${unread} sin leer)` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-(--text-secondary) transition hover:bg-surface-elevated hover:text-(--text-primary)"
      >
        <HiOutlineBell className="text-xl" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-(--border) bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
            <span className="text-sm font-semibold text-(--text-primary)">
              Notificaciones
            </span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs text-(--text-secondary) hover:text-(--text-primary) hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-(--text-muted)">
                No tienes notificaciones
              </div>
            ) : (
              <ul className="divide-y divide-(--border)">
                {items.map((n) => (
                  <li
                    key={n.id_notificacion}
                    onClick={() => void handleItemClick(n)}
                    className={`cursor-pointer px-4 py-3 transition hover:bg-surface-elevated ${
                      n.leida ? "" : "bg-emerald-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          n.leida
                            ? "text-(--text-secondary)"
                            : "font-semibold text-(--text-primary)"
                        }`}
                      >
                        {n.titulo}
                      </p>
                      {!n.leida && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-(--text-secondary)">
                      {n.mensaje}
                    </p>
                    <p className="mt-1 text-[11px] text-(--text-muted)">
                      {formatRelative(n.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
