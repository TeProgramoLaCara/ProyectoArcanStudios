"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineSquares2X2,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineChevronRight,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const items = [
  { href: "/cliente/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { href: "/cliente/cursos", label: "Cursos", icon: HiOutlineBookOpen },
  { href: "/cliente/reservas", label: "Reservas", icon: HiOutlineClipboardDocumentList },
  { href: "/cliente/ajustes", label: "Ajustes", icon: HiOutlineCog6Tooth },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
            C
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Arcan Studios</p>
            <p className="text-xs text-[var(--text-secondary)]">Cliente Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-hidden px-3 py-4">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
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
                  ? "bg-[var(--border)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </div>
              <HiOutlineChevronRight className="text-sm text-[var(--text-muted)]" />
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <Link
          href="/"
          className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
        >
          <div className="flex items-center gap-3">
            <HiOutlineArrowRightOnRectangle className="text-lg" />
            <span className="font-medium">Cerrar sesión</span>
          </div>
          <HiOutlineChevronRight className="text-sm text-rose-300/60" />
        </Link>
      </div>
    </aside>
  );
}
