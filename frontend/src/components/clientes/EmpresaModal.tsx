'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Empresa, Usuario } from '@/resources/data';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_USUARIOS = 5;

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30'; /* colors.ts: surfaceInput, accent */

const labelClass = 'text-xs font-medium uppercase tracking-wider text-white/40';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  mode: 'create' | 'edit';
  empresa?: Empresa;
  onClose: () => void;
  onSave: (empresa: Empresa) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmpresaModal({ mode, empresa, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [newUsername, setNewUsername] = useState('');

  // Sincronizar formulario al abrirse
  useEffect(() => {
    if (mode === 'edit' && empresa) {
      setName(empresa.name);
      setPhone(empresa.phone);
      setUsuarios([...empresa.usuarios]);
    } else {
      setName('');
      setPhone('');
      setUsuarios([]);
    }
    setNewUsername('');
  }, [mode, empresa]);

  function addUser() {
    const trimmed = newUsername.trim();
    if (!trimmed || usuarios.length >= MAX_USUARIOS) return;
    setUsuarios((prev) => [
      ...prev,
      { id: Date.now().toString(), username: trimmed },
    ]);
    setNewUsername('');
  }

  function removeUser(id: string) {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUser();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: mode === 'edit' ? empresa!.id : Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      usuarios,
    });
  }

  const isFull = usuarios.length >= MAX_USUARIOS;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"> {/* colors.ts: surfaceElevated */}
        {/* Barra de acento superior */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" /> {/* colors.ts: accent */}

        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-white">
            {mode === 'edit' ? 'Editar empresa' : 'Nueva empresa'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/40 transition hover:text-white/80"
          >
            ✕
          </button>
        </div>
        <div className="h-px bg-white/[0.06]" />

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">

          {/* Nombre + Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Nombre</label>
              <input
                required
                className={inputClass}
                placeholder="Ej: Nova"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Teléfono</label>
              <input
                className={inputClass}
                placeholder="+34 900 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Sección de usuarios */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Usuarios</label>
              <span className="text-[10px] text-white/30">
                {usuarios.length}/{MAX_USUARIOS}
              </span>
            </div>

            {/* Lista de usuarios actuales */}
            {usuarios.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                  >
                    <span className="truncate text-sm text-white/70">
                      {u.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeUser(u.id)}
                      className="shrink-0 text-xs text-white/25 transition hover:text-red-400"
                      title="Eliminar usuario"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Fila para añadir usuario */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isFull}
                placeholder={isFull ? 'Límite alcanzado' : 'Nuevo usuario...'}
                className={`${inputClass} flex-1 ${isFull ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
              <button
                type="button"
                onClick={addUser}
                disabled={isFull || !newUsername.trim()}
                className="shrink-0 rounded-xl border border-[#267F6B]/40 bg-[#267F6B]/15 px-3 py-2 text-sm font-semibold text-[#2fa58a] transition hover:bg-[#267F6B]/25 disabled:cursor-not-allowed disabled:opacity-30" /* colors.ts: accent, accentLight */
              >
                + Añadir
              </button>
            </div>

            {isFull && (
              <p className="text-[11px] text-white/30">
                Máximo {MAX_USUARIOS} usuarios por empresa.
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:text-white/80"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]" /* colors.ts: accent, accentLight */
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
