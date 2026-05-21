"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import SettingsSection from "@/components/ajustes/SettingsSection";
import ProfileSettingsForm from "@/components/ajustes/ProfileSettingsForm";
import ThemeToggle from "@/components/ajustes/ThemeToggle";
import { listUsuarios, type ApiUsuario } from "@/services/clientes.service";

export default function AjustesClientePage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [members, setMembers] = useState<ApiUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.empresa?.id) {
      setLoading(false);
      return;
    }
    listUsuarios()
      .then((all) =>
        setMembers(all.filter((u) => u.empresa?.id_empresa === user.empresa?.id)),
      )
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [user?.empresa?.id]);

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`relative overflow-hidden rounded-[26px] border ${
          isDark
            ? "border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.22)]"
            : "border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
        }`}
      >
        <div
          className={`pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l to-transparent ${
            isDark ? "from-[#267F6B]/10" : "from-[#267F6B]/[0.08]"
          }`}
        />
        <div className="px-6 py-5">
          <h1
            className={`text-xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}
          >
            Ajustes
          </h1>
          <p
            className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-[#475569]"}`}
          >
            Configura tu cuenta, apariencia y consulta a tu equipo.
          </p>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#267F6B]/40 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <SettingsSection
          title="Perfil"
          description="Actualiza tu contraseña de acceso."
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

      {user?.empresa && (
        <SettingsSection
          title="Empresa asociada"
          description="Miembros vinculados a tu empresa en la plataforma."
        >
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-(--border) bg-(--surface-elevated) px-4 py-3">
              <p className="text-sm font-semibold text-(--text-primary)">
                {user.empresa.nombre}
              </p>
              <p className="mt-1 text-xs text-(--text-secondary)">
                {loading
                  ? "Cargando…"
                  : `${members.length} miembro${members.length !== 1 ? "s" : ""} registrado${members.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {!loading && members.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {members.map((u) => (
                  <div
                    key={u.id_usuario}
                    className="rounded-lg border border-(--border) bg-surface px-3 py-2 text-sm text-(--text-primary)"
                  >
                    <p className="font-medium">{u.nombre}</p>
                    <p className="text-xs text-(--text-secondary)">{u.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SettingsSection>
      )}
    </div>
  );
}
