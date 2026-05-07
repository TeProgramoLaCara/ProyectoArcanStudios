"use client";

import { useMemo, useState } from "react";
import CourseCard from "@/components/courses/CourseCard";
import CapacitacionCard from "@/components/courses/CapacitacionCard";
import { useTheme } from "@/context/ThemeContext";
import {
  allEvents,
  capacitaciones as baseCaps,
  cursos as baseCursos,
  PROFESSOR_COLORS,
  type Capacitacion,
  type Curso,
} from "@/resources/data";

type Profesor = {
  id: string;
  name: string;
};

type ProfesorProfile = {
  courseIds: string[];
  capIds: string[];
};

const profesores: Profesor[] = Array.from(
  new Map(allEvents.map((e) => [e.professorId, { id: e.professorId, name: e.professorName }])).values(),
);

const initialProfiles: Record<string, ProfesorProfile> = profesores.reduce(
  (acc, prof) => {
    // Seed inicial sencillo para demo: cada profesor parte con 2 cursos y 3 caps.
    const baseIndex = profesores.findIndex((p) => p.id === prof.id);
    const courseIds = baseCursos
      .slice(baseIndex % baseCursos.length, (baseIndex % baseCursos.length) + 2)
      .map((c) => c.id);
    const capIds = Array.from(
      new Set(
        baseCursos
          .filter((c) => courseIds.includes(c.id))
          .flatMap((c) => c.capacitaciones),
      ),
    );
    acc[prof.id] = { courseIds, capIds };
    return acc;
  },
  {} as Record<string, ProfesorProfile>,
);

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
  onAdd?: () => void;
  addLabel?: string;
}) {
  const { isDark } = useTheme();
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>{title}</h2>
        <p className={`mt-1 text-sm ${isDark ? "text-white/45" : "text-[#475569]"}`}>{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            isDark ? "border-white/10 bg-white/5 text-white/50" : "border-black/[0.08] bg-black/[0.04] text-[#475569]"
          }`}
        >
          {count}
        </span>
        {onAdd && addLabel ? (
          <button
            type="button"
            onClick={onAdd}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              isDark
                ? "border-[#267F6B]/40 bg-[#267F6B]/15 text-[#2fa58a] hover:bg-[#267F6B]/25"
                : "border-[#267F6B]/40 bg-[#267F6B]/10 text-[#267F6B] hover:bg-[#267F6B]/20"
            }`}
          >
            + {addLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

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
        className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/40"}`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-lg rounded-2xl border p-5 ${
          isDark ? "border-white/10 bg-[#111111]" : "border-black/[0.08] bg-white"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-[#0f172a]"}`}>{title}</h3>
          <button type="button" onClick={onClose} className="text-sm text-white/60">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ProfesorCursosPage() {
  const { isDark } = useTheme();
  const [activeProfessorId, setActiveProfessorId] = useState<string>(profesores[0]?.id ?? "p1");
  const [catalogCaps, setCatalogCaps] = useState<Capacitacion[]>(baseCaps);
  const [catalogCursos, setCatalogCursos] = useState<Curso[]>(baseCursos);
  const [profiles, setProfiles] = useState<Record<string, ProfesorProfile>>(initialProfiles);
  const [showCapModal, setShowCapModal] = useState(false);
  const [editingCap, setEditingCap] = useState<Capacitacion | null>(null);
  const [editingCourse, setEditingCourse] = useState<Curso | null>(null);

  const activeProfessor = useMemo(
    () => profesores.find((p) => p.id === activeProfessorId) ?? profesores[0],
    [activeProfessorId],
  );
  const activeProfile = profiles[activeProfessorId] ?? { courseIds: [], capIds: [] };

  const myCaps = useMemo(
    () => catalogCaps.filter((c) => activeProfile.capIds.includes(c.id)),
    [catalogCaps, activeProfile.capIds],
  );
  const myCourses = useMemo(
    () => catalogCursos.filter((c) => activeProfile.courseIds.includes(c.id)),
    [catalogCursos, activeProfile.courseIds],
  );

  const [selectedCapId, setSelectedCapId] = useState("");

  const addExistingCap = () => {
    if (!selectedCapId) return;
    setProfiles((prev) => ({
      ...prev,
      [activeProfessorId]: {
        ...activeProfile,
        capIds: Array.from(new Set([...activeProfile.capIds, selectedCapId])),
      },
    }));
    setShowCapModal(false);
    setSelectedCapId("");
  };

  const removeAssignedCap = (capId: string) => {
    setProfiles((prev) => ({
      ...prev,
      [activeProfessorId]: {
        ...activeProfile,
        capIds: activeProfile.capIds.filter((id) => id !== capId),
      },
    }));
  };

  const removeAssignedCourse = (courseId: string) => {
    setProfiles((prev) => ({
      ...prev,
      [activeProfessorId]: {
        ...activeProfile,
        courseIds: activeProfile.courseIds.filter((id) => id !== courseId),
      },
    }));
  };

  const confirmRemoveFromMine = (name: string, type: "cursos" | "capacitaciones") =>
    window.confirm(`Seguro que quieres eliminar "${name}" de tus ${type}?`);

  const saveEditedCap = () => {
    if (!editingCap) return;
    const title = editingCap.title.trim();
    const description = editingCap.description.trim();
    if (!title || !description) return;
    setCatalogCaps((prev) =>
      prev.map((cap) => (cap.id === editingCap.id ? { ...editingCap, title, description } : cap)),
    );
    setEditingCap(null);
  };

  const saveEditedCourse = () => {
    if (!editingCourse) return;
    const title = editingCourse.title.trim();
    const description = editingCourse.description.trim();
    if (!title || !description || editingCourse.capacitaciones.length === 0) return;
    setCatalogCursos((prev) =>
      prev.map((course) =>
        course.id === editingCourse.id ? { ...editingCourse, title, description } : course,
      ),
    );
    setEditingCourse(null);
  };

  const deleteCapFromCatalog = (capId: string) => {
    setCatalogCaps((prev) => prev.filter((cap) => cap.id !== capId));
    setCatalogCursos((prev) =>
      prev.map((course) => ({
        ...course,
        capacitaciones: course.capacitaciones.filter((id) => id !== capId),
      })),
    );
    setProfiles((prev) => {
      const next: Record<string, ProfesorProfile> = {};
      for (const [profId, profile] of Object.entries(prev)) {
        next[profId] = {
          ...profile,
          capIds: profile.capIds.filter((id) => id !== capId),
        };
      }
      return next;
    });
  };

  const deleteCourseFromCatalog = (courseId: string) => {
    setCatalogCursos((prev) => prev.filter((course) => course.id !== courseId));
    setProfiles((prev) => {
      const next: Record<string, ProfesorProfile> = {};
      for (const [profId, profile] of Object.entries(prev)) {
        next[profId] = {
          ...profile,
          courseIds: profile.courseIds.filter((id) => id !== courseId),
        };
      }
      return next;
    });
  };

  const unassignedCaps = catalogCaps.filter((c) => !activeProfile.capIds.includes(c.id));
  return (
    <>
      <section className={`p-6 ${isDark ? "bg-[#050505]" : "bg-[#f8fafc]"}`}>
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8">
          <div
            className={`rounded-[26px] border p-6 ${
              isDark
                ? "border-white/10 bg-[#0d0d0d] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                : "border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
            }`}
          >
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>Mis cursos</h1>
            <p className={`mt-1 text-sm ${isDark ? "text-white/55" : "text-[#475569]"}`}>
              Cursos y capacitaciones que el profesor puede impartir.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: PROFESSOR_COLORS[activeProfessor?.id] ?? "#9ca3af" }}
              />
              <select
                value={activeProfessorId}
                onChange={(e) => setActiveProfessorId(e.target.value)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  isDark
                    ? "border-white/10 bg-[#141414] text-white"
                    : "border-black/[0.08] bg-[#e2e8f0] text-[#0f172a]"
                }`}
              >
                {profesores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-0">
            <div className="flex flex-1 flex-col gap-5 lg:pr-8">
              <SectionHeader
                title="Mis cursos"
                subtitle={`Programas asignados a ${activeProfessor?.name ?? "este profesor"}.`}
                count={myCourses.length}
              />
              <div className="flex flex-col gap-4">
                {myCourses.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-white/45" : "text-[#475569]"}`}>
                    No hay cursos asignados todavía.
                  </p>
                ) : (
                  myCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      capacitaciones={catalogCaps}
                      onRemove={() => {
                        if (confirmRemoveFromMine(course.title, "cursos")) {
                          removeAssignedCourse(course.id);
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            <div className={`hidden w-px self-stretch lg:block ${isDark ? "bg-white/[0.06]" : "bg-black/[0.05]"}`} />

            <div className="flex flex-1 flex-col gap-5 lg:pl-8">
              <SectionHeader
                title="Mis capacitaciones"
                subtitle="Competencias habilitadas para impartir formación."
                count={myCaps.length}
                onAdd={() => setShowCapModal(true)}
                addLabel="Añadir capacitación"
              />
              <div className="flex flex-col gap-4">
                {myCaps.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-white/45" : "text-[#475569]"}`}>
                    No hay capacitaciones asignadas todavía.
                  </p>
                ) : (
                  myCaps.map((cap) => (
                    <CapacitacionCard
                      key={cap.id}
                      cap={cap}
                      onRemove={() => {
                        if (confirmRemoveFromMine(cap.title, "capacitaciones")) {
                          removeAssignedCap(cap.id);
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div
            className={`rounded-[24px] border p-5 ${
              isDark
                ? "border-white/10 bg-[#0d0d0d] shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                : "border-black/[0.08] bg-[#f1f5f9] shadow-[0_4px_24px_rgba(15,23,42,0.08)]"
            }`}
          >
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
              Catálogo completo
            </h2>
            <p className={`mt-1 text-sm ${isDark ? "text-white/45" : "text-[#475569]"}`}>
              Listado global de todos los cursos y todas las capacitaciones.
            </p>

            <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:gap-0">
              <div className="flex flex-1 flex-col gap-5 lg:pr-8">
                <SectionHeader
                  title="Todos los cursos"
                  subtitle="Cursos disponibles en el catálogo general."
                  count={catalogCursos.length}
                />
                <div className="flex flex-col gap-4">
                  {catalogCursos.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      capacitaciones={catalogCaps}
                      onEdit={() => {
                        setEditingCourse(course);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div
                className={`hidden w-px self-stretch lg:block ${
                  isDark ? "bg-white/[0.06]" : "bg-black/[0.05]"
                }`}
              />

              <div className="flex flex-1 flex-col gap-5 lg:pl-8">
                <SectionHeader
                  title="Todas las capacitaciones"
                  subtitle="Capacitaciones disponibles en el catálogo general."
                  count={catalogCaps.length}
                  onAdd={() => setShowCapModal(true)}
                  addLabel="Añadir capacitación"
                />
                <div className="flex flex-col gap-4">
                  {catalogCaps.map((cap) => (
                    <CapacitacionCard
                      key={cap.id}
                      cap={cap}
                      onEdit={() => {
                        setEditingCap(cap);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showCapModal && (
        <Modal title="Añadir capacitación que puede impartir" onClose={() => setShowCapModal(false)}>
          <div className="grid gap-3">
            <select
              value={selectedCapId}
              onChange={(e) => setSelectedCapId(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            >
              <option value="">Selecciona una capacitación</option>
              {unassignedCaps.map((cap) => (
                <option key={cap.id} value={cap.id}>
                  {cap.title}
                </option>
              ))}
            </select>
            <button type="button" onClick={addExistingCap} className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white">
              Añadir capacitación
            </button>
          </div>
        </Modal>
      )}

      {editingCap && (
        <Modal title="Editar capacitación" onClose={() => setEditingCap(null)}>
          <div className="grid gap-3">
            <input
              value={editingCap.title}
              onChange={(e) =>
                setEditingCap((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              }
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            />
            <textarea
              rows={3}
              value={editingCap.description}
              onChange={(e) =>
                setEditingCap((prev) => (prev ? { ...prev, description: e.target.value } : prev))
              }
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            />
            <select
              value={editingCap.category}
              onChange={(e) =>
                setEditingCap((prev) => (prev ? { ...prev, category: e.target.value } : prev))
              }
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            >
              <option value="Blender">Blender</option>
              <option value="Unity">Unity</option>
            </select>
            <button
              type="button"
              onClick={saveEditedCap}
              className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => {
                deleteCapFromCatalog(editingCap.id);
                setEditingCap(null);
              }}
              className="rounded-xl border border-rose-300/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100"
            >
              Eliminar capacitación
            </button>
          </div>
        </Modal>
      )}
      {editingCourse && (
        <Modal title="Editar curso" onClose={() => setEditingCourse(null)}>
          <div className="grid gap-3">
            <input
              value={editingCourse.title}
              onChange={(e) =>
                setEditingCourse((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              }
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            />
            <textarea
              rows={3}
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev,
                )
              }
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            />
            <select
              value={editingCourse.category}
              onChange={(e) =>
                setEditingCourse((prev) => (prev ? { ...prev, category: e.target.value } : prev))
              }
              className="rounded-xl border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white"
            >
              <option value="Blender">Blender</option>
              <option value="Unity">Unity</option>
            </select>
            <div className="grid gap-1.5 rounded-xl border border-white/10 p-3">
              <p className="text-xs text-white/65">Capacitaciones del curso</p>
              {catalogCaps.map((cap) => (
                <label key={cap.id} className="flex items-center gap-2 text-sm text-white/85">
                  <input
                    type="checkbox"
                    checked={editingCourse.capacitaciones.includes(cap.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEditingCourse((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          capacitaciones: checked
                            ? Array.from(new Set([...prev.capacitaciones, cap.id]))
                            : prev.capacitaciones.filter((id) => id !== cap.id),
                        };
                      });
                    }}
                  />
                  {cap.title}
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={saveEditedCourse}
              className="rounded-xl bg-[#267F6B] px-4 py-2 text-sm font-semibold text-white"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => {
                deleteCourseFromCatalog(editingCourse.id);
                setEditingCourse(null);
              }}
              className="rounded-xl border border-rose-300/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100"
            >
              Eliminar curso
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}