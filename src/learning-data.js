/* Bank soal buatan untuk latihan kelas awal, bukan paket kurikulum resmi.
   answer adalah nilai jawaban, bukan urutan tombol: pilihan boleh diacak. */
(function(root){
  const subjects={math:{title:'Bekal Matematika',icon:'＋',description:'Hitung bekal, kenali bentuk, dan baca angka.'},reading:{title:'Pesan untuk Mesha',icon:'Aa',description:'Baca pesan pendek dan cari artinya.'},logic:{title:'Jejak & Pola',icon:'◇',description:'Lanjutkan pola dan ikuti petunjuk.'},nature:{title:'Sahabat Lingkungan',icon:'♧',description:'Kenali hewan dan kebiasaan baik.'}};
  const questions=[];
  function add(grade,subject,rows){rows.forEach(([prompt,options,answer,hint,explanation,visual],i)=>questions.push({id:`g${grade}-${subject}-${i+1}`,grade,subject,prompt,options,answer,hint,explanation,visual}));}
  add(1,'math',[
    ['Bio membawa 3 apel. Mesha memberi 2 apel. Ada berapa apel sekarang?',['4','5','6'],'5','Mulai dari 3. Tambah 2 dengan menghitung: 4, 5.','3 + 2 = 5. Bekal apel mereka bertambah.',{count:3,extra:2,label:'apel'}],
    ['Ada 8 botol air. Tim memakai 3 botol. Berapa botol yang belum dipakai?',['4','5','6'],'5','Hitung mundur tiga langkah dari 8: 7, 6, 5.','8 − 3 = 5 botol.'],
    ['Mesha punya 7 pensil. Bio punya 4 pensil. Siapa yang punya lebih banyak?',['Mesha','Bio','Sama banyak'],'Mesha','Bandingkan 7 dengan 4. Angka mana yang lebih besar?','7 lebih besar dari 4. Pensil Mesha lebih banyak.'],
    ['Urutkan nomor jejak: 2, 4, 6, … Angka berikutnya adalah…',['7','8','9'],'8','Setiap langkah bertambah 2. Setelah 6, hitung 7, 8.','2, 4, 6, 8. Polanya bertambah 2.'],
    ['Papan berbentuk segitiga memiliki berapa sisi?',['2','3','4'],'3','Ikuti tepi segitiga. Ada tiga garis lurus.','Segitiga mempunyai 3 sisi.',{shape:'triangle'}],
    ['Angka setelah 12 adalah…',['11','13','15'],'13','Ucapkan urutannya: 10, 11, 12, …','Setelah 12 adalah 13.'],
    ['Ada 10 kartu hewan. Bio menemukan 4 kartu lagi. Jumlahnya…',['12','14','16'],'14','Mulai dari 10, lalu hitung empat langkah ke depan.','10 + 4 = 14 kartu.'],
    ['Dua kelompok masing-masing berisi 3 batu. Berapa batu semuanya?',['5','6','7'],'6','Gabungkan 3 batu dengan 3 batu lagi.','3 + 3 = 6 batu.',{count:3,extra:3,label:'batu'}]
  ]);
  add(2,'math',[
    ['Bio membawa 24 kartu. Mesha membawa 13 kartu. Berapa jumlahnya?',['27','37','47'],'37','Gabungkan puluhan: 20 + 10. Lalu satuan: 4 + 3.','24 + 13 = 37 kartu.'],
    ['Tim punya 35 stiker. Sebanyak 12 stiker dibagikan. Sisanya…',['21','23','25'],'23','Kurangi 10 dulu: 35 menjadi 25. Lalu kurangi 2.','35 − 12 = 23 stiker.'],
    ['Angka 46 terdiri dari…',['4 puluhan dan 6 satuan','6 puluhan dan 4 satuan','4 satuan dan 6 ratusan'],'4 puluhan dan 6 satuan','46 = 40 + 6. Empat kelompok sepuluh dan enam satuan.','46 terdiri dari 4 puluhan dan 6 satuan.'],
    ['Ada 3 kantong. Tiap kantong berisi 2 biji. Berapa biji semuanya?',['5','6','8'],'6','Jumlahkan isi kantongnya: 2 + 2 + 2.','2 + 2 + 2 = 6 biji.'],
    ['Enam pisang dibagi sama banyak kepada 2 anak. Tiap anak mendapat…',['2 pisang','3 pisang','4 pisang'],'3 pisang','Berikan satu-satu bergantian. Masing-masing mendapat tiga.','3 + 3 = 6. Tiap anak mendapat 3 pisang.'],
    ['Bio punya Rp2.000. Ia membeli pensil Rp1.000. Sisa uangnya…',['Rp500','Rp1.000','Rp3.000'],'Rp1.000','Dua ribu dikurangi seribu.','Rp2.000 − Rp1.000 = Rp1.000.'],
    ['Tim mulai mengamati pukul 08.00. Satu jam kemudian pukul…',['07.00','08.30','09.00'],'09.00','Tambahkan satu pada angka jam: 8 menjadi 9.','Satu jam setelah 08.00 adalah 09.00.'],
    ['Pilih urutan bilangan dari yang paling kecil.',['18, 28, 38','38, 28, 18','28, 18, 38'],'18, 28, 38','Bandingkan angka puluhannya: 1, 2, lalu 3.','18 lebih kecil dari 28, dan 28 lebih kecil dari 38.']
  ]);
  add(1,'reading',[
    ['Baca pesan: “Mesha membawa peta.” Siapa yang membawa peta?',['Mesha','Bio','Prof. Nara'],'Mesha','Cari nama orang di awal pesan.','Mesha adalah orang yang membawa peta.'],
    ['Baca: “Bio duduk di bawah pohon.” Di mana Bio duduk?',['Di kapal','Di bawah pohon','Di rumah'],'Di bawah pohon','Cari kata setelah “di”.','Bio duduk di bawah pohon.'],
    ['Huruf pertama pada kata “peta” adalah…',['b','p','t'],'p','Baca perlahan dari kiri: p-e-t-a.','Kata peta dimulai dengan huruf p.'],
    ['Pesannya berbunyi: “Ambil dua buku.” Apa yang harus diambil?',['Dua buku','Dua batu','Satu buku'],'Dua buku','Perhatikan benda dan jumlah pada pesan.','Pesan itu meminta kita mengambil dua buku.']
  ]);
  add(2,'reading',[
    ['“Pagi ini Bio menanam biji. Setelah itu, ia menyiramnya.” Apa yang dilakukan lebih dulu?',['Menyiram biji','Menanam biji','Memetik buah'],'Menanam biji','Baca kejadian sebelum kata “setelah itu”.','Bio menanam biji lebih dulu, kemudian menyiramnya.'],
    ['“Langit mendung. Mesha membawa payung agar tidak kehujanan.” Mengapa Mesha membawa payung?',['Agar tidak kehujanan','Untuk menyimpan buku','Untuk mencari ikan'],'Agar tidak kehujanan','Cari alasan setelah kata “agar”.','Payung dibawa agar Mesha tidak kehujanan.'],
    ['Pilih kalimat yang urutannya tepat.',['Bio membaca buku.','Buku Bio membaca.','Membaca buku Bio.'],'Bio membaca buku.','Mulai dari siapa, lalu kegiatannya, lalu bendanya.','Bio adalah pelaku, membaca adalah kegiatan, buku adalah bendanya.'],
    ['“Di tas ada buku, peta, dan pensil.” Benda mana yang tidak disebut?',['Peta','Pensil','Sendok'],'Sendok','Cocokkan setiap pilihan dengan isi pesan.','Pesan menyebut buku, peta, dan pensil. Tidak ada sendok.']
  ]);
  add(1,'logic',[
    ['Lanjutkan pola: merah, biru, merah, biru, …',['Merah','Biru','Hijau'],'Merah','Dua warna ini muncul bergantian.','Setelah biru, warna merah muncul lagi.'],
    ['Pilih yang berbeda dari dua lainnya.',['Apel','Pisang','Sepatu'],'Sepatu','Dua benda bisa dimakan sebagai buah. Mana yang dipakai di kaki?','Apel dan pisang adalah buah. Sepatu dipakai di kaki.'],
    ['Bio harus memakai kaus kaki sebelum sepatu. Mana yang dipakai dulu?',['Sepatu','Kaus kaki','Topi'],'Kaus kaki','Ingat kata “sebelum”.','Kaus kaki dipakai lebih dulu, lalu sepatu.'],
    ['Jejaknya berbentuk: lingkaran, segitiga, lingkaran, segitiga, …',['Lingkaran','Segitiga','Persegi'],'Lingkaran','Bentuknya bergantian: satu bulat, satu segitiga.','Bentuk berikutnya adalah lingkaran.']
  ]);
  add(2,'logic',[
    ['Lanjutkan pola: kecil, kecil, besar, kecil, kecil, …',['Kecil','Besar','Sedang'],'Besar','Satu kelompok polanya adalah kecil, kecil, besar.','Setiap dua kecil diikuti satu besar.'],
    ['Bio di tengah. Peti ada di kiri Bio. Mesha ada di kanan Bio. Siapa di sebelah kanan Bio?',['Mesha','Peti','Bio'],'Mesha','Baca kembali letak Mesha pada petunjuk.','Mesha berada di sebelah kanan Bio.'],
    ['Nomor peti lebih besar dari 12 dan lebih kecil dari 14. Nomornya…',['11','13','15'],'13','Cari bilangan yang berada di antara 12 dan 14.','Urutannya 12, 13, 14. Jadi nomor peti adalah 13.'],
    ['Urutan kegiatan: ambil biji → tanam → siram. Apa yang dilakukan setelah menanam?',['Menyiram','Mengambil biji','Memetik buah'],'Menyiram','Ikuti panah setelah kata tanam.','Setelah menanam, tim menyiram bijinya.']
  ]);
  add(1,'nature',[
    ['Sampah bungkus bekal sebaiknya kita taruh di…',['Sungai','Tempat sampah','Bawah kursi'],'Tempat sampah','Cari tempat khusus untuk membuang sampah.','Buang sampah pada tempatnya agar lingkungan bersih.'],
    ['Sebelum makan bekal, kita perlu…',['Mencuci tangan','Bermain lumpur','Membuang bekal'],'Mencuci tangan','Buat tangan bersih sebelum menyentuh makanan.','Cuci tangan dengan sabun dan air sebelum makan.'],
    ['Hewan mana yang mempunyai sayap?',['Kucing','Burung','Ikan'],'Burung','Sayap ada di sisi tubuh burung.','Burung mempunyai sayap.'],
    ['Setelah mencuci tangan, keran air sebaiknya…',['Dibiarkan mengalir','Ditutup','Dibuka lebih besar'],'Ditutup','Air tidak perlu mengalir saat tidak dipakai.','Tutup keran untuk menghemat air.']
  ]);
  add(2,'nature',[
    ['Tanaman di pot tampak layu. Tanahnya kering. Apa yang sebaiknya dicoba?',['Memberi air secukupnya','Mencabut semua daun','Menambah sampah'],'Memberi air secukupnya','Tanah kering adalah petunjuk bahwa tanaman mungkin perlu air.','Beri air secukupnya, lalu amati tanaman.'],
    ['Kertas bekas masih kosong di satu sisi. Kita bisa…',['Memakai sisi kosong untuk menggambar','Membuangnya ke sungai','Merobek semuanya'],'Memakai sisi kosong untuk menggambar','Cari cara memakai kertas itu lagi.','Menggunakan sisi kosong membantu mengurangi kertas terbuang.'],
    ['Bio hendak melihat hewan liar. Cara yang baik adalah…',['Mengamati dari jarak aman','Mengejar hewan','Menarik ekornya'],'Mengamati dari jarak aman','Jaga agar hewan tidak takut atau terganggu.','Amati hewan dari jarak aman dan ikuti arahan pendamping.'],
    ['Es di mangkuk diletakkan di tempat hangat. Lama-kelamaan es akan…',['Mencair menjadi air','Menjadi batu','Bertambah beku'],'Mencair menjadi air','Ingat es batu yang dibiarkan di luar tempat dingin.','Es menerima panas dan mencair menjadi air.']
  ]);
  const data={subjects,questions};root.BioLearningData=data;
  if(typeof module==='object'&&module.exports)module.exports=data;
})(typeof window==='object'?window:globalThis);
