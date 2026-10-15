import React, { useState, useEffect } from 'react';
import { PaymentRecord } from '../types/finance';
import { X, Save, Plus } from 'lucide-react';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PaymentRecord) => void;
  editingRecord: PaymentRecord | null;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRecord,
}) => {
  const [formData, setFormData] = useState<PaymentRecord>({
    tanggal_waktu: '',
    nama_pengirim_chat: '',
    nama_jamaah_atau_agen: '',
    jenis_pembayaran: 'DP',
    nominal: 0,
    bank_tujuan: 'BCA',
    status: 'Sudah Transfer',
    bukti_transfer_terlampir: true,
    keterangan: '',
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({ ...editingRecord });
    } else {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setFormData({
        tanggal_waktu: dateStr,
        nama_pengirim_chat: '',
        nama_jamaah_atau_agen: '',
        jenis_pembayaran: 'DP',
        nominal: 0,
        bank_tujuan: 'BCA',
        status: 'Sudah Transfer',
        bukti_transfer_terlampir: false,
        keterangan: '',
      });
    }
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {editingRecord ? (
              <Save className="w-5 h-5 text-emerald-400" />
            ) : (
              <Plus className="w-5 h-5 text-emerald-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {editingRecord ? 'Edit Data Transaksi' : 'Tambah Transaksi Manual'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal &amp; Waktu (YYYY-MM-DD HH:MM)
              </label>
              <input
                type="text"
                required
                value={formData.tanggal_waktu}
                onChange={(e) => setFormData({ ...formData, tanggal_waktu: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="2026-03-12 14:30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Pengirim WA
              </label>
              <input
                type="text"
                required
                value={formData.nama_pengirim_chat}
                onChange={(e) => setFormData({ ...formData, nama_pengirim_chat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="Misal: Pak Bambang"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jamaah / Agen / Pelanggan
              </label>
              <input
                type="text"
                required
                value={formData.nama_jamaah_atau_agen}
                onChange={(e) => setFormData({ ...formData, nama_jamaah_atau_agen: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="Bambang & Sulastri"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jenis Pembayaran
              </label>
              <select
                value={formData.jenis_pembayaran}
                onChange={(e) => setFormData({ ...formData, jenis_pembayaran: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="DP">DP (Down Payment)</option>
                <option value="Pelunasan">Pelunasan</option>
                <option value="Cicilan">Cicilan</option>
                <option value="Booking Fee">Booking Fee</option>
                <option value="Setoran Tiket">Setoran Tiket</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nominal (Integer Murni)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.nominal}
                onChange={(e) => setFormData({ ...formData, nominal: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="10000000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Tujuan / Asal
              </label>
              <input
                type="text"
                value={formData.bank_tujuan}
                onChange={(e) => setFormData({ ...formData, bank_tujuan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="BCA / Mandiri / BSI / Null"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Pembayaran
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Sudah Transfer">Sudah Transfer</option>
                <option value="Janji Bayar">Janji Bayar</option>
                <option value="Butuh Verifikasi">Butuh Verifikasi</option>
                <option value="Gagal">Gagal</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bukti_transfer_terlampir}
                  onChange={(e) => setFormData({ ...formData, bukti_transfer_terlampir: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
              </label>
              <span className="text-xs text-slate-300 font-medium">Bukti Transfer Terlampir</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Keterangan / Catatan Tambahan
            </label>
            <textarea
              rows={2}
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              placeholder="Catatan paket, jumlah pax, dsb..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-md shadow-emerald-950/30 transition-all cursor-pointer"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
