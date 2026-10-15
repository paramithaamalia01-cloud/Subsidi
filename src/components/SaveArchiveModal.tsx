import React, { useState } from 'react';
import { ArchivedBatch, PaymentRecord } from '../types/finance';
import { formatRupiah } from '../utils/formatters';
import { Archive, Plus, FolderPlus, X, Check, Layers } from 'lucide-react';

interface SaveArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PaymentRecord[];
  rawChatText: string;
  existingArchives: ArchivedBatch[];
  onSaveNewArchive: (title: string, note?: string) => void;
  onMergeIntoArchive: (archiveId: string) => void;
}

export const SaveArchiveModal: React.FC<SaveArchiveModalProps> = ({
  isOpen,
  onClose,
  records,
  rawChatText,
  existingArchives,
  onSaveNewArchive,
  onMergeIntoArchive,
}) => {
  const [mode, setMode] = useState<'new' | 'merge'>('new');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [selectedArchiveId, setSelectedArchiveId] = useState(existingArchives[0]?.id || '');

  if (!isOpen) return null;

  const totalConfirmed = records.reduce(
    (acc, item) => (item.status === 'Sudah Transfer' ? acc + item.nominal : acc),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'new') {
      onSaveNewArchive(title, note);
    } else {
      if (!selectedArchiveId) return;
      onMergeIntoArchive(selectedArchiveId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Simpan Ke Arsip Transaksi</h2>
              <p className="text-xs text-slate-400">Simpan untuk dicek lagi atau ditambahkan di kemudian hari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Batch Info */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
          <div className="flex justify-between items-center text-slate-300 font-semibold">
            <span>Jumlah Transaksi Saat Ini:</span>
            <span className="font-mono text-emerald-400 text-sm">{records.length} Item</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Total Terkonfirmasi:</span>
            <span className="font-mono text-slate-200">{formatRupiah(totalConfirmed)}</span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        {existingArchives.length > 0 && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`py-2 px-3 font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'new'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Arsip Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('merge')}
              className={`py-2 px-3 font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'merge'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Gabungkan Ke Arsip Ada</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'new' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judul / Nama Arsip Batch
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Batch Umrah Ramadan 12 Maret 2026..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Catatan agen, rombongan, atau tenggat pembayaran..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Pilih Arsip yang Ingin Ditambahkan / Digabungkan:
              </label>
              <select
                value={selectedArchiveId}
                onChange={(e) => setSelectedArchiveId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {existingArchives.map((arch) => (
                  <option key={arch.id} value={arch.id}>
                    {arch.title} ({arch.records.length} Item - {arch.dateCreated})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Transaksi baru akan digabungkan secara otomatis tanpa menduplikasi data yang identik.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{mode === 'new' ? 'Simpan Arsip' : 'Gabungkan Ke Arsip'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
