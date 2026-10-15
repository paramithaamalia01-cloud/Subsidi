import { ParserResult, PaymentRecord } from '../types/finance';

/**
 * Heuristic client-side parser fallback in case network API is offline
 */
export function parseChatHeuristic(text: string): ParserResult {
  const lines = text.split('\n');
  const records: PaymentRecord[] = [];

  let currentSender = 'Pengirim WA';
  let currentDate = '2026-03-12 00:00';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match date timestamp pattern e.g. [12/03/26 08:25:44] or 12/03/26, 08:25 - Name:
    const headerMatch = line.match(/^\[?(\d{2}\/\d{2}\/\d{2,4})[,\s]+(\d{2}[:.]\d{2}(?:[:.]\d{2})?)\]?\s*([^:]+):/i);
    if (headerMatch) {
      const rawDate = headerMatch[1];
      const rawTime = headerMatch[2].replace('.', ':');
      currentSender = headerMatch[3].trim();

      // Convert DD/MM/YY to YYYY-MM-DD
      const dateParts = rawDate.split('/');
      if (dateParts.length === 3) {
        const year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];
        currentDate = `${year}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')} ${rawTime.slice(0, 5)}`;
      }
    }

    const lower = line.toLowerCase();

    // Check if line contains financial intent
    if (
      lower.includes('transfer') ||
      lower.includes('dp') ||
      lower.includes('pelunasan') ||
      lower.includes('cicilan') ||
      lower.includes('janji bayar') ||
      lower.includes('booking fee') ||
      lower.includes('setoran') ||
      lower.includes('rp')
    ) {
      // Extract nominal
      let nominal = 0;
      const rpMatch = line.match(/rp\.?\s*([\d.,]+)/i);
      const jtMatch = line.match(/(\d+(?:[.,]\d+)?)\s*(?:jt|juta)/i);
      const rbMatch = line.match(/(\d+(?:[.,]\d+)?)\s*(?:rb|ribu)/i);

      if (rpMatch) {
        const clean = rpMatch[1].replace(/\./g, '').replace(',', '.');
        nominal = parseInt(clean, 10) || 0;
      } else if (jtMatch) {
        const val = parseFloat(jtMatch[1].replace(',', '.'));
        nominal = Math.round(val * 1000000);
      } else if (rbMatch) {
        const val = parseFloat(rbMatch[1].replace(',', '.'));
        nominal = Math.round(val * 1000);
      }

      if (nominal > 0 || lower.includes('janji bayar') || lower.includes('dp')) {
        // Detect Bank
        let bank = 'Null';
        if (lower.includes('bsi')) bank = 'BSI';
        else if (lower.includes('bca')) bank = 'BCA';
        else if (lower.includes('mandiri')) bank = 'Mandiri';
        else if (lower.includes('bri')) bank = 'BRI';
        else if (lower.includes('seabank')) bank = 'Seabank';

        // Detect Status
        let status = 'Sudah Transfer';
        if (lower.includes('janji') || lower.includes('nanti')) status = 'Janji Bayar';
        else if (lower.includes('gagal') || lower.includes('retur')) status = 'Gagal';
        else if (lower.includes('ragu') || lower.includes('cek')) status = 'Butuh Verifikasi';

        // Detect Type
        let jenis = 'DP';
        if (lower.includes('lunas') || lower.includes('pelunasan')) jenis = 'Pelunasan';
        else if (lower.includes('cicilan')) jenis = 'Cicilan';
        else if (lower.includes('booking')) jenis = 'Booking Fee';

        // Detect Media Attachment
        const hasMedia = lower.includes('<media omitted>') || lower.includes('struk') || lower.includes('bukti');

        records.push({
          id: 'rec-' + Math.random().toString(36).substr(2, 9),
          tanggal_waktu: currentDate,
          nama_pengirim_chat: currentSender,
          nama_jamaah_atau_agen: currentSender,
          jenis_pembayaran: jenis,
          nominal,
          bank_tujuan: bank,
          status,
          bukti_transfer_terlampir: hasMedia,
          keterangan: line.slice(0, 100),
          raw_line_context: line
        });
      }
    }
  }

  const totalConfirmed = records.reduce((acc, r) => (r.status === 'Sudah Transfer' ? acc + r.nominal : acc), 0);

  return {
    summary: {
      total_transaksi: records.length,
      total_nominal_terkonfirmasi: totalConfirmed
    },
    data_pembayaran: records
  };
}
