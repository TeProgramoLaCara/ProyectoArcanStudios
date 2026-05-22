'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import SettingsSection from '@/components/ajustes/SettingsSection';
import ProfessorAccountSettingsForm from '@/components/ajustes/ProfessorAccountSettingsForm';
import ThemeToggle from '@/components/ajustes/ThemeToggle';
import ProfessorColorSettings from '@/components/ajustes/ProfessorColorSettings';
import { getCalendarData } from '@/services/calendar.service';
import { mapCalendarApiData } from '@/components/calendar/calendar.mapper';

export default function AjustesProfesorPage() {
  const { isDark } = useTheme();
  const [professors, setProfessors] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    getCalendarData()
      .then((data) => {
        const mapped = mapCalendarApiData(data);
        setProfessors(mapped.professors.map((professor) => ({ id: professor.id, name: professor.name })));
      })
      .catch((error) => {
        console.error('Error cargando profesores en ajustes:', error);
      });
  }, []);

  const currentProfessor = useMemo(
    () => professors[0] ?? { id: '', name: 'Profesor no disponible' },
    [professors],
  );

  return (
    <div className="flex flex-col gap-6">
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
            Configura tu cuenta, apariencia y color de profesor asociado.
          </p>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#267F6B]/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <SettingsSection
          title="Perfil"
          description="Actualiza tu usuario, correo vinculado y contraseña."
        >
          <ProfessorAccountSettingsForm
            professorId={currentProfessor.id}
            professorName={currentProfessor.name}
          />
        </SettingsSection>

        <SettingsSection
          title="Apariencia"
          description="Elige el tema visual de la aplicación."
        >
          <ThemeToggle />
        </SettingsSection>
      </div>

      <SettingsSection
        title="Color de profesor"
        description="Cambia únicamente el color al que está relacionado tu perfil."
      >
        <ProfessorColorSettings
          professorId={currentProfessor.id}
          professorName={currentProfessor.name}
        />
      </SettingsSection>
    </div>
  );
}
