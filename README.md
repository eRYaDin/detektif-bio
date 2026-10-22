# Detektif Bio — Scientific Odyssey

**Petualangan sains + 40 soal Misi Belajar untuk kelas 1–2 SD.** Dibuat dengan HTML, CSS, dan Vanilla JavaScript, tanpa engine, akun, atau dependensi runtime. Dapat dimainkan offline setelah file tersedia.

## Versi siap GitHub

Folder `detektif-bio-github` merupakan paket rilis bersih. Unggah isinya ke root repository. Lihat [UPLOAD-GITHUB.md](UPLOAD-GITHUB.md) untuk mengaktifkan GitHub Pages. Paket ini belum diterbitkan ke akun GitHub.

## Misi belajar tambahan

Buka **Misi belajar Bio** dari buku lapangan atau bicara dengan **Prof. Nara**. Pilih kelas 1 atau kelas 2. Setiap kelas berisi 8 soal matematika, 4 soal membaca, 4 soal pola/logika, dan 4 soal lingkungan. Jawaban salah mendapat petunjuk; jawaban benar menampilkan penjelasan. Kumpulkan hingga 8 lencana. Progres otomatis disimpan dan dapat dilanjutkan tanpa mengulang kasus paus. Rincian: [MATERI.md](MATERI.md).

## Mainkan

Klik dua kali **MULAI-GAME.cmd**, atau buka **index.html** dengan Edge, Chrome, atau Firefox. Semua gambar sudah disertakan. Python dan Node tidak dibutuhkan untuk bermain.

Bila memakai VS Code, buka folder ini dan jalankan index.html dengan Live Server. Untuk server lokal opsional:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Lalu buka http://127.0.0.1:8766 di browser.

## Kontrol

- **Mode bermain**: fokuskan layar pada peta dan kontrol. Tombol **Kembali** mengembalikan tampilan halaman.
- **Layar penuh**: buka seluruh game termasuk soal, jurnal, dan kontrol. Pada Android yang mendukungnya, game mencoba orientasi landscape. Jika tidak didukung, putar perangkat secara manual; mode bermain tetap tersedia.
- **Teks A+ / A−**: ubah teks utama dari 18 menjadi 21 piksel. Pilihan disimpan di perangkat. Zoom browser tetap diizinkan.
- Portrait Android: dialog tampil di bawah peta, bukan menutupi peta. Landscape mode bermain: dialog di samping peta dan tombol arah satu baris. Tablet/PC memakai ruang layar yang tersedia.
- Menu **Belajar** dan **Jurnal** juga tersedia pada toolbar di atas peta, termasuk dalam layar penuh.

- WASD / panah: berjalan.
- Klik peta: cari jalan ke tujuan secara otomatis.
- Klik tokoh atau alat: dekati lalu interaksi otomatis.
- E / Enter: berinteraksi; mempercepat teks dan melanjutkan dialog dengan satu pilihan.
- J: jurnal peneliti. Esc: tutup dialog atau jendela.
- Tombol ♪ di kanan atas: musik ambient orisinal dan efek suara. Default suara mati; audio memerlukan klik pengguna.
- Tombol ⛶: layar penuh. Browser yang tidak mendukung bisa memakai F11.
- Ponsel: tombol arah dan Interaksi tersedia tepat di bawah peta.

## Isi demo (sekitar 8–15 menit)

1. Temui Mesha di jalan menuju jembatan.
2. Bandingkan data sensor air di utara.
3. Susun rantai makanan di dermaga tenggara.
4. Coba tombol mesin menyala / mati, lalu pilih kapan suara paus lebih jelas.
5. Kembali ke Mesha. Uji kesimpulan berdasarkan tiga bukti.
6. Buka peti di utara stasiun penelitian untuk lencana dan kartu fakta.

Soal disesuaikan untuk kelas 1–2 SD: mencocokkan angka suhu yang sama, menyusun tiga bagian rantai makanan dengan petunjuk tiap langkah, membandingkan kondisi mesin menyala/mati, dan memilih tindakan agar teluk tenang. Tidak ada soal frekuensi atau oksigen terlarut. Urutan tiga pemeriksaan bebas. Jawaban salah mendapat petunjuk tanpa menghapus langkah benar. Jurnal dapat dibaca kembali kapan saja. Progres disimpan otomatis melalui localStorage; save terpisah untuk tiap browser dan alamat file/server. Jika penyimpanan diblokir browser, permainan tetap berjalan dengan progres untuk sesi itu saja. Tombol ? menyediakan opsi mengulang kasus, termasuk untuk mencoba soal baru bila save sebelumnya sudah selesai.

## Aset dan materi

