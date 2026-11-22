// Level 8 model: vehicles, geometry blocking, queue, simulator, solver.
const CAP = { L: 40, M: 24, S: 16 };
const COLS = {
  Y: { name: 'Yellow', hex: '#f5c518' }, R: { name: 'Red', hex: '#e0262e' },
  G: { name: 'Green', hex: '#2fb52f' }, C: { name: 'Cyan', hex: '#2ad4e0' },
  N: { name: 'Brown', hex: '#6b3a1e' }, B: { name: 'Blue', hex: '#1f6fe0' },
  P: { name: 'Purple', hex: '#8a35d0' }, M: { name: 'Magenta', hex: '#e0309a' },
  O: { name: 'Orange', hex: '#f07a12' }, LP: { name: 'Light pink', hex: '#f2a7bd' },
};
// id, colour, size, bbox [x0,y0,x1,y1] in board-image px, axis, direction
const V = [
  ['Y1','Y','L',[35,28,100,195],'v','u'], ['Y2','Y','M',[112,28,178,155],'v','u'],
  ['R1','R','S',[105,180,175,285],'v','u'], ['Y3','Y','M',[30,208,97,340],'v','u'],
  ['R2','R','L',[205,22,382,100],'h','l'], ['G1','G','M',[400,25,525,100],'h','l'],
  ['G2','G','L',[555,22,733,100],'h','l'], ['C1','C','M',[755,22,882,98],'h','l'],
  ['N1','N','L',[893,20,1072,98],'h','l'], ['N2','N','S',[725,105,842,175],'h','l'],
  ['R3','R','S',[928,210,1000,318],'v','u'], ['C2','C','L',[1018,133,1085,300],'v','u'],
  ['G3','G','M',[1018,315,1088,447],'v','u'], ['R4','R','L',[1020,458,1092,637],'v','u'],
  ['Y4','Y','M',[1022,640,1092,775],'v','u'], ['B1','B','L',[1025,788,1098,975],'v','u'],
  ['Y6','Y','M',[38,448,105,582],'v','u'], ['LP2','LP','M',[22,598,95,732],'v','u'],
  ['B2','B','M',[25,762,98,900],'v','u'],
  ['LP1','LP','M',[40,908,180,990],'h','r'], ['P2','P','M',[185,905,322,988],'h','r'],
  ['G4','G','S',[338,908,460,990],'h','r'], ['G5','G','M',[470,905,608,990],'h','r'],
  ['G6','G','S',[740,908,865,992],'h','r'], ['Y5','Y','M',[878,903,1015,985],'h','r'],
  ['Y7','Y','S',[190,115,310,250],'/','ur'], ['O1','O','L',[195,165,360,330],'/','dl'],
  ['M1','M','L',[343,113,502,268],'\\','ul'], ['G7','G','M',[478,112,602,240],'\\','dr'],
  ['LP3','LP','L',[607,110,772,265],'\\','ul'], ['P3','P','M',[343,225,472,355],'\\','ul'],
  ['G8','G','L',[470,232,642,392],'\\','ul'], ['Y8','Y','M',[573,208,703,332],'\\','dr'],
  ['R5','R','L',[663,238,826,392],'/','ur'], ['B3','B','L',[803,265,972,437],'\\','dr'],
  ['M2','M','L',[133,290,297,452],'\\','ul'], ['B4','B','M',[278,283,407,420],'\\','dr'],
  ['N3','N','M',[443,318,577,452],'\\','ul'], ['P4','P','L',[62,348,227,508],'\\','ul'],
  ['Y9','Y','M',[378,373,508,508],'\\','dr'], ['G9','G','L',[522,358,692,508],'/','dl'],
  ['B5','B','M',[738,338,868,473],'\\','dr'], ['C3','C','L',[683,413,848,578],'\\','ul'],
  ['LP4','LP','M',[838,423,972,562],'\\','dr'], ['LP5','LP','L',[273,418,440,582],'\\','ul'],
  ['B6','B','L',[198,478,367,642],'\\','ul'], ['O2','O','L',[378,478,548,662],'/','dl'],
  ['B7','B','M',[623,468,762,602],'\\','ul'], ['O3','O','M',[558,528,692,668],'\\','dr'],
  ['P5','P','M',[728,568,868,702],'\\','ul'], ['LP6','LP','L',[823,538,1002,697],'\\','ul'],
  ['R6','R','L',[113,518,282,688],'\\','ul'], ['Y10','Y','M',[273,622,407,752],'/','dl'],
  ['C4','C','L',[463,593,637,762],'\\','ul'], ['Y11','Y','M',[673,643,807,782],'\\','dr'],
  ['R7','R','L',[768,663,942,842],'/','dl'], ['C5','C','S',[115,680,245,803],'/','dl'],
  ['G10','G','L',[130,727,302,902],'/','dl'], ['N4','N','M',[240,765,378,905],'/','ur'],
  ['R8','R','L',[413,663,587,842],'\\','dr'], ['P6','P','L',[363,733,542,908],'\\','dr'],
  ['M3','M','L',[608,728,787,893],'\\','ul'], ['M4','M','L',[553,783,732,968],'\\','dr'],
  ['O4','O','L',[828,728,1002,897],'/','ur'], ['P1','P','L',[805,112,960,250],'/','ur'],
].map(([id, col, size, bb, axis, dir]) => ({ id, col, size, cap: CAP[size], bb, axis, dir }));

