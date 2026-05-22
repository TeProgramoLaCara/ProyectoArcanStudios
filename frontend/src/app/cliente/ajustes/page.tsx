'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { type Empresa, type Reserva } from '@/resources/data';
import SettingsSection from '@/components/ajustes/SettingsSection';
import ProfileSettingsForm from '@/components/ajustes/ProfileSettingsForm';
import ThemeToggle from '@/components/ajustes/ThemeToggle';
import { getClientApiData } from '@/services/client.service';

const CURRENT_CLIENT = 'Alejandro Vega';

export default function AjustesClientePage() {
  const { isDark } = useTheme();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    getClientApiData()
      .then((data) => {
        setReservas(data.reservas);
        setEmpresas(data.empresas);
      })
      .catch((error) => {
        console.error('Error cargando ajustes cliente:', error);
      });
  }, []);

  const currentCompany = useMemo(
    () => reservas.find((reserva) => reserva.clientName === CURRENT_CLIENT)?.company ?? 'Sin empresa',
    [reservas],
  );

  const companyMembers = useMemo(
    () => empresas.find((empresa) => empresa.name === currentCompany)?.usuarios ?? [],
    [currentCompany, empresas],
  );

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`relative overflow-hidden rounded-[26px] border ${
          isDark
            ? 'border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.22)]'
            : 'border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]'
        }`}
      >
        <div
          className={`pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l to-transparent ${
            isDark ? 'from-[#267F6B]/10' : 'from-[#267F6B]/[0.08]'
          }`}
        />
        <div className="px-6 py-5">
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Ajustes</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-[#475569]'}`}>
            Configura tu cuenta, apariencia y visibilidad de tu empresa.
          </p>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#267F6B]/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <SettingsSection
          title="Perfil"
          description="Actualiza tu usuario y contraseña de acceso."
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

      <SettingsSection
        title="Empresa asociada"
        description="Miembros vinculados a tu empresa en la plataforma."
      >
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-(--border) bg-(--surface-elevated) px-4 py-3">
            <p className="text-sm font-semibold text-(--text-primary)">{currentCompany}</p>
            <p className="mt-1 text-xs text-(--text-secondary)">
              {companyMembers.length} miembro(s) registrado(s)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {companyMembers.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border border-(--border) bg-surface px-3 py-2 text-sm text-(--text-primary)"
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
