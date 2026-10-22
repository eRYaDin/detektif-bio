# Pemeriksaan tampilan v1.1

Pemeriksaan browser dilakukan pada preview lokal dengan penggantian viewport. Ini simulasi ukuran layar, bukan pengujian pada perangkat Android/iPad fisik.

| Ukuran CSS | Pemeriksaan |
| --- | --- |
| 320 × 568 | Soal dengan teks besar, tidak ada overflow horizontal, tombol tutup di layar |
| 360 × 800 | Dialog portrait 18px; soal dengan Teks A+ 24px; jawaban salah/benar dapat dipilih |
| 640 × 360 | Soal landscape dapat digulir dan tombol tutup tetap di layar |
| 844 × 390 | Mode bermain landscape: peta kiri, dialog kanan, kontrol satu baris bawah |
| 768 × 1024 | Menu dan soal tablet portrait, tanpa overflow horizontal |
| 1024 × 768 | Menu dan soal tablet landscape, tanpa overflow horizontal |
| 1440 × 900 | Halaman dan menu belajar PC, tanpa overflow horizontal |

- Dialog dan soal tidak ikut diperkecil bersama Canvas. Teks utama 18px, mode besar 21px. Judul soal masing-masing 21px dan 24px.
- Menu belajar dapat dibuka dari toolbar Mode bermain. Tombol tutup modal dibuat sticky agar tetap terjangkau saat menggulir.
- Log error JavaScript preview kosong selama alur pemeriksaan.
- `npm test` mencakup bank 40 soal, hint, lencana, save, geometri klik Canvas pada area letterbox, mode fokus, pengaturan teks, fullscreen dan fallback, serta pelepasan tombol ketika resize/rotasi.
- Fullscreen dan penguncian orientasi bergantung pada browser. Jika permintaan fullscreen ditolak, Mode bermain tetap tersedia. Jika penguncian landscape ditolak, pemain dapat memutar perangkat secara manual.
- Dukungan aktual Android, iOS, tablet sentuh, dan area notch tetap perlu dicoba pada perangkat fisik; tidak diklaim telah diverifikasi oleh simulasi ini.
