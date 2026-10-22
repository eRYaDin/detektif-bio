# Materi Misi Belajar Bio

40 soal buatan dengan narasi pendek dan 8 lencana: 4 bidang × 2 tingkat. Selain soal-soal ini, kasus paus tetap dapat dimainkan. Ini latihan untuk kelas awal, bukan klaim kesesuaian penuh dengan kurikulum tertentu atau alat penilaian anak.

| Bidang | Kelas 1 | Kelas 2 | Soal per tingkat |
| --- | --- | --- | --- |
| Bekal Matematika | Tambah/kurang sederhana, bandingkan jumlah, urutan angka, sisi segitiga, dua kelompok benda | Tambah/kurang puluhan tanpa menyimpan/meminjam, nilai tempat, kelompok sama, berbagi rata, uang, jam, urutan bilangan | 8 |
| Pesan untuk Mesha | Siapa, tempat, huruf awal, mengikuti pesan pendek | Urutan kejadian, alasan, susunan kalimat, informasi yang tidak disebut | 4 |
| Jejak & Pola | Warna/bentuk bergantian, benda berbeda, urutan kegiatan | Pola berulang, kanan/kiri, bilangan di antara, mengikuti panah | 4 |
| Sahabat Lingkungan | Membuang sampah, cuci tangan, ciri hewan, hemat air | Mengamati tanaman, memakai ulang kertas, menghormati satwa, es mencair | 4 |

## Alur belajar

- Buka tombol **Misi belajar Bio** atau ajak Prof. Nara berbicara.
- Pilih **Kelas 1** atau **Kelas 2**, lalu satu bidang.
- Pilihan jawaban diacak sekali saat soal tampil.
- Salah menjawab memberikan petunjuk, tanpa kehilangan progres dan tanpa batas waktu.
- Benar menjawab menampilkan penjelasan singkat dan membuka tombol soal berikutnya.
- Kemajuan tersimpan setiap jawaban benar, sehingga misi yang ditutup dapat dilanjutkan.
- Menyelesaikan semua soal satu bidang pada satu tingkat menghasilkan satu lencana.
- Misi yang selesai dapat diulang. Mengulang tidak menggandakan progres atau lencana.
- Progres kasus paus dan progres belajar disimpan terpisah. Mengulang salah satunya tidak menghapus yang lain.

## Pendampingan

Bacakan soal bila anak memerlukan bantuan. Gunakan jari atau benda nyata untuk berhitung. Pilih tingkat sesuai kenyamanan anak, bukan berdasarkan label kelas semata. Materi belum menjalani uji coba pembelajaran bersama anak.

## Mengganti atau menambah soal

Edit `src/learning-data.js`. Tiap soal memuat `id`, `grade`, `subject`, `prompt`, tiga `options`, `answer`, `hint`, dan `explanation`. Nilai `answer` harus sama persis dengan salah satu pilihan, bukan nomor tombol. Pertahankan ID soal lama bila masih ingin memakai progres yang tersimpan.

Tidak ada teks bebas dari pengguna yang dikirim ke server. Progres disimpan hanya di browser perangkat ini.
