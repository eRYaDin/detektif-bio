/* Pisahkan naskah dan bukti dari mesin permainan agar bab baru mudah ditambahkan. */
window.BioContent={
  evidence:{
    water:{title:'Suhu air masih sama',symbol:'≈',text:'Kemarin 26 °C. Hari ini juga 26 °C. Angkanya sama! Kita masih perlu mencari petunjuk lain.'},
    food:{title:'Makanan paus masih ada',symbol:'⋯',text:'Tumbuhan laut kecil dimakan krill. Krill adalah hewan kecil mirip udang. Krill dimakan paus bungkuk. Mesha masih melihat krill di teluk.'},
    sound:{title:'Lebih tenang, lebih jelas',symbol:'∿',text:'Dalam percobaan kita, suara paus lebih jelas saat mesin kapal dimatikan. Suara mesin yang keras bisa menutupi suara paus.'}
  },
  sources:[
    ['NOAA Fisheries · Humpback whale','https://www.fisheries.noaa.gov/species/humpback-whale'],
    ['NOAA Ocean Service · Ocean noise','https://oceanservice.noaa.gov/facts/ocean-noise.html'],
    ['NOAA Ocean Service · Hydrophone','https://oceanservice.noaa.gov/facts/hydrophone.html']
  ],
  intro:[
    {who:'mesha',exp:'surprised',text:'Bio, suara paus sulit terdengar! Di teluk ada kapal dengan mesin yang keras.'},
    {who:'bio',exp:'thinking',text:'Ayo cari tahu! Kita periksa air, makanan paus, dan suara kapal.'},
    {who:'mesha',exp:'happy',text:'Cari tiga tanda bintang di peta. Klik alatnya untuk mencoba. Setelah selesai, temui aku lagi, ya!'}
  ],
  names:{bio:['Detektif Bio','PENELITI MUDA'],mesha:['Detektif Mesha','AHLI PETA & DATA'],prof:['Prof. Nara','PENELITI LAUT']}
};
