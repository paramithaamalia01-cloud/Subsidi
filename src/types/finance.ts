export interface PaymentRecord {
  id?: string;
  tanggal_waktu: string;
  nama_pengirim_chat: string;
  nama_jamaah_atau_agen: string;
  jenis_pembayaran: string;
  nominal: number;
  bank_tujuan: string;
  status: 'Sudah Transfer' | 'Janji Bayar' | 'Butuh Verifikasi' | 'Gagal' | string;
  bukti_transfer_terlampir: boolean;
  keterangan: string;
  raw_line_context?: string; // Optional line context for transcript inspector
}

export interface SummaryData {
  total_transaksi: number;
  total_nominal_terkonfirmasi: number;
}

export interface ParserResult {
  summary: SummaryData;
  data_pembayaran: PaymentRecord[];
}

export interface ArchivedBatch {
  id: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  note?: string;
  rawChatText: string;
  records: PaymentRecord[];
  summary: SummaryData;
}

export type PaymentStatus = 'Semua' | 'Sudah Transfer' | 'Janji Bayar' | 'Butuh Verifikasi' | 'Gagal';
export type PaymentTypeFilter = 'Semua' | 'DP' | 'Pelunasan' | 'Cicilan' | 'Booking Fee';
