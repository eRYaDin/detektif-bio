# Unggah game dan aktifkan GitHub Pages

Paket ini berupa situs statis. Tidak perlu API key, database, npm install, atau proses build untuk bermain.

## Cara lewat website GitHub

1. Ekstrak `detektif-bio-github.zip` di komputer.
2. Buat repository di GitHub, misalnya `detektif-bio`. Pilih visibilitas sesuai kebutuhan. Ketersediaan Pages untuk repository privat bergantung pada paket akun.
3. Buka repository → **Add file → Upload files**.
4. Unggah **isi** folder `detektif-bio-github`, bukan folder luarnya. Pastikan `index.html`, folder `src`, dan folder `assets` berada langsung di halaman utama repository. Sertakan file `.nojekyll`.
5. Commit file yang diunggah.
6. Buka **Settings → Pages**. Pada **Build and deployment**, pilih **Deploy from a branch**.
7. Pilih branch yang memuat file game (biasanya `main`) dan folder **/(root)**, lalu **Save**.
8. Tunggu deployment selesai. GitHub menampilkan tautan game di halaman Pages; bentuk umumnya `https://NAMA-AKUN.github.io/NAMA-REPOSITORY/`.

Jika file bertitik tidak terlihat di penjelajah file, aktifkan tampilan file tersembunyi atau gunakan cara Git di bawah. Semua file runtime memakai path relatif sehingga game dapat berjalan di subfolder repository.

## Cara lewat Git

Jalankan dari dalam folder hasil ekstrak. Perintah berikut hanya untuk repository baru yang belum diinisialisasi:

```sh
git init -b main
git add .
git commit -m "Prepare Detektif Bio learning game"
git remote add origin https://github.com/NAMA-AKUN/NAMA-REPOSITORY.git
git push -u origin main
```

Ganti URL contoh dengan URL repository milikmu, kemudian aktifkan Pages seperti langkah di atas. Paket tidak menyertakan kredensial atau alamat repository pribadi.

## Pemeriksaan opsional sebelum mengunggah

Dengan Node.js 20 atau lebih baru:

```sh
npm test
```

Tidak perlu `npm install`. Workflow `.github/workflows/check.yml` menjalankan tes yang sama saat push dan pull request. Workflow ini memeriksa kode; penerbitan Pages diatur melalui Settings seperti di atas.

## Jika halaman kosong atau 404

- Pastikan `index.html` berada di root sumber Pages, bukan tersimpan satu folder lebih dalam.
- Pastikan kedua atlas PNG di `assets/illustrated/` ikut terunggah.
- Cocokkan kapitalisasi nama file. GitHub Pages membedakan huruf besar dan kecil.
- Cek deployment di tab Actions dan URL yang ditampilkan pada Settings → Pages.
- Setelah memperbarui file, refresh browser dengan Ctrl+F5.
- Progres lokal tidak ikut terunggah. Browser di alamat Pages memulai penyimpanannya sendiri.

Panduan resmi: [Mengatur sumber publikasi GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Paket ini **siap diunggah**, tetapi belum membuat repository atau menerbitkan game atas nama pemilik.
