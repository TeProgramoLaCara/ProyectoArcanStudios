'use client';

import SettingsSection from '@/components/ajustes/SettingsSection';
import ProfileSettingsForm from '@/components/ajustes/ProfileSettingsForm';
import ThemeToggle from '@/components/ajustes/ThemeToggle';

export default function AjustesPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Cabecera */}
      <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-linear-to-l from-[#267F6B]/10 to-transparent" />
        <div className="px-6 py-5">
          <h1 className="text-xl font-bold text-(--text-primary)">Ajustes</h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Configura tu cuenta y preferencias de la aplicación.
          </p>
        </div>
        <div className="h-px bg-linear-to-r from-transparent via-[#267F6B]/40 to-transparent" />
      </div>

      {/* Contenido en dos columnas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <SettingsSection title="Perfil" description="Actualiza tu nombre de usuario y contraseña.">
          <ProfileSettingsForm />
        </SettingsSection>

        <SettingsSection title="Apariencia" description="Elige el tema visual de la aplicación.">
          <ThemeToggle />
        </SettingsSection>
      </div>
    </div>
  );
}
