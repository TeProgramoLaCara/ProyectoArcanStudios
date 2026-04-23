'use client';

import { useState } from 'react';

const inputClass =
  'w-full rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30';

const labelClass = 'text-xs font-medium uppercase tracking-wider text-(--text-muted)';

function PasswordField({ label, placeholder = '••••••••' }: { label: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          className={`${inputClass} pr-20`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-(--text-muted) transition hover:text-(--text-secondary)"
        >
          {visible ? 'Ocultar' : 'Ver'}
        </button>
      </div>
    </div>
  );
}

export default function ProfileSettingsForm() {
  const [username, setUsername] = useState('');

  return (
    <div className="flex flex-col gap-4">
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

      <PasswordField label="Contraseña actual" />
      <PasswordField label="Nueva contraseña" />
      <PasswordField label="Confirmar contraseña" />

      <div className="flex justify-end pt-1">
        <button
          type="button"
          className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
