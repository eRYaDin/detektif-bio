// Geometri Canvas dan fallback layar penuh diuji tanpa browser/layanan eksternal.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const code=fs.readFileSync(path.join(__dirname,'../src/display.js'),'utf8');
const {mapPoint}=require('../src/display.js');
for(const [width,height] of [[960,576],[360,320],[844,239],[1440,800]]){
 const rect={left:13,top:29,width,height},p=mapPoint(13+width/2,29+height/2,rect);
 assert.equal(p.x,240);assert.equal(p.y,144);
 const scale=Math.min(width/480,height/288),left=13+(width-480*scale)/2,top=29+(height-288*scale)/2;
 assert(Math.abs(mapPoint(left,top,rect).x)<1e-8);
 if(left>13)assert.equal(mapPoint(13,29+height/2,rect),null);
 if(top>29)assert.equal(mapPoint(13+width/2,29,rect),null);
}
assert.equal(mapPoint(0,0,{left:0,top:0,width:0,height:0}),null);
function classes(){const set=new Set();return {toggle(k,on){on?set.add(k):set.delete(k);},contains:k=>set.has(k)};}
const elements=new Map(['play-mode','text-size','play-learning','play-journal','fullscreen'].map(id=>[id,{setAttribute(k,v){this[k]=v;}}]));
const events={},store={},keys=new Set(['left']);let lock=0,unlock=0,toasts=0,learning=0,journal=0;
const doc={body:{classList:classes()},documentElement:{},getElementById:id=>elements.get(id),addEventListener:(name,fn)=>events[name]=fn};
const win={scrollY:150,scrollTo(){},addEventListener:(name,fn)=>events[name]=fn,screen:{orientation:{async lock(){lock++;},unlock(){unlock++;}}}};
const context={window:win,document:doc,localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},matchMedia:()=>({matches:true}),module:{exports:{}}};
vm.createContext(context);vm.runInContext(code,context);
win.BioDisplay.init({keys,openJournal:()=>journal++,openLearning:()=>learning++,toast:()=>toasts++});
(async()=>{
 elements.get('text-size').onclick();assert.equal(store['bio-large-text'],'true');assert(doc.body.classList.contains('large-text'));
 await elements.get('play-mode').onclick();assert(doc.body.classList.contains('game-focus'));assert.equal(keys.size,0);assert.equal(toasts,1,'Tombol main mencoba fullscreen dan memberi fallback');
 elements.get('play-learning').onclick();elements.get('play-journal').onclick();assert.equal(learning,1);assert.equal(journal,1);
 await elements.get('fullscreen').onclick();assert.equal(toasts,2);assert(doc.body.classList.contains('game-focus'),'Fallback tetap bisa dimainkan');
 await elements.get('play-mode').onclick();assert(!doc.body.classList.contains('game-focus'));
 doc.documentElement.requestFullscreen=async(options)=>{assert.equal(options.navigationUI,'hide');doc.fullscreenElement=doc.documentElement;};
 doc.exitFullscreen=async()=>{doc.fullscreenElement=null;events.fullscreenchange();};
 await elements.get('play-mode').onclick();assert.equal(lock,1);assert(doc.fullscreenElement);
 await elements.get('play-mode').onclick();assert(!doc.body.classList.contains('game-focus'));assert.equal(unlock,1);
 keys.add('right');events.resize();assert.equal(keys.size,0);
 console.log('PASS: rasio klik Canvas, pita kosong, teks besar, fokus game, fullscreen/fallback, rotasi');
})().catch(e=>{console.error(e);process.exitCode=1;});
