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
  HiOutlineUserCircle,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { href: "/admin/calendario", label: "Calendario", icon: HiOutlineCalendarDays },
  { href: "/admin/cursos", label: "Cursos", icon: HiOutlineBookOpen },
  { href: "/admin/reservas", label: "Reservas", icon: HiOutlineClipboardDocumentList },
  { href: "/admin/profes", label: "Profes", icon: HiOutlineUserGroup },
  { href: "/admin/clientes", label: "Clientes", icon: HiOutlineBuildingOffice2 },
  { href: "/admin/perfil", label: "Perfil", icon: HiOutlineUserCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#0a0a0a] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Arcan Studios</p>
            <p className="text-xs text-white/50">Reservations Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-hidden px-3 py-4">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-white/35">
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
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </div>

              <HiOutlineChevronRight className="text-sm text-white/40" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}