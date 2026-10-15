import { ParserResult, PaymentRecord, SummaryData } from '../types/finance';

/**
 * Format raw number to Indonesian Rupiah (Rp X.XXX.XXX)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Generate formatted WhatsApp Rekap text with markdown (bold, italic, list)
 */
export function generateWhatsAppRecapText(records: PaymentRecord[], summary?: SummaryData): string {
  const confirmedTotal = records.reduce(
    (acc, item) => (item.status === 'Sudah Transfer' ? acc + item.nominal : acc),
    0
  );
  const pendingTotal = records.reduce(
    (acc, item) => (item.status === 'Janji Bayar' ? acc + item.nominal : acc),
    0
  );

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let text = `📊 *REKAP PEMBAYARAN TRANSAKSI WHATSAPP*\n`;
  text += `📅 _Tanggal Rekap: ${todayStr}_\n\n`;

  text += `💵 *RINGKASAN UTAMA:*\n`;
  text += `• Total Transaksi: *${records.length} Item*\n`;
  text += `• Total Terkonfirmasi: *${formatRupiah(confirmedTotal)}*\n`;
  if (pendingTotal > 0) {
    text += `• Total Janji Bayar: *${formatRupiah(pendingTotal)}*\n`;
  }
  text += `\n----------------------------------\n`;
  text += `📝 *RINCIAN TRANSAKSI:* \n\n`;

  if (records.length === 0) {
    text += `_Belum ada data transaksi yang tercatat._\n`;
  } else {
    records.forEach((item, index) => {
      const statusEmoji =
        item.status === 'Sudah Transfer'
          ? '✅'
          : item.status === 'Janji Bayar'
          ? '⏳'
          : item.status === 'Gagal'
          ? '❌'
          : '⚠️';

      const strukText = item.bukti_transfer_terlampir ? ' (Struk Ada)' : '';

      text += `*${index + 1}. ${item.nama_pengirim_chat}*`;
      if (item.nama_jamaah_atau_agen && item.nama_jamaah_atau_agen !== item.nama_pengirim_chat) {
        text += ` _(a.n ${item.nama_jamaah_atau_agen})_`;
      }
      text += `\n`;
      text += `   • Jenis: ${item.jenis_pembayaran}\n`;
      text += `   • Nominal: *${formatRupiah(item.nominal)}*\n`;
      text += `   • Bank: ${item.bank_tujuan || 'Null'}\n`;
      text += `   • Status: ${statusEmoji} *${item.status}*${strukText}\n`;
      text += `   • Tanggal: _${item.tanggal_waktu}_\n`;
      if (item.keterangan) {
        text += `   • Ket: ${item.keterangan}\n`;
      }
      text += `\n`;
    });
  }

  text += `----------------------------------\n`;
  text += `_Rekap otomatis diproses via WhatsApp Financial Extractor_`;

  return text;
}

/**
 * Export payment records to TSV string for direct 1-click Copy-Paste into Excel / Google Sheets
 */
export function exportToTSVForExcel(data: PaymentRecord[]): string {
  const headers = [
    'Tanggal & Waktu',
    'Nama Pengirim WA',
    'Jamaah / Agen / Pelanggan',
    'Jenis Pembayaran',
    'Nominal (Rp)',
    'Bank Tujuan',
    'Status Pembayaran',
    'Bukti Struk',
    'Keterangan'
  ];

  const rows = data.map(item => [
    item.tanggal_waktu || '',
    item.nama_pengirim_chat || '',
    item.nama_jamaah_atau_agen || '',
    item.jenis_pembayaran || '',
    item.nominal || 0,
    item.bank_tujuan || 'Null',
    item.status || '',
    item.bukti_transfer_terlampir ? 'Ya (Struk Ada)' : 'Tidak Ada',
    item.keterangan || ''
  ]);

  return [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
}

/**
 * Export payment records to CSV string with UTF-8 BOM for Microsoft Excel
 */
export function exportToCSV(data: PaymentRecord[]): string {
  const headers = [
    'Tanggal & Waktu',
    'Nama Pengirim WA',
    'Jamaah / Agen / Pelanggan',
    'Jenis Pembayaran',
    'Nominal (Rp)',
    'Bank Tujuan',
    'Status',
    'Bukti Terlampir',
    'Keterangan'
  ];

  const rows = data.map(item => [
    `"${item.tanggal_waktu || ''}"`,
    `"${(item.nama_pengirim_chat || '').replace(/"/g, '""')}"`,
    `"${(item.nama_jamaah_atau_agen || '').replace(/"/g, '""')}"`,
    `"${(item.jenis_pembayaran || '').replace(/"/g, '""')}"`,
    item.nominal || 0,
    `"${(item.bank_tujuan || 'Null').replace(/"/g, '""')}"`,
    `"${(item.status || '').replace(/"/g, '""')}"`,
    item.bukti_transfer_terlampir ? 'Ya' : 'Tidak',
    `"${(item.keterangan || '').replace(/"/g, '""')}"`
  ]);

  // Add UTF-8 BOM \uFEFF so Excel automatically reads UTF-8 characters properly
  return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate parser result JSON schema conformity
 */
export function validateSchemaConformity(jsonObj: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!jsonObj || typeof jsonObj !== 'object') {
    return { valid: false, errors: ['Objek JSON tidak valid atau kosong.'] };
  }

  if (!jsonObj.summary) {
    errors.push('Property "summary" tidak ditemukan.');
  } else {
    if (typeof jsonObj.summary.total_transaksi !== 'number') {
      errors.push('summary.total_transaksi harus berupa angka (integer).');
    }
    if (typeof jsonObj.summary.total_nominal_terkonfirmasi !== 'number') {
      errors.push('summary.total_nominal_terkonfirmasi harus berupa angka (integer).');
    }
  }

  if (!Array.isArray(jsonObj.data_pembayaran)) {
    errors.push('Property "data_pembayaran" harus berupa Array.');
  } else {
    jsonObj.data_pembayaran.forEach((item: any, idx: number) => {
      if (typeof item.tanggal_waktu !== 'string') {
        errors.push(`Item [${idx}]: "tanggal_waktu" wajib string format YYYY-MM-DD HH:MM.`);
      }
      if (typeof item.nama_pengirim_chat !== 'string') {
        errors.push(`Item [${idx}]: "nama_pengirim_chat" wajib string.`);
      }
      if (typeof item.nama_jamaah_atau_agen !== 'string') {
        errors.push(`Item [${idx}]: "nama_jamaah_atau_agen" wajib string.`);
      }
      if (typeof item.jenis_pembayaran !== 'string') {
        errors.push(`Item [${idx}]: "jenis_pembayaran" wajib string.`);
      }
      if (typeof item.nominal !== 'number') {
        errors.push(`Item [${idx}]: "nominal" wajib angka murni (integer).`);
      }
      if (typeof item.bank_tujuan !== 'string') {
        errors.push(`Item [${idx}]: "bank_tujuan" wajib string.`);
      }
      if (typeof item.status !== 'string') {
        errors.push(`Item [${idx}]: "status" wajib string.`);
      }
      if (typeof item.bukti_transfer_terlampir !== 'boolean') {
        errors.push(`Item [${idx}]: "bukti_transfer_terlampir" wajib boolean (true/false).`);
      }
      if (typeof item.keterangan !== 'string') {
        errors.push(`Item [${idx}]: "keterangan" wajib string.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
