import React, { useRef, useState } from 'react';
import { ArchivedBatch, PaymentRecord } from '../types/finance';
import { formatRupiah, downloadFile } from '../utils/formatters';
import {
  Archive,
  Calendar,
  FolderOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  FileCheck,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Layers,
  Search,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

interface ArchiveTabProps {
  archives: ArchivedBatch[];
  onLoadArchive: (archive: ArchivedBatch) => void;
  onDeleteArchive: (archiveId: string, title: string) => void;
  onOpenSaveModal: () => void;
  onImportBackup: (importedArchives: ArchivedBatch[]) => void;
}

export const ArchiveTab: React.FC<ArchiveTabProps> = ({
  archives,
  onLoadArchive,
  onDeleteArchive,
  onOpenSaveModal,
  onImportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // Filter archives by search term
  const filteredArchives = archives.filter((a) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.note && a.note.toLowerCase().includes(q)) ||
      a.dateCreated.toLowerCase().includes(q)
    );
  });

  // Backup all archives export
  const handleExportAllBackup = () => {
    const jsonStr = JSON.stringify(archives, null, 2);
    downloadFile(
      jsonStr,
      `semua_arsip_transaksi_wa_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json'
    );
  };

  // Import backup file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let itemsToImport: ArchivedBatch[] = [];
        if (Array.isArray(parsed)) {
          itemsToImport = parsed;
        } else if (parsed && parsed.id && parsed.records) {
          itemsToImport = [parsed];
        }

        if (itemsToImport.length > 0) {
          onImportBackup(itemsToImport);
          alert(`Berhasil mengimpor ${itemsToImport.length} data arsip!`);
        } else {
          alert('Format berkas arsip JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON cadangan.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Archive className="w-3.5 h-3.5" /> Pusat Arsip &amp; Riwayat Transaksi
            </span>
            <span className="text-xs text-slate-400">Tersimpan Otomatis di Memori</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Arsip Batches &amp; Riwayat Obrolan WA
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Simpan hasil pemindaian obrolan Anda ke dalam arsip, buka kembali kapan saja, atau tambahkan obrolan baru di kemudian hari tanpa kehilangan histori pembayaran sebelumnya.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Simpan Sesi Ini Ke Arsip</span>
          </button>

          <input
            type="file"
            ref={backupFileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => backupFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors text-xs cursor-pointer"
            title="Impor file cadangan JSON arsip dari komputer lain"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Impor Backup</span>
          </button>

          <button
            onClick={handleExportAllBackup}
            disabled={archives.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors disabled:opacity-40 text-xs cursor-pointer"
            title="Unduh seluruh arsip sebagai file cadangan JSON"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Cadangan (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul arsip, tanggal, atau catatan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total Tersimpan: <span className="font-bold text-white font-mono">{archives.length} Batch Arsip</span>
        </div>
      </div>

      {/* Archives Grid List */}
      {filteredArchives.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
            <Archive className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              {archives.length === 0 ? 'Belum Ada Arsip Tersimpan' : 'Arsip Tidak Ditemukan'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              {archives.length === 0
                ? 'Gunakan tombol "Simpan Sesi Ini Ke Arsip" untuk menyimpan data hasil ekstraksi chat WA Anda agar dapat diperiksa atau ditambahkan lagi di kemudian hari.'
                : 'Tidak ada judul atau catatan arsip yang sesuai dengan kata kunci pencarian.'}
            </p>
          </div>
          {archives.length === 0 && (
            <button
              onClick={onOpenSaveModal}
              className="px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Sesi Pertama Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArchives.map((batch) => (
            <div
              key={batch.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group"
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <FolderOpen className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-white line-clamp-1">{batch.title}</h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{batch.dateCreated}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteArchive(batch.id, batch.title)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Arsip Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Batch Metrics Box */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Transaksi</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {batch.records.length} Item
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Terkonfirmasi</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatRupiah(batch.summary?.total_nominal_terkonfirmasi || 0)}
                    </span>
                  </div>
                </div>

                {batch.note && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50">
                    &quot;{batch.note}&quot;
                  </p>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onLoadArchive(batch)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-colors text-xs cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Buka Ke Tabel</span>
                </button>

                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(batch, null, 2);
                    downloadFile(
                      jsonStr,
                      `${batch.title.replace(/\s+/g, '_')}_${batch.id}.json`,
                      'application/json'
                    );
                  }}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Unduh File JSON Arsip Ini"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
