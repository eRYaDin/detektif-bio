// Jalankan tanpa browser, tanpa npm install. Cocok untuk CI GitHub.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const ref=m[1].split('?')[0];if(/^(?:https?:|#)/.test(ref))continue;
 assert(!ref.startsWith('/'),`Gunakan path relatif untuk GitHub Pages: ${ref}`);
 assert(fs.existsSync(path.join(root,ref)),`File hilang: ${ref}`);
}
for(const file of ['style.css','illustrated-characters.css','learning.css','responsive.css'])for(const m of read(file).matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g))assert(fs.existsSync(path.join(root,m[1])),`Aset CSS hilang: ${m[1]}`);
for(const file of fs.readdirSync(path.join(root,'src')).filter(f=>f.endsWith('.js')))cp.execFileSync(process.execPath,['--check',path.join(root,'src',file)]);
for(const name of ['bio','companions']){const png=fs.readFileSync(path.join(root,`assets/illustrated/${name}-atlas.png`));assert.equal(png.subarray(1,4).toString(),'PNG');assert(png.readUInt32BE(16)>1000);}
assert(fs.existsSync(path.join(root,'.nojekyll')));
assert(html.includes('id="learning"'));
assert.equal([...html.matchAll(/id="sound"/g)].length,1,'Satu tombol suara saja');
assert(html.slice(html.indexOf('<nav class="play-toolbar"'),html.indexOf('</nav>')).includes('id="sound"'),'Suara harus tersedia dalam toolbar game');
assert(html.indexOf('src/learning-data.js')<html.indexOf('src/learning.js'));
assert(html.indexOf('src/learning.js')<html.indexOf('src/game.js'));
console.log('PASS: syntax JS, aset runtime, urutan script, path relatif, dan .nojekyll');
