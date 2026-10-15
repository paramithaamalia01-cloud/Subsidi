import React, { useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, RotateCcw, Copy, Layers } from 'lucide-react';
import { SAMPLE_CHATS, SampleChat } from '../data/sampleChats';

interface InputTabProps {
  rawChatText: string;
  setRawChatText: (text: string) => void;
  onProcessChat: () => void;
  isProcessing: boolean;
  error: string | null;
  selectedSampleId: string;
  setSelectedSampleId: (id: string) => void;
}

export const InputTab: React.FC<InputTabProps> = ({
  rawChatText,
  setRawChatText,
  onProcessChat,
  isProcessing,
  error,
  selectedSampleId,
  setSelectedSampleId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler (.txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('Mohon unggah file format teks (.txt) hasil ekspor WhatsApp.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawChatText(content);
        setSelectedSampleId('custom');
      }
    };
    reader.readAsText(file);
  };

  // Select Sample Preset
  const handleSelectSample = (sample: SampleChat) => {
    setSelectedSampleId(sample.id);
    setRawChatText(sample.rawText);
  };

  // Count lines and financial keywords
  const lineCount = rawChatText ? rawChatText.split('\n').filter(l => l.trim().length > 0).length : 0;
  const keywords = ['transfer', 'dp', 'pelunasan', 'cicilan', 'booking', 'lunas', 'rp', 'bsi', 'bca', 'mandiri', 'bri', 'struk', 'bukti'];
  const keywordHits = keywords.reduce((acc, kw) => {
    const matches = (rawChatText.toLowerCase().match(new RegExp(kw, 'g')) || []).length;
    return acc + matches;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Introduction */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash Engine
              </span>
              <span className="text-xs text-slate-400">Skema JSON Standar Finansial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ekstraksi &amp; Validaasi Obrolan Finansial WhatsApp
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unggah atau tempel ekspor chat WhatsApp mentah. AI akan secara otomatis memindai komitmen pembayaran, setoran DP, pelunasan, nomor rekening, nominal Rupiah murni, dan status bukti transfer.
            </p>
          </div>

          <button
            onClick={onProcessChat}
            disabled={isProcessing || !rawChatText.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Sparkles className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span className="text-sm">{isProcessing ? 'Memproses dengan AI...' : 'Ekstrak & Validasi Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Preset Sample Selectors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Pilih Contoh Dataset Chat (1-Klik Uji Coba)</span>
          </label>
          <span className="text-xs text-slate-500">
            {selectedSampleId === 'custom' ? 'Mode: Teks Custom / File Upload' : 'Mode: Sample Preset Selected'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_CHATS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                selectedSampleId === sample.id
                  ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {sample.badge}
                  </span>
                  {selectedSampleId === sample.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-200 line-clamp-1">{sample.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">{sample.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert if any */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Gagal Mengurai Obrolan</p>
            <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Text Area & Upload Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Toolbar Header */}
        <div className="bg-slate-800/80 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Transkrip Obrolan WhatsApp Mentah</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{lineCount} Baris Chat</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">{keywordHits} Kata Kunci Finansial Detected</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File .txt</span>
            </button>

            {rawChatText && (
              <button
                onClick={() => {
                  setRawChatText('');
                  setSelectedSampleId('custom');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Kosongkan Teks"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={rawChatText}
            onChange={(e) => {
              setRawChatText(e.target.value);
              setSelectedSampleId('custom');
            }}
            placeholder="Tempelkan ekspor chat WhatsApp mentah di sini, atau pilih salah satu sampel preset di atas..."
            className="w-full h-80 p-4 bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-y border-none"
          />
        </div>

        {/* Footer Summary Bar */}
        <div className="bg-slate-900 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Format Waktu Support: [DD/MM/YY, HH.MM] atau YYYY-MM-DD</span>
          </div>

          <button
            onClick={onProcessChat}
            disabled={isProcessing || !rawChatText.trim()}
            className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-40 cursor-pointer"
          >
            <span>Mulai Proses Extraction</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