const DIRV = { u:[0,-1], d:[0,1], l:[-1,0], r:[1,0], ul:[-1,-1], ur:[1,-1], dl:[-1,1], dr:[1,1] };
function rectOf(v, wScale) {
  const [x0,y0,x1,y1] = v.bb, cx=(x0+x1)/2, cy=(y0+y1)/2;
  let L, W, ax;
  if (v.axis === 'v') { L = y1-y0; W = x1-x0; ax=[0,1]; }
  else if (v.axis === 'h') { L = x1-x0; W = y1-y0; ax=[1,0]; }
  else { W = v.size==='S' ? 56 : 62; L = ((x1-x0)+(y1-y0))/2*Math.SQRT2 - W;
         ax = v.axis==='\\' ? [Math.SQRT1_2,Math.SQRT1_2] : [Math.SQRT1_2,-Math.SQRT1_2]; }
  return { cx, cy, L, W: W*wScale, ax };
}
function corners(cx, cy, ax, halfL0, halfL1, halfW) { // along axis from -halfL0 .. +halfL1
  const px=[-ax[1],ax[0]];
  return [[-halfL0,-halfW],[halfL1,-halfW],[halfL1,halfW],[-halfL0,halfW]]
    .map(([a,b])=>[cx+ax[0]*a+px[0]*b, cy+ax[1]*a+px[1]*b]);
}
function bodyPoly(v){ const r=rectOf(v,0.92); return corners(r.cx,r.cy,r.ax,r.L/2,r.L/2,r.W/2); }
function pathPoly(v){
  const r=rectOf(v,0.80); let d=DIRV[v.dir]; const n=Math.hypot(d[0],d[1]); d=[d[0]/n,d[1]/n];
  // path starts just ahead of the body centre and runs 2000px in the travel direction
  return corners(r.cx+d[0]*(r.L/2-2), r.cy+d[1]*(r.L/2-2), d, 0, 2000, r.W/2);
}
function overlap(A,B){
  for (const P of [A,B]) for (let i=0;i<P.length;i++){
    const p=P[i], q=P[(i+1)%P.length], nx=q[1]-p[1], ny=p[0]-q[0];
    let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;
    for(const s of A){const t=s[0]*nx+s[1]*ny; a0=Math.min(a0,t); a1=Math.max(a1,t);}
    for(const s of B){const t=s[0]*nx+s[1]*ny; b0=Math.min(b0,t); b1=Math.max(b1,t);}
    if (a1<=b0 || b1<=a0) return false;
  }
  return true;
}
function computeBlockers(){
  const bodies = Object.fromEntries(V.map(v=>[v.id, bodyPoly(v)]));
  const out={};
  for (const v of V){ const p=pathPoly(v);
    out[v.id]=V.filter(o=>o.id!==v.id && overlap(p,bodies[o.id])).map(o=>o.id); }
  return out;
}

// ---- people ----
// Middle (spinning ring) at the start, and the left lane front -> back. Counts are people (4 per line).
const DEFAULT_POOL = { Y:52, C:36, R:88, G:40 };
const DEFAULT_LEFT = [
  ['R',4],['G',24],['LP',40],['Y',24],['G',16],['P',16],['B',24],['G',24],['LP',24],['N',16],
  ['C',20],['Y',20],['P',20],['B',20],['C',24],['Y',20],['M',20],['LP',20],['Y',24],['R',24],
  ['C',20],['G',20],['O',20],['R',16],['Y',32],['G',24],
];
const RIGHT_FRONT = ['Y','B','R']; // seen at the front of the right lane

function totals(){ const t={}; for(const v of V) t[v.col]=(t[v.col]||0)+v.cap; return t; }
function buildRight(pool,left){
  const need=totals(), have={};
  for(const [c,n] of Object.entries(pool)) have[c]=(have[c]||0)+n;
  for(const [c,n] of left) have[c]=(have[c]||0)+n;
  const rem={}; for(const c of Object.keys(COLS)) rem[c]=(need[c]||0)-(have[c]||0);
  const order=[...RIGHT_FRONT, ...Object.keys(COLS).filter(c=>!RIGHT_FRONT.includes(c))];
  return { rem, right: order.filter(c=>rem[c]>0).map(c=>[c,rem[c]]) };
}

