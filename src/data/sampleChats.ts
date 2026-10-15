export interface SampleChat {
  id: string;
  title: string;
  badge: string;
  description: string;
  rawText: string;
}

export const SAMPLE_CHATS: SampleChat[] = [
  {
    id: 'umrah-haji',
    title: 'Travel Umrah & Haji (DP & Pelunasan Pax)',
    badge: 'Umrah & Travel',
    description: 'Obrolan pendaftaran jamaah, setoran DP via BSI, janji bayar sisa pelunasan, dan bukti transfer terlampir.',
    rawText: `[12/03/26 08:15:20] Hj. Annisa Admin Travel: Assalamu'alaikum Bpk Bambang, selamat pagi. Mohon info update untuk pendaftaran Paket Umrah VIP Ramadan 1447H untuk 2 pax.
[12/03/26 08:22:10] Pak Bambang Umrah: Wa'alaikumussalam Bu Annisa. Iya bu, saya dan istri (Sulastri) fix ambil paket VIP yang 12 hari.
[12/03/26 08:25:44] Pak Bambang Umrah: Ini saya sudah transfer DP pendaftaran sebesar Rp 10.000.000 (10 juta rupiah) untuk 2 orang via Bank BSI.
[12/03/26 08:26:01] Pak Bambang Umrah: <Media omitted>
[12/03/26 08:26:15] Pak Bambang Umrah: Bukti transfer terlampir ya bu. Atas nama Bambang & Sulastri.
[12/03/26 08:30:12] Hj. Annisa Admin Travel: Alhamdulillah, Jazakallah khair Pak Bambang. Bukti DP BSI Rp 10.000.000 sudah kami verifikasi dan masuk ke sistem.
[12/03/26 08:31:00] Hj. Annisa Admin Travel: Total harga paket 2 pax = Rp 70.000.000. Sisa pelunasan sebesar Rp 60.000.000 ya Pak.
[12/03/26 08:40:05] Pak Bambang Umrah: Baik bu Annisa. Nanti sisanya Rp 60.000.000 janji bayar pelunasan tgl 25 Maret setelah pencairan deposito saya di Mandiri.
[12/03/26 14:10:33] Ustadz Ridwan Agen Jatim: Mbak Annisa, ini setoran pendaftaran Umrah Backpacker 1 pax atas nama jamaah Ahmad Fauzi.
[12/03/26 14:11:02] Ustadz Ridwan Agen Jatim: Sudah saya kirim Rp 5.000.000 via BSI tadi siang jam 13:45.
[12/03/26 14:11:15] Ustadz Ridwan Agen Jatim: <Media omitted>
[12/03/26 14:15:00] Hj. Annisa Admin Travel: Siap Ustadz Ridwan, struk transfer BSI Rp 5.000.000 a.n Ahmad Fauzi diterima.`
  },
  {
    id: 'catering-event',
    title: 'Catering & Event Organizer (Booking Fee & DP 50%)',
    badge: 'Catering / EO',
    description: 'Pemesanan paket catering pernikahan 500 pax, DP via BCA, dan janji bayar termin ke-2.',
    rawText: `[14/03/26 09:10:00] Maya Restu: Pagi mba Sisca, mau tanya ketersediaan tanggal 18 Mei 2026 untuk Paket Wedding Buffet 500 Pax.
[14/03/26 09:15:22] Sisca Catering Admin: Pagi Bu Maya, tanggal 18 Mei masih available. Total biaya paket 500 pax = Rp 45.000.000 (termasuk bonus stall sate 100 porsi).
[14/03/26 09:30:11] Maya Restu: Oke mba, saya lock tanggalnya ya. Ini saya baru saja transfer Booking Fee awal Rp 5.000.000 ke rekening BCA PT Berkah Catering.
[14/03/26 09:30:45] Maya Restu: <Media omitted>
[14/03/26 09:31:02] Maya Restu: Mohon dicek ya struk BCA nya. Atas nama pengirim Maya Restu.
[14/03/26 09:35:10] Sisca Catering Admin: Terima kasih Bu Maya! Dana Rp 5.000.000 sudah masuk BCA kami. Tanggal 18 Mei resmi terkunci.
[14/03/26 09:36:00] Sisca Catering Admin: Ketentuan kami: DP 50% (Rp 17.500.000 lagi) dikirim paling lambat 1 April, dan pelunasan H-7 acara.
[14/03/26 09:40:12] Maya Restu: Siap mba. Untuk DP 50% janji bayar tgl 30 Maret sebelum tenggat.`
  },
  {
    id: 'grosir-tiket',
    title: 'Grosir Tiket & Agen Wisata (Mandiri & Seabank)',
    badge: 'Agen & Grosir',
    description: 'Pembelian tiket penerbangan grup, konfirmasi transfer gagal retur, lalu transfer ulang via Seabank.',
    rawText: `[15/03/26 10:05:12] Dedi Tour Agent: Pagi bro, issued 5 tiket Garuda Jakarta-Bali tanggal 20 April untuk Rombongan Pak Rudi.
[15/03/26 10:12:40] Admin Ticketing Central: Pagi Mas Dedi. Total 5 pax Garuda = Rp 8.250.000 nett.
[15/03/26 10:25:10] Dedi Tour Agent: Oke bro, barusan gw transfer Rp 8.250.000 via Mandiri.
[15/03/26 10:25:30] Dedi Tour Agent: <Media omitted>
[15/03/26 10:30:15] Admin Ticketing Central: Waduh mas, Mandiri lagi gangguan/retur nih. Status di m-banking gagal/pending.
[15/03/26 10:35:00] Dedi Tour Agent: Oh iya benar di mutasi saya balik dana. Oke ini saya coba transfer ulang Rp 8.250.000 via Seabank ke Mandiri tujuan toko ya.
[15/03/26 10:36:20] Dedi Tour Agent: <Media omitted>
[15/03/26 10:36:35] Dedi Tour Agent: Bukti tf Seabank jam 10:36 berhasil Rp 8.250.000 a.n Dedi Kurniawan.
[15/03/26 10:38:00] Admin Ticketing Central: Sip mantap! Seabank Rp 8.250.000 lunas terkonfirmasi masuk. Tiket 5 pax sudah ter-issued.`
  },
  {
    id: 'obrolan-campuran',
    title: 'Obrolan Campuran (Chat Santai + Transaksi Finansial)',
    badge: 'Uji Filter AI',
    description: 'Menguji ketajaman AI mengabaikan bincang-bincang santai, gosip, dan hanya memilah transaksi pembayaran.',
    rawText: `[16/03/26 07:00:15] Ibu Endang: Halo mba Fitri, selamat pagi. Bagimana kabarnya? Semoga sehat selalu sekeluarga ya.
[16/03/26 07:05:22] Fitri Toko Baju: Halo Ibu Endang, amin ya Allah. Alhamdulillah sehat bu. Ibu gimana? Ada yang bisa dibantu?
[16/03/26 07:10:00] Ibu Endang: Ini mba, mau tanya kemarin batik sarimbit sama gamis pesenan saya totalnya berapa ya?
[16/03/26 07:12:30] Fitri Toko Baju: Oh iya bu, 2 pasang batik sarimbit + 1 gamis Silk totalnya Rp 1.850.000 bu.
[16/03/26 07:15:00] Ibu Endang: Nanti siang saya arisan sama ibu-ibu kompleks nih di restoran padang. Seneng banget hujan-hujan gini makan gulai.
[16/03/26 07:16:12] Fitri Toko Baju: Wah seru banget bu, jangan lupa bawa payung ya cuaca lagi ekstrem.
[16/03/26 07:30:00] Ibu Endang: Haha iya mba. Btw ini uang pelunasan baju Rp 1.850.000 sudah saya kirim via BRI ya jam 07:28 WIB.
[16/03/26 07:30:15] Ibu Endang: <Media omitted>
[16/03/26 07:31:00] Ibu Endang: Gambar resi BRI nya terlampir di atas.
[16/03/26 07:35:10] Fitri Toko Baju: Siap Ibu Endang! Sudah masuk BRI Rp 1.850.000 Lunas. Baju sore ini saya paketkan via JNE.`
  }
];
