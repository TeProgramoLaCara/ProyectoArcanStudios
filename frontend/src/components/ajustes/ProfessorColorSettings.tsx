'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  professorId: string;
  professorName: string;
};

const STORAGE_KEY = 'arcan-professor-color-overrides';
const DEFAULT_PROFESSOR_COLOR = '#9ca3af';

function readOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export default function ProfessorColorSettings({ professorId, professorName }: Props) {
  const { isDark } = useTheme();
  const [savedOverrideCount, setSavedOverrideCount] = useState(0);
  const [currentColor, setCurrentColor] = useState(DEFAULT_PROFESSOR_COLOR);

  useEffect(() => {
    const overrides = readOverrides();
    setSavedOverrideCount(Object.keys(overrides).length);
    setCurrentColor(overrides[professorId] ?? DEFAULT_PROFESSOR_COLOR);
  }, [professorId]);

  function handleSaveColor() {
    const overrides = readOverrides();
    overrides[professorId] = currentColor;
    writeOverrides(overrides);
    setSavedOverrideCount(Object.keys(overrides).length);
  }

  function handleResetColor() {
    const overrides = readOverrides();
    delete overrides[professorId];
    writeOverrides(overrides);
    setSavedOverrideCount(Object.keys(overrides).length);
    setCurrentColor(DEFAULT_PROFESSOR_COLOR);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#94a3b8]'}`}>
          Profesor vinculado
        </label>
        <div
          className={
            isDark
              ? 'w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm text-white'
              : 'w-full rounded-xl border border-black/[0.08] bg-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a]'
          }
        >
          {professorName}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-white/20 bg-transparent p-0"
        />
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>
            Color asociado al profesor
          </span>
          <span className={`text-xs ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
            Guardado local ({savedOverrideCount} personalizaciones activas)
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleResetColor}
          className={
            isDark
              ? 'rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white'
              : 'rounded-xl border border-black/[0.08] px-4 py-2 text-sm text-[#475569] hover:text-[#0f172a]'
          }
        >
          Restaurar
        </button>
        <button
          type="button"
          onClick={handleSaveColor}
          className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
        >
          Guardar color
        </button>
      </div>
    </div>
  );
}
