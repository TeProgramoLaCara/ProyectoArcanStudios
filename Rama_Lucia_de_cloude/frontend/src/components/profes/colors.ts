import type { Capacitacion } from './types';

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const AVATAR_COLORS = [
  '#267F6B',
  '#e05a1a',
  '#38a8e0',
  '#b06fe0',
  '#f59e0b',
  '#ef4444',
] as const;

// ─── Status ───────────────────────────────────────────────────────────────────

export const STATUS_COLORS = {
  active: {
    dot: '#267F6B',
    text: '#2fa58a',
  },
  inactive: {
    dot: 'var(--status-inactive-dot)',
    text: 'var(--status-inactive-text)',
  },
} as const;

// ─── Capacitaciones ───────────────────────────────────────────────────────────

export type PillStyle = { color: string; bg: string; border: string };

/** Lista ordenada de todas las capacitaciones disponibles. */
export const ALL_CAPS: Capacitacion[] = [
  'Blender',
  'Unity',
  'Unreal Engine',
  'ZBrush',
  'Maya 3D',
];

/** Estilos de pill para mostrar capacitaciones (cards, listas). */
export const CAP_PILL_STYLES: Record<Capacitacion, PillStyle> = {
  Blender: {
    color: '#e05a1a',
    bg: 'rgba(234,88,12,0.08)',
    border: 'rgba(234,88,12,0.25)',
  },
  Unity: {
    color: '#38a8e0',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.25)',
  },
  'Unreal Engine': {
    color: '#b06fe0',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
  },
  ZBrush: {
    color: '#267F6B',
    bg: 'rgba(38,127,107,0.15)',
    border: 'rgba(38,127,107,0.35)',
  },
  'Maya 3D': {
    color: '#38a8e0',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.25)',
  },
};

/** Estilos de pill togglable en estado seleccionado (modales). */
export const CAP_TOGGLE_STYLES: Record<Capacitacion, PillStyle> = {
  Blender: {
    color: '#e05a1a',
    bg: 'rgba(234,88,12,0.12)',
    border: 'rgba(234,88,12,0.45)',
  },
  Unity: {
    color: '#38a8e0',
    bg: 'rgba(14,165,233,0.12)',
    border: 'rgba(14,165,233,0.45)',
  },
  'Unreal Engine': {
    color: '#b06fe0',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.45)',
  },
  ZBrush: {
    color: '#267F6B',
    bg: 'rgba(38,127,107,0.18)',
    border: 'rgba(38,127,107,0.5)',
  },
  'Maya 3D': {
    color: '#38a8e0',
    bg: 'rgba(14,165,233,0.12)',
    border: 'rgba(14,165,233,0.45)',
  },
};

/** Estilos de pill togglable en estado no seleccionado (modales). */
export const INACTIVE_TOGGLE_PILL: PillStyle = {
  color: 'var(--inactive-pill-color)',
  bg: 'var(--inactive-pill-bg)',
  border: 'var(--inactive-pill-border)',
};
