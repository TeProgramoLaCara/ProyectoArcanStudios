"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getUnreadCount,
  listNotificaciones,
  markAllAsRead as apiMarkAll,
  markAsRead as apiMarkOne,
  type Notificacion,
} from "@/services/notificacion.service";
import { useAuth } from "@/context/AuthContext";

const POLL_INTERVAL_MS = 30_000;

export function useNotificaciones() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notificacion[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const [list, countRes] = await Promise.all([
        listNotificaciones(),
        getUnreadCount(),
      ]);
      setItems(list);
      setUnread(countRes.count);
    } catch {
      // silencioso: el polling reintenta
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setUnread(0);
      return;
    }
    setLoading(true);
    void refresh().finally(() => setLoading(false));

    intervalRef.current = setInterval(() => {
      void refresh();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, refresh]);

  const markAsRead = useCallback(
    async (id: number) => {
      await apiMarkOne(id);
      await refresh();
    },
    [refresh],
  );

  const markAllAsRead = useCallback(async () => {
    if (unread === 0) return;
    await apiMarkAll();
    await refresh();
  }, [refresh, unread]);

  return { items, unread, loading, refresh, markAsRead, markAllAsRead };
}
