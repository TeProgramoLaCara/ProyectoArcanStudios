'use client';

import { createPortal } from 'react-dom';

type Props = {
  empresaName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ empresaName, onClose, onConfirm }: Props) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"> {/* colors.ts: surfaceElevated */}
        {/* Barra de acento rojo */}
        <div className="h-[3px] w-full bg-gradient-to-r from-red-500/0 via-red-500/60 to-red-500/0" />

        <div className="flex flex-col items-center gap-5 px-6 py-7 text-center">
          {/* Ícono de alerta */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-xl text-red-400">
            ✕
          </div>

          {/* Mensaje */}
          <div>
            <h3 className="text-base font-semibold text-white">Eliminar empresa</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              ¿Estás seguro de que quieres eliminar{' '}
              <span className="font-semibold text-white/80">{empresaName}</span>?
              Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Botones */}
          <div className="flex w-full gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-white/50 transition hover:text-white/80"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
