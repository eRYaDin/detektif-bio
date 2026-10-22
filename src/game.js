/* Moteur kecil Vanilla JS. Urutan: eksplorasi → bukti → kesimpulan → peti. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), C=BioContent, A=AudioBio;
  const SAVE='bio-odyssey-v1', fresh=()=>({started:false,evidence:[],solved:false,finished:false});
  let state=fresh(), storageOK=true;
  try {const s=JSON.parse(localStorage.getItem(SAVE));if(s&&Array.isArray(s.evidence)){state={started:!!s.started,evidence:[...new Set(s.evidence.filter(k=>C.evidence[k]))],solved:!!s.solved,finished:!!s.finished};if(state.evidence.length<3)state.solved=state.finished=false;if(!state.solved)state.finished=false;}}catch{storageOK=false;}
  const canvas=$('world'),ctx=canvas.getContext('2d');
  const player={x:115,y:182,dir:'down',walking:false};
  const entities=[{id:'mesha',x:198,y:173,kind:'npc',sprite:'mesha'},{id:'prof',x:126,y:174,kind:'npc',sprite:'prof'},{id:'water',x:282,y:92},{id:'sound',x:409,y:124},{id:'food',x:425,y:226},{id:'chest',x:166,y:92}];
  const keys=new Set();let ready=false,route=[],routeTarget=null,last=0,lastStep=0,near=null,dialogOpen=false,typing=null,fullText='',currentNext=null,toastTimer,scopeFrame,lastFocus;
  function save(){try{localStorage.setItem(SAVE,JSON.stringify(state));}catch{storageOK=false;}if(!storageOK)document.querySelector('.below-game>span').textContent='Penyimpanan browser tidak tersedia · progres hanya untuk sesi ini';}
  function updateUI(){
    const n=state.evidence.length;$('evidence-count').textContent=`${n} / 3`;$('progress-bar').style.width=`${n/3*100}%`;
    for(const id of ['mesha','water','food','sound']){const done=id==='mesha'?state.started:state.evidence.includes(id);$('obj-'+id).classList.toggle('done',done);$('obj-'+id).querySelector('b').textContent=done?'✓':'○';}
    $('journal-count').textContent=`${n+(state.finished?1:0)} kartu ditemukan`;
    $('mission-text').textContent=state.finished?'Misteri selesai! Buka jurnal untuk membaca penemuanmu.':state.solved?'Ambil hadiah di peti. Letaknya di atas rumah penelitian.':n===3?'Tiga petunjuk sudah lengkap. Ayo temui Mesha lagi!':state.started?'Cari tiga tanda bintang. Klik alatnya dan coba soalnya.':'Temui Mesha di dekat jembatan. Ia perlu bantuanmu.';
    $('tip-text').textContent=n===3?'Ingat petunjukmu. Apa yang membuat suara paus lebih jelas?':'Klik jalan untuk berjalan. Klik tokoh untuk bicara.';
    $('map-status').textContent=state.finished?'KASUS TERPECAHKAN':state.solved?'AMBIL HADIAHMU':`${n} / 3 BUKTI DITEMUKAN`;
    $('start').innerHTML=state.started?'Lanjutkan ekspedisi <span>→</span>':'Mulai ekspedisi <span>→</span>';
  }
  function toast(text){$('toast').textContent=text;$('toast').classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),2600);}
  function portraitStyle(who='bio',exp='neutral'){
    const row=who==='bio'?['neutral','happy','thinking','surprised'].indexOf(exp):who==='mesha'?(exp==='happy'?1:0):(exp==='happy'?3:2);
    return `background-image:url('assets/illustrated/${who==='bio'?'bio':'companions'}-atlas.png');background-position:100% ${Math.max(0,row)/3*100}%`;
  }
  function portraitHTML(who,exp,extra=''){return `<span role="img" aria-label="${C.names[who][0]} ${exp}" class="atlas-portrait ${extra}" style="${portraitStyle(who,exp)}"></span>`;}
  function stopTyping(){if(typing){clearInterval(typing);typing=null;$('dialog-text').textContent=fullText;}}
  function closeDialog(){stopTyping();$('dialog').classList.add('hidden');$('game-frame').classList.remove('has-dialog');dialogOpen=false;currentNext=null;canvas.focus({preventScroll:true});}
  function say(who,exp,text,actions=[['Lanjut →',closeDialog]]){
    route=[];routeTarget=null;keys.clear();dialogOpen=true;$('dialog').classList.remove('hidden');$('game-frame').classList.add('has-dialog');$('interaction').classList.add('hidden');
    $('portrait').style.cssText=portraitStyle(who,exp);$('portrait').setAttribute('aria-label',`${C.names[who][0]}, ekspresi ${exp}`);$('speaker').textContent=C.names[who][0];$('speaker-role').textContent=C.names[who][1];
    stopTyping();fullText=text;$('dialog-text').textContent='';let i=0;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)$('dialog-text').textContent=text;
    else typing=setInterval(()=>{i+=2;$('dialog-text').textContent=text.slice(0,i);if(i>=text.length){clearInterval(typing);typing=null;if(!document.body.classList.contains('game-focus'))$('dialog').scrollIntoView({block:'nearest'});}},15);
    $('choices').replaceChildren();currentNext=actions.length===1?actions[0][1]:null;
    actions.forEach(([label,callback])=>{const b=document.createElement('button');b.textContent=label;if(actions.length===1)b.className='next';b.onclick=()=>{if(typing){stopTyping();return;}A.click();callback();};$('choices').append(b);});
    canvas.focus({preventScroll:true});
  }
  function conversation(lines,done=closeDialog){let i=0;const next=()=>{if(i>=lines.length){done();return;}const l=lines[i++];say(l.who,l.exp,l.text,[[i===lines.length?'Cukup jelas! →':'Lanjut →',next]]);};next();}
  function openModal(eyebrow,title,html){
    stopTyping();closeDialog();route=[];routeTarget=null;keys.clear();lastFocus=document.activeElement;
    $('modal-eyebrow').textContent=eyebrow;$('modal-title').textContent=title;$('modal-content').innerHTML=html;$('modal').classList.remove('hidden');document.body.classList.add('modal-open');document.querySelector('.modal').scrollTop=0;$('modal-close').focus();
  }
  function closeModal(){cancelAnimationFrame(scopeFrame);$('modal').classList.add('hidden');document.body.classList.remove('modal-open');keys.clear();(lastFocus?.isConnected?lastFocus:canvas).focus({preventScroll:true});}
  function feedback(message){A.think();const el=$('feedback');el.innerHTML=portraitHTML('bio','thinking','feedback-portrait')+message;el.setAttribute('role','status');}
  function collect(id){
    closeModal();if(!state.evidence.includes(id)){state.evidence.push(id);save();updateUI();A.success();toast('Bukti baru ditambahkan ke jurnal');}
    const e=C.evidence[id];say('bio','happy',e.text,[[state.evidence.length===3?'Temui Mesha →':'Ayo lanjut! →',closeDialog]]);
  }
  function waterPuzzle(){
    openModal('KELAS 1–2 SD / PETUNJUK 1','Lihat angka pada alat!',`<p>Alat ini mengukur suhu air. Suhu memberi tahu seberapa panas atau dingin air.</p><div class="experiment"><div class="reading"><small>KEMARIN</small><b>26 °C</b><p>Suhu air</p></div><div class="reading"><small>HARI INI</small><b>26 °C</b><p>Suhu air</p></div></div><h3>Apakah kedua angka ini sama?</h3><div class="puzzle-options"><button id="water-wrong">Tidak, angkanya berbeda.</button><button id="water-right">Ya, keduanya 26.</button></div><p class="feedback" id="feedback">Lihat angka di kiri dan kanan. Tidak perlu menghitung.</p><p class="subtle">Angka ini dibuat untuk cerita permainan.</p>`);
    $('water-wrong').onclick=()=>feedback('Coba lihat lagi, ya. Di kiri tertulis 26. Di kanan juga 26. Apakah angkanya sama?');
    $('water-right').onclick=()=>collect('water');
  }
  function foodPuzzle(){
    let chain=[];
    openModal('KELAS 1–2 SD / PETUNJUK 2','Susun makanan paus!',`<p>Krill adalah hewan kecil mirip udang.</p><div class="junior-hint"><b>Baca petunjuknya:</b><p>Krill makan tumbuhan laut kecil.<br>Paus bungkuk makan krill.</p></div><h3>Klik urutannya: makanan krill → krill → paus.</h3><div class="chain" id="chain">Mulai dari makanan krill…</div><div class="puzzle-options" id="organisms"><button data-organism="paus">Paus bungkuk</button><button data-organism="fitoplankton">Tumbuhan laut kecil</button><button data-organism="krill">Krill · mirip udang kecil</button></div><p class="feedback" id="feedback">Panah berarti “dimakan oleh”.</p><button class="primary" id="chain-reset">Coba dari awal</button>`);
    const names={fitoplankton:'Tumbuhan laut kecil',krill:'Krill',paus:'Paus'};
    document.querySelectorAll('[data-organism]').forEach(b=>b.onclick=()=>{if(chain.includes(b.dataset.organism))return;const expected=['fitoplankton','krill','paus'][chain.length];if(b.dataset.organism!==expected){feedback(chain.length===0?'Mulai dari makanan krill. Krill makan tumbuhan laut kecil. Klik tumbuhan laut kecil, ya.':chain.length===1?'Tumbuhan laut kecil dimakan krill. Sekarang klik krill, ya.':'Siapa yang makan krill? Coba pilih paus bungkuk.');return;}chain.push(b.dataset.organism);b.classList.add('selected');b.disabled=true;A.click();$('chain').textContent=chain.map(x=>names[x]).join(' → ');$('feedback').textContent=chain.length===1?'Bagus! Sekarang pilih hewan yang makan tumbuhan itu.':chain.length===2?'Betul! Sekarang pilih hewan yang makan krill.':'Benar! Tumbuhan laut kecil → krill → paus.';if(chain.length===3){const saveButton=document.createElement('button');saveButton.className='primary';saveButton.textContent='Simpan petunjuk →';saveButton.onclick=()=>collect('food');$('organisms').append(saveButton);}});
    $('chain-reset').onclick=foodPuzzle;
  }
  function soundPuzzle(){
    soundExperiment();
  }
  function soundExperiment(){
    cancelAnimationFrame(scopeFrame);
    openModal('KELAS 1–2 SD / PETUNJUK 3','Kapan suara paus lebih jelas?',`<p>Coba dua tombol ini. Lihat apa yang terjadi!</p><div class="puzzle-options"><button id="engine-on">1. Nyalakan mesin kapal</button><button id="engine-off">2. Matikan mesin kapal</button></div><div class="junior-hint" id="sound-observation" role="status">Klik tombol pertama, lalu tombol kedua.</div><h3>Suara paus lebih jelas saat…</h3><div class="puzzle-options"><button id="sound-right" disabled>Mesin kapal dimatikan.</button><button id="sound-wrong" disabled>Mesin kapal menyala keras.</button></div><p class="feedback" id="feedback">Coba kedua tombol dulu, ya. Kamu tetap bisa bermain tanpa suara.</p><p class="subtle">Ini percobaan dalam cerita, bukan rekaman paus asli.</p>`);
    const seen=new Set();
    function observe(on){seen.add(on);A.click();$('sound-observation').innerHTML=on?'<b>BRUM! BRUM!</b><p>Mesin berbunyi keras. Suara paus sulit terdengar.</p>':'<b>Mesinnya sudah tenang.</b><p>Sekarang suara paus lebih jelas!</p>';if(seen.size===2){$('sound-right').disabled=$('sound-wrong').disabled=false;$('feedback').textContent='Kamu sudah mencoba keduanya. Sekarang pilih jawabanmu.';}}
    $('engine-on').onclick=()=>observe(true);$('engine-off').onclick=()=>observe(false);
    $('sound-right').onclick=()=>collect('sound');$('sound-wrong').onclick=()=>feedback('Coba ingat saat mesin dimatikan. Suara paus menjadi lebih jelas, kan? Kamu boleh mencoba tombolnya lagi.');
  }
  function conclusion(){
    say('mesha','thinking','Saat mesin tenang, suara paus lebih jelas. Apa yang sebaiknya kita lakukan dekat paus?',[
      ['Bunyikan mesin lebih keras.',()=>say('bio','thinking','Mesin yang keras membuat suara paus sulit terdengar. Coba pilih cara yang membuat teluk lebih tenang.',[['Coba lagi →',conclusion]])],
      ['Kurangi suara mesin kapal.',()=>{state.solved=true;save();updateUI();A.success();conversation([{who:'bio',exp:'happy',text:'Ayo ajak tim menjaga teluk tetap tenang. Kita juga akan mengamati paus lagi.'},{who:'mesha',exp:'happy',text:'Hebat! Kamu sudah mengikuti petunjuk. Buka peti di atas rumah penelitian untuk mengambil hadiahmu!'}]);}]
    ]);
  }
  function interact(entity=near){
    if(!ready||!entity||dialogOpen||!$('modal').classList.contains('hidden')||!$('intro').classList.contains('hidden'))return;
    route=[];routeTarget=null;A.click();
    if(entity.id==='prof'){say('prof','happy','Halo, Bio! Mau menyiapkan bekal matematika, membaca pesan, atau mencari pola? Pilih Misi belajar untuk mencoba.',[['Misi belajar →',()=>BioLessons.open()],['Petunjuk kasus paus',()=>conversation([{who:'prof',exp:'neutral',text:'Mesha ada di sebelah kanan. Klik Mesha untuk bicara. Setelah itu, cari tiga tanda bintang di peta!'}])]]);return;}
    if(entity.id==='mesha'){
      if(!state.started){conversation(C.intro,()=>{state.started=true;save();updateUI();closeDialog();toast('Misi dimulai · temukan tiga bukti');});}
      else if(state.finished)say('mesha','happy','Kita berhasil! Terima kasih sudah membantu paus. Kamu boleh membaca petunjukmu lagi di jurnal.');
      else if(state.solved)say('mesha','happy','Ayo buka peti di atas rumah penelitian. Ada hadiah untukmu!');
      else if(state.evidence.length===3)conclusion();
      else say('mesha','thinking',`Kita punya ${state.evidence.length} dari 3 petunjuk. Cari bintang di atas peta dan di seberang jembatan. Klik alat di bawah bintangnya, ya!`);
      return;
    }
    if(entity.id==='chest'){
      if(state.finished){openJournal();return;}
      if(!state.solved){say('bio','thinking','Petinya masih terkunci. Ayo cari tiga petunjuk, lalu temui Mesha!');return;}
      state.finished=true;save();updateUI();A.success();
      openModal('KASUS SELESAI / PENEMUAN PERTAMA','Penjaga Suara Samudra',`${portraitHTML('bio','happy','reward-portrait')}<p>Kerja bagus, Detektif Bio! Tim Arunika mengusulkan zona tenang untuk kapal dan melanjutkan pengamatan paus.</p><div class="specimen"><span>✦</span><div><h3>Lencana Peneliti Samudra</h3><p>Diperoleh dengan mengumpulkan bukti dan menguji dugaan.</p></div></div><p><b>Kartu fakta baru:</b> Paus bungkuk memakai suara untuk berkomunikasi. Paus jantan dikenal menyanyikan pola suara yang kompleks. Kebisingan manusia bisa mengganggu suara yang dibutuhkan hewan laut.</p><p class="subtle">Cerita, peta, data sensor, dan audio adalah simulasi. Di dunia nyata, peneliti mengumpulkan lebih banyak pengamatan untuk menguji penyebab perilaku paus.</p><button class="primary" id="ending-journal">Baca jurnal penemuan →</button>`);$('ending-journal').onclick=openJournal;return;
    }
    if(!state.started){say('bio','thinking','Ada alat penelitian! Aku perlu bicara dengan Mesha dulu.');return;}
    if(state.evidence.includes(entity.id)){say('bio','happy',C.evidence[entity.id].text);return;}
    ({water:waterPuzzle,food:foodPuzzle,sound:soundPuzzle}[entity.id])?.();
  }
  function openJournal(){
    const cards=Object.entries(C.evidence).map(([id,e])=>`<article class="specimen ${state.evidence.includes(id)?'':'locked'}"><span>${state.evidence.includes(id)?e.symbol:'?'}</span><div><h3>${state.evidence.includes(id)?e.title:'Bukti belum ditemukan'}</h3><p>${state.evidence.includes(id)?e.text:'Jelajahi pulau dan periksa alat bertanda bintang.'}</p></div></article>`).join('');
    openModal('JURNAL EKSPEDISI / ARUNIKA','Penemuan kecil, pertanyaan besar.',`<p class="subtle">${state.evidence.length} dari 3 bukti ditemukan${state.finished?' · Lencana Peneliti Samudra diperoleh':''}.</p>${cards}${state.finished?'<article class="specimen"><span>✦</span><div><h3>Penjaga Suara Samudra</h3><p>Paus bungkuk berkomunikasi dengan suara. Paus jantan dikenal menghasilkan nyanyian yang kompleks.</p></div></article>':''}<h3>Untuk peneliti yang ingin tahu lebih jauh</h3><p class="subtle">Data permainan adalah rekaan. Bacaan sains pendukung:</p>${C.sources.map(([n,url])=>`<p style="margin:5px 0"><a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#3d664b;font-size:11px">${n} ↗</a></p>`).join('')}`);
  }
  function help(){openModal('BUKU SAKU DETEKTIF','Ikuti rasa ingin tahumu.',`<p><b>Berjalan:</b> WASD, tombol panah, kontrol sentuh, atau klik tempat di peta. Bio akan mencari jalan sendiri.</p><p><b>Berinteraksi:</b> Dekati tokoh, alat, atau peti lalu tekan E / Enter. Kamu juga bisa langsung mengekliknya.</p><p><b>Dialog:</b> Klik tombol jawaban. E / Enter mempercepat teks dan melanjutkan dialog yang punya satu pilihan. J membuka jurnal, Esc menutup jendela.</p><p><b>Tujuan:</b> Temui Mesha → kumpulkan tiga bukti → kembali ke Mesha → buka peti. Tidak ada batas waktu atau game over.</p><p class="subtle">Suara bersifat opsional dan dibuat dengan sintesis lokal. Tidak ada aset yang diunduh. Progres disimpan di browser ini bila penyimpanan tersedia.</p><button class="primary" id="restart">Ulangi ekspedisi</button>`);$('restart').onclick=()=>{openModal('MULAI DARI AWAL','Ulangi kasus pertama?',`<p>Ini akan menghapus progres demo di browser ini.</p><button class="primary" id="confirm-reset">Ya, mulai lagi</button>`);$('confirm-reset').onclick=()=>{state=fresh();save();updateUI();player.x=115;player.y=182;route=[];routeTarget=null;closeModal();$('intro').classList.remove('hidden');};};}
  function findRoute(tx,ty){
    // BFS pada kisi 8 piksel; jalur hanya melintasi daratan dan jembatan.
    const S=8,cols=60,rows=36,key=(x,y)=>y*cols+x;
    const sx=Math.floor(player.x/S),sy=Math.floor(player.y/S),gx=Math.floor(tx/S),gy=Math.floor(ty/S),queue=[[sx,sy]],prev=new Map([[key(sx,sy),null]]);let end=null,best=Infinity;
    for(let index=0;index<queue.length;index++){
      const [x,y]=queue[index],dist=(x-gx)**2+(y-gy)**2;
      if(dist<best){best=dist;end=[x,y];}if(dist===0)break;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<0||nx>=cols||ny<0||ny>=rows||prev.has(k)||!BioArt.walkable(nx*S+4,ny*S+4))continue;prev.set(k,[x,y]);queue.push([nx,ny]);}
    }
    const points=[];while(end&&!(end[0]===sx&&end[1]===sy)){points.push({x:end[0]*S+4,y:end[1]*S+4});end=prev.get(key(...end));}return points.reverse();
  }
  canvas.addEventListener('pointerdown',e=>{
    if(!ready||dialogOpen||!$('modal').classList.contains('hidden')||!$('intro').classList.contains('hidden'))return;
    canvas.focus({preventScroll:true});const point=BioDisplay.mapPoint(e.clientX,e.clientY,canvas.getBoundingClientRect());if(!point)return;const {x,y}=point;
    const entity=entities.find(o=>Math.hypot(o.x-x,o.y-y)<20);
    if(entity&&Math.hypot(entity.x-player.x,entity.y-player.y)<25){interact(entity);return;}
    route=findRoute(entity?.x??x,entity?.y??y);routeTarget=entity||null;if(!route.length&&entity)toast('Dekati lewat jalan setapak');
  });
  const moveCodes={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
  document.addEventListener('keydown',e=>{
    const modalOpen=!$('modal').classList.contains('hidden');
    if(modalOpen){if(e.key==='Escape'){closeModal();e.preventDefault();}if(e.key==='Tab'){const els=[...$('modal').querySelectorAll('button,a,input')].filter(el=>!el.disabled);const first=els[0],lastEl=els.at(-1);if(e.shiftKey&&document.activeElement===first){lastEl.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===lastEl){first.focus();e.preventDefault();}}return;}
    if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
    if(moveCodes[e.code]){e.preventDefault();keys.add(moveCodes[e.code]);route=[];routeTarget=null;}
    if(e.repeat)return;
    if(e.code==='KeyJ'&&$('intro').classList.contains('hidden')){e.preventDefault();openJournal();}
    if(e.code==='Escape'&&dialogOpen)closeDialog();
    if(e.code==='KeyE'||e.code==='Enter'||e.code==='Space'){
      if(document.activeElement.tagName==='BUTTON')return;e.preventDefault();if(dialogOpen){if(typing)stopTyping();else currentNext?.();}else interact();
    }
  });
  document.addEventListener('keyup',e=>{if(moveCodes[e.code])keys.delete(moveCodes[e.code]);});window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear();});
  document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.move);route=[];routeTarget=null;b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.move);});
  $('touch-action').onclick=()=>{if(dialogOpen){if(typing)stopTyping();else currentNext?.();}else interact();};
  $('start').onclick=()=>{if(!ready){toast('Menyiapkan peta…');return;}$('intro').classList.add('hidden');canvas.focus({preventScroll:true});if(!state.started)conversation([{who:'bio',exp:'neutral',text:'Aku Bio. Pagi ini aku datang ke Arunika untuk sebuah misteri. Mesha menungguku di jalan menuju jembatan. Saatnya mencari tahu!'}]);};
  $('sound').onclick=async()=>{try{const on=await A.toggle();$('sound').querySelector('span').textContent=on?'Suara aktif':'Suara mati';$('sound').setAttribute('aria-label',on?'Matikan suara':'Aktifkan suara');}catch{toast('Audio belum tersedia di browser ini');}};
  BioLessons.init({openModal,closeModal,portraitHTML,audio:A});
  $('learning').onclick=()=>BioLessons.open();
  $('help').onclick=help;$('journal').onclick=openJournal;$('modal-close').onclick=closeModal;$('modal').onclick=e=>{if(e.target===$('modal'))closeModal();};
  BioDisplay.init({keys,openJournal,openLearning:()=>BioLessons.open(),toast});
  function tick(t){
    const dt=Math.min((t-last)/1000,.04);last=t;player.walking=false;
    if(ready){
      if(!dialogOpen&&$('modal').classList.contains('hidden')&&$('intro').classList.contains('hidden')){
        let dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);
        if(!dx&&!dy&&route.length){let target=route[0];const distance=Math.hypot(target.x-player.x,target.y-player.y);if(distance<2){route.shift();if(!route.length&&routeTarget){const goal=routeTarget;routeTarget=null;if(Math.hypot(goal.x-player.x,goal.y-player.y)<26)interact(goal);}}else{dx=(target.x-player.x)/distance;dy=(target.y-player.y)/distance;}}
        if(dx||dy){const mag=Math.hypot(dx,dy);dx/=mag;dy/=mag;const nx=player.x+dx*62*dt,ny=player.y+dy*62*dt;let moved=false;if(BioArt.walkable(nx,player.y)){moved ||= nx!==player.x;player.x=nx;}if(BioArt.walkable(player.x,ny)){moved ||= ny!==player.y;player.y=ny;}player.walking=moved;if(!moved&&route.length){route=[];routeTarget=null;}player.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';if(moved&&t-lastStep>240){A.step();lastStep=t;}}
      }
      near=entities.filter(o=>Math.hypot(o.x-player.x,o.y-player.y)<25).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
      const show=near&&!dialogOpen&&$('modal').classList.contains('hidden')&&$('intro').classList.contains('hidden');$('interaction').classList.toggle('hidden',!show);
      if(show)$('interaction').querySelector('span').textContent=({mesha:'Bicara dengan Mesha',prof:'Bicara dengan Prof. Nara',water:'Periksa sensor air',sound:'Gunakan hidrofon',food:'Periksa rantai makanan',chest:state.finished?'Lihat penemuan':'Buka peti peneliti'})[near.id];
      $('area-label').querySelector('b').textContent=player.x>355?(player.y>193?'Dermaga Pengamatan':'Stasiun Hidrofon'):player.x>250?'Pos Pengamatan Sungai':player.y<128?'Hutan Peneliti':'Stasiun Penelitian';
      BioArt.render(ctx,t,player,entities,state);
    }
    requestAnimationFrame(tick);
  }
  updateUI();BioArt.load().then(()=>{ready=true;requestAnimationFrame(tick);});
})();
