'use client';

import { useTheme } from '@/context/ThemeContext';
import type { Empresa } from '@/resources/data';
import UsuarioRow from './UsuarioRow';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  empresa: Empresa;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: string) => void;
  onRemoveUser: (empresaId: string, userId: string) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmpresaCard({
  empresa,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onRemoveUser,
}: Props) {
  const { isDark } = useTheme();
  const isFull = empresa.usuarios.length >= 5;

  const iconBtnClass = `flex h-7 w-7 items-center justify-center rounded-full border text-sm transition ${
    isDark
      ? 'border-white/10 bg-white/5 text-white/30'
      : 'border-black/[0.08] bg-black/[0.04] text-[#94a3b8]'
  }`;

  return (
    <div className={`rounded-[18px] border transition-colors duration-200 ${
      isDark ? 'bg-[#0d0d0d]' : 'bg-[#f1f5f9]'
    } ${
      isExpanded
        ? 'border-[#267F6B]/30'
        : isDark
          ? 'border-white/[0.08] hover:border-[#267F6B]/20'
          : 'border-black/[0.08] hover:border-[#267F6B]/30'
    }`}>
      {/* ── Fila principal (siempre visible) ── */}
      <div className="flex items-center gap-3 px-5 py-4">

        {/* Ícono empresa */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base ${
          isDark ? 'border-white/10 bg-white/5' : 'border-black/[0.08] bg-black/[0.04]'
        }`}>
          🏢
        </div>

        {/* Nombre + teléfono */}
        <div className="min-w-0 flex-1">
          <p className={`truncate font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{empresa.name}</p>
          <p className={`mt-0.5 text-xs ${isDark ? 'text-white/40' : 'text-[#475569]'}`}>{empresa.phone}</p>
        </div>

        {/* Badge de usuarios */}
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
          isFull
            ? 'border-[#267F6B]/40 bg-[#267F6B]/10 text-[#2fa58a]'
            : isDark
              ? 'border-white/10 bg-white/5 text-white/40'
              : 'border-black/[0.08] bg-black/[0.04] text-[#475569]'
        }`}>
          {empresa.usuarios.length}/5
        </span>

        {/* Botones de acción */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onEdit(empresa)}
            className={`${iconBtnClass} hover:border-[#267F6B]/40 hover:text-[#2fa58a]`}
            title="Editar empresa"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(empresa.id)}
            className={`${iconBtnClass} hover:border-red-500/30 hover:text-red-400`}
            title="Eliminar empresa"
          >
            ✕
          </button>
        </div>

        {/* Chevron expand/collapse */}
        <button
          onClick={onToggle}
          className={`${iconBtnClass} ${isDark ? 'hover:text-white/70' : 'hover:text-[#0f172a]'}`}
          aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ── Lista de usuarios (expandible) ── */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '420px' : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className={`border-t px-5 pb-4 pt-3 ${isDark ? 'border-white/[0.06]' : 'border-black/[0.05]'}`}>
          {empresa.usuarios.length === 0 ? (
            <p className={`py-2 text-center text-xs ${isDark ? 'text-white/25' : 'text-[#94a3b8]'}`}>
              Sin usuarios registrados
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {empresa.usuarios.map((u) => (
                <UsuarioRow
                  key={u.id}
                  usuario={u}
                  onRemove={(userId) => onRemoveUser(empresa.id, userId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
