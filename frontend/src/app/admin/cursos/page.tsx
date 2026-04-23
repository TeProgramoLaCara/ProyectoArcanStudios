"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import CourseCard from "@/components/courses/CourseCard";
import CapacitacionCard from "@/components/courses/CapacitacionCard";
import { cursos, capacitaciones } from "@/resources/data";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30";

const selectClass =
  "w-full rounded-xl border border-(--border) bg-surface-input px-4 py-2.5 text-sm text-(--text-primary) outline-none transition focus:border-[#267F6B]/60";

const labelClass = "text-xs font-medium uppercase tracking-wider text-(--text-muted)";

// ─── Modal wrapper ────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-sm bg-(--overlay-bg)" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-(--border) bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        <div className="h-0.75 w-full bg-linear-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" />
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-(--text-primary)">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-(--border) bg-surface-elevated text-xs text-(--text-muted) transition hover:text-(--text-primary)"
          >
            ✕
          </button>
        </div>
        <div className="h-px bg-(--border-subtle)" />
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ─── Create modals ────────────────────────────────────────────────────────────

function CreateCursoModal({ onClose }: { onClose: () => void }) {
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
          <button onClick={onClose} className="rounded-xl border border-(--border) px-4 py-2 text-sm text-(--text-secondary) transition hover:text-(--text-primary)">
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
          <button onClick={onClose} className="rounded-xl border border-(--border) px-4 py-2 text-sm text-(--text-secondary) transition hover:text-(--text-primary)">
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

function SectionHeader({ title, subtitle, count, onAdd, addLabel }: {
  title: string; subtitle: string; count: number; onAdd: () => void; addLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-(--text-primary)">{title}</h2>
        <p className="mt-1 text-sm text-(--text-secondary)">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-(--border) bg-surface-elevated px-3 py-1 text-xs font-medium text-(--text-secondary)">
          {count} items
        </span>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl border border-[#267F6B]/50 bg-[#267F6B]/10 px-4 py-2 text-sm font-semibold text-[#267F6B] transition hover:bg-[#267F6B]/20 hover:border-[#267F6B]/70"
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

  return (
    <>
      <section className="p-6 bg-background">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10">

          {/* Page header */}
          <div className="relative overflow-hidden rounded-[26px] border border-(--border) bg-surface p-6 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-linear-to-l from-[#267F6B]/10 to-transparent" />
            <h1 className="text-3xl font-bold text-(--text-primary)">Cursos y Capacitaciones</h1>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Catálogo completo de formaciones disponibles. Cada curso incluye dos capacitaciones especializadas.
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400/70" />
                <span className="text-xs text-(--text-muted)">Blender</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400/70" />
                <span className="text-xs text-(--text-muted)">Unity</span>
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
            <div className="hidden lg:block w-px self-stretch bg-(--border-subtle)" />

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
