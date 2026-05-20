"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30";

const labelClass =
  "text-xs font-medium uppercase tracking-wider text-(--text-muted)";

function PasswordField({
  label,
  value,
  onChange,
  placeholder = "••••••••",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={`${inputClass} pr-20`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-(--text-muted) transition hover:text-(--text-secondary)"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>
  );
}

export default function ProfileSettingsForm() {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setMessage(null);
    if (!current || !next) {
      setMessage({ type: "error", text: "Completa contraseña actual y nueva." });
      return;
    }
    if (next !== confirm) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }
    if (next.length < 6) {
      setMessage({
        type: "error",
        text: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ current, next }),
      });
      setMessage({ type: "ok", text: "Contraseña actualizada correctamente." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "No se pudo actualizar.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Nombre</label>
        <input
          type="text"
          className={inputClass}
          disabled
          value={user?.nombre ?? ""}
          readOnly
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Email</label>
        <input
          type="email"
          className={inputClass}
          disabled
          value={user?.email ?? ""}
          readOnly
        />
        <span className="text-[11px] text-(--text-muted)">
          Para cambiar el email, contacta con el administrador.
        </span>
      </div>

      <PasswordField
        label="Contraseña actual"
        value={current}
        onChange={setCurrent}
      />
      <PasswordField
        label="Nueva contraseña"
        value={next}
        onChange={setNext}
      />
      <PasswordField
        label="Confirmar contraseña"
        value={confirm}
        onChange={setConfirm}
      />

      {message && (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            message.type === "ok"
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-700"
              : "border-red-400/40 bg-red-500/10 text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a] disabled:opacity-60"
        >
          {submitting ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
