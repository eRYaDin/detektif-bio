/* Tampilan lintas perangkat, terpisah dari logika pelajaran dan save permainan. */
(function(root){
  // Canvas memakai object-fit:contain. Abaikan klik pada pita kosong di tepinya.
  function mapPoint(clientX,clientY,rect){
    const scale=Math.min(rect.width/480,rect.height/288);
    if(!Number.isFinite(scale)||scale<=0)return null;
    const x=(clientX-rect.left-(rect.width-480*scale)/2)/scale;
    const y=(clientY-rect.top-(rect.height-288*scale)/2)/scale;
    return x<0||y<0||x>480||y>288?null:{x,y};
  }
  function init({keys,openJournal,openLearning,toast}){
    const $=id=>document.getElementById(id);let focus=false,previousScroll=0,large=false,ownedFullscreen=false;
    try{large=localStorage.getItem('bio-large-text')==='true';}catch{}
    function applyText(){document.body.classList.toggle('large-text',large);$('text-size').setAttribute('aria-pressed',String(large));$('text-size').textContent=large?'Teks A−':'Teks A+';$('text-size').setAttribute('aria-label',large?'Gunakan ukuran teks biasa':'Perbesar teks');}
    function setFocus(on){
      keys.clear();if(on&&!focus)previousScroll=window.scrollY;
      focus=on;document.body.classList.toggle('game-focus',on);$('play-mode').setAttribute('aria-pressed',String(on));$('play-mode').textContent=on?'Kembali':'Main layar penuh';
      if(!on)window.scrollTo({top:previousScroll,behavior:'instant'});
    }
    async function leaveFullscreen(){if(document.fullscreenElement){try{await document.exitFullscreen();}catch{toast('Gunakan tombol kembali perangkat untuk keluar layar penuh.');return;}}ownedFullscreen=false;setFocus(false);}
    $('play-mode').onclick=()=>focus?leaveFullscreen():enterFullscreen();
    $('text-size').onclick=()=>{large=!large;applyText();try{localStorage.setItem('bio-large-text',String(large));}catch{}};
    $('play-learning').onclick=openLearning;$('play-journal').onclick=openJournal;
    async function enterFullscreen(){
      // Seluruh dokumen ikut fullscreen agar modal soal dan kontrol tetap terlihat.
      setFocus(true);
      try{if(!document.documentElement.requestFullscreen)throw Error('unsupported');await document.documentElement.requestFullscreen({navigationUI:'hide'});ownedFullscreen=true;
        if(matchMedia('(any-pointer: coarse)').matches&&root.screen?.orientation?.lock){try{await root.screen.orientation.lock('landscape');}catch{toast('Putar perangkat mendatar jika ingin peta lebih lebar.');}}
      }catch{toast('Mode bermain aktif. Browser ini belum mengizinkan layar penuh.');}
    }
    $('fullscreen').onclick=()=>document.fullscreenElement?leaveFullscreen():enterFullscreen();
    document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&ownedFullscreen){ownedFullscreen=false;try{root.screen?.orientation?.unlock?.();}catch{}setFocus(false);}});
    // Rotasi atau perpindahan aplikasi tidak boleh meninggalkan tombol arah tertahan.
    window.addEventListener('resize',()=>keys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear();});
    applyText();
  }
  root.BioDisplay={init,mapPoint};if(typeof module==='object'&&module.exports)module.exports={mapPoint};
})(typeof window==='object'?window:globalThis);
