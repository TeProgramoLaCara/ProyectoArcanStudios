'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

// ─── PasswordField helper ─────────────────────────────────────────────────────

function PasswordField({
  label,
  placeholder = '••••••••',
}: {
  label: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  const { isDark } = useTheme();

  const inputClass = isDark
    ? 'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30 pr-20'
    : 'w-full rounded-xl border border-black/[0.08] bg-[#e8edf2] px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30 pr-20';

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          className={inputClass}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium transition ${
            isDark ? 'text-white/30 hover:text-white/60' : 'text-[#94a3b8] hover:text-[#475569]'
          }`}
        >
          {visible ? 'Ocultar' : 'Ver'}
        </button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileSettingsForm() {
  const [username, setUsername] = useState('');
  const { isDark } = useTheme();

  const inputClass = isDark
    ? 'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30'
    : 'w-full rounded-xl border border-black/[0.08] bg-[#e8edf2] px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30';

  const labelClass = `text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`;

  function handleSave() {
    console.log('save triggered');
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Nombre de usuario */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Usuario</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Contraseñas */}
      <PasswordField label="Contraseña actual" />
      <PasswordField label="Nueva contraseña" />
      <PasswordField label="Confirmar contraseña" />

      {/* Botón guardar */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
