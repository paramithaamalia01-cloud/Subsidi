import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputTab } from './components/InputTab';
import { TableTab } from './components/TableTab';
import { ArchiveTab } from './components/ArchiveTab';
import { JsonPreviewTab } from './components/JsonPreviewTab';
import { GuideTab } from './components/GuideTab';
import { EditTransactionModal } from './components/EditTransactionModal';
import { TranscriptContextModal } from './components/TranscriptContextModal';
import { WhatsAppRecapModal } from './components/WhatsAppRecapModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SaveArchiveModal } from './components/SaveArchiveModal';
import { SAMPLE_CHATS } from './data/sampleChats';
import { PaymentRecord, SummaryData, ArchivedBatch } from './types/finance';
import { parseChatHeuristic } from './utils/heuristicParser';
import {
  getSavedArchives,
  createNewArchiveBatch,
  mergeIntoExistingArchive,
  deleteArchiveBatch,
  saveArchivesToStorage
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'table' | 'archive' | 'json' | 'guide'>('input');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_CHATS[0].id);
  const [rawChatText, setRawChatText] = useState<string>(SAMPLE_CHATS[0].rawText);
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<SummaryData>({ total_transaksi: 0, total_nominal_terkonfirmasi: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Saved Archives state in localStorage
  const [archives, setArchives] = useState<ArchivedBatch[]>([]);

  // Modals state
  const [editingRecord, setEditingRecord] = useState<PaymentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  
  const [contextRecord, setContextRecord] = useState<PaymentRecord | null>(null);
  const [isContextModalOpen, setIsContextModalOpen] = useState<boolean>(false);
  
  const [isWARecapModalOpen, setIsWARecapModalOpen] = useState<boolean>(false);

  const [deletingRecord, setDeletingRecord] = useState<PaymentRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isSaveArchiveModalOpen, setIsSaveArchiveModalOpen] = useState<boolean>(false);

  // Load saved archives from storage on mount
  useEffect(() => {
    setArchives(getSavedArchives());
  }, []);

  // Helper to ensure every record has a unique ID
  const ensureIds = (items: PaymentRecord[]): PaymentRecord[] => {
    return items.map((item, idx) => ({
      ...item,
      id: item.id || `rec-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    }));
  };

  // Function to process chat via server-side Gemini 3.8 Flash API
  const handleProcessChat = async () => {
    if (!rawChatText.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatText: rawChatText }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data_pembayaran && Array.isArray(data.data_pembayaran)) {
        const recordsWithIds = ensureIds(data.data_pembayaran);

        setRecords(recordsWithIds);
        setSummary(data.summary || {
          total_transaksi: recordsWithIds.length,
          total_nominal_terkonfirmasi: recordsWithIds.reduce((a, b) => b.status === 'Sudah Transfer' ? a + b.nominal : a, 0)
        });

        // Automatically switch to Table view after processing
        setActiveTab('table');
      } else {
        throw new Error('Format respon AI tidak mengandung atribut "data_pembayaran".');
      }
    } catch (err: any) {
      console.warn('Server parse error, invoking client fallback:', err);
      // Fallback heuristic parser if server fails or offline
      try {
        const fallback = parseChatHeuristic(rawChatText);
        const recordsWithIds = ensureIds(fallback.data_pembayaran);
        setRecords(recordsWithIds);
        setSummary(fallback.summary);
        setActiveTab('table');
      } catch (fallbackErr) {
        setError(err.message || 'Gagal memproses obrolan WhatsApp.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Run initial parse on mount for default sample
  useEffect(() => {
    handleProcessChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save edited or newly added transaction
  const handleSaveTransaction = (savedRecord: PaymentRecord) => {
    if (editingRecord && editingRecord.id) {
      // Update existing record by ID
      setRecords((prev) =>
        prev.map((r) => (r.id === editingRecord.id ? { ...savedRecord, id: editingRecord.id } : r))
      );
    } else {
      // Add new record
      const newRec = {
        ...savedRecord,
        id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      setRecords((prev) => [newRec, ...prev]);
    }
    setIsEditModalOpen(false);
    setEditingRecord(null);
  };

  // Request Delete Modal Trigger
  const handleRequestDelete = (targetRecord: PaymentRecord) => {
    setDeletingRecord(targetRecord);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (deletingRecord) {
      setRecords((prev) =>
        prev.filter((r) => {
          if (deletingRecord.id && r.id) {
            return r.id !== deletingRecord.id;
          }
          return !(
            r.nama_pengirim_chat === deletingRecord.nama_pengirim_chat &&
            r.tanggal_waktu === deletingRecord.tanggal_waktu &&
            r.nominal === deletingRecord.nominal &&
            r.jenis_pembayaran === deletingRecord.jenis_pembayaran
          );
        })
      );
    }
    setDeletingRecord(null);
    setIsDeleteModalOpen(false);
  };

  // Archive Handlers
  const handleSaveNewArchive = (title: string, note?: string) => {
    createNewArchiveBatch(title, rawChatText, records, note);
    setArchives(getSavedArchives());
  };

  const handleMergeIntoArchive = (archiveId: string) => {
    mergeIntoExistingArchive(archiveId, records, rawChatText);
    setArchives(getSavedArchives());
  };

  const handleLoadArchive = (batch: ArchivedBatch) => {
    setRecords(ensureIds(batch.records));
    setSummary(batch.summary);
    setRawChatText(batch.rawChatText || '');
    setActiveTab('table');
  };

  const handleDeleteArchive = (archiveId: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus arsip "${title}"?`)) {
      deleteArchiveBatch(archiveId);
      setArchives(getSavedArchives());
    }
  };

  const handleImportBackup = (imported: ArchivedBatch[]) => {
    const current = getSavedArchives();
    const existingIds = new Set(current.map(a => a.id));
    
    const combined = [...current];
    imported.forEach(item => {
      if (!existingIds.has(item.id)) {
        combined.push(item);
        existingIds.add(item.id);
      }
    });

    saveArchivesToStorage(combined);
    setArchives(combined);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProcessClick={handleProcessChat}
        isProcessing={isProcessing}
        itemCount={records.length}
        archiveCount={archives.length}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'input' && (
          <InputTab
            rawChatText={rawChatText}
            setRawChatText={setRawChatText}
            onProcessChat={handleProcessChat}
            isProcessing={isProcessing}
            error={error}
            selectedSampleId={selectedSampleId}
            setSelectedSampleId={setSelectedSampleId}
          />
        )}

        {activeTab === 'table' && (
          <TableTab
            records={records}
            summary={summary}
            setRecords={setRecords}
            onOpenEditModal={(rec) => {
              setEditingRecord(rec);
              setIsEditModalOpen(true);
            }}
            onOpenContextModal={(rec) => {
              setContextRecord(rec);
              setIsContextModalOpen(true);
            }}
            onDeleteRecord={handleRequestDelete}
            onOpenWARecapModal={() => setIsWARecapModalOpen(true)}
            onOpenSaveArchiveModal={() => setIsSaveArchiveModalOpen(true)}
            onSwitchToInput={() => setActiveTab('input')}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveTab
            archives={archives}
            onLoadArchive={handleLoadArchive}
            onDeleteArchive={handleDeleteArchive}
            onOpenSaveModal={() => setIsSaveArchiveModalOpen(true)}
            onImportBackup={handleImportBackup}
          />
        )}

        {activeTab === 'json' && (
          <JsonPreviewTab records={records} />
        )}

        {activeTab === 'guide' && (
          <GuideTab />
        )}
      </main>

      {/* Modal Dialogs */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveTransaction}
        editingRecord={editingRecord}
      />

      <TranscriptContextModal
        isOpen={isContextModalOpen}
        onClose={() => {
          setIsContextModalOpen(false);
          setContextRecord(null);
        }}
        record={contextRecord}
        fullRawChatText={rawChatText}
      />

      <WhatsAppRecapModal
        isOpen={isWARecapModalOpen}
        onClose={() => setIsWARecapModalOpen(false)}
        records={records}
        summary={summary}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRecord(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        record={deletingRecord}
      />

      <SaveArchiveModal
        isOpen={isSaveArchiveModalOpen}
        onClose={() => setIsSaveArchiveModalOpen(false)}
        records={records}
        rawChatText={rawChatText}
        existingArchives={archives}
        onSaveNewArchive={handleSaveNewArchive}
        onMergeIntoArchive={handleMergeIntoArchive}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 WhatsApp Financial Chat Parser &amp; Validator. Powered by Gemini 3.8 Flash Engine.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Arsip Transaksi Storage</span>
            <span>·</span>
            <span>Tabel Excel Clean</span>
            <span>·</span>
            <span>Rekap WA Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
