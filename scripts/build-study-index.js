// Rebuild labels/validation metadata from the actual question banks; no dependencies.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.resolve(__dirname, '../public/studyguides');
const read = p => fs.readFileSync(path.join(base, p), 'utf8');
const stat = read('statistics/guides/statistics-review.html');
const stats = vm.runInNewContext(stat.match(/const questions=([\s\S]*?);\s*\$\('questions'\)/)[1]);
const neuro = JSON.parse(read('neuroscience/guides/neuroscience-study-guide.html').match(/<script[^>]+id="data"[^>]*>([\s\S]*?)<\/script>/)[1]);
const lit = read('english/guides/ap-literature-review.html');
const mc = JSON.parse(lit.match(/const questions=([^\n]+);/)[1]);
const shorts = JSON.parse(lit.match(/const shorts=([^\n]+);/)[1]);
const latest = read('english/guides/androids-chapters-10-12.html');
const ctx = vm.createContext({});vm.runInContext(latest.match(/<script id="review-core">([\s\S]*?)<\/script>/)[1],ctx);
const index = {
  'statistics-review':{cardIds:['0','1','2','3','4','5'],questions:stats.map((q,i)=>({id:`STAT-${String(i+1).padStart(3,'0')}`,type:q[6]?'mc':'written',prompt:q[2]+' · '+q[3],...(q[6]?{options:q[6],answer:q[7]}:{})}))},
  'neuroscience-review':{cardIds:neuro.cards.map(c=>c.id),questions:[...neuro.quiz.map(q=>({id:q.id,type:'mc',prompt:q.prompt,options:q.options,answer:q.answer})),...neuro.frq.map((q,i)=>({id:`FRQ-${String(i+1).padStart(3,'0')}`,type:'written',prompt:q.title}))]},
  'literature-review':{questions:[...mc.map((q,i)=>({id:`LIT-${String(i+1).padStart(3,'0')}`,type:'mc',prompt:q.stem,options:q.options,answer:q.key})),...shorts.map(q=>({id:q.id,type:'written',prompt:q.prompt})),{id:'essay',type:'written',prompt:'Develop a defensible claim: setting and Iran’s dialogue.'}]},
  'literature-androids-10-12':{questions:ctx.Review.questions.map(q=>({id:q.id,type:q.type==='mc'?'mc':'written',prompt:q.prompt,...(q.type==='mc'?{options:q.options,answer:q.answer}:{})}))}
};
fs.writeFileSync(path.join(base,'learning-index.json'),JSON.stringify(index,null,2)+'\n');
const catalog = JSON.parse(read('catalog.json'));
for(const item of catalog.materials) item.bytes=fs.statSync(path.join(base,'..','.'+decodeURIComponent(item.href))).size;
fs.writeFileSync(path.join(base,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Indexed ${Object.values(index).reduce((n,x)=>n+x.questions.length,0)} questions; ${catalog.materials.length} materials.`);