// ---- simulator ----
const BAYS = 4; // the middle holds exactly what it starts with (the total entered for the start)
function newState(pool,left,right){
  const cap=Object.values(pool).reduce((a,b)=>a+(+b||0),0);
  return { gone:new Set(), parked:[], pool:{...pool}, cap, q:[...left.map(g=>[...g]), ...right.map(g=>[...g])],
           leftLen:left.length, log:[] };
}
function clone(s){ return { gone:new Set(s.gone), parked:s.parked.map(p=>({...p})), pool:{...s.pool}, cap:s.cap,
  q:s.q.map(g=>[...g]), leftLen:s.leftLen, log:[...s.log] }; }
function poolTotal(s){ return Object.values(s.pool).reduce((a,b)=>a+b,0); }
function settle(s){
  let changed=true;
  while(changed){ changed=false;
    for(const p of s.parked){ const a=Math.min(p.need, s.pool[p.col]||0);
      if(a>0){ p.need-=a; s.pool[p.col]-=a; changed=true; } }
    const before=s.parked.length; s.parked=s.parked.filter(p=>p.need>0); if(s.parked.length!==before) changed=true;
    let room=s.cap-poolTotal(s);
    while(room>0 && s.q.length){ const g=s.q[0], t=Math.min(room,g[1]);
      s.pool[g[0]]=(s.pool[g[0]]||0)+t; g[1]-=t; room-=t; changed=true;
      if(g[1]===0){ s.q.shift(); if(s.leftLen>0) s.leftLen--; } }
  }
}
function isFree(s,id,BL){ return !s.gone.has(id) && BL[id].every(b=>s.gone.has(b)); }
function status(s){
  if(s.gone.size===V.length && s.parked.length===0) return 'WIN';
  if(s.parked.length>=BAYS && s.parked.every(p=>!(s.pool[p.col]>0))) return 'DEAD';
  return 'OK';
}
function tap(s,id,BL){
  const v=V.find(x=>x.id===id);
  if(!v) return 'unknown';
  if(s.gone.has(id)) return 'already gone';
  if(!isFree(s,id,BL)) return 'blocked by '+BL[id].filter(b=>!s.gone.has(b)).join(', ');
  if(s.parked.length>=BAYS) return 'no free space';
  s.gone.add(id); s.parked.push({id, col:v.col, need:v.cap}); settle(s);
  s.log.push(id); return null;
}
function runScenario(moves,pool,left,right,BL){
  const s=newState(pool,left,right); settle(s); const steps=[{move:null, s:clone(s)}];
  for(const m of moves){ const err=tap(s,m,BL);
    if(err){ steps.push({move:m, err, s:clone(s)}); return {steps, end:'STOPPED: '+m+' '+err}; }
    steps.push({move:m, s:clone(s)});
    const st=status(s); if(st!=='OK') return {steps, end:st}; }
  return {steps, end: status(s)==='OK' ? 'Moves ran out (still alive)' : status(s)};
}
// Solver: DFS, only taps that will fill at once unless nothing else; limited nodes.
function solve(pool,left,right,BL,limit=200000,prefix=[]){
  const start=newState(pool,left,right); settle(start);
  for(const m of prefix){ if(tap(start,m,BL)) break; if(status(start)!=='OK') return {win:status(start)==='WIN', moves:start.log, nodes:0}; }
  let nodes=0, best=null; const seen=new Set();
  function key(s){ return [...s.gone].sort().join(',')+'|'+s.parked.map(p=>p.id+p.need).join(','); }
  function dfs(s){
    if(++nodes>limit) return null;
    const st=status(s); if(st==='WIN') return s; if(st==='DEAD') { if(!best||s.gone.size>best.gone.size) best=s; return null; }
    const k=key(s); if(seen.has(k)) return null; seen.add(k);
    if(s.parked.length>=BAYS) { if(!best||s.gone.size>best.gone.size) best=s; return null; }
    const free=V.filter(v=>isFree(s,v.id,BL));
    const scored=free.map(v=>{ const have=s.pool[v.col]||0; const waiting=s.parked.some(p=>p.col===v.col);
      const unlock=V.filter(o=>!s.gone.has(o.id)&&BL[o.id].includes(v.id)).length;
      return {v, sc:(have>=v.cap?100:have*2)+(waiting?-60:0)+unlock*5}; }).sort((a,b)=>b.sc-a.sc);
    for(const {v} of scored){ const n=clone(s); tap(n,v.id,BL); const r=dfs(n); if(r) return r; }
    if(!best||s.gone.size>best.gone.size) best=s; return null;
  }
  const win=dfs(start);
  return { win: !!win, moves:(win||best).log, nodes };
}
if (typeof module!=='undefined') module.exports={V,COLS,CAP,computeBlockers,DEFAULT_POOL,DEFAULT_LEFT,buildRight,totals,runScenario,solve,newState,settle,tap,status,isFree,clone};
