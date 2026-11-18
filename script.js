const $=id=>document.getElementById(id),sleep=ms=>new Promise(r=>setTimeout(r,ms)),R=(a,b)=>a+Math.random()*(b-a);
const NS='http://www.w3.org/2000/svg',svg=$('bq');
const el=(t,a={},p=svg)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};

// gradients
const defs=el('defs');
const grad=(id,c1,c2,c3)=>{const g=el('radialGradient',{id,cx:'45%',cy:'35%',r:'75%'},defs);[[0,c1],[.65,c2],[1,c3]].forEach(([o,c])=>el('stop',{offset:o,'stop-color':c},g))};
grad('gW','#ffffff','#fdeef3','#e8c8d6');grad('gP','#ffc2dc','#ff8fbd','#d93d82');grad('gD','#ff9cc7','#e8509a','#a3195c');
const kraft=el('linearGradient',{id:'gK',x1:0,x2:1},defs);[[0,'#ffd9e8'],[.5,'#fff'],[1,'#ffc2da']].forEach(([o,c])=>el('stop',{offset:o,'stop-color':c},kraft));

// rose builder: layered petals + spiral heart
function rose(cx,cy,r,g,delay,stroke){
  const w=el('g',{class:'rose',style:`--d:${delay}s`});
  const g2=el('g',{transform:`translate(${cx} ${cy})`},w);
  const rings=[[7,1,.0],[6,.78,.5],[5,.58,.9],[4,.4,1.4]];
  rings.forEach(([n,k,off],ri)=>{
    for(let i=0;i<n;i++){
      const a=(i/n)*360+off*40+ri*17,pr=r*k;
      el('ellipse',{cx:0,cy:-pr*.42,rx:pr*.58,ry:pr*.62,fill:`url(#${g})`,stroke,'stroke-width':.8,'stroke-opacity':.55,transform:`rotate(${a})`},g2);
    }
  });
  const c=r*.3;
  el('path',{d:`M${-c} 0C${-c} ${-c*1.3} ${c} ${-c*1.3} ${c} 0C${c} ${c} ${-c*.3} ${c} ${-c*.3} ${-c*.1}C${-c*.3} ${-c*.55} ${c*.35} ${-c*.5} ${c*.3} 0`,fill:'none',stroke,'stroke-width':1.3,'stroke-opacity':.7,'stroke-linecap':'round'},g2);
  el('circle',{cx:-r*.2,cy:-r*.3,r:r*.14,fill:'#fff',opacity:.35},g2);
  return w;
}

