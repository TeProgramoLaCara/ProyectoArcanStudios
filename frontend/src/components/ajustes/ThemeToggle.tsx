'use client';

import { useTheme } from '@/context/ThemeContext';
import COLORS from '@/resources/colors';

function DarkPreview() {
  return (
    <div className="flex overflow-hidden rounded-lg" style={{ backgroundColor: '#0d0d0d', height: '68px' }}>
      <div className="w-9 shrink-0" style={{ backgroundColor: '#0a0a0a' }} />
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
        <div className="h-1.5 rounded-sm" style={{ width: '65%', backgroundColor: 'rgba(255,255,255,0.18)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '45%', backgroundColor: 'rgba(255,255,255,0.10)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '55%', backgroundColor: 'rgba(255,255,255,0.10)' }} />
      </div>
    </div>
  );
}

function LightPreview() {
  return (
    <div className="flex overflow-hidden rounded-lg" style={{ backgroundColor: '#f0ece4', height: '68px' }}>
      <div className="w-9 shrink-0" style={{ backgroundColor: '#e8e2d8' }} />
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
        <div className="h-1.5 rounded-sm" style={{ width: '65%', backgroundColor: 'rgba(100,78,42,0.20)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '45%', backgroundColor: 'rgba(100,78,42,0.12)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '55%', backgroundColor: 'rgba(100,78,42,0.12)' }} />
      </div>
    </div>
  );
}

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">

      {/* Tarjetas de previsualización */}
      <div className="grid grid-cols-2 gap-3">

        {/* Oscuro */}
        <button
          type="button"
          onClick={() => { if (!isDark) toggleTheme(); }}
          className={`relative overflow-hidden rounded-[14px] border p-2.5 transition-colors ${
            isDark ? 'border-[#267F6B]' : 'border-(--border)'
          }`}
        >
          {isDark && (
            <span
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: COLORS.accent }}
            >
              ✓
            </span>
          )}
          <DarkPreview />
          <p className="mt-2 text-center text-xs font-medium text-(--text-secondary)">Oscuro</p>
        </button>

        {/* Claro */}
        <button
          type="button"
          onClick={() => { if (isDark) toggleTheme(); }}
          className={`relative overflow-hidden rounded-[14px] border p-2.5 transition-colors ${
            !isDark ? 'border-[#267F6B]' : 'border-(--border)'
          }`}
        >
          {!isDark && (
            <span
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: COLORS.accent }}
            >
              ✓
            </span>
          )}
          <LightPreview />
          <p className="mt-2 text-center text-xs font-medium text-(--text-secondary)">Claro</p>
        </button>

      </div>

      {/* Pill toggle deslizante */}
      <div className="flex items-center gap-4">
        <span className="min-w-12 text-sm font-medium text-(--text-secondary)">
          {isDark ? 'Oscuro' : 'Claro'}
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={!isDark}
          aria-label="Cambiar tema"
          onClick={toggleTheme}
          className="relative h-7 w-14 rounded-full border border-(--border) bg-(--border) transition-colors"
        >
          <span
            className="absolute top-1 h-5 w-5 rounded-full shadow-sm transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: COLORS.accent,
              left: isDark ? '4px' : 'calc(100% - 24px)',
            }}
          />
        </button>

        <span className="text-xs text-(--text-muted)">
          {isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
        </span>
      </div>

    </div>
  );
}
