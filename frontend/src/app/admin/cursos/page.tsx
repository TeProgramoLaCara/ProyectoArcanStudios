"use client";

import { useState } from "react";
import CourseCard, { type Curso, type Capacitacion } from "@/components/courses/CourseCard";
import CapacitacionCard from "@/components/courses/CapacitacionCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const capacitaciones: Capacitacion[] = [
  {
    id: "c1",
    title: "Modelado 3D en Blender",
    description:
      "Aprende a crear objetos tridimensionales desde cero usando las herramientas de modelado de Blender. Cubre desde primitivas hasta técnicas de sculpting básico.",
    category: "Blender",
  },
  {
    id: "c2",
    title: "Texturizado y UV Mapping",
    description:
      "Domina el proceso de UV unwrapping y aprende a aplicar materiales PBR realistas a tus modelos para uso en motores de videojuegos.",
    category: "Blender",
  },
  {
    id: "c3",
    title: "Introducción a Unity",
    description:
      "Configuración del entorno, navegación por el editor e importación de assets. Fundamentos del ciclo de desarrollo en Unity.",
    category: "Unity",
  },
  {
    id: "c4",
    title: "Scripting con C# en Unity",
    description:
      "Fundamentos de programación orientada a objetos aplicados al desarrollo de videojuegos. Movimiento, colisiones y lógica de juego.",
    category: "Unity",
  },
  {
    id: "c5",
    title: "Rigging y Animación",
    description:
      "Creación de armaduras y skinning de personajes en Blender. Exportación de animaciones optimizadas para Unity.",
    category: "Blender",
  },
  {
    id: "c6",
    title: "Diseño de Niveles",
    description:
      "Principios de level design aplicados en Unity. Uso de ProBuilder y técnicas de composición espacial para crear entornos jugables.",
    category: "Unity",
  },
];

const cursos: Curso[] = [
  {
    id: "k1",
    title: "Creación de Assets para Videojuegos",
    description:
      "Flujo de trabajo completo para crear y exportar assets 3D listos para producción, desde el concepto en Blender hasta su implementación en Unity.",
    capacitaciones: ["c1", "c2"],
    category: "Blender",
  },
  {
    id: "k2",
    title: "Desarrollo de Videojuegos con Unity",
    description:
      "Introducción práctica al desarrollo de videojuegos. Aprenderás a construir escenas interactivas y programar mecánicas básicas con C#.",
    capacitaciones: ["c3", "c4"],
    category: "Unity",
  },
  {
    id: "k3",
    title: "Personajes Animados para Unity",
    description:
      "Pipeline completo de personaje: modelado, rigging, animación en Blender e integración con el Animator Controller de Unity.",
    capacitaciones: ["c5", "c4"],
    category: "Blender",
  },
  {
    id: "k4",
    title: "Entornos y Niveles Interactivos",
    description:
      "Diseña entornos 3D completos con Blender y constrúyelos como niveles jugables en Unity utilizando técnicas profesionales de level design.",
    capacitaciones: ["c2", "c6"],
    category: "Unity",
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30";

const labelClass = "text-xs font-medium uppercase tracking-wider text-white/40";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B] to-[#267F6B]/0" />
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white/40 transition hover:text-white/80"
          >
            ✕
          </button>
        </div>
        <div className="h-px bg-white/[0.06]" />
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Create modals ────────────────────────────────────────────────────────────

function CreateCursoModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Nuevo curso" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input
            className={inputClass}
            placeholder="Ej: Creación de Assets para Videojuegos"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Descripción</label>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Describe el objetivo y contenido del curso..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Categoría</label>
          <select className={inputClass}>
            <option value="">Selecciona una categoría</option>
            <option value="Blender">Blender</option>
            <option value="Unity">Unity</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Capacitaciones incluidas</label>
          <div className="flex flex-col gap-2">
            {[1, 2].map((n) => (
              <select key={n} className={inputClass}>
                <option value="">Capacitación {n}</option>
                {capacitaciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:text-white/80"
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
  return (
    <Modal title="Nueva capacitación" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input
            className={inputClass}
            placeholder="Ej: Modelado 3D en Blender"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Descripción</label>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Describe el contenido de la capacitación..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Categoría</label>
          <select className={inputClass}>
            <option value="">Selecciona una categoría</option>
            <option value="Blender">Blender</option>
            <option value="Unity">Unity</option>
          </select>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:text-white/80"
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
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/45">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
          {count} items
        </span>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl border border-[#267F6B]/40 bg-[#267F6B]/15 px-4 py-2 text-sm font-semibold text-[#2fa58a] transition hover:bg-[#267F6B]/25 hover:border-[#267F6B]/60"
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
      <section className="bg-[#050505] p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10">

          {/* Page header */}
          <div className="rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <h1 className="text-3xl font-bold text-white">Cursos y Capacitaciones</h1>
            <p className="mt-1 text-sm text-white/55">
              Catálogo completo de formaciones disponibles. Cada curso incluye dos capacitaciones especializadas.
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400/70" />
                <span className="text-xs text-white/40">Blender</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400/70" />
                <span className="text-xs text-white/40">Unity</span>
              </div>
            </div>
          </div>

          {/* Cursos */}
          <div className="flex flex-col gap-5">
            <SectionHeader
              title="Cursos"
              subtitle="Programas completos formados por dos capacitaciones."
              count={cursos.length}
              onAdd={() => setShowCursoModal(true)}
              addLabel="Nuevo curso"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
              {cursos.map((curso) => (
                <CourseCard
                  key={curso.id}
                  course={curso}
                  capacitaciones={capacitaciones}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* Capacitaciones */}
          <div className="flex flex-col gap-5">
            <SectionHeader
              title="Capacitaciones"
              subtitle="Módulos individuales que componen los cursos."
              count={capacitaciones.length}
              onAdd={() => setShowCapModal(true)}
              addLabel="Nueva capacitación"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {capacitaciones.map((cap) => (
                <CapacitacionCard key={cap.id} cap={cap} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {showCursoModal && (
        <CreateCursoModal onClose={() => setShowCursoModal(false)} />
      )}
      {showCapModal && (
        <CreateCapacitacionModal onClose={() => setShowCapModal(false)} />
      )}
    </>
  );
}