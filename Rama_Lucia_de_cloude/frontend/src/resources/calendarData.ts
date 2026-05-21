// src/resources/calendarData.ts
// Tipos y datos mock del calendario de Arcan Studios
 
export type Aula = 'aula1' | 'aula2' | 'aula3';
export type Turno = 'mañana' | 'tarde';
 
export interface CalendarEvent {
  id: string;
  title: string;
  empresa: string;
  empresaId: string;
  profesor: string;
  profesorId: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD exclusive
  aula: Aula;
  turno: Turno;
  tool: string;
  color: string; // color hex del evento según aula
}
 
// ── Paleta por aula — consistente con el design system del admin ──────────────
export const AULA_META: Record<Aula, { label: string; color: string; bg: string }> = {
  aula1: { label: 'Aula 1', color: '#7c6fff', bg: 'rgba(124,111,255,0.12)' },
  aula2: { label: 'Aula 2', color: '#ff7eb3', bg: 'rgba(255,126,179,0.12)' },
  aula3: { label: 'Aula 3', color: '#00c9a7', bg: 'rgba(0,201,167,0.12)'  },
};
 
export const TURNO_META: Record<Turno, { label: string; icon: string; color: string; bg: string }> = {
  mañana: { label: 'Mañana', icon: '☀️', color: '#ffb347', bg: 'rgba(255,179,71,0.14)' },
  tarde:  { label: 'Tarde',  icon: '🌙', color: '#4fa3ff', bg: 'rgba(79,163,255,0.14)'  },
};
 
export const TOOL_ICON: Record<string, string> = {
  Blender:   '🟠',
  Unity:     '🔵',
  Unreal:    '🟣',
  ZBrush:    '🔴',
  'Maya 3D': '🟢',
};
 
export const EMPRESAS = [
  { id: 'e1', nombre: 'Studio Norte'  },
  { id: 'e2', nombre: 'PixelCraft SL' },
  { id: 'e3', nombre: 'MeshLab Co.'   },
  { id: 'e4', nombre: 'Vertex Studio' },
  { id: 'e5', nombre: 'Nova Design'   },
];
 
export const PROFESORES = [
  { id: 'p1', nombre: 'Laura Pérez'  },
  { id: 'p2', nombre: 'Carlos Díaz'  },
  { id: 'p3', nombre: 'Ana Torres'   },
  { id: 'p4', nombre: 'Marcos Gil'   },
  { id: 'p5', nombre: 'Sofía Ruiz'   },
];
 
export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1', title: 'Blender Fundamentals',
    empresa: 'Studio Norte', empresaId: 'e1',
    profesor: 'Laura Pérez', profesorId: 'p1',
    start: '2026-05-04', end: '2026-05-22',
    aula: 'aula1', turno: 'mañana', tool: 'Blender',
    color: AULA_META.aula1.color,
  },
  {
    id: '2', title: 'Unity Avanzado',
    empresa: 'PixelCraft SL', empresaId: 'e2',
    profesor: 'Carlos Díaz', profesorId: 'p2',
    start: '2026-05-06', end: '2026-05-24',
    aula: 'aula2', turno: 'tarde', tool: 'Unity',
    color: AULA_META.aula2.color,
  },
  {
    id: '3', title: 'ZBrush Sculpting',
    empresa: 'MeshLab Co.', empresaId: 'e3',
    profesor: 'Ana Torres', profesorId: 'p3',
    start: '2026-05-11', end: '2026-05-29',
    aula: 'aula3', turno: 'mañana', tool: 'ZBrush',
    color: AULA_META.aula3.color,
  },
  {
    id: '4', title: 'Unreal Engine 5',
    empresa: 'Nova Design', empresaId: 'e5',
    profesor: 'Marcos Gil', profesorId: 'p4',
    start: '2026-05-18', end: '2026-06-05',
    aula: 'aula1', turno: 'tarde', tool: 'Unreal',
    color: AULA_META.aula1.color,
  },
  {
    id: '5', title: 'Maya 3D Pro',
    empresa: 'Vertex Studio', empresaId: 'e4',
    profesor: 'Sofía Ruiz', profesorId: 'p5',
    start: '2026-05-25', end: '2026-06-12',
    aula: 'aula2', turno: 'mañana', tool: 'Maya 3D',
    color: AULA_META.aula2.color,
  },
  {
    id: '6', title: 'Blender Rigging',
    empresa: 'MeshLab Co.', empresaId: 'e3',
    profesor: 'Laura Pérez', profesorId: 'p1',
    start: '2026-04-21', end: '2026-05-09',
    aula: 'aula3', turno: 'tarde', tool: 'Blender',
    color: AULA_META.aula3.color,
  },
  {
    id: '7', title: 'Unity Shaders',
    empresa: 'Studio Norte', empresaId: 'e1',
    profesor: 'Carlos Díaz', profesorId: 'p2',
    start: '2026-05-05', end: '2026-05-23',
    aula: 'aula2', turno: 'mañana', tool: 'Unity',
    color: AULA_META.aula2.color,
  },
];
 