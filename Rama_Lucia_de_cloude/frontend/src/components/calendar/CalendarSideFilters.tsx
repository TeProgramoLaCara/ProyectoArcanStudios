'use client';
 
// src/components/calendar/CalendarSideFilters.tsx
// Panel de filtros del sidebar del calendario (empresa, turno, aulas).
// Diseño alineado con el design system de Arcan Studios.
 
import type { Aula, Turno } from '@/resources/calendarData';
import { AULA_META, TURNO_META, EMPRESAS } from '@/resources/calendarData';
 
export interface SideFiltersState {
  empresaIds: string[];
  aulas: Aula[];
  turnos: Turno[];
}
 
export const DEFAULT_SIDE_FILTERS: SideFiltersState = {
  empresaIds: [],
  aulas: ['aula1', 'aula2', 'aula3'],
  turnos: ['mañana', 'tarde'],
};
 
interface Props {
  filters: SideFiltersState;
  onChange: (f: SideFiltersState) => void;
}
 
function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}
 
const ALL_AULAS: Aula[]  = ['aula1', 'aula2', 'aula3'];
const ALL_TURNOS: Turno[] = ['mañana', 'tarde'];
 
export function CalendarSideFilters({ filters, onChange }: Props) {
  const isDefault =
    filters.empresaIds.length === 0 &&
    filters.aulas.length === 3 &&
    filters.turnos.length === 2;
 
  return (
    <div className="rounded-2xl border border-(--border) bg-surface p-4 shadow-sm flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-(--text-primary)">Filtros</p>
        {!isDefault && (
          <button
            onClick={() => onChange(DEFAULT_SIDE_FILTERS)}
            className="text-[10px] font-semibold text-accent bg-(--accent)/10 px-2 py-1 rounded-lg hover:bg-(--accent)/20 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
 
      {/* ── Aulas ─────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-2">
          Aulas
        </p>
        <div className="flex flex-col gap-1.5">
          {ALL_AULAS.map(aula => {
            const meta   = AULA_META[aula];
            const active = filters.aulas.includes(aula);
            return (
              <button
                key={aula}
                onClick={() => onChange({ ...filters, aulas: toggle(filters.aulas, aula) })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all"
                style={{
                  background: active ? meta.bg : 'var(--border-subtle, rgba(255,255,255,0.04))',
                  borderColor: active ? `${meta.color}40` : 'var(--border)',
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-colors"
                  style={{ background: active ? meta.color : 'var(--text-muted)' }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: active ? meta.color : 'var(--text-secondary)' }}
                >
                  {meta.label}
                </span>
                {active && (
                  <span className="ml-auto text-[10px]" style={{ color: meta.color }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
 
      {/* ── Turno ─────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-2">
          Turno
        </p>
        <div className="flex gap-2">
          {ALL_TURNOS.map(turno => {
            const meta   = TURNO_META[turno];
            const active = filters.turnos.includes(turno);
            return (
              <button
                key={turno}
                onClick={() => onChange({ ...filters, turnos: toggle(filters.turnos, turno) })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all"
                style={{
                  background: active ? meta.bg : 'var(--border-subtle, rgba(255,255,255,0.04))',
                  borderColor: active ? `${meta.color}40` : 'var(--border)',
                  color: active ? meta.color : 'var(--text-secondary)',
                }}
              >
                <span>{meta.icon}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>
 
      {/* ── Empresa ───────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-2">
          Empresa
        </p>
        <div className="flex flex-col gap-1">
          {EMPRESAS.map(emp => {
            const active = filters.empresaIds.includes(emp.id);
            return (
              <button
                key={emp.id}
                onClick={() => onChange({ ...filters, empresaIds: toggle(filters.empresaIds, emp.id) })}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all"
                style={{
                  background: active ? 'rgba(38,127,107,0.10)' : 'var(--border-subtle, rgba(255,255,255,0.04))',
                  borderColor: active ? 'rgba(38,127,107,0.35)' : 'var(--border)',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: active ? '#267F6B' : 'var(--text-muted)' }}
                />
                <span
                  className="text-[11px]"
                  style={{
                    fontWeight: active ? 600 : 400,
                    color: active ? '#267F6B' : 'var(--text-secondary)',
                  }}
                >
                  {emp.nombre}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
 