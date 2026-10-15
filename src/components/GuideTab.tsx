import React from 'react';
import { Smartphone, CheckCircle, HelpCircle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export const GuideTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-extrabold text-white">Panduan Ekspor Chat WhatsApp &amp; Standar Format</h1>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Petunjuk langkah demi langkah mengambil berkas obrolan WhatsApp mentah dari smartphone Anda, serta standar format catatan admin untuk akurasi ekstraksi 100%.
        </p>
      </div>

      {/* Step 1: How to export WA chats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Android Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Ekspor Chat di WhatsApp Android</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>Buka obrolan individual atau grup di WhatsApp Android.</li>
            <li>Ketuk titik tiga <strong className="text-white">(⋮)</strong> di sudut kanan atas.</li>
            <li>Pilih <strong className="text-white">Lainnya (More)</strong> &rarr; <strong className="text-white">Ekspor Obrolan (Export chat)</strong>.</li>
            <li>Pilih opsi <strong className="text-white">Tanpa Media (Without Media)</strong> agar berukuran kecil dan cepat.</li>
            <li>Simpan atau kirim file <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400">.txt</code> tersebut ke PC/laptop Anda.</li>
          </ol>
        </div>

        {/* iPhone / iOS Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Ekspor Chat di WhatsApp iPhone (iOS)</span>
          </div>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>Buka obrolan individual atau grup di WhatsApp iOS.</li>
            <li>Ketuk nama kontak atau nama grup di bagian atas layar.</li>
            <li>Gulir ke bawah dan ketuk <strong className="text-white">Ekspor Obrolan (Export Chat)</strong>.</li>
            <li>Pilih opsi <strong className="text-white">Tanpa Media (Without Media)</strong>.</li>
            <li>Pilih <strong className="text-white">Simpan ke File (Save to Files)</strong> atau kirim via AirDrop/Email/Drive.</li>
          </ol>
        </div>
      </div>

      {/* Best Practices for Financial Admins */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Tips Praktis Admin Finansial &amp; Travel</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
            <h3 className="font-bold text-emerald-400">1. Tuliskan Nominal Secara Jelas</h3>
            <p className="text-slate-400 leading-relaxed">
              Format nominal disarankan mencantumkan angka seperti <code className="text-white">Rp 10.000.000</code>, <code className="text-white">10jt</code>, atau <code className="text-white">500rb</code>. AI Gemini otomatis mengonversi kata seperti &quot;10juta&quot; menjadi angka murni <code className="text-emerald-400">10000000</code>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
            <h3 className="font-bold text-emerald-400">2. Sebutkan Nama Bank &amp; Jamaah</h3>
            <p className="text-slate-400 leading-relaxed">
              Sebutkan nama bank tujuan (seperti BSI, BCA, Mandiri, BRI) dan nama jamaah/agen (misal: &quot;DP 2 pax a.n Ahmad &amp; Siti&quot;) agar otomatis terisi di kolom target.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
            <h3 className="font-bold text-emerald-400">3. Sertakan Kata Kunci Status</h3>
            <p className="text-slate-400 leading-relaxed">
              Kata kunci seperti <code className="text-white">&quot;sudah tf&quot;</code>, <code className="text-white">&quot;struk terlampir&quot;</code>, atau <code className="text-white">&quot;janji bayar tgl 20&quot;</code> membantu menetapkan status otomatis.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
            <h3 className="font-bold text-emerald-400">4. Penanganan Obrolan Santai</h3>
            <p className="text-slate-400 leading-relaxed">
              Aplikasi ini secara cerdas mengabaikan obrolan santai, salam, atau gosip non-finansial dan hanya mengambil poin komitmen pembayaran.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
