"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineCube,
  HiOutlineSparkles,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { useTheme } from "@/context/ThemeContext";
import { type Capacitacion, type Curso } from "@/resources/data";
import { getClientApiData } from "@/services/client.service";

const COURSE_META: Record<string, { duration: string; level: string; outcome: string }> = {
  k1: {
    duration: "2 semanas",
    level: "Inicial-intermedio",
    outcome: "Assets 3D",
  },
  k2: {
    duration: "2 semanas",
    level: "Inicial",
    outcome: "Prototipo Unity",
  },
  k3: {
    duration: "2 semanas",
    level: "Intermedio",
    outcome: "Personaje Unity",
  },
  k4: {
    duration: "2 semanas",
    level: "Intermedio",
    outcome: "Nivel jugable",
  },
};

const COURSE_ACCENTS: Record<string, { glow: string; icon: string; line: string; soft: string }> = {
  Blender: {
    glow: "from-orange-500/25 via-amber-400/10 to-transparent",
    icon: "bg-orange-500/15 text-orange-300",
    line: "bg-orange-400",
    soft: "border-orange-300/25 bg-orange-400/10 text-orange-200",
  },
  Unity: {
    glow: "from-sky-500/25 via-cyan-400/10 to-transparent",
    icon: "bg-sky-500/15 text-sky-300",
    line: "bg-sky-400",
    soft: "border-sky-300/25 bg-sky-400/10 text-sky-200",
  },
};

const MODULE_ACCENTS = [
  "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  "border-pink-300/25 bg-pink-400/10 text-pink-200",
  "border-violet-300/25 bg-violet-400/10 text-violet-200",
  "border-amber-300/25 bg-amber-400/10 text-amber-200",
  "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
  "border-lime-300/25 bg-lime-400/10 text-lime-200",
];

function getCourseCaps(course: Curso, capacitaciones: Capacitacion[]) {
  return course.capacitaciones
    .map((id) => capacitaciones.find((cap) => cap.id === id))
    .filter((cap): cap is Capacitacion => Boolean(cap));
}

function getCourseAccent(category: string) {
  return (
    COURSE_ACCENTS[category] ?? {
      glow: "from-emerald-500/25 via-teal-400/10 to-transparent",
      icon: "bg-emerald-500/15 text-emerald-300",
      line: "bg-emerald-400",
      soft: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
    }
  );
}

function categoryClasses(category: string, isDark: boolean) {
  if (category.toLowerCase().includes("blender")) {
    return isDark
      ? "border-orange-300/25 bg-orange-400/10 text-orange-200"
      : "border-orange-300 bg-orange-50 text-orange-700";
  }

  return isDark
    ? "border-sky-300/25 bg-sky-400/10 text-sky-200"
    : "border-sky-300 bg-sky-50 text-sky-700";
}

function CatalogMetric({
  icon: Icon,
  label,
  value,
  detail,
  color,
  isDark,
}: {
  icon: typeof HiOutlineBookOpen;
  label: string;
  value: string | number;
  detail: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <article className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/45" : "text-slate-500"}`}>
            {label}
          </p>
          <p className={`mt-1 text-3xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className={`mt-2 text-sm ${isDark ? "text-white/55" : "text-slate-600"}`}>{detail}</p>
    </article>
  );
}

function CourseInfoCard({
  capacitaciones,
  course,
  isDark,
}: {
  capacitaciones: Capacitacion[];
  course: Curso;
  isDark: boolean;
}) {
  const caps = getCourseCaps(course, capacitaciones);
  const accent = getCourseAccent(course.category);
  const meta = COURSE_META[course.id] ?? {
    duration: "2 semanas",
    level: "Adaptable",
    outcome: "Proyecto práctico",
  };

  return (
    <article
      className={`group relative flex min-h-[310px] overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-[#267F6B]/45 ${
        isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white shadow-sm"
      }`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent.glow}`} />
      <span className={`absolute left-0 top-0 h-full w-1 ${accent.line}`} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent.icon}`}>
            <HiOutlineAcademicCap className="h-5 w-5" />
          </span>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${categoryClasses(course.category, isDark)}`}>
            {course.category}
          </span>
        </div>

        <div className="mt-3 flex-1">
          <h3 className={`text-base font-bold leading-snug ${isDark ? "text-white" : "text-slate-950"}`}>
            {course.title}
          </h3>
          <p className={`mt-2 line-clamp-3 text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
            {course.description}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <CourseFact icon={HiOutlineCalendarDays} label="Duración" value={meta.duration} isDark={isDark} accentClass={accent.soft} />
          <CourseFact icon={HiOutlineUserGroup} label="Nivel" value={meta.level} isDark={isDark} accentClass={accent.soft} />
          <CourseFact icon={HiOutlineSparkles} label="Resultado" value={meta.outcome} isDark={isDark} accentClass={accent.soft} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-3">
          {caps.map((cap, index) => (
            <span
              key={cap.id}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                MODULE_ACCENTS[index % MODULE_ACCENTS.length]
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {cap.title}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CourseFact({
  icon: Icon,
  label,
  value,
  isDark,
  accentClass,
}: {
  icon: typeof HiOutlineCalendarDays;
  label: string;
  value: string;
  isDark: boolean;
  accentClass: string;
}) {
  return (
    <div className={`min-w-0 rounded-xl border p-2.5 ${accentClass}`}>
      <Icon className="h-4 w-4" />
      <p className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className={`mt-0.5 truncate text-[11px] font-bold leading-snug ${isDark ? "text-white/85" : "text-slate-800"}`}>
        {value}
      </p>
    </div>
  );
}

function TrainingModuleCard({
  cap,
  courseCount,
  index,
  isDark,
}: {
  cap: Capacitacion;
  courseCount: number;
  index: number;
  isDark: boolean;
}) {
  const accent = MODULE_ACCENTS[index % MODULE_ACCENTS.length];

  return (
    <article className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-[#111111]" : "border-slate-200 bg-slate-50"}`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${accent}`}>
          <HiOutlineCube className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`truncate text-sm font-bold ${isDark ? "text-white" : "text-slate-950"}`}>{cap.title}</h3>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${categoryClasses(cap.category, isDark)}`}>
              {cap.category}
            </span>
          </div>
          <p className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${isDark ? "text-white/58" : "text-slate-600"}`}>
            {cap.description}
          </p>
        </div>
      </div>
      <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isDark ? "bg-[#267F6B]/15 text-[#2fa58a]" : "bg-emerald-50 text-[#267F6B]"
      }`}>
        <HiOutlineCheckCircle className="h-4 w-4" />
        En {courseCount} curso{courseCount === 1 ? "" : "s"}
      </p>
    </article>
  );
}