Seluruh gambar dibuat baru untuk demo ini. Gambar referensi pengguna tidak disalin, dipotong, atau dimuat ke game. Bio diadaptasi sebagai penjelajah bertopi cokelat dengan seragam tan dan setangan merah-putih. Mesha dan Prof. Nara juga memiliki sprite serta potret tersendiri.

- Karakter aktif menggunakan atlas ilustrasi baru pada `assets/illustrated/`, dibuat dengan ImageGen dari referensi visual. Bio memiliki 4 arah dan 3 frame per arah, serta 4 potret: netral, senang, berpikir, terkejut.
- Mesha dan Prof. Nara memakai ilustrasi pendamping dengan potret netral dan senang. Ekspresi dialog lain menggunakan potret netral mereka.
- Tinggi kotak karakter di peta 48 piksel dunia (96 piksel Canvas), dengan penghalusan saat gambar diperkecil. Ini dua kali lebih tinggi dari sprite versi awal.
- Peta digambar pada resolusi dasar 480 × 288; karakter digambar dengan smoothing tersendiri dan Canvas ditampilkan tanpa pemaksaan mode pixelated.
- Musik dan efek suara orisinal disintesis dengan Web Audio API, termasuk suara sinyal latihan. Tidak ada rekaman paus asli atau berkas audio pihak ketiga.
- `assets/illustrated/bio-atlas.png` memperlihatkan desain Bio yang aktif di game. `assets/illustrated/companions-atlas.png` berisi Mesha dan Prof. Nara.
- Pada folder pengembangan awal, `assets/character-sheet.png`, `assets/portraits/`, dan `assets/sprites/` menyimpan versi pixel lama. Semua itu tidak dipakai renderer dan tidak disertakan dalam paket GitHub.
- `tools/create_assets.py` pada folder pengembangan hanya membangun aset pixel lama dan tidak disertakan dalam rilis. Catatan prompt ilustrasi aktif tersedia di `assets/illustrated/GENERATION.md`.

Peta, cerita, angka suhu, dan percobaan mesin merupakan simulasi edukasi. Suhu yang sama tidak berarti seluruh kondisi air pasti aman. Pengaruh kebisingan dalam cerita dipakai untuk mengajak anak memilih tindakan menjaga teluk tenang. Di dunia nyata, peneliti memerlukan pengamatan lebih lanjut. Paus bungkuk tidak diperlakukan sebagai hewan yang menggunakan ekolokasi pada demo ini.

Bacaan pendukung fakta (juga tertaut di jurnal):

- NOAA Fisheries, Humpback Whale: https://www.fisheries.noaa.gov/species/humpback-whale
- NOAA Ocean Service, What is ocean noise?: https://oceanservice.noaa.gov/facts/ocean-noise.html
- NOAA Ocean Service, What is a hydrophone?: https://oceanservice.noaa.gov/facts/hydrophone.html

## Struktur folder pengembangan

```text
index.html                 UI dan elemen Canvas
style.css                  Tema, responsivitas, dialog, jurnal
src/art.js                 Peta, penggambaran objek, collision
src/game.js                Pergerakan, pathfinding, dialog, puzzle, save
src/content.js             Naskah, bukti, nama tokoh, sumber
src/audio.js               Musik dan efek lokal
assets/portraits/          12 PNG potret
assets/sprites/            3 PNG sprite sheet
assets/illustrated/        Atlas ilustrasi aktif dan catatan generasi
tools/create_assets.py     Sumber aset orisinal
tools/check-demo.cjs       Pemeriksaan browser opsional (Playwright)
```

Paket GitHub hanya membawa aset aktif dan pemeriksaan tanpa dependensi; file preview, aset pixel lama, serta alat browser opsional tidak disertakan. Materi baru berada di `src/learning-data.js` dan UI-nya di `src/learning.js`, dengan gaya `learning.css`.

Untuk mengganti materi kasus paus, mulai dari `src/content.js`. Posisi tokoh dan alat terdapat pada array `entities` di `src/game.js`. Gambar dunia dan collision di `src/art.js` harus disesuaikan bersama jika memindahkan rintangan.

Ini satu pulau petualangan dengan satu kasus sains dan 40 soal misi belajar. Tidak ada multiplayer, server penyimpanan, atau pembacaan narasi dengan suara manusia. Teks dapat dibacakan oleh pendamping.

## Pengembangan dan pemeriksaan

Node.js hanya diperlukan untuk pemeriksaan, bukan untuk bermain. Dengan Node 20+ jalankan `npm test` tanpa `npm install`. Tes mencakup struktur file, logika kasus, bank soal, petunjuk, progres, dan lencana. `npm run release` membuat folder rilis bersih di sebelah folder proyek. Semua path aset relatif, termasuk untuk GitHub Pages project site.

Sumber materi/aset dan catatan data: [ASSETS.md](ASSETS.md). Pemilik dapat menambahkan lisensi publik yang dipilihnya sebelum publikasi.
