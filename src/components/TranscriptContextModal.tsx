import React from 'react';
import { PaymentRecord } from '../types/finance';
import { X, Search, CheckCircle2, Clock, AlertTriangle, Building, User, Calendar, Tag } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface TranscriptContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PaymentRecord | null;
  fullRawChatText: string;
}

export const TranscriptContextModal: React.FC<TranscriptContextModalProps> = ({
  isOpen,
  onClose,
  record,
  fullRawChatText,
}) => {
  if (!isOpen || !record) return null;

  // Search for lines in the raw chat text that contain relevant sender or payment keywords
  const allLines = fullRawChatText.split('\n');
  const senderName = record.nama_pengirim_chat.toLowerCase();
  
  // Find lines related to this sender or payment
  const matchingLineIndices: number[] = [];
  allLines.forEach((line, index) => {
    const lLower = line.toLowerCase();
    if (
      (senderName && lLower.includes(senderName.split(' ')[0])) ||
      (record.bank_tujuan !== 'Null' && lLower.includes(record.bank_tujuan.toLowerCase())) ||
      (record.nominal > 0 && lLower.includes(String(record.nominal).slice(0, 3)))
    ) {
      matchingLineIndices.push(index);
    }
  });

  // Extract transcript context window (around matching lines)
  let contextLines: { index: number; line: string; isHighlight: boolean }[] = [];

  if (matchingLineIndices.length > 0) {
    const firstMatch = matchingLineIndices[0];
    const startIdx = Math.max(0, firstMatch - 3);
    const endIdx = Math.min(allLines.length - 1, firstMatch + 6);

    for (let i = startIdx; i <= endIdx; i++) {
      contextLines.push({
        index: i + 1,
        line: allLines[i],
        isHighlight: matchingLineIndices.includes(i)
      });
    }
  } else {
    // Fallback if no direct keyword line match
    contextLines = allLines.slice(0, 10).map((line, idx) => ({
      index: idx + 1,
      line,
      isHighlight: false
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Inspeksi Konteks Obrolan Transaksi
              </h2>
              <p className="text-xs text-slate-400">Pemeriksaan Baris Transkrip Asli WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Record Summary Card */}
        <div className="my-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white font-mono">
                {formatRupiah(record.nominal)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                {record.jenis_pembayaran}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                record.status === 'Sudah Transfer'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : record.status === 'Janji Bayar'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              }`}>
                {record.status}
              </span>
              {record.bukti_transfer_terlampir && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Bukti Struk ✓
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 flex items-center gap-1"><User className="w-3 h-3" /> Pengirim WA</span>
              <p className="font-semibold text-slate-200 mt-0.5 truncate">{record.nama_pengirim_chat}</p>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1"><Tag className="w-3 h-3" /> Jamaah/Agen</span>
              <p className="font-semibold text-slate-200 mt-0.5 truncate">{record.nama_jamaah_atau_agen}</p>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1"><Building className="w-3 h-3" /> Bank Tujuan</span>
              <p className="font-semibold text-slate-200 mt-0.5">{record.bank_tujuan || 'Null'}</p>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Tanggal Chat</span>
              <p className="font-semibold text-slate-200 mt-0.5 font-mono text-[11px]">{record.tanggal_waktu}</p>
            </div>
          </div>

          {record.keterangan && (
            <div className="text-xs pt-1 text-slate-300">
              <span className="text-slate-500 font-medium">Catatan AI: </span>
              <span>{record.keterangan}</span>
            </div>
          )}
        </div>

        {/* Raw Transcript Segment Window */}
        <div className="flex-1 overflow-y-auto space-y-1 bg-slate-950 p-4 border border-slate-800 rounded-xl font-mono text-xs">
          <p className="text-[11px] text-slate-500 mb-2 font-sans font-semibold uppercase tracking-wider">
            Potongan Baris Obrolan WhatsApp Terkait:
          </p>
          {contextLines.map((item) => (
            <div
              key={item.index}
              className={`p-2 rounded transition-colors flex gap-3 ${
                item.isHighlight
                  ? 'bg-emerald-950/60 border-l-2 border-emerald-500 text-emerald-200 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/50'
              }`}
            >
              <span className="text-slate-600 select-none text-[10px] w-6 shrink-0">{item.index}</span>
              <span className="break-all leading-relaxed">{item.line}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">Hasil verifikasi silang AI Gemini 3.8 Flash</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
