// Periksa seluruh bank soal dan perilaku misi melalui DOM kecil dalam memori.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),data=require('../src/learning-data.js');
assert.equal(data.questions.length,40);assert.equal(new Set(data.questions.map(q=>q.id)).size,40);
for(const q of data.questions){assert([1,2].includes(q.grade));assert(data.subjects[q.subject]);assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert(q.options.includes(q.answer),q.id);assert(q.hint&&q.explanation);}
for(const grade of [1,2]){assert.equal(data.questions.filter(q=>q.grade===grade).length,20);assert.equal(data.questions.filter(q=>q.grade===grade&&q.subject==='math').length,8);}
// Periksa hasil hitungan secara terpisah dari pilihan jawaban.
const maths=[3+2,8-3,undefined,8,3,13,10+4,3+3,24+13,35-12];
for(let i=0;i<maths.length;i++)if(maths[i]!==undefined)assert.equal(Number(data.questions.filter(q=>q.subject==='math')[i].answer),maths[i]);
let elements,groups,html,title,stored={},audioSuccess=0;
function el(){return {textContent:'',innerHTML:'',disabled:false,hidden:false,dataset:{},classList:{add(){},remove(){}}};}
const counter=el(),document={getElementById(id){return id==='learning-count'?counter:elements.get(id);},querySelectorAll(s){return groups[s]||[];}};
function render(a,b,markup){html=markup;title=b;elements=new Map();groups={};for(const m of markup.matchAll(/id="([^"]+)"/g))elements.set(m[1],el());for(const attr of ['grade','subject','answer']){groups[`[data-${attr}]`]=[...markup.matchAll(new RegExp(`data-${attr}="([^"]+)"`,'g'))].map(m=>{const e=el();e.dataset[attr]=m[1];return e;});}}
const context={window:{BioLearningData:data},document,localStorage:{getItem:k=>stored[k]??null,setItem:(k,v)=>{stored[k]=v;}},module:{exports:{}},Math};vm.createContext(context);
const code=fs.readFileSync(path.join(root,'src/learning.js'),'utf8');vm.runInContext(code,context);
const lesson=context.window.BioLessons;lesson.init({openModal:render,portraitHTML:()=>'',audio:{think(){},success(){audioSuccess++;}}});
lesson.open();assert(html.includes('0 / 20 soal kelas 1'));groups['[data-subject]'][0].onclick();
const wrong=groups['[data-answer]'].find(e=>!html.includes(`data-answer="${e.dataset.answer}" aria-describedby="lesson-question">5</button>`));wrong.onclick();assert(document.getElementById('lesson-feedback').innerHTML.includes('Ayo coba lagi'));assert.equal(audioSuccess,0);
function answer(q){const match=[...html.matchAll(/data-answer="(\d+)" aria-describedby="lesson-question">([^<]+)<\/button>/g)].find(m=>m[2]===q.answer);assert(match,q.id);groups['[data-answer]'].find(e=>e.dataset.answer===match[1]).onclick();}
const questions=data.questions.filter(q=>q.grade===1&&q.subject==='math');
for(const q of questions){answer(q);const before=audioSuccess;answer(q);assert.equal(audioSuccess,before,'Klik ganda tidak menambah hadiah');document.getElementById('lesson-next').onclick();}
assert.equal(title,'Lencana misi untukmu!');assert.equal(JSON.parse(stored['bio-learning-v1']).completed.length,8);lesson.open();assert(counter.textContent.includes('1 lencana'));
groups['[data-subject]'][0].onclick();answer(questions[0]);assert.equal(JSON.parse(stored['bio-learning-v1']).completed.length,8,'Replay tidak menggandakan progres');
lesson.open();groups['[data-grade]'][1].onclick();assert(html.includes('0 / 20 soal kelas 2'));
assert.equal(context.module.exports.clean({grade:9,completed:['bad',questions[0].id,questions[0].id]}).completed.length,1);
// Tutup satu misi setelah jawaban pertama, lalu pastikan soal berikutnya dilanjutkan.
groups['[data-subject]'][0].onclick();const math2=data.questions.filter(q=>q.grade===2&&q.subject==='math');answer(math2[0]);lesson.open();groups['[data-subject]'][0].onclick();assert(html.includes(math2[1].prompt));
// Selesaikan seluruh materi lewat handler yang sama dengan tombol game.
for(const grade of [1,2])for(const subject of Object.keys(data.subjects)){
 const completed=JSON.parse(stored['bio-learning-v1']).completed;
 const remaining=data.questions.filter(q=>q.grade===grade&&q.subject===subject&&!completed.includes(q.id));
 if(!remaining.length)continue;lesson.open();groups['[data-grade]'][grade-1].onclick();groups['[data-subject]'].find(e=>e.dataset.subject===subject).onclick();
 for(const q of remaining){answer(q);document.getElementById('lesson-next').onclick();}
 assert.equal(title,'Lencana misi untukmu!');
}
lesson.open();assert(counter.textContent.includes('40 / 40 soal · 8 lencana'));
stored['bio-odyssey-v1']='progres kasus paus';document.getElementById('learning-reset').onclick();document.getElementById('cancel-learning-reset').onclick();assert.equal(JSON.parse(stored['bio-learning-v1']).completed.length,40);
document.getElementById('learning-reset').onclick();document.getElementById('confirm-learning-reset').onclick();assert.equal(JSON.parse(stored['bio-learning-v1']).completed.length,0);assert.equal(stored['bio-odyssey-v1'],'progres kasus paus');
// Save rusak dan penyimpanan diblokir tidak boleh menghentikan game.
stored['bio-learning-v1']='{invalid';assert.doesNotThrow(()=>vm.runInContext(code,context));
context.localStorage.getItem=()=>{throw Error('blocked');};assert.doesNotThrow(()=>vm.runInContext(code,context));context.window.BioLessons.init({openModal:render});context.window.BioLessons.open();assert(html.includes('Penyimpanan tidak tersedia'));
console.log('PASS: 40 soal, jawaban matematika, hint, replay, lencana, pilihan kelas, save rusak/terblokir');
