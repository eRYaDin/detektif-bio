/* Misi belajar terpisah dari kasus paus. Bisa dimainkan dan diulang kapan saja. */
(function(root){
  const D=root.BioLearningData,KEY='bio-learning-v1',known=new Set(D.questions.map(q=>q.id));
  function clean(raw){return {grade:raw?.grade===2?2:1,completed:[...new Set((Array.isArray(raw?.completed)?raw.completed:[]).filter(id=>known.has(id)))]};}
  let state=clean(),storageOK=true,ui;
  try{const stored=localStorage.getItem(KEY);try{state=clean(JSON.parse(stored));}catch{state=clean();}}catch{storageOK=false;}
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const done=id=>state.completed.includes(id);
  const list=(grade,subject)=>D.questions.filter(q=>q.grade===grade&&q.subject===subject);
  function badges(){return [1,2].flatMap(grade=>Object.keys(D.subjects).filter(s=>list(grade,s).every(q=>done(q.id))).map(subject=>({grade,subject})));}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;}updateCount();}
  function updateCount(){const e=document.getElementById('learning-count');if(e)e.textContent=`${state.completed.length} / ${D.questions.length} soal · ${badges().length} lencana`;}
  function open(){
    const grade=state.grade,total=D.questions.filter(q=>q.grade===grade).length,count=D.questions.filter(q=>q.grade===grade&&done(q.id)).length;
    ui.openModal('MISI BELAJAR BIO / KELAS 1–2 SD','Belajar sambil berpetualang',`<p>Pilih kelasmu, lalu pilih misi. Tidak ada batas waktu. Kamu boleh mencoba lagi.</p><div class="grade-picker" role="group" aria-label="Pilih tingkat kelas">${[1,2].map(g=>`<button data-grade="${g}" aria-pressed="${g===grade}">Kelas ${g}</button>`).join('')}</div><div class="learning-summary"><b>${count} / ${total} soal kelas ${grade}</b><span>${badges().length} / 8 lencana</span></div><div class="lesson-grid">${Object.entries(D.subjects).map(([id,s])=>{const qs=list(grade,id),n=qs.filter(q=>done(q.id)).length;return `<button class="lesson-card" data-subject="${id}"><span class="lesson-icon" aria-hidden="true">${s.icon}</span><strong>${s.title}</strong><span>${s.description}</span><small>${n===qs.length?'✓ Lencana diperoleh':`${n} / ${qs.length} soal selesai`} · ${n===qs.length?'Main lagi':'Mulai / lanjutkan'} →</small></button>`;}).join('')}</div><p class="subtle">${storageOK?'Progres tersimpan di browser ini.':'Penyimpanan tidak tersedia. Progres hanya untuk sesi ini.'} Pilihan kelas bisa diganti kapan saja.</p><details class="parent-notes"><summary>Catatan untuk pendamping</summary><p>Materi latihan kelas awal dengan tingkat bertahap, bukan penilaian kemampuan atau paket kurikulum resmi. Bacakan kalimat bila anak belum lancar membaca. Setiap jawaban salah mendapat petunjuk. Kelas 1 memakai hitungan sederhana; kelas 2 menambah puluhan, uang, waktu, dan pembagian konkret.</p><button id="learning-reset" class="secondary">Hapus progres belajar…</button></details>`);
    document.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{state.grade=Number(b.dataset.grade);save();open();});
    document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>start(b.dataset.subject));
    document.getElementById('learning-reset').onclick=()=>{ui.openModal('MULAI DARI AWAL','Hapus progres misi belajar?',`<p>Lencana dan jawaban misi belajar akan dihapus dari browser ini. Progres kasus paus tetap tersimpan.</p><button class="primary" id="confirm-learning-reset">Ya, hapus progres belajar</button><button class="secondary" id="cancel-learning-reset">Batal</button>`);document.getElementById('confirm-learning-reset').onclick=()=>{state=clean();save();open();};document.getElementById('cancel-learning-reset').onclick=open;};
  }
  function visual(v){if(!v)return '';if(v.shape==='triangle')return '<div class="lesson-visual"><span class="triangle-shape" role="img" aria-label="Segitiga dengan tiga sisi"></span></div>';return `<div class="lesson-visual" role="img" aria-label="${v.count} ${esc(v.label)} ditambah ${v.extra} ${esc(v.label)}"><span class="counter-group">${'<i></i>'.repeat(v.count)}</span><b>＋</b><span class="counter-group">${'<i></i>'.repeat(v.extra)}</span></div>`;}
  function start(subject){
    const grade=state.grade,qs=list(grade,subject);let cursor=qs.findIndex(q=>!done(q.id));if(cursor<0)cursor=0;
    function show(){
      const q=qs[cursor];let answered=false;
      // Acak sekali per tampilan. Jawaban tidak selalu berada di tombol yang sama.
      const options=[...q.options];for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
      ui.openModal(`KELAS ${grade} / ${D.subjects[subject].title.toUpperCase()}`,`Misi ${cursor+1} dari ${qs.length}`,`<div class="learning-summary"><span>Pelan-pelan juga boleh.</span><button id="lesson-menu" class="text-button">← Pilih misi</button></div>${visual(q.visual)}<h3 class="lesson-question" id="lesson-question">${esc(q.prompt)}</h3><div class="puzzle-options" id="lesson-options">${options.map((o,i)=>`<button data-answer="${i}" aria-describedby="lesson-question">${esc(o)}</button>`).join('')}</div><div id="lesson-feedback" class="lesson-feedback" aria-live="polite">Pilih jawabanmu. Kalau belum tepat, Bio akan membantu.</div><button id="lesson-next" class="primary hidden">${cursor===qs.length-1?'Ambil lencana →':'Soal berikutnya →'}</button>`);
      document.getElementById('lesson-menu').onclick=open;
      document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
        if(answered)return;const feedback=document.getElementById('lesson-feedback');
        if(options[Number(b.dataset.answer)]!==q.answer){ui.audio.think();feedback.innerHTML=ui.portraitHTML('bio','thinking','feedback-portrait')+`<b>Ayo coba lagi.</b><p>${esc(q.hint)}</p>`;feedback.className='lesson-feedback retry';return;}
        answered=true;if(!done(q.id)){state.completed.push(q.id);save();}ui.audio.success();
        document.querySelectorAll('[data-answer]').forEach(button=>{button.disabled=true;if(options[Number(button.dataset.answer)]===q.answer)button.classList.add('selected');});
        feedback.innerHTML=ui.portraitHTML('bio','happy','feedback-portrait')+`<b>Tepat! Kamu menemukannya.</b><p>${esc(q.explanation)}</p>`;feedback.className='lesson-feedback success';document.getElementById('lesson-next').classList.remove('hidden');
      });
      document.getElementById('lesson-next').onclick=()=>{if(!answered)return;if(cursor<qs.length-1){cursor++;show();}else finish(subject,grade);};
    }show();
  }
  function finish(subject,grade){const all=list(grade,subject).every(q=>done(q.id));ui.openModal('PENEMUAN BARU',all?'Lencana misi untukmu!':'Latihan selesai!',`${ui.portraitHTML('bio','happy','reward-portrait')}<p>Kamu menyelesaikan <b>${D.subjects[subject].title}</b> kelas ${grade}.</p><p>Terima kasih sudah mencoba dan mengikuti petunjuk. Kamu boleh mengulang misi kapan saja.</p><div class="junior-hint"><b>${all?'✦ '+D.subjects[subject].title:'Ayo lanjutkan latihan'}</b><p>${all?'Lencana sudah tersimpan dalam progres belajarmu.':'Masih ada soal yang bisa kamu coba lagi.'}</p></div><button class="primary" id="more-lessons">Pilih misi lagi →</button>`);document.getElementById('more-lessons').onclick=open;}
  root.BioLessons={init(api){ui=api;updateCount();},open};
  if(typeof module==='object'&&module.exports)module.exports={clean,list,subjects:D.subjects};
})(typeof window==='object'?window:globalThis);
