'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Profesor, Capacitacion } from './types';
import { ALL_CAPS, CAP_TOGGLE_STYLES, INACTIVE_TOGGLE_PILL } from './colors';

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30';

const labelClass = 'text-xs font-medium uppercase tracking-wider text-white/40';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  profesor?: Profesor | null;
  onClose: () => void;
  onSave: (data: Omit<Profesor, 'id'>) => void;
};

type FormState = {
  nombre: string;
  apellidos: string;
  email: string;
  tel: string;
  status: Profesor['status'];
  caps: Capacitacion[];
};

const EMPTY_FORM: FormState = {
  nombre: '',
  apellidos: '',
  email: '',
  tel: '',
  status: 'active',
  caps: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfesorModal({ open, profesor, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // Sync form when modal opens
  useEffect(() => {
    if (!open) return;
    if (profesor) {
      setForm({
        nombre: profesor.nombre,
        apellidos: profesor.apellidos,
        email: profesor.email,
        tel: profesor.tel,
        status: profesor.status,
        caps: [...profesor.caps],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, profesor]);

  if (!open) return null;

  function toggleCap(cap: Capacitacion) {
    setForm((prev) => ({
      ...prev,
      caps: prev.caps.includes(cap)
        ? prev.caps.filter((c) => c !== cap)
        : [...prev.caps, cap],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        {/* Top accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-white">
            {profesor ? 'Editar profesor' : 'Añadir profesor'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/40 transition hover:text-white/80"
          >
            ✕
          </button>
        </div>
        <div className="h-px bg-white/[0.06]" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">

          {/* Nombre + Apellidos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Nombre</label>
              <input
                required
                className={inputClass}
                placeholder="Carlos"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Apellidos</label>
              <input
                required
                className={inputClass}
                placeholder="Martínez"
                value={form.apellidos}
                onChange={(e) => setForm((p) => ({ ...p, apellidos: e.target.value }))}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email</label>
            <input
              required
              type="email"
              className={inputClass}
              placeholder="carlos@arcanstudios.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          {/* Teléfono + Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Teléfono</label>
              <input
                className={inputClass}
                placeholder="+34 600 000 000"
                value={form.tel}
                onChange={(e) => setForm((p) => ({ ...p, tel: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Estado</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.value as Profesor['status'] }))
                }
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Capacitaciones — toggleable pills */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Capacitaciones</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CAPS.map((cap) => {
                const selected = form.caps.includes(cap);
                const s = selected ? CAP_TOGGLE_STYLES[cap] : INACTIVE_TOGGLE_PILL;
                return (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => toggleCap(cap)}
                    className="rounded-full px-3 py-1 text-xs font-semibold transition"
                    style={{
                      color: s.color,
                      backgroundColor: s.bg,
                      border: `1px solid ${s.border}`,
                    }}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
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
