import React from 'react';
import { PaymentRecord } from '../types/finance';
import { formatRupiah } from '../utils/formatters';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  record: PaymentRecord | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  record,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <span>Konfirmasi Hapus Transaksi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
          <p className="text-slate-300 font-medium">
            Apakah Anda yakin ingin menghapus transaksi berikut?
          </p>
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Pengirim WA:</span>
              <span className="font-semibold text-slate-200">{record.nama_pengirim_chat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jamaah / Agen:</span>
              <span className="font-semibold text-emerald-400">{record.nama_jamaah_atau_agen}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jenis &amp; Nominal:</span>
              <span className="font-mono font-bold text-white">
                {record.jenis_pembayaran} ({formatRupiah(record.nominal)})
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-950/40 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ya, Hapus Transaksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
