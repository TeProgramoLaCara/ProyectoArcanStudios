'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  professorId: string;
  professorName: string;
};

type StoredAccount = {
  username: string;
  email: string;
};

const STORAGE_KEY = 'arcan-professor-account-settings';

function readStored(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StoredAccount>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeStored(next: Record<string, StoredAccount>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function defaultUsername(name: string) {
  return name.toLowerCase().replace(/\s+/g, '.');
}

function defaultEmail(name: string) {
  return `${defaultUsername(name)}@arcanstudios.com`;
}

export default function ProfessorAccountSettingsForm({ professorId, professorName }: Props) {
  const { isDark } = useTheme();
  const [username, setUsername] = useState(defaultUsername(professorName));
  const [email, setEmail] = useState(defaultEmail(professorName));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStored();
    const account = stored[professorId];
    setUsername(account?.username ?? defaultUsername(professorName));
    setEmail(account?.email ?? defaultEmail(professorName));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setMessage(null);
  }, [professorId, professorName]);

  const inputClass = isDark
    ? 'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30'
    : 'w-full rounded-xl border border-black/[0.08] bg-[#e8edf2] px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30';

  const labelClass = `text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`;

  function handleSave() {
    setError(null);
    setMessage(null);

    if (!username.trim() || !email.trim()) {
      setError('Usuario y correo son obligatorios.');
      return;
    }

    const wantsPasswordChange = Boolean(newPassword || confirmPassword || currentPassword);
    if (wantsPasswordChange) {
      if (!currentPassword) {
        setError('Para cambiar la contraseña debes introducir primero la contraseña anterior.');
        return;
      }
      if (!newPassword || !confirmPassword) {
        setError('Completa la nueva contraseña y su confirmación.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('La nueva contraseña y la confirmación no coinciden.');
        return;
      }
    }

    const next = readStored();
    next[professorId] = {
      username: username.trim(),
      email: email.trim(),
    };
    writeStored(next);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('Cambios guardados correctamente.');
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Usuario</label>
        <input
          type="text"
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu nombre de usuario"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Correo vinculado</label>
        <input
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu.correo@arcanstudios.com"
        />
      </div>

      <div className="h-px bg-white/10" />

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Contraseña anterior (obligatoria para cambiar)</label>
        <input
          type="password"
          className={inputClass}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Nueva contraseña</label>
        <input
          type="password"
          className={inputClass}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Confirmar nueva contraseña</label>
        <input
          type="password"
          className={inputClass}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-xs text-rose-300">{error}</p>}
      {message && <p className="text-xs text-emerald-300">{message}</p>}

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
