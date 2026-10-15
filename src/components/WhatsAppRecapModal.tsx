import React, { useState } from 'react';
import { PaymentRecord, SummaryData } from '../types/finance';
import { generateWhatsAppRecapText } from '../utils/formatters';
import { X, Copy, Check, Share2, MessageSquare } from 'lucide-react';

interface WhatsAppRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PaymentRecord[];
  summary: SummaryData;
}

export const WhatsAppRecapModal: React.FC<WhatsAppRecapModalProps> = ({
  isOpen,
  onClose,
  records,
  summary,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const recapText = generateWhatsAppRecapText(records, summary);

  const handleCopy = () => {
    navigator.clipboard.writeText(recapText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Salin Rekap Pembayaran WhatsApp
              </h2>
              <p className="text-xs text-slate-400">Siap Tempel (Paste) Langsung ke Chat WA Admin / Grup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Preview Card */}
        <div className="my-4 flex-1 overflow-y-auto space-y-2 bg-slate-950 p-4 border border-slate-800 rounded-xl font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
          {recapText}
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500">
            Format menggunakan cetak tebal <code className="text-emerald-400">*teks*</code> &amp; miring <code className="text-emerald-400">_teks_</code> WhatsApp.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin Ke Clipboard!' : 'Salin Teks Rekap WA'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
