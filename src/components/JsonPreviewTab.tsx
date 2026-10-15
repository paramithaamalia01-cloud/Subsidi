import React, { useState } from 'react';
import { ParserResult, PaymentRecord } from '../types/finance';
import { validateSchemaConformity, downloadFile, exportToCSV } from '../utils/formatters';
import { Copy, Check, Download, ShieldCheck, AlertCircle, Code2, FileSpreadsheet } from 'lucide-react';

interface JsonPreviewTabProps {
  records: PaymentRecord[];
}

export const JsonPreviewTab: React.FC<JsonPreviewTabProps> = ({ records }) => {
  const [copied, setCopied] = useState(false);
  const [showValidationResult, setShowValidationResult] = useState(false);

  // Compute live summary matching schema
  const confirmedTotal = records.reduce(
    (acc, item) => (item.status === 'Sudah Transfer' ? acc + item.nominal : acc),
    0
  );

  const formattedOutput: ParserResult = {
    summary: {
      total_transaksi: records.length,
      total_nominal_terkonfirmasi: confirmedTotal,
    },
    data_pembayaran: records.map(({ id, raw_line_context, ...rest }) => ({ ...rest })),
  };

  const jsonString = JSON.stringify(formattedOutput, null, 2);

  // Copy JSON
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    downloadFile(jsonString, `whatsapp_financial_data_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  // Download CSV
  const handleDownloadCSV = () => {
    const csvStr = exportToCSV(records);
    downloadFile(csvStr, `whatsapp_financial_data_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  // Validation
  const validation = validateSchemaConformity(formattedOutput);

  return (
    <div className="space-y-6">
      {/* Top Banner Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-3.5 h-3.5" /> Direct Output JSON
            </span>
            <span className="text-xs text-slate-400">100% Sesuai Spesifikasi</span>
          </div>
          <h2 className="text-lg font-bold text-white">Output JSON Terformat &amp; Tervalidasi</h2>
          <p className="text-xs text-slate-400">
            Hasil ekstraksi murni JSON tanpa teks pengantar, siap diintegrasikan ke API backend atau sistem akuntansi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowValidationResult(!showValidationResult)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Uji Skema JSON</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh JSON</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Unduh format spreadsheet CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Schema Validation Report Drawer */}
      {showValidationResult && (
        <div className={`p-4 rounded-xl border text-xs animate-fade-in ${
          validation.valid
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {validation.valid ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>
              {validation.valid
                ? 'Skema JSON Valid 100%! Memenuhi semua atribut yang ditentukan.'
                : 'Peringatan Skema JSON:'}
            </span>
          </div>
          {!validation.valid && (
            <ul className="list-disc list-inside space-y-1 mt-2 text-rose-300">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Code Viewer Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 font-bold text-slate-300">output_data.json</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {jsonString.length.toLocaleString('id-ID')} Karakter
          </span>
        </div>

        <pre className="p-5 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto bg-slate-950 max-h-[600px] select-all">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
