"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import NotificacionBell from "@/components/notificaciones/NotificacionBell";

const ROL_LABELS: Record<string, string> = {
  admin: "Administrador",
  profesor: "Profesor",
  cliente: "Cliente",
};

function perfilHref(rol: string): string {
  if (rol === "admin") return "/admin/ajustes";
  if (rol === "profesor") return "/profesor/perfil";
  return "/cliente/ajustes";
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  if (!user) return null;

  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-(--border) bg-surface px-6">
      <NotificacionBell />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full px-2.5 py-1 text-left transition hover:bg-surface-elevated"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#267F6B]/15 text-[#267F6B]">
            <HiOutlineUser className="text-base" />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold text-(--text-primary)">
              {user.nombre}
            </span>
            <span className="text-[11px] text-(--text-secondary)">
              {ROL_LABELS[user.rol] ?? user.rol}
            </span>
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-(--border) bg-surface shadow-2xl">
            <div className="border-b border-(--border) px-4 py-3">
              <p className="text-sm font-semibold text-(--text-primary)">
                {user.nombre}
              </p>
              <p className="text-xs text-(--text-secondary)">{user.email}</p>
              <p className="mt-1 text-xs text-(--text-muted)">
                {ROL_LABELS[user.rol] ?? user.rol}
                {user.empresa ? ` · ${user.empresa.nombre}` : ""}
              </p>
            </div>
            <Link
              href={perfilHref(user.rol)}
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-(--text-primary) transition hover:bg-surface-elevated"
            >
              <HiOutlineUserCircle className="text-base" />
              Mi perfil
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center gap-2 border-t border-(--border) px-4 py-3 text-left text-sm text-(--text-primary) transition hover:bg-surface-elevated"
            >
              <HiOutlineArrowRightOnRectangle className="text-base" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
