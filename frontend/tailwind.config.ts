/**
 * Configuración de Tailwind CSS — Arcan Studios.
 *
 * En Tailwind v4 el sistema de temas se gestiona principalmente en globals.css
 * mediante @theme inline y variables CSS. Este archivo extiende los colores
 * personalizados para completar la integración con utilidades semánticas.
 *
 * Los valores "var(--x)" se resuelven en tiempo de ejecución, por lo que
 * bg-surface, bg-background, text-primary, etc. respetan el tema activo.
 */
export default {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background:          'var(--bg)',
        surface:             'var(--surface)',
        'surface-elevated':  'var(--surface-elevated)',
        'surface-input':     'var(--surface-input)',
        'text-primary':      'var(--text-primary)',
        'text-secondary':    'var(--text-secondary)',
        'text-muted':        'var(--text-muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          light:   'var(--accent-light)',
        },
      },
    },
  },
  plugins: [],
};
