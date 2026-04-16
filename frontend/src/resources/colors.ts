/**
 * Paleta de colores centralizada de Arcan Studios.
 *
 * Uso en Tailwind: los valores de color se referencia como clases arbitrarias
 * del tipo bg-[#267F6B] mientras se migra a utilidades personalizadas.
 *
 * Uso en estilos dinámicos (inline / style={{}}): importar COLORS directamente.
 */

export const COLORS = {
  // ─── Acento principal ──────────────────────────────────────────────────────
  /** Verde acento base, usado en bordes activos, botones primarios y badges. */
  accent: "#267F6B",
  /** Verde acento claro, usado en textos de énfasis sobre fondo acento. */
  accentLight: "#2fa58a",

  // ─── Fondos y superficies ──────────────────────────────────────────────────
  /** Fondo global de página. */
  background: "#050505",
  /** Superficie de cards y paneles. */
  surface: "#0d0d0d",
  /** Superficie elevada (modales, tooltips, dropdowns). */
  surfaceElevated: "#141414",
  /** Fondo de inputs y campos de formulario. */
  surfaceInput: "#1a1a1a",

  // ─── Bordes ────────────────────────────────────────────────────────────────
  /** Borde estándar de componentes. */
  border: "rgba(255,255,255,0.10)",
  /** Borde sutil, divisores internos. */
  borderSubtle: "rgba(255,255,255,0.06)",

  // ─── Texto ────────────────────────────────────────────────────────────────
  /** Texto principal sobre fondo oscuro. */
  textPrimary: "#ffffff",
  /** Texto secundario, descripciones. */
  textSecondary: "rgba(255,255,255,0.55)",
  /** Texto atenuado, labels y metadatos. */
  textMuted: "rgba(255,255,255,0.35)",

  // ─── Categorías de cursos ─────────────────────────────────────────────────
  /** Color de categoría Blender — orange-500. */
  categoryBlender: "#f97316",
  /** Color de categoría Unity — sky-400. */
  categoryUnity: "#38bdf8",

  // ─── Estados de reserva ───────────────────────────────────────────────────
  /** Color de estado Pendiente — yellow-500. */
  statusPendiente: "#eab308",
  /** Color de estado Confirmada. */
  statusConfirmada: "#267F6B",
  /** Color de estado En curso — sky-400. */
  statusEnCurso: "#38bdf8",
  /** Color de estado Completada. */
  statusCompletada: "rgba(255,255,255,0.50)",
  /** Color de estado Cancelada — red-500. */
  statusCancelada: "#ef4444",
} as const;

export default COLORS;

/**
 * Paleta de colores para el tema claro.
 * El acento es idéntico en ambos temas.
 */
export const LIGHT_COLORS = {
  // ─── Acento principal ──────────────────────────────────────────────────────
  accent:          "#267F6B",
  accentLight:     "#2fa58a",

  // ─── Fondos y superficies ──────────────────────────────────────────────────
  background:      "#f8fafc",
  surface:         "#f1f5f9",
  surfaceElevated: "#e2e8f0",
  surfaceInput:    "#e8edf2",

  // ─── Bordes ────────────────────────────────────────────────────────────────
  border:          "rgba(0,0,0,0.08)",
  borderSubtle:    "rgba(0,0,0,0.05)",

  // ─── Texto ────────────────────────────────────────────────────────────────
  textPrimary:     "#0f172a",
  textSecondary:   "#475569",
  textMuted:       "#94a3b8",

  // ─── Categorías de cursos ─────────────────────────────────────────────────
  categoryBlender: "#ea580c",
  categoryUnity:   "#0284c7",

  // ─── Estados de reserva ───────────────────────────────────────────────────
  statusPendiente:  "#b45309",
  statusConfirmada: "#267F6B",
  statusEnCurso:    "#0284c7",
  statusCompletada: "#64748b",
  statusCancelada:  "#dc2626",
} as const;
