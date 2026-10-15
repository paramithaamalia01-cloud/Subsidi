import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side Endpoint to Parse & Validate WhatsApp Financial Chat Logs
app.post('/api/parse-chat', async (req, res) => {
  try {
    const { chatText } = req.body;

    if (!chatText || typeof chatText !== 'string' || !chatText.trim()) {
      return res.status(400).json({ error: 'Teks obrolan WhatsApp mentah tidak boleh kosong.' });
    }

    const systemInstruction = `Anda adalah parser dan validator data finansial yang bertugas membaca transkrip obrolan WhatsApp mentah (WhatsApp chat export).

Tugas Anda:
1. Memindai seluruh obrolan dan mengidentifikasi seluruh percakapan yang membahas komitmen pembayaran, konfirmasi transfer, setoran, pelunasan, booking fee, atau Down Payment (DP).
2. Mengekstrak entitas penting secara presisi:
   - nama_pengirim_chat: Nama kontak pengirim pesan di WA (misal "Bpk Bambang Umrah", "Bu Maya", "Ustadz Ridwan", dll).
   - nama_jamaah_atau_agen: Nama orang yang dibayarkan atau nama agen/jamaah/pelanggan utama (jika disebutkan di obrolan, misal "Bambang & Sulastri", "Ibu Maya", atau sama dengan pengirim jika tidak ada nama lain).
   - jenis_pembayaran: Kategori spesifik seperti "DP", "Pelunasan", "Cicilan 1", "Cicilan 2", "Booking Fee", "Setoran Tiket", atau jenis pembayaran lain.
   - nominal: Nominal Pembayaran dalam angka murni integer (bersihkan semua simbol mata uang, titik, koma, huruf k/rb/jt/juta, misal: "Rp 5.000.000" -> 5000000, "10jt" -> 10000000, "50rb" -> 50000, "2,5jt" -> 2500000). Jika janji bayar tapi nominal tidak disebutkan pasti, estimasikan atau 0.
   - tanggal_waktu: Tanggal & Waktu Transaksi/Chat dalam format "YYYY-MM-DD HH:MM". Jika format tanggal di chat adalah [DD/MM/YY, HH.MM], konversikan ke YYYY-MM-DD HH:MM. Jika tahun tidak tercantum, gunakan tahun berjalan (2026).
   - bank_tujuan: Bank Asal atau Rekening Tujuan pembayaran (misal "BCA", "Mandiri", "BSI", "BRI", "BNI", "Seabank", "Danamon", atau "Null" jika tidak disebutkan).
   - status: Status Pembayaran. Wajib memilih salah satu dari:
     * "Sudah Transfer" (Jika ada konfirmasi transfer, struk, resi, atau pengirim sudah melakukan pembayaran).
     * "Janji Bayar" (Jika pengirim menyatakan komitmen/janji bayar di tanggal tertentu misal "nanti sore sy transfer", "janji tgl 20", dsb).
     * "Butuh Verifikasi" (Jika ragu, bukti buram, nominal belum pasti, atau perlu kroscek admin).
     * "Gagal" (Jika ada kabar transfer gagal/retur/ditolak).
   - bukti_transfer_terlampir: Boolean true/false. true jika ada tanda lampiran gambar/file seperti "<Media omitted>", "<Gambar tidak disertakan>", "foto terlampir", "ini struknya", "bukti tf", dll.
   - keterangan: Catatan/keterangan singkat terkait transaksi (misal: paket yang diambil, jumlah pax, nomor resi, catatan tenor, atau potongan harga).
3. Mengabaikan obrolan santai di luar konteks transaksi finansial (misal salam, sapaan, tanya kabar, jualan umum tanpa transaksi finansial).
4. Menghasilkan output HANYA dalam format JSON valid sesuai skema yang ditentukan. Hitung summary total_transaksi (jumlah item di array) dan total_nominal_terkonfirmasi (jumlah nominal dari transaksi berstatus "Sudah Transfer").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Berikut adalah transkrip obrolan WhatsApp mentah yang harus diproses:\n\n---\n${chatText}\n---`
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                total_transaksi: { type: Type.INTEGER, description: 'Total jumlah transaksi yang berhasil diekstrak' },
                total_nominal_terkonfirmasi: { type: Type.INTEGER, description: 'Total akumulasi nominal transaksi berstatus Sudah Transfer' }
              },
              required: ['total_transaksi', 'total_nominal_terkonfirmasi']
            },
            data_pembayaran: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tanggal_waktu: { type: Type.STRING, description: 'Format YYYY-MM-DD HH:MM' },
                  nama_pengirim_chat: { type: Type.STRING },
                  nama_jamaah_atau_agen: { type: Type.STRING },
                  jenis_pembayaran: { type: Type.STRING, description: 'DP / Pelunasan / Cicilan / Booking Fee / dll' },
                  nominal: { type: Type.INTEGER, description: 'Angka murni tanpa format mata uang' },
                  bank_tujuan: { type: Type.STRING, description: 'BCA / Mandiri / BSI / BRI / Null / dll' },
                  status: { type: Type.STRING, description: 'Sudah Transfer / Janji Bayar / Butuh Verifikasi / Gagal' },
                  bukti_transfer_terlampir: { type: Type.BOOLEAN },
                  keterangan: { type: Type.STRING }
                },
                required: [
                  'tanggal_waktu',
                  'nama_pengirim_chat',
                  'nama_jamaah_atau_agen',
                  'jenis_pembayaran',
                  'nominal',
                  'bank_tujuan',
                  'status',
                  'bukti_transfer_terlampir',
                  'keterangan'
                ]
              }
            }
          },
          required: ['summary', 'data_pembayaran']
        }
      }
    });

    const outputText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(outputText);
    } catch (pErr) {
      console.error('Failed to parse JSON response from Gemini:', outputText);
      return res.status(500).json({ error: 'Respon dari AI tidak dapat diformat ke JSON valid.' });
    }

    // Re-verify summary math on server side as extra sanity check
    if (parsedResult.data_pembayaran && Array.isArray(parsedResult.data_pembayaran)) {
      const actualCount = parsedResult.data_pembayaran.length;
      const actualConfirmedTotal = parsedResult.data_pembayaran.reduce((acc: number, item: any) => {
        if (item.status === 'Sudah Transfer' && typeof item.nominal === 'number') {
          return acc + item.nominal;
        }
        return acc;
      }, 0);

      parsedResult.summary = {
        total_transaksi: actualCount,
        total_nominal_terkonfirmasi: actualConfirmedTotal
      };
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('API Error /api/parse-chat:', error);
    return res.status(500).json({
      error: error?.message || 'Terjadi kesalahan saat mengekstrak data obrolan.'
    });
  }
});

// Boot Server with Vite Dev Middleware or Static Production Build
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    // Serve index.html for non-API routes in dev
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = await vite.transformIndexHtml(url, `
          <!doctype html>
          <html lang="id">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>WhatsApp Financial Chat Parser &amp; Validator</title>
              <script type="module" src="/src/main.tsx"></script>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WA Financial Extractor] Server active at http://localhost:${PORT}`);
  });
}

startServer();
