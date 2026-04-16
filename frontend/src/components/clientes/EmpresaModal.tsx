'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/context/ThemeContext';
import type { Empresa, Usuario } from '@/resources/data';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_USUARIOS = 5;

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
  const { isDark } = useTheme();

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

  const inputClass = isDark
    ? 'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30'
    : 'w-full rounded-xl border border-black/[0.08] bg-[#e8edf2] px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30';

  const labelClass = isDark
    ? 'text-xs font-medium uppercase tracking-wider text-white/40'
    : 'text-xs font-medium uppercase tracking-wider text-[#94a3b8]';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/70' : 'bg-black/40'}`}
        onClick={onClose}
      />

      {/* Modal box */}
      <div className={`relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border shadow-[0_32px_80px_rgba(0,0,0,0.7)] ${
        isDark ? 'border-white/10 bg-[#111111]' : 'border-black/[0.08] bg-[#ffffff]'
      }`}>
        {/* Barra de acento superior */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" />

        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>
            {mode === 'edit' ? 'Editar empresa' : 'Nueva empresa'}
          </h3>
          <button
            onClick={onClose}
            className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${
              isDark
                ? 'border-white/10 bg-white/5 text-white/40 hover:text-white/80'
                : 'border-black/[0.08] bg-black/[0.04] text-[#94a3b8] hover:text-[#0f172a]'
            }`}
          >
            ✕
          </button>
        </div>
        <div className={`h-px ${isDark ? 'bg-white/[0.06]' : 'bg-black/[0.05]'}`} />

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
              <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-[#94a3b8]'}`}>
                {usuarios.length}/{MAX_USUARIOS}
              </span>
            </div>

            {/* Lista de usuarios actuales */}
            {usuarios.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${
                      isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-black/[0.05] bg-black/[0.03]'
                    }`}
                  >
                    <span className={`truncate text-sm ${isDark ? 'text-white/70' : 'text-[#475569]'}`}>
                      {u.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeUser(u.id)}
                      className={`shrink-0 text-xs transition hover:text-red-400 ${isDark ? 'text-white/25' : 'text-[#94a3b8]'}`}
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
                className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${
                  isDark
                    ? 'border-[#267F6B]/40 bg-[#267F6B]/15 text-[#2fa58a] hover:bg-[#267F6B]/25'
                    : 'border-[#267F6B]/50 bg-[#267F6B]/10 text-[#267F6B] hover:bg-[#267F6B]/20'
                }`}
              >
                + Añadir
              </button>
            </div>

            {isFull && (
              <p className={`text-[11px] ${isDark ? 'text-white/30' : 'text-[#94a3b8]'}`}>
                Máximo {MAX_USUARIOS} usuarios por empresa.
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                isDark ? 'border-white/10 text-white/50 hover:text-white/80' : 'border-black/[0.08] text-[#475569] hover:text-[#0f172a]'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
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