// build bouquet
const root=el('g',{class:'sway'});
const sv=svg;
function add(tag,a){return el(tag,a,root)}
const base=[200,420];
// wrapping paper back
add('path',{d:'M200 438L70 268Q135 215 200 245Q265 215 330 268Z',fill:'url(#gK)',opacity:.95,stroke:'#f3a6c6','stroke-width':1.5});
// stems
const R_=[ // x,y,r,grad,delay
 [200,150,48,'gW',.4],[128,190,44,'gP',.7],[272,190,44,'gW',.9],[78,258,38,'gP',1.1],[322,258,38,'gP',1.2],
 [170,232,46,'gW',1.0],[232,232,46,'gP',1.3],[120,292,40,'gW',1.5],[282,292,40,'gW',1.6],[200,300,44,'gD',1.7],[160,150,28,'gP',.5],[246,148,28,'gP',.6]
];
R_.forEach(([x,y])=>add('path',{d:`M${base[0]} ${base[1]}Q${(x+base[0])/2} ${(y+base[1])/2+20} ${x} ${y}`,stroke:'#3f9c52','stroke-width':4,fill:'none','stroke-linecap':'round'}));
// leaves
[[96,215,-50],[304,215,50],[150,120,-30],[250,118,30],[60,300,-80],[340,300,80],[200,95,0],[130,330,-60],[270,330,60]].forEach(([x,y,a],i)=>{
  const l=el('g',{class:'fill',style:`--d:${.2+i*.08}s`},root);
  el('path',{d:`M${x} ${y}Q${x+22} ${y-30} ${x} ${y-62}Q${x-22} ${y-30} ${x} ${y}Z`,fill:i%2?'#4fb363':'#3f9c52',transform:`rotate(${a} ${x} ${y})`},l);
});
// baby's breath
for(let i=0;i<22;i++){
  const a=R(-42,42)*Math.PI/180,len=R(215,285),x=200+Math.sin(a)*len,y=420-Math.cos(a)*len;
  const g=el('g',{class:'fill',style:`--d:${R(1.6,2.6)}s`},root);
  el('path',{d:`M200 420Q${(x+200)/2} ${(y+420)/2} ${x} ${y}`,stroke:'#6dbb7c','stroke-width':1.3,fill:'none'},g);
  for(let k=0;k<5;k++)el('circle',{cx:x+R(-9,9),cy:y+R(-9,9),r:R(2,3.6),fill:'#fff'},g);
}
// roses (back to front by order: sort by y asc so upper behind)
R_.slice().sort((a,b)=>a[1]-b[1]).forEach(([x,y,r,g,d])=>{const w=rose(x,y,r,g,d,g==='gW'?'#d9a9bd':'#b0225f');root.appendChild(w)});
// wrapping paper front
add('path',{d:'M200 444L84 300Q145 330 200 318Q255 330 316 300Z',fill:'url(#gK)',stroke:'#f3a6c6','stroke-width':1.5,opacity:.97});
add('path',{d:'M200 444L120 330M200 444L280 330M200 444V322',stroke:'#f3a6c6','stroke-width':1,fill:'none',opacity:.7});
// ribbon bow
const bow=el('g',{transform:'translate(200 392)'},root);
el('path',{d:'M0 0C-40-30-62 6-30 18C-16 22-6 8 0 0',fill:'#ff4d8d',stroke:'#c2185b','stroke-width':1},bow);
el('path',{d:'M0 0C40-30 62 6 30 18C16 22 6 8 0 0',fill:'#ff4d8d',stroke:'#c2185b','stroke-width':1},bow);
el('path',{d:'M-4 4L-24 48L-10 42L-4 56ZM4 4L24 48L10 42L4 56Z',fill:'#e0356f'},bow);
el('circle',{r:9,fill:'#ff7aa8',stroke:'#c2185b','stroke-width':1},bow);

// ---- background petals canvas ----
const cv=$('fx'),cx=cv.getContext('2d');let W,H;const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener('resize',rs);
const cl=['#fff','#ffd1e3','#ff9ec7','#ffeef5'],mk=()=>({x:R(0,W),y:R(-H,0),s:R(5,10),vy:R(.5,1.3),vx:R(-.3,.6),r:R(0,6),vr:R(-.03,.03),c:cl[Math.random()*4|0]});
const ps=[...Array(34)].map(()=>{const p=mk();p.y=R(0,H);return p});let boost=1;
(function lp(t){cx.clearRect(0,0,W,H);ps.forEach(p=>{p.x+=(p.vx+Math.sin(t/1100+p.r))*boost;p.y+=p.vy*boost;p.r+=p.vr;if(p.y>H+20){Object.assign(p,mk());p.y=-20}
cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.globalAlpha=.85;cx.beginPath();cx.ellipse(0,0,p.s,p.s*.6,0,0,7);cx.fill();cx.restore()});requestAnimationFrame(lp)})(0);

// ---- open + letter ----
const T="Aap meri zindagi ki sabse khoobsurat kahani ho, Disha ji. Safed gulab aapki masoomiyat jaise, aur gulabi gulab aapki muskaan jaise. Har phool mein bas aap hi nazar aati ho. Meri princess, aapke saath har din ek naya gulab khilta hai. 🌹";
let opened=false;
svg.addEventListener('click',async()=>{
  if(opened)return;opened=true;svg.classList.add('open');$('tap').classList.add('gone');boost=3.5;
  await sleep(2600);boost=1.3;$('letter').classList.add('on');await sleep(900);
  const e=$('txt');for(const ch of T){e.textContent+=ch;await sleep(32)}
  $('letter').querySelector('.sign').classList.add('on');
});
svg.classList.remove('open');
