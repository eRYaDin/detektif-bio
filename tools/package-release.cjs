// Salin hanya file yang diperlukan; tidak menyertakan preview, save, atau file referensi.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dest=path.resolve(root,'../detektif-bio-github');
const files=['index.html','style.css','illustrated-characters.css','learning.css','src','assets/illustrated/bio-atlas.png','assets/illustrated/companions-atlas.png','assets/illustrated/GENERATION.md','README.md','UPLOAD-GITHUB.md','ASSETS.md','MATERI.md','MULAI-GAME.cmd','package.json','.gitignore','.nojekyll','.github','tools/check-project.cjs','tools/check-junior.cjs','tools/check-learning.cjs','tools/package-release.cjs'];
if(root===dest){console.log('Sudah berada di folder rilis.');process.exit(0);}
fs.mkdirSync(dest,{recursive:true});
for(const file of files){const target=path.join(dest,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(path.join(root,file),target,{recursive:true});}
console.log(`Folder siap GitHub: ${dest}`);
