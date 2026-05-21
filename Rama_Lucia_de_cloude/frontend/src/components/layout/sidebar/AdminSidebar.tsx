"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineSquares2X2,
  HiOutlineCalendarDays,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineCog6Tooth,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const items = [
  { href: "/admin/dashboard",  label: "Dashboard",  icon: HiOutlineSquares2X2 },
  { href: "/admin/calendario", label: "Calendario", icon: HiOutlineCalendarDays },
  { href: "/admin/cursos",     label: "Cursos",     icon: HiOutlineBookOpen },
  { href: "/admin/reservas",   label: "Reservas",   icon: HiOutlineClipboardDocumentList },
  { href: "/admin/profes",     label: "Profes",     icon: HiOutlineUserGroup },
  { href: "/admin/clientes",   label: "Clientes",   icon: HiOutlineBuildingOffice2 },
  { href: "/admin/ajustes",    label: "Ajustes",    icon: HiOutlineCog6Tooth },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-(--border) bg-surface text-(--text-primary)">
      {/* Cabecera con logo */}
      <div className="border-b border-(--border) px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#267F6B]/15 text-[#267F6B] font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-(--text-primary)">Arcan Studios</p>
            <p className="text-xs text-(--text-secondary)">Reservations Panel</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-2 overflow-hidden px-3 py-4">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-(--text-muted)">
          Platform
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-surface-elevated text-(--text-primary)"
                  : "text-(--text-secondary) hover:bg-surface-elevated hover:text-(--text-primary)"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </div>
              <HiOutlineChevronRight className="text-sm text-(--text-muted)" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