export default function ClienteCursosPage() {
  const { isDark } = useTheme();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    getClientApiData()
      .then((data) => {
        setCursos(data.cursos);
        setCapacitaciones(data.capacitaciones);
      })
      .catch((error) => {
        console.error("Error cargando cursos cliente:", error);
      });
  }, []);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(cursos.map((course) => course.category)))],
    [cursos],
  );

  const filteredCourses = useMemo(
    () =>
      activeCategory === "Todos"
        ? cursos
        : cursos.filter((course) => course.category === activeCategory),
    [activeCategory],
  );

  const moduleUsage = useMemo(
    () =>
      capacitaciones.map((cap) => ({
        cap,
        courseCount: cursos.filter((course) => course.capacitaciones.includes(cap.id)).length,
      })),
    [capacitaciones, cursos],
  );

  return (
    <section className={`min-h-full p-6 ${isDark ? "bg-[#050505]" : "bg-[#f8fafc]"}`}>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
        <header className={`overflow-hidden rounded-2xl border p-6 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className={`text-sm font-semibold ${isDark ? "text-[#2fa58a]" : "text-[#267F6B]"}`}>
                Catálogo formativo
              </p>
              <h1 className={`mt-1 text-3xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>
                Cursos disponibles
              </h1>
              <p className={`mt-2 max-w-3xl text-sm leading-relaxed ${isDark ? "text-white/55" : "text-slate-600"}`}>
                Consulta qué puede contratar tu empresa antes de reservar. Cada curso combina capacitaciones prácticas y está pensado para grupos de clientes.
              </p>
            </div>
            <Link
              href="/cliente/reservas"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#267F6B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2fa58a]"
            >
              Reservar curso
              <HiOutlineArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <CatalogMetric
            icon={HiOutlineBookOpen}
            label="Cursos"
            value={cursos.length}
            detail="Programas completos listos para reservar."
            color="border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
            isDark={isDark}
          />
          <CatalogMetric
            icon={HiOutlineCube}
            label="Capacitaciones"
            value={capacitaciones.length}
            detail="Módulos que componen los cursos del catálogo."
            color="border-violet-300/25 bg-violet-400/10 text-violet-200"
            isDark={isDark}
          />
          <CatalogMetric
            icon={HiOutlineCalendarDays}
            label="Duración mínima"
            value="2 semanas"
            detail="Las reservas se planifican por bloques formativos."
            color="border-amber-300/25 bg-amber-400/10 text-amber-200"
            isDark={isDark}
          />
        </div>

        <section className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>Explorar cursos</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-slate-600"}`}>
                Filtra por área para encontrar rápidamente la formación que encaja con tu equipo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = activeCategory === category;
                const accent = category === "Todos" ? "border-[#267F6B] bg-[#267F6B] text-white" : categoryClasses(category, isDark);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? accent
                        : isDark
                          ? "border-white/10 bg-white/[0.03] text-white/65 hover:text-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseInfoCard
                key={course.id}
                capacitaciones={capacitaciones}
                course={course}
                isDark={isDark}
              />
            ))}
          </div>
        </section>

        <section className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-[#0d0d0d]" : "border-black/[0.08] bg-white"}`}>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-950"}`}>
              Capacitaciones disponibles
            </h2>
            <p className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-slate-600"}`}>
              Estos módulos sirven para entender el contenido de cada curso o para pedir una formación combinando dos capacitaciones.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {moduleUsage.map(({ cap, courseCount }, index) => (
              <TrainingModuleCard
                key={cap.id}
                cap={cap}
                courseCount={courseCount}
                index={index}
                isDark={isDark}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
