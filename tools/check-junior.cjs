// Uji logika soal tanpa browser. Tidak membutuhkan paket tambahan.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/game.js'),'utf8');
let nodes,organisms,message,rewards,spoken,state;
function element(){return {textContent:'',innerHTML:'',disabled:false,className:'',classList:{add(){}},append(b){this.children??=[];this.children.push(b);}};}
const context={
 $:id=>nodes.get(id),document:{querySelectorAll:()=>organisms,createElement:element},
 openModal:(eyebrow,title,html)=>{nodes=new Map();organisms=[];for(const m of html.matchAll(/id="([^"]+)"/g))nodes.set(m[1],element());for(const m of html.matchAll(/data-organism="([^"]+)"/g)){const e=element();e.dataset={organism:m[1]};organisms.push(e);}if(html.includes('id="sound-right" disabled'))nodes.get('sound-right').disabled=nodes.get('sound-wrong').disabled=true;},
 feedback:text=>{message=text;},collect:id=>rewards.push(id),A:{click(){},success(){}},
 cancelAnimationFrame(){},scopeFrame:undefined,say:(who,exp,text,actions)=>{spoken={who,exp,text,actions};},
 save(){},updateUI(){},conversation(){},state:{solved:false}
};
vm.createContext(context);
const puzzles=vm.runInContext(source.slice(source.indexOf('  function waterPuzzle()'),source.indexOf('  function interact('))+'\n({waterPuzzle,foodPuzzle,soundPuzzle,conclusion});',context);
rewards=[];puzzles.waterPuzzle();nodes.get('water-wrong').onclick();assert.match(message,/Coba lihat/);assert.equal(rewards.length,0);nodes.get('water-right').onclick();assert.deepEqual(rewards,['water']);console.log('PASS: perbandingan angka, petunjuk jawaban salah, hadiah');
rewards=[];puzzles.foodPuzzle();const pick=id=>organisms.find(x=>x.dataset.organism===id).onclick();pick('paus');assert.match(message,/Mulai dari makanan/);assert.equal(nodes.get('chain').textContent,'');pick('fitoplankton');pick('fitoplankton');assert.equal(nodes.get('chain').textContent,'Tumbuhan laut kecil');pick('paus');assert.equal(nodes.get('chain').textContent,'Tumbuhan laut kecil');pick('krill');pick('paus');assert.equal(nodes.get('chain').textContent,'Tumbuhan laut kecil → Krill → Paus');nodes.get('organisms').children[0].onclick();assert.deepEqual(rewards,['food']);console.log('PASS: urutan bertahap, salah tidak menghapus langkah, tanpa duplikasi');
rewards=[];puzzles.soundPuzzle();assert(nodes.get('sound-right').disabled);nodes.get('engine-on').onclick();nodes.get('engine-on').onclick();assert(nodes.get('sound-right').disabled);nodes.get('engine-off').onclick();assert(!nodes.get('sound-right').disabled);nodes.get('sound-wrong').onclick();assert.equal(rewards.length,0);assert.match(message,/mesin dimatikan/);nodes.get('sound-right').onclick();assert.deepEqual(rewards,['sound']);console.log('PASS: wajib mencoba dua kondisi mesin, jawaban salah dapat diulang');
puzzles.conclusion();assert.equal(spoken.actions.length,2);spoken.actions[0][1]();assert.equal(context.state.solved,false);puzzles.conclusion();spoken.actions[1][1]();assert.equal(context.state.solved,true);console.log('PASS: dua pilihan akhir, kesimpulan benar membuka hadiah');
assert(!/120 Hz|mg\/L|frekuensi|oksigen terlarut/.test(source.slice(source.indexOf('  function waterPuzzle()'),source.indexOf('  function interact('))));console.log('PASS: soal kelas 1–2 tanpa satuan dan konsep teknis lanjutan');
