import { ArchivedBatch, PaymentRecord, SummaryData } from '../types/finance';

const STORAGE_KEY = 'wa_financial_archives_v1';

/**
 * Get all archived batches from localStorage
 */
export function getSavedArchives(): ArchivedBatch[] {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) return [];
    const parsed = JSON.parse(dataStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load archives from localStorage:', err);
    return [];
  }
}

/**
 * Save all archived batches to localStorage
 */
export function saveArchivesToStorage(archives: ArchivedBatch[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
    return true;
  } catch (err) {
    console.error('Failed to save archives to localStorage:', err);
    return false;
  }
}

/**
 * Create a new archived batch
 */
export function createNewArchiveBatch(
  title: string,
  rawChatText: string,
  records: PaymentRecord[],
  note?: string
): ArchivedBatch {
  const confirmedTotal = records.reduce(
    (acc, item) => (item.status === 'Sudah Transfer' ? acc + item.nominal : acc),
    0
  );

  const nowStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const newBatch: ArchivedBatch = {
    id: `archive-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim() || `Arsip Transaksi - ${nowStr}`,
    dateCreated: nowStr,
    dateUpdated: nowStr,
    note: note || '',
    rawChatText,
    records,
    summary: {
      total_transaksi: records.length,
      total_nominal_terkonfirmasi: confirmedTotal
    }
  };

  const archives = getSavedArchives();
  archives.unshift(newBatch);
  saveArchivesToStorage(archives);
  return newBatch;
}

/**
 * Append/merge new records into an existing archive batch
 */
export function mergeIntoExistingArchive(
  archiveId: string,
  newRecords: PaymentRecord[],
  additionalRawText?: string
): ArchivedBatch | null {
  const archives = getSavedArchives();
  const index = archives.findIndex(a => a.id === archiveId);
  if (index === -1) return null;

  const archive = archives[index];

  // Combine records avoiding exact duplicates
  const existingMap = new Set(
    archive.records.map(r => `${r.nama_pengirim_chat.toLowerCase()}_${r.tanggal_waktu}_${r.nominal}_${r.jenis_pembayaran}`)
  );

  const mergedRecords = [...archive.records];
  let addedCount = 0;

  newRecords.forEach(rec => {
    const key = `${rec.nama_pengirim_chat.toLowerCase()}_${rec.tanggal_waktu}_${rec.nominal}_${rec.jenis_pembayaran}`;
    if (!existingMap.has(key)) {
      mergedRecords.push({
        ...rec,
        id: rec.id || `merged-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      });
      existingMap.add(key);
      addedCount++;
    }
  });

  // Calculate updated summary
  const confirmedTotal = mergedRecords.reduce(
    (acc, item) => (item.status === 'Sudah Transfer' ? acc + item.nominal : acc),
    0
  );

  const nowStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  archive.records = mergedRecords;
  archive.summary = {
    total_transaksi: mergedRecords.length,
    total_nominal_terkonfirmasi: confirmedTotal
  };
  archive.dateUpdated = nowStr;

  if (additionalRawText && additionalRawText.trim()) {
    archive.rawChatText = `${archive.rawChatText}\n\n--- [Tambahan Chat ${nowStr}] ---\n${additionalRawText}`;
  }

  archives[index] = archive;
  saveArchivesToStorage(archives);
  return archive;
}

/**
 * Delete an archive batch by ID
 */
export function deleteArchiveBatch(archiveId: string): boolean {
  const archives = getSavedArchives();
  const filtered = archives.filter(a => a.id !== archiveId);
  return saveArchivesToStorage(filtered);
}
