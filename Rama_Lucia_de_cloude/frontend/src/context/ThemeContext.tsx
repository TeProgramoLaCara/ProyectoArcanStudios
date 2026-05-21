'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyTheme(t: Theme) {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  html.classList.add(t);
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // Leer del localStorage al montar (cliente únicamente)
  useEffect(() => {
    const stored = localStorage.getItem('arcan-theme') as Theme | null;
    const resolved: Theme =
      stored === 'dark' || stored === 'light' ? stored : 'dark';
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('arcan-theme', next);
    applyTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
