import React from 'react';
import { FileText, Table, Code2, HelpCircle, Sparkles, ReceiptText, Archive } from 'lucide-react';

interface HeaderProps {
  activeTab: 'input' | 'table' | 'archive' | 'json' | 'guide';
  setActiveTab: (tab: 'input' | 'table' | 'archive' | 'json' | 'guide') => void;
  onProcessClick?: () => void;
  isProcessing?: boolean;
  itemCount: number;
  archiveCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onProcessClick,
  isProcessing,
  itemCount,
  archiveCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <ReceiptText className="w-5 h-5 text-white" />
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('input'); }}
                className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
              >
                WA Financial Extractor
              </a>
              <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">Parser &amp; Validator Data Obrolan WhatsApp</p>
            </div>
          </div>

          {/* Zone 2: Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'input'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Input Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'table'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabel Transaksi</span>
              {itemCount > 0 && (
                <span className="ml-1 bg-emerald-700/60 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'archive'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Arsip &amp; Riwayat</span>
              {archiveCount > 0 && (
                <span className="ml-1 bg-emerald-800/80 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {archiveCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'json'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Pratinjau JSON</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'guide'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Panduan</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onProcessClick}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] transition-all rounded-lg shadow-md shadow-emerald-950/40 disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Memproses AI...' : 'Proses Chat AI'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-800 py-2">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'input' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Input</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'table' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Tabel ({itemCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'archive' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Arsip ({archiveCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'json' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'guide' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Panduan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
