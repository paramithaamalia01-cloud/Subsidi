import React, { useState, useMemo } from 'react';
import { PaymentRecord, SummaryData, PaymentStatus, PaymentTypeFilter } from '../types/finance';
import { formatRupiah, exportToCSV, exportToTSVForExcel, downloadFile } from '../utils/formatters';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ArrowUpDown,
  Building2,
  User,
  MessageSquare,
  FileSpreadsheet,
  Copy,
  Check,
  Table as TableIcon,
  Archive
} from 'lucide-react';

interface TableTabProps {
  records: PaymentRecord[];
  summary: SummaryData;
  setRecords: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  onOpenEditModal: (record: PaymentRecord | null) => void;
  onOpenContextModal: (record: PaymentRecord) => void;
  onDeleteRecord: (record: PaymentRecord) => void;
  onOpenWARecapModal: () => void;
  onOpenSaveArchiveModal: () => void;
  onSwitchToInput: () => void;
}

export const TableTab: React.FC<TableTabProps> = ({
  records,
  summary,
  setRecords,
  onOpenEditModal,
  onOpenContextModal,
  onDeleteRecord,
  onOpenWARecapModal,
  onOpenSaveArchiveModal,
  onSwitchToInput,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>('Semua');
  const [typeFilter, setTypeFilter] = useState<PaymentTypeFilter>('Semua');
  const [sortField, setSortField] = useState<'tanggal_waktu' | 'nominal'>('tanggal_waktu');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedExcel, setCopiedExcel] = useState(false);

  // Filter & Sort Logic
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Status filter
        if (statusFilter !== 'Semua' && rec.status !== statusFilter) return false;

        // Type filter
        if (typeFilter !== 'Semua' && !rec.jenis_pembayaran.toLowerCase().includes(typeFilter.toLowerCase())) {
          return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchSender = rec.nama_pengirim_chat.toLowerCase().includes(q);
          const matchJamaah = rec.nama_jamaah_atau_agen.toLowerCase().includes(q);
          const matchBank = rec.bank_tujuan.toLowerCase().includes(q);
          const matchKet = rec.keterangan.toLowerCase().includes(q);
          const matchJenis = rec.jenis_pembayaran.toLowerCase().includes(q);
          if (!matchSender && !matchJamaah && !matchBank && !matchKet && !matchJenis) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'nominal') {
          return sortDirection === 'asc' ? a.nominal - b.nominal : b.nominal - a.nominal;
        } else {
          return sortDirection === 'asc'
            ? (a.tanggal_waktu || '').localeCompare(b.tanggal_waktu || '')
            : (b.tanggal_waktu || '').localeCompare(a.tanggal_waktu || '');
        }
      });
  }, [records, statusFilter, typeFilter, searchTerm, sortField, sortDirection]);

  // Dynamic calculations
  const liveConfirmedTotal = useMemo(() => {
    return records.reduce((acc, item) => (item.status === 'Sudah Transfer' ? acc + item.nominal : acc), 0);
  }, [records]);

  const livePendingTotal = useMemo(() => {
    return records.reduce((acc, item) => (item.status === 'Janji Bayar' ? acc + item.nominal : acc), 0);
  }, [records]);

  const verifyCount = useMemo(() => {
    return records.filter((r) => r.status === 'Butuh Verifikasi' || (!r.bank_tujuan || r.bank_tujuan === 'Null')).length;
  }, [records]);

  // Handle Quick Status Change by Record ID
  const handleQuickStatusChange = (targetRecord: PaymentRecord, newStatus: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === targetRecord.id ? { ...r, status: newStatus } : r))
    );
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvContent = exportToCSV(filteredRecords);
    downloadFile(csvContent, `rekap_pembayaran_excel_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  };

  // Copy TSV Handler
  const handleCopyTSVForExcel = () => {
    const tsvContent = exportToTSVForExcel(filteredRecords);
    navigator.clipboard.writeText(tsvContent);
    setCopiedExcel(true);
    setTimeout(() => setCopiedExcel(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metric KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Transaksi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Transaksi</span>
            <p className="text-2xl font-extrabold text-white font-mono">{records.length}</p>
            <span className="text-[11px] text-slate-500">Hasil parsing chat WA</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/60">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Card 2: Total Terkonfirmasi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-400">Total Terkonfirmasi (Lunas/DP)</span>
            <p className="text-xl font-black text-white font-mono tracking-tight">
              {formatRupiah(liveConfirmedTotal)}
            </p>
            <span className="text-[11px] text-emerald-400/80">Status: Sudah Transfer</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Card 3: Total Janji Bayar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-400">Potensi Janji Bayar</span>
            <p className="text-xl font-bold text-white font-mono tracking-tight">
              {formatRupiah(livePendingTotal)}
            </p>
            <span className="text-[11px] text-amber-400/80">Status: Janji Bayar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Card 4: Butuh Verifikasi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-400">Butuh Verifikasi / Struk</span>
            <p className="text-2xl font-extrabold text-white font-mono">{verifyCount}</p>
            <span className="text-[11px] text-slate-400">Perlu kroscek admin</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <AlertCircle className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Control Bar: Filter, Search & Action Export Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        {/* Top Row Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama pengirim, jamaah, bank, atau keterangan..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Action Export & Archive Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Save to Archive */}
            <button
              onClick={onOpenSaveArchiveModal}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              <span>Simpan Ke Arsip</span>
            </button>

            {/* WhatsApp Rekap Action */}
            <button
              onClick={onOpenWARecapModal}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Salin Rekap WA</span>
            </button>

            {/* Direct Copy to Excel */}
            <button
              onClick={handleCopyTSVForExcel}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
              title="Salin tabel dengan format kolom tab yang siap di-paste langsung ke Microsoft Excel atau Google Sheets"
            >
              {copiedExcel ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedExcel ? 'Tersalin!' : 'Salin Ke Excel'}</span>
            </button>

            {/* Download Excel CSV */}
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
              title="Unduh File Excel .CSV (UTF-8)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>.CSV</span>
            </button>

            {/* Add Manual */}
            <button
              onClick={() => onOpenEditModal(null)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" /> Status:
            </span>
            {(['Semua', 'Sudah Transfer', 'Janji Bayar', 'Butuh Verifikasi', 'Gagal'] as PaymentStatus[]).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    statusFilter === st
                      ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>

          {/* Jenis Pembayaran & Sort Select */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Jenis:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as PaymentTypeFilter)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Semua">Semua Jenis</option>
                <option value="DP">DP</option>
                <option value="Pelunasan">Pelunasan</option>
                <option value="Cicilan">Cicilan</option>
                <option value="Booking Fee">Booking Fee</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={() => {
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                }}
                className="flex items-center gap-1 bg-slate-950 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer"
                title="Ganti Urutan (Ascending/Descending)"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>{sortField === 'nominal' ? 'Nominal' : 'Tanggal'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Excel Formatted Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <TableIcon className="w-4 h-4 text-emerald-400" />
            <span>Tabel Rekapitulasi Transaksi</span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Gunakan tombol &quot;Simpan Ke Arsip&quot; di atas untuk menyimpan batch ini agar dapat dibuka/ditambahkan lagi.
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">Tidak ada data transaksi</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {records.length === 0
                  ? 'Belum ada obrolan WhatsApp yang diproses. Silakan input chat di tab utama.'
                  : 'Tidak ada transaksi yang cocok dengan filter pencarian.'}
              </p>
            </div>
            {records.length === 0 && (
              <button
                onClick={onSwitchToInput}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Input Chat Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-slate-950 text-emerald-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-3 border-r border-slate-800/60 text-center">No</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Tanggal &amp; Waktu</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Nama Pengirim WA</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Jamaah / Agen / Pelanggan</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Jenis Pembayaran</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60 text-right">Nominal (Rp)</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Bank Tujuan</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Status Pembayaran</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60 text-center">Struk</th>
                  <th className="py-3.5 px-4 border-r border-slate-800/60">Keterangan</th>
                  <th className="py-3.5 px-4 text-center min-w-[100px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRecords.map((rec, index) => (
                  <tr
                    key={rec.id || index}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Index Row No */}
                    <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px] border-r border-slate-800/60">
                      {index + 1}
                    </td>

                    {/* Tanggal & Waktu */}
                    <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap text-[11px] border-r border-slate-800/60">
                      {rec.tanggal_waktu || '2026-03-12 00:00'}
                    </td>

                    {/* Pengirim WA */}
                    <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap border-r border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{rec.nama_pengirim_chat}</span>
                      </div>
                    </td>

                    {/* Jamaah / Agen / Pelanggan */}
                    <td className="py-3 px-4 font-medium text-emerald-300 whitespace-nowrap border-r border-slate-800/60">
                      {rec.nama_jamaah_atau_agen}
                    </td>

                    {/* Jenis Pembayaran */}
                    <td className="py-3 px-4 whitespace-nowrap border-r border-slate-800/60">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                        {rec.jenis_pembayaran}
                      </span>
                    </td>

                    {/* Nominal */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap text-sm border-r border-slate-800/60">
                      {formatRupiah(rec.nominal)}
                    </td>

                    {/* Bank Tujuan */}
                    <td className="py-3 px-4 font-semibold text-slate-300 whitespace-nowrap border-r border-slate-800/60">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{rec.bank_tujuan || 'Null'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap border-r border-slate-800/60">
                      <select
                        value={rec.status}
                        onChange={(e) => handleQuickStatusChange(rec, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${
                          rec.status === 'Sudah Transfer'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : rec.status === 'Janji Bayar'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : rec.status === 'Gagal'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        <option value="Sudah Transfer" className="bg-slate-900 text-emerald-400">Sudah Transfer</option>
                        <option value="Janji Bayar" className="bg-slate-900 text-amber-400">Janji Bayar</option>
                        <option value="Butuh Verifikasi" className="bg-slate-900 text-indigo-400">Butuh Verifikasi</option>
                        <option value="Gagal" className="bg-slate-900 text-rose-400">Gagal</option>
                      </select>
                    </td>

                    {/* Bukti Transfer */}
                    <td className="py-3 px-4 text-center whitespace-nowrap border-r border-slate-800/60">
                      {rec.bukti_transfer_terlampir ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Struk ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">Tanpa Struk</span>
                      )}
                    </td>

                    {/* Keterangan */}
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate text-[11px] border-r border-slate-800/60" title={rec.keterangan}>
                      {rec.keterangan || '-'}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenContextModal(rec);
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-emerald-500/30"
                          title="Inspeksi / Preview Konteks Obrolan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditModal(rec);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-500/30"
                          title="Edit Transaksi Ini"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRecord(rec);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
                          title="Hapus Transaksi Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan {filteredRecords.length} dari total {records.length} transaksi</span>
          <span className="font-mono text-emerald-400 font-bold">
            Total Terkonfirmasi: {formatRupiah(liveConfirmedTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
