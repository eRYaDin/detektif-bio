/* Dunia digambar pada resolusi 480 × 288 lalu diperbesar tanpa antialiasing. */
window.BioArt = (() => {
  const W=480,H=288,T=16, objects=[], blocked=new Set();
  const sprites={}, terrain=document.createElement('canvas');terrain.width=W;terrain.height=H;
  const c=terrain.getContext('2d');c.imageSmoothingEnabled=false;
  let seed=3471;
  function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  const rect=(g,x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
  function poly(g,points,color){g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();}
  function riverX(y){return 327+Math.round(Math.sin(y/54)*10);}
  function isWater(x,y){return x<13||y<9||y>279||x>452||Math.abs(x-riverX(y))<15;}
  function path(x,y){return (Math.abs(y-179)<10&&x>64&&x<411)||(Math.abs(x-198)<10&&y>79&&y<231)||(Math.abs(x-281)<9&&y>85&&y<186)||(Math.abs(y-93)<8&&x>194&&x<287)||(Math.abs(x-409)<10&&y>111&&y<230)||(Math.abs(y-226)<8&&x>195&&x<417);}
  function shadow(g,x,y,w=20){g.fillStyle='#203e3860';g.beginPath();g.ellipse(x,y,w/2,4,0,0,Math.PI*2);g.fill();}
  function tree(g,x,y,kind=0){
    shadow(g,x,y+2,30);rect(g,x-3,y-11,6,14,'#685e38');rect(g,x-1,y-10,3,12,'#95804b');
    const colors=kind?['#32594a','#407351','#64904f','#8ca659']:['#284f44','#386d4c','#56854b','#7d9a50'];
    poly(g,[[x-20,y-11],[x-22,y-22],[x-17,y-29],[x-14,y-38],[x-7,y-43],[x+8,y-44],[x+17,y-36],[x+18,y-29],[x+23,y-23],[x+20,y-11],[x+12,y-6],[x-12,y-6]],colors[0]);
    poly(g,[[x-18,y-20],[x-16,y-31],[x-9,y-39],[x+6,y-41],[x+14,y-35],[x+17,y-23],[x+11,y-14],[x-9,y-13]],colors[1]);
    poly(g,[[x-16,y-29],[x-10,y-37],[x+4,y-39],[x+11,y-33],[x+8,y-24],[x,y-26],[x-5,y-20],[x-14,y-23]],colors[2]);
    rect(g,x-10,y-35,9,3,colors[3]);rect(g,x-14,y-29,5,3,colors[3]);rect(g,x+4,y-32,5,2,colors[3]);rect(g,x+10,y-18,6,3,colors[2]);rect(g,x-15,y-14,7,2,colors[2]);
  }
  function bush(g,x,y){shadow(g,x,y+2,18);rect(g,x-10,y-6,20,6,'#426c42');rect(g,x-7,y-10,14,8,'#60864a');rect(g,x-4,y-12,8,8,'#7e9c55');rect(g,x-7,y-7,3,2,'#a6b96a');rect(g,x+5,y-4,3,2,'#a6b96a');}
  function rock(g,x,y){shadow(g,x,y+1,15);poly(g,[[x-8,y],[x-8,y-6],[x-3,y-11],[x+4,y-10],[x+8,y-5],[x+7,y]],'#697a65');poly(g,[[x-7,y-5],[x-3,y-10],[x+3,y-9],[x+5,y-5]],'#a0a78a');rect(g,x-5,y-5,5,2,'#b9b99a');}
  function building(g,x,y){
    shadow(g,x+29,y+8,93);rect(g,x-4,y-39,77,47,'#4b5940');rect(g,x,y-38,69,44,'#d5c28b');rect(g,x,y-4,69,9,'#9b9565');
    for(let i=0;i<5;i++)rect(g,x,y-32+i*7,69,1,'#bcad76');
    for(const ox of [9,45]){rect(g,x+ox,y-29,15,17,'#52664c');rect(g,x+ox+2,y-27,11,12,'#82b7ab');rect(g,x+ox+3,y-26,4,5,'#bed4bb');rect(g,x+ox+7,y-27,1,12,'#52664c');rect(g,x+ox-2,y-12,19,3,'#7b7350');}
    rect(g,x+29,y-22,13,27,'#5b6651');rect(g,x+31,y-20,9,24,'#846e47');rect(g,x+37,y-8,2,2,'#e6cc79');rect(g,x+26,y+5,19,4,'#bab387');rect(g,x+23,y+9,25,3,'#d5c28b');
    poly(g,[[x-7,y-40],[x+8,y-65],[x+60,y-65],[x+77,y-40],[x+77,y-35],[x-7,y-35]],'#304a41');
    poly(g,[[x-5,y-41],[x+10,y-63],[x+58,y-63],[x+73,y-41]],'#587d68');
    for(let i=0;i<4;i++){rect(g,x+7-i*4,y-60+i*6,54+i*8,2,'#719578');for(let j=0;j<7;j++)rect(g,x+10+j*7-i*3,y-57+i*6,1,4,'#40634f');}
    rect(g,x+52,y-72,9,15,'#a9aa83');rect(g,x+50,y-73,13,3,'#d0c49b');rect(g,x+27,y-44,17,9,'#334f41');rect(g,x+29,y-42,13,5,'#bcce99');
    rect(g,x+75,y-29,2,36,'#725e3c');rect(g,x+77,y-27,15,10,'#d2c184');rect(g,x+80,y-24,10,1,'#657444');rect(g,x+80,y-21,7,1,'#657444');
  }
  function fence(g,x,y,n){for(let i=0;i<n;i++){rect(g,x+i*10,y-12,3,15,'#6b6945');rect(g,x+i*10,y-13,3,3,'#c2b175');if(i<n-1){rect(g,x+i*10,y-9,11,3,'#c2b175');rect(g,x+i*10,y-3,11,2,'#9e915e');}}}
  function instrument(g,x,y,type,t,done){
    shadow(g,x,y+2,23);
    if(type==='water'){
      rect(g,x-6,y-18,12,20,'#596852');rect(g,x-8,y-21,16,5,'#d0cfab');rect(g,x-4,y-15,8,8,'#234f4d');rect(g,x-2,y-13,4,3,'#8fcdac');rect(g,x+7,y-13,6,2,'#727c5c');rect(g,x+12,y-13,2,15,'#d0cfab');rect(g,x-9,y+2,23,3,'#a3ac86');
    }else if(type==='sound'){
      rect(g,x-8,y-11,18,13,'#6a7456');rect(g,x-10,y-15,22,5,'#bdc496');rect(g,x-7,y-13,16,7,'#35564c');rect(g,x-5,y-12,7,4,'#9ac2a0');for(let i=0;i<3;i++)rect(g,x+4+i*2,y-11,1,3,'#d3bf76');
      rect(g,x+10,y-28,2,21,'#c5c79f');poly(g,[[x+1,y-29],[x+4,y-35],[x+21,y-28],[x+17,y-21],[x+9,y-22]],'#677f66');poly(g,[[x+3,y-29],[x+5,y-33],[x+18,y-28],[x+15,y-24],[x+9,y-24]],'#c2c9a2');
    }else if(type==='food'){
      rect(g,x-9,y-20,17,23,'#6b6d4f');rect(g,x-11,y-22,21,4,'#d4c08a');rect(g,x-7,y-17,13,15,'#dfd2a4');rect(g,x-5,y-14,5,4,'#6b9166');rect(g,x,y-8,4,3,'#b57e4c');rect(g,x-4,y-4,8,1,'#6b9166');
    }else if(type==='chest'){
      rect(g,x-10,y-10,21,13,'#4a5138');rect(g,x-9,y-10,19,11,'#a87b43');rect(g,x-9,y-13,19,5,done?'#5a4934':'#c39751');rect(g,x-7,y-12,3,14,'#d9c17b');rect(g,x+5,y-12,3,14,'#d9c17b');rect(g,x-9,y-6,19,2,'#624c31');rect(g,x-2,y-7,5,5,'#e5cd78');
      if(done){rect(g,x-8,y-10,17,4,'#3e432d');rect(g,x-8,y-18,17,5,'#bb9858');}
    }
  }
  function add(type,x,y,extra={}){objects.push({type,x,y,...extra});if(['tree','rock','bush','building'].includes(type)){blocked.add(`${Math.floor(x/T)},${Math.floor(y/T)}`);}}
  function build(){
    rect(c,0,0,W,H,'#61988b');
    for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2){
      if(isWater(x,y))continue;
      const edge=x<24||y<19||y>268||x>440||Math.abs(x-riverX(y))<23;
      rect(c,x,y,2,2,edge?'#d4c28b':['#829b56','#839e57','#7b9751','#88a35c'][Math.floor(rand()*4)]);
      if(path(x,y))rect(c,x,y,2,2,['#c7b982','#cabc86','#cdbf87','#c4b67d'][Math.floor(rand()*4)]);
      else if(!edge&&rand()<.035){rect(c,x,y,1,2,'#617f46');rect(c,x+1,y+1,2,1,'#a0b369');}
      if(edge&&rand()<.035)rect(c,x,y,2,1,'#b2ad72');
    }
    // River banks, rocks, and wooden crossing are consistent with collision data.
    for(let y=10;y<279;y+=7){const x=riverX(y);rect(c,x-15,y,2,4,'#396f61');rect(c,x+14,y,2,3,'#b5c59a');}
    rect(c,302,165,52,28,'#4e654c');for(let y=165;y<192;y+=5){rect(c,301,y,54,4,'#aa9660');rect(c,303,y,50,1,'#cfb77b');}fence(c,301,169,6);fence(c,301,195,6);
    // East observation dock.
    for(let y=220;y<240;y+=4){rect(c,403,y,63,3,'#ac9562');rect(c,404,y,61,1,'#ccb785');}rect(c,459,216,3,26,'#685f42');rect(c,459,215,3,3,'#d9c89a');
    fence(c,65,220,8);fence(c,224,248,6);
    add('building',71,132);
    for(let yy=87;yy<140;yy+=16)for(let xx=70;xx<140;xx+=16)blocked.add(`${Math.floor(xx/16)},${Math.floor(yy/16)}`);
    const trees=[[31,43],[62,50],[94,41],[127,46],[160,44],[194,38],[231,44],[266,41],[293,45],[374,43],[407,45],[438,49],[34,84],[163,79],[34,127],[36,171],[35,213],[52,253],[84,263],[119,258],[153,265],[186,270],[234,275],[276,272],[365,274],[401,269],[440,265],[449,76],[369,90],[377,129],[445,155],[448,195],[237,145],[249,66]];
    trees.forEach(([x,y],i)=>add('tree',x,y,{kind:i%3===0?1:0}));
    [[58,75],[149,142],[164,151],[221,126],[251,140],[291,246],[371,209],[434,249],[365,62],[297,66],[75,240],[137,236]].forEach(([x,y])=>add('bush',x,y));
    [[55,196],[223,66],[296,116],[366,153],[435,103],[171,236],[284,261]].forEach(([x,y])=>add('rock',x,y));
    // Tiny field details: flowers, loose pebbles, lily pads, reeds.
    for(let i=0;i<160;i++){
      const x=Math.floor(rand()*W),y=Math.floor(rand()*H);
      if(isWater(x,y)||path(x,y)||x<25||x>438||y<20||y>264)continue;
      rect(c,x,y,1,4,'#587a42');rect(c,x-1,y-1,3,2,i%3?'#dbcf8b':'#e5e0b4');rect(c,x,y,1,1,'#a58044');
    }
    for(let y=50;y<260;y+=39){const x=riverX(y);rect(c,x+3,y,6,3,'#72955c');rect(c,x+4,y-1,3,1,'#98ad6a');}
    for(let y=17;y<275;y+=28){let x=riverX(y)-20;rect(c,x,y-6,1,9,'#6c8b4a');rect(c,x+3,y-9,1,12,'#64864a');rect(c,x+2,y-10,3,3,'#b0a16a');}
    // Signposts point toward actual stations.
    [[186,154],[286,213]].forEach(([x,y])=>{rect(c,x,y-12,2,15,'#71633e');rect(c,x-9,y-16,21,7,'#d7c18a');rect(c,x-6,y-14,12,1,'#7e8052');});
  }
  function walkable(x,y){
    if(x<24||x>442||y<30||y>264)return false;
    if(isWater(x,y)&&!(x>=300&&x<=356&&y>=169&&y<=192))return false;
    if(blocked.has(`${Math.floor(x/T)},${Math.floor(y/T)}`))return false;
    return !objects.some(o=>o.type==='tree'&&Math.abs(x-o.x)<9&&Math.abs(y-o.y)<6);
  }
  function drawWhale(g,t){const x=463+Math.sin(t*.00015)*4,y=88+Math.sin(t*.0008)*2;poly(g,[[x-7,y-3],[x-3,y-7],[x+4,y-8],[x+8,y-5],[x+8,y+5],[x+4,y+12],[x+5,y+17],[x+10,y+14],[x+9,y+20],[x+2,y+18],[x-3,y+20],[x-7,y+16],[x,y+16],[x-4,y+8]],'#426f71');rect(g,x-5,y-4,6,2,'#8cafa0');rect(g,x-5,y+1,2,2,'#d4d1a6');}
  function label(g,x,y,text,color='#f6d887'){
    g.font='bold 9px monospace';const w=g.measureText(text).width+10;rect(g,x-w/2,y-11,w,15,'#203f32e8');g.fillStyle=color;g.textAlign='center';g.fillText(text,x,y);g.textAlign='start';
  }
  function render(g,t,player,entities,state){
    g.imageSmoothingEnabled=false;g.clearRect(0,0,960,576);g.save();g.scale(2,2);g.drawImage(terrain,0,0);
    // Ripples use a stable spatial seed and move only a few pixels.
    for(let i=0;i<105;i++){const x=(i*73+17)%W,y=(i*41+21)%H;if(!isWater(x,y))continue;const shift=Math.sin(t*.001+i)*2;rect(g,x+shift,y,5+i%4,1,i%3?'#91b4a355':'#b5ccb077');}
    drawWhale(g,t);
    const list=[...objects,...entities.map(e=>({...e,type:'entity'})),{...player,type:'player'}].sort((a,b)=>a.y-b.y);
    for(const o of list){
      if(o.type==='tree')tree(g,o.x,o.y,o.kind);
      else if(o.type==='building')building(g,o.x,o.y);
      else if(o.type==='bush')bush(g,o.x,o.y);
      else if(o.type==='rock')rock(g,o.x,o.y);
      else if(o.type==='player'||o.kind==='npc'){
        shadow(g,o.x,o.y,22);const who=o.type==='player'?'bio':o.sprite;
        const img=sprites[who];let dir=o.dir||'down';const frame=o.type==='player'&&o.walking?1+Math.floor(t/190)%2:0;
        if(img?.complete&&img.naturalWidth){
          // High resolution character cells keep smooth detail independently of terrain.
          const row=who==='bio'?['down','right','left','up'].indexOf(dir):who==='mesha'?0:2;
          const sw=img.naturalWidth/4,sh=img.naturalHeight/4;
          g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
          g.drawImage(img,frame*sw,row*sh,sw,sh,o.x-24,o.y-48,48,48);g.restore();
        }
        if(o.id==='mesha'&&!state.finished){const yy=o.y-54+Math.round(Math.sin(t*.003)*2);label(g,o.x,yy,state.evidence.length===3?'!':'Mesha');}
      }else if(o.type==='entity'){
        instrument(g,o.x,o.y,o.id,t,state.finished);
        const collected=state.evidence.includes(o.id);
        if(o.id!=='chest'&&!collected){const yy=o.y-30+Math.round(Math.sin(t*.003)*2);label(g,o.x,yy,'✦');}
        if(o.id==='chest'&&state.solved&&!state.finished)label(g,o.x,o.y-23,'!');
      }
    }
    // Floating pollen and a mild vignette keep the hand-pixelled scene readable.
    for(let i=0;i<12;i++){const x=(i*43+t*.004)%W,y=65+(i*31)%190+Math.sin(t*.001+i)*4;rect(g,x,y,1,1,'#f0e8ac99');}
    g.restore();
  }
  async function load(){await Promise.all(['bio','mesha','prof'].map(who=>new Promise(resolve=>{const img=new Image();sprites[who]=img;img.onload=resolve;img.onerror=resolve;img.src=`assets/illustrated/${who==='bio'?'bio':'companions'}-atlas.png`;})));build();}
  return {load,render,walkable,riverX};
})();
