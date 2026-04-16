"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import CourseCard from "@/components/courses/CourseCard";
import CapacitacionCard from "@/components/courses/CapacitacionCard";
import { cursos, capacitaciones } from "@/resources/data";

// ─── Helper class builders ────────────────────────────────────────────────────

function getInputClass(isDark: boolean) {
  return isDark
    ? "w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30"
    : "w-full rounded-xl border border-black/[0.08] bg-[#e8edf2] px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30";
}

function getSelectClass(isDark: boolean) {
  return isDark
    ? "w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#267F6B]/60"
    : "w-full rounded-xl border border-black/[0.08] bg-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#267F6B]/60";
}

function getLabelClass(isDark: boolean) {
  return isDark
    ? "text-xs font-medium uppercase tracking-wider text-white/40"
    : "text-xs font-medium uppercase tracking-wider text-[#94a3b8]";
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 backdrop-blur-sm ${isDark ? "bg-black/70" : "bg-black/40"}`}
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border shadow-[0_32px_80px_rgba(0,0,0,0.7)] ${
        isDark ? "border-white/10 bg-[#111111]" : "border-black/[0.08] bg-[#ffffff]"
      }`}>
        <div className="h-[3px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" />
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-[#0f172a]"}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${
              isDark
                ? "border-white/10 bg-white/5 text-white/40 hover:text-white/80"
                : "border-black/[0.08] bg-black/[0.04] text-[#94a3b8] hover:text-[#0f172a]"
            }`}
          >
            ✕
          </button>
        </div>
        <div className={`h-px ${isDark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`} />
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Create modals ────────────────────────────────────────────────────────────

function CreateCursoModal({ onClose }: { onClose: () => void }) {
  const { isDark } = useTheme();
  const inputClass = getInputClass(isDark);
  const selectClass = getSelectClass(isDark);
  const labelClass = getLabelClass(isDark);

  return (
    <Modal title="Nuevo curso" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input className={inputClass} placeholder="Ej: Creación de Assets para Videojuegos" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Descripción</label>
          <textarea rows={3} className={`${inputClass} resize-none`} placeholder="Describe el objetivo y contenido del curso..." />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Categoría</label>
          <select className={selectClass}>
            <option value="">Selecciona una categoría</option>
            <option value="Blender">Blender</option>
            <option value="Unity">Unity</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Capacitaciones incluidas</label>
          <div className="flex flex-col gap-2">
            {[1, 2].map((n) => (
              <select key={n} className={selectClass}>
                <option value="">Capacitación {n}</option>
                {capacitaciones.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              isDark ? "border-white/10 text-white/50 hover:text-white/80" : "border-black/[0.08] text-[#475569] hover:text-[#0f172a]"
            }`}
          >
            Cancelar
          </button>
          <button className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]">
            Crear curso
          </button>
        </div>
      </div>
    </Modal>
  );
}

function CreateCapacitacionModal({ onClose }: { onClose: () => void }) {
  const { isDark } = useTheme();
  const inputClass = getInputClass(isDark);
  const selectClass = getSelectClass(isDark);
  const labelClass = getLabelClass(isDark);

  return (
    <Modal title="Nueva capacitación" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input className={inputClass} placeholder="Ej: Modelado 3D en Blender" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Descripción</label>
          <textarea rows={3} className={`${inputClass} resize-none`} placeholder="Describe el contenido de la capacitación..." />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Categoría</label>
          <select className={selectClass}>
            <option value="">Selecciona una categoría</option>
            <option value="Blender">Blender</option>
            <option value="Unity">Unity</option>
          </select>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              isDark ? "border-white/10 text-white/50 hover:text-white/80" : "border-black/[0.08] text-[#475569] hover:text-[#0f172a]"
            }`}
          >
            Cancelar
          </button>
          <button className="rounded-xl bg-[#267F6B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2fa58a]">
            Crear capacitación
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  count,
  onAdd,
  addLabel,
}: {
  title: string;
  subtitle: string;
  count: number;
  onAdd: () => void;
  addLabel: string;
}) {
  const { isDark } = useTheme();

  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>{title}</h2>
        <p className={`mt-1 text-sm ${isDark ? "text-white/45" : "text-[#475569]"}`}>{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
          isDark ? "border-white/10 bg-white/5 text-white/50" : "border-black/[0.08] bg-black/[0.04] text-[#475569]"
        }`}>
          {count} items
        </span>
        <button
          onClick={onAdd}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            isDark
              ? "border-[#267F6B]/40 bg-[#267F6B]/15 text-[#2fa58a] hover:bg-[#267F6B]/25 hover:border-[#267F6B]/60"
              : "border-[#267F6B]/50 bg-[#267F6B]/10 text-[#267F6B] hover:bg-[#267F6B]/20 hover:border-[#267F6B]/70"
          }`}
        >
          <span className="text-base leading-none">+</span>
          {addLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CursosPage() {
  const [showCursoModal, setShowCursoModal] = useState(false);
  const [showCapModal, setShowCapModal] = useState(false);
  const { isDark } = useTheme();

  return (
    <>
      <section className={`p-6 ${isDark ? "bg-[#050505]" : "bg-[#f8fafc]"}`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10">

          {/* Page header */}
          <div className={`relative overflow-hidden rounded-[26px] border p-6 ${
            isDark
              ? "border-white/10 bg-[#0d0d0d] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
              : "border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
          }`}>
            <div className={`pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l to-transparent ${
              isDark ? "from-[#267F6B]/10" : "from-[#267F6B]/[0.08]"
            }`} />
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>Cursos y Capacitaciones</h1>
            <p className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-[#475569]"}`}>
              Catálogo completo de formaciones disponibles. Cada curso incluye dos capacitaciones especializadas.
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400/70" />
                <span className={`text-xs ${isDark ? "text-white/40" : "text-[#94a3b8]"}`}>Blender</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400/70" />
                <span className={`text-xs ${isDark ? "text-white/40" : "text-[#94a3b8]"}`}>Unity</span>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">

            {/* Left column — Cursos */}
            <div className="flex flex-col gap-5 flex-1 lg:pr-8">
              <SectionHeader
                title="Cursos"
                subtitle="Programas completos formados por dos capacitaciones."
                count={cursos.length}
                onAdd={() => setShowCursoModal(true)}
                addLabel="Nuevo curso"
              />
              <div className="flex flex-col gap-4">
                {cursos.map((curso) => (
                  <CourseCard key={curso.id} course={curso} capacitaciones={capacitaciones} />
                ))}
              </div>
            </div>

            {/* Vertical divider */}
            <div className={`hidden lg:block w-px self-stretch ${isDark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`} />

            {/* Right column — Capacitaciones */}
            <div className="flex flex-col gap-5 flex-1 lg:pl-8">
              <SectionHeader
                title="Capacitaciones"
                subtitle="Módulos individuales que componen los cursos."
                count={capacitaciones.length}
                onAdd={() => setShowCapModal(true)}
                addLabel="Nueva capacitación"
              />
              <div className="flex flex-col gap-4">
                {capacitaciones.map((cap) => (
                  <CapacitacionCard key={cap.id} cap={cap} />
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {showCursoModal && <CreateCursoModal onClose={() => setShowCursoModal(false)} />}
      {showCapModal && <CreateCapacitacionModal onClose={() => setShowCapModal(false)} />}
    </>
  );
}
