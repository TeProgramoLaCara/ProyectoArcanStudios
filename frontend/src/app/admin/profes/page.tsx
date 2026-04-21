'use client';

import { useMemo, useState } from 'react';
import { mockProfesores } from '@/components/profes/mockData';
import type { Profesor } from '@/components/profes/types';
import ProfesorCard from '@/components/profes/ProfesorCard';
import ProfesorModal from '@/components/profes/ProfesorModal';
import DeleteModal from '@/components/profes/DeleteModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'all' | 'active' | 'inactive';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activos' },
  { key: 'inactive', label: 'Inactivos' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfesPage() {
  const [profesores, setProfesores] = useState<Profesor[]>(mockProfesores);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProfesor, setEditProfesor] = useState<Profesor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Profesor | null>(null);

  // ── Derived counts ──
  const activos = profesores.filter((p) => p.status === 'active').length;
  const inactivos = profesores.filter((p) => p.status === 'inactive').length;

  const tabCount: Record<Tab, number> = {
    all: profesores.length,
    active: activos,
    inactive: inactivos,
  };

  // ── Filtered list ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return profesores.filter((p) => {
      const matchTab =
        tab === 'all' ||
        (tab === 'active' && p.status === 'active') ||
        (tab === 'inactive' && p.status === 'inactive');
      const matchSearch =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.apellidos.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [profesores, tab, search]);

  // ── Handlers ──
  function handleSave(data: Omit<Profesor, 'id'>) {
    if (editProfesor) {
      setProfesores((prev) =>
        prev.map((p) => (p.id === editProfesor.id ? { ...data, id: editProfesor.id } : p))
      );
    } else {
      const newId = Math.max(0, ...profesores.map((p) => p.id)) + 1;
      setProfesores((prev) => [...prev, { ...data, id: newId }]);
    }
    setModalOpen(false);
    setEditProfesor(null);
  }

  function handleEdit(profesor: Profesor) {
    setEditProfesor(profesor);
    setModalOpen(true);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setProfesores((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function openCreate() {
    setEditProfesor(null);
    setModalOpen(true);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <section className="bg-surface rounded-2xl p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8">

          {/* ── Page header ── */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/10bg-surface p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-[#267F6B]/10 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B]/60 to-[#267F6B]/0" />
            <h1 className="text-3xl font-bold text-(--text-primary)">Profesores</h1>
            <p className="mt-1 text-sm text-(--text-muted)">
              Gestión del equipo docente y sus capacitaciones.
            </p>
          </div>

          {/* ── Topbar ── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Profesores</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/50">
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por nombre, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#267F6B]/60 focus:ring-1 focus:ring-[#267F6B]/30 sm:w-64"
              />
              <button
                onClick={openCreate}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#267F6B]/40 bg-[#267F6B]/15 px-4 py-2 text-sm font-semibold text-[#2fa58a] transition hover:border-[#267F6B]/60 hover:bg-[#267F6B]/25"
              >
                <span className="text-base leading-none">+</span>
                Añadir profesor
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex w-fit items-center gap-1 rounded-xl border border-white/10 bg-[#0d0d0d] p-1">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  tab === key
                    ? 'bg-[#267F6B]/20 text-[#2fa58a]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    tab === key
                      ? 'bg-[#267F6B]/30 text-[#2fa58a]'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {tabCount[key]}
                </span>
              </button>
            ))}
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-white/30">
              No se encontraron profesores.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProfesorCard
                  key={p.id}
                  profesor={p}
                  onEdit={() => handleEdit(p)}
                  onDelete={() => setDeleteTarget(p)}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── Modals ── */}
      <ProfesorModal
        open={modalOpen}
        profesor={editProfesor}
        onClose={() => { setModalOpen(false); setEditProfesor(null); }}
        onSave={handleSave}
      />

      <DeleteModal
        open={!!deleteTarget}
        profesorNombre={
          deleteTarget ? `${deleteTarget.nombre} ${deleteTarget.apellidos}` : ''
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
