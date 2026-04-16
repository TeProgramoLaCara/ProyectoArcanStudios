'use client';

import { useMemo, useState } from 'react';
import MetricCard from '@/components/reservations/MetriCard';
import ClientesFilters from '@/components/clientes/ClientesFilters';
import EmpresaCard from '@/components/clientes/EmpresaCard';
import EmpresaModal from '@/components/clientes/EmpresaModal';
import DeleteConfirmModal from '@/components/clientes/DeleteConfirmModal';
import { empresas as initialEmpresas, type Empresa } from '@/resources/data';

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalState = { mode: 'create' | 'edit'; empresa?: Empresa } | null;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientesPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>(initialEmpresas);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Empresa | null>(null);

  // ── Métricas ──
  const totalEmpresas = empresas.length;
  const totalUsuarios = empresas.reduce((sum, e) => sum + e.usuarios.length, 0);
  const completas = empresas.filter((e) => e.usuarios.length >= 5).length;
  const conDisponibilidad = empresas.filter((e) => e.usuarios.length < 5).length;

  // ── Lista filtrada ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return empresas;
    return empresas.filter((e) => e.name.toLowerCase().includes(q));
  }, [empresas, search]);

  // ── Accordion: sólo una empresa expandida a la vez ──
  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  // ── CRUD ──
  function handleSave(empresa: Empresa) {
    if (modalState?.mode === 'edit') {
      setEmpresas((prev) => prev.map((e) => (e.id === empresa.id ? empresa : e)));
    } else {
      setEmpresas((prev) => [...prev, empresa]);
    }
    setModalState(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setEmpresas((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    if (expandedId === deleteTarget.id) setExpandedId(null);
    setDeleteTarget(null);
  }

  function handleRemoveUser(empresaId: string, userId: string) {
    setEmpresas((prev) =>
      prev.map((e) =>
        e.id === empresaId
          ? { ...e, usuarios: e.usuarios.filter((u) => u.id !== userId) }
          : e
      )
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <section className="bg-[#050505] p-6"> {/* colors.ts: background */}
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8">

          {/* ── Cabecera de página ── */}
          <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"> {/* colors.ts: surface */}
            {/* Degradado lateral derecho */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-[#267F6B]/10 to-transparent" /> {/* colors.ts: accent */}
            {/* Línea inferior de acento */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#267F6B]/0 via-[#267F6B]/60 to-[#267F6B]/0" /> {/* colors.ts: accent */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Clientes</h1>
                <p className="mt-1 text-sm text-white/55">
                  Gestión de empresas cliente y sus usuarios.
                </p>
              </div>
              <button
                onClick={() => setModalState({ mode: 'create' })}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#267F6B]/40 bg-[#267F6B]/15 px-4 py-2 text-sm font-semibold text-[#2fa58a] transition hover:border-[#267F6B]/60 hover:bg-[#267F6B]/25" /* colors.ts: accent, accentLight */
              >
                <span className="text-base leading-none">+</span>
                Nueva empresa
              </button>
            </div>
          </div>

          {/* ── Métricas ── */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MetricCard label="Total empresas"    value={totalEmpresas}    icon="🏢" accent />
            <MetricCard label="Total usuarios"    value={totalUsuarios}    icon="👥" />
            <MetricCard label="Empresas completas" value={completas}       icon="✅" />
            <MetricCard label="Con disponibilidad" value={conDisponibilidad} icon="📭" />
          </div>

          {/* ── Separador degradado ── */}
          <div className="relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#267F6B]/40 to-transparent" /> {/* colors.ts: accent */}
          </div>

          {/* ── Filtros + lista ── */}
          <div className="flex flex-col gap-5 rounded-[26px] border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"> {/* colors.ts: surface */}

            {/* Cabecera del panel */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Lista de empresas
                </h2>
                <p className="mt-0.5 text-sm text-white/40">
                  {filtered.length} empresa{filtered.length !== 1 ? 's' : ''}{' '}
                  encontrada{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
              <ClientesFilters
                search={search}
                onSearchChange={setSearch}
                onReset={() => setSearch('')}
              />
            </div>

            {/* Cards de empresas */}
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-white/30">
                No se encontraron empresas con los filtros aplicados.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((empresa) => (
                  <EmpresaCard
                    key={empresa.id}
                    empresa={empresa}
                    isExpanded={expandedId === empresa.id}
                    onToggle={() => handleToggle(empresa.id)}
                    onEdit={(e) => setModalState({ mode: 'edit', empresa: e })}
                    onDelete={(id) =>
                      setDeleteTarget(empresas.find((e) => e.id === id) ?? null)
                    }
                    onRemoveUser={handleRemoveUser}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── Modales ── */}
      {modalState && (
        <EmpresaModal
          mode={modalState.mode}
          empresa={modalState.empresa}
          onClose={() => setModalState(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          empresaName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
