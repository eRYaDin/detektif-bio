const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
let contexts=[],fail=false,timers=new Set(),id=0;
class FakeAudioContext{
 constructor(){this.state='suspended';this.currentTime=0;this.destination={};contexts.push(this);}
 async resume(){if(fail)throw Error('autoplay blocked');this.state='running';}
 async suspend(){this.state='suspended';}
 createGain(){return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}
 createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},start(){},stop(){}};}
}
const ctx={window:{AudioContext:FakeAudioContext},setInterval:()=>{timers.add(++id);return id;},clearInterval:i=>timers.delete(i),Math};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/audio.js'),'utf8'),ctx);const audio=ctx.window.AudioBio;
(async()=>{
 assert.equal(audio.enabled,false);await audio.toggle();assert.equal(audio.enabled,true);assert.equal(contexts[0].state,'running');assert.equal(timers.size,1);audio.click();
 await audio.toggle(true);assert.equal(timers.size,1,'Jangan menggandakan musik');
 await audio.toggle();assert.equal(audio.enabled,false);assert.equal(timers.size,0);
 fail=true;await assert.rejects(audio.toggle(),/autoplay blocked/);assert.equal(audio.enabled,false);assert.equal(timers.size,0);
 fail=false;await audio.toggle();assert.equal(audio.enabled,true,'Tap berikutnya mencoba aktif, bukan mematikan state palsu');
 await audio.toggle(false);contexts[0].state='closed';await audio.toggle();assert.equal(contexts.length,2,'Context yang sudah ditutup dibuat ulang');
 console.log('PASS: suara on/off, retry autoplay, satu timer, pemulihan AudioContext');
})().catch(e=>{console.error(e);process.exitCode=1;});
