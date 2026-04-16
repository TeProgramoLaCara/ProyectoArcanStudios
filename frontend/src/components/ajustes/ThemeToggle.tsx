'use client';

import { useTheme } from '@/context/ThemeContext';
import COLORS from '@/resources/colors';

// ─── Mock preview de cada tema ────────────────────────────────────────────────

function DarkPreview() {
  return (
    <div
      className="flex overflow-hidden rounded-lg"
      style={{ backgroundColor: '#0d0d0d', height: '68px' }}
    >
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
    <div
      className="flex overflow-hidden rounded-lg"
      style={{ backgroundColor: '#ffffff', height: '68px' }}
    >
      <div className="w-9 shrink-0" style={{ backgroundColor: '#f0f0f0' }} />
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
        <div className="h-1.5 rounded-sm" style={{ width: '65%', backgroundColor: 'rgba(0,0,0,0.15)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '45%', backgroundColor: 'rgba(0,0,0,0.08)' }} />
        <div className="h-1.5 rounded-sm" style={{ width: '55%', backgroundColor: 'rgba(0,0,0,0.08)' }} />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

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
            isDark ? 'border-[#267F6B]' : 'border-black/[0.08]'
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
          <p className={`mt-2 text-center text-xs font-medium ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
            Oscuro
          </p>
        </button>

        {/* Claro */}
        <button
          type="button"
          onClick={() => { if (isDark) toggleTheme(); }}
          className={`relative overflow-hidden rounded-[14px] border p-2.5 transition-colors ${
            !isDark ? 'border-[#267F6B]' : 'border-white/10'
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
          <p className={`mt-2 text-center text-xs font-medium ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
            Claro
          </p>
        </button>

      </div>

      {/* Pill toggle deslizante */}
      <div className="flex items-center gap-4">
        <span className={`min-w-[48px] text-sm font-medium ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
          {isDark ? 'Oscuro' : 'Claro'}
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={!isDark}
          aria-label="Cambiar tema"
          onClick={toggleTheme}
          className={`relative h-7 w-14 rounded-full border transition-colors ${
            isDark ? 'border-white/10 bg-white/10' : 'border-black/[0.08] bg-black/[0.08]'
          }`}
        >
          {/* Círculo deslizante */}
          <span
            className="absolute top-1 h-5 w-5 rounded-full shadow-sm transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: COLORS.accent,
              left: isDark ? '4px' : 'calc(100% - 24px)',
            }}
          />
        </button>

        <span className={`text-xs ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
          {isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
        </span>
      </div>

    </div>
  );
}
