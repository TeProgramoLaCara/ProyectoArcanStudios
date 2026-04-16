'use client';

import { useTheme } from '@/context/ThemeContext';
import SettingsSection from '@/components/ajustes/SettingsSection';
import ProfileSettingsForm from '@/components/ajustes/ProfileSettingsForm';
import ThemeToggle from '@/components/ajustes/ThemeToggle';

export default function AjustesPage() {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col gap-6">

      {/* Cabecera */}
      <div className={`relative overflow-hidden rounded-[26px] border ${
        isDark
          ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
          : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
      }`}>
        <div className={`pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l to-transparent ${
          isDark ? 'from-[#267F6B]/10' : 'from-[#267F6B]/[0.08]'
        }`} />
        <div className="px-6 py-5">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Ajustes</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
            Configura tu cuenta y preferencias de la aplicación.
          </p>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#267F6B]/40 to-transparent" />
      </div>

      {/* Contenido en dos columnas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">

        <SettingsSection
          title="Perfil"
          description="Actualiza tu nombre de usuario y contraseña."
        >
          <ProfileSettingsForm />
        </SettingsSection>

        <SettingsSection
          title="Apariencia"
          description="Elige el tema visual de la aplicación."
        >
          <ThemeToggle />
        </SettingsSection>

      </div>
    </div>
  );
}
