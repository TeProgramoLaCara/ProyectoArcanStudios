'use client';

import type { Empresa } from '@/resources/data';
import UsuarioRow from './UsuarioRow';

type Props = {
  empresa: Empresa;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: string) => void;
  onRemoveUser: (empresaId: string, userId: string) => void;
};

export default function EmpresaCard({
  empresa,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onRemoveUser,
}: Props) {
  const isFull = empresa.usuarios.length >= 5;

  const iconBtnClass =
    'flex h-7 w-7 items-center justify-center rounded-full border border-(--border) bg-surface-elevated text-sm text-(--text-muted) transition';

  return (
    <div className={`rounded-[18px] border bg-surface transition-colors duration-200 ${
      isExpanded
        ? 'border-[#267F6B]/30'
        : 'border-(--border) hover:border-[#267F6B]/25'
    }`}>

      {/* ── Fila principal (siempre visible) ── */}
      <div className="flex items-center gap-3 px-5 py-4">

        {/* Ícono empresa */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--border) bg-surface-elevated text-base">
          🏢
        </div>

        {/* Nombre + teléfono */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-(--text-primary)">{empresa.name}</p>
          <p className="mt-0.5 text-xs text-(--text-secondary)">{empresa.phone}</p>
        </div>

        {/* Badge de usuarios */}
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
          isFull
            ? 'border-[#267F6B]/40 bg-[#267F6B]/10 text-[#2fa58a]'
            : 'border-(--border) bg-surface-elevated text-(--text-secondary)'
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
          className={`${iconBtnClass} hover:text-(--text-primary)`}
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
        <div className="border-t border-(--border-subtle) px-5 pb-4 pt-3">
          {empresa.usuarios.length === 0 ? (
            <p className="py-2 text-center text-xs text-(--text-muted)">
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
