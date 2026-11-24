/* ตัววาดกระทง SVG — คัดลอกจาก app/index.html (ให้หน้าจอแสดงผลวาดกระทงหน้าตาเดียวกับเว็บลอยกระทง) */
const FLOWERS = {
  lotus:{scale:.95}, rose:{scale:.95}, marigold:{scale:1.0}, jasmine:{scale:1.18}, orchid:{scale:.95},
};
const CANDLES = {
  gold:{color:'#ffd166'}, coral:{color:'#ff8b6a'}, pink:{color:'#ff9ecb'},
  blue:{color:'#7cc6ee'}, lavender:{color:'#b79ced'}, mint:{color:'#8fe3c0'},
};
const BASES = { tong:{}, stem:{}, bread:{} };

let uid = 0;
function flowerSVG(type,x,y,s){
  let g = '';
  if(type==='lotus'){
    g += [-52,0,52].map(a=>`<path d="M0,4 C-9,-3 -8,-18 0,-25 C8,-18 9,-3 0,4" fill="#f9a8c9" transform="rotate(${a})"/>`).join('');
    g += [-26,26].map(a=>`<path d="M0,3 C-7,-2 -6,-14 0,-19 C6,-14 7,-2 0,3" fill="#ef6fa1" transform="rotate(${a})"/>`).join('');
    g += `<circle r="4.2" fill="#ffd166"/>`;
  } else if(type==='rose'){
    g = `<circle r="15" fill="#c2303f"/><circle r="10.5" fill="#e04a5a"/><circle r="6.5" fill="#f2848f"/><circle r="3" fill="#c2303f"/>
    <path d="M-9,-5 A10,10 0 0 1 7,-8" stroke="#f5a3ab" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M-6,7 A8,8 0 0 0 8,4" stroke="#e04a5a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  } else if(type==='marigold'){
    let dots='';
    for(let i=0;i<7;i++){
      const a=i*(360/7)*Math.PI/180;
      dots+=`<circle cx="${(Math.cos(a)*7.5).toFixed(1)}" cy="${(Math.sin(a)*7.5).toFixed(1)}" r="5" fill="#f9a03f" stroke="#d97b16" stroke-width="1"/>`;
    }
    g = dots+`<circle r="3.6" fill="#ffd166"/>`;
  } else if(type==='jasmine'){
    let p='';
    for(let i=0;i<5;i++) p+=`<ellipse cy="-5" rx="3.4" ry="7.2" fill="#fbfbf4" stroke="#e3decb" stroke-width=".8" transform="rotate(${i*72})"/>`;
    g = p+`<circle r="2.4" fill="#ffd166"/>`;
  } else {
    let p='';
    for(let i=0;i<5;i++) p+=`<ellipse cy="-5.5" rx="4.6" ry="8.6" fill="#c9a0e8" stroke="#9d72c7" stroke-width="1" transform="rotate(${i*72})"/>`;
    g = p+`<ellipse rx="3.2" ry="4.6" fill="#fff6e8"/><circle r="1.8" fill="#ffd166"/>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}

function krathongSVG(o){
  const u = ++uid;
  const c = (CANDLES[o.candle]||CANDLES.gold).color;
  const ay = o.base==='tong' ? 122 : o.base==='stem' ? 112 : 110;

  const defs = `<defs>
    <radialGradient id="glow${u}"><stop offset="0%" stop-color="#fff6d8" stop-opacity=".95"/><stop offset="45%" stop-color="#ffd166" stop-opacity=".32"/><stop offset="100%" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
    <linearGradient id="bowl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3f9760"/><stop offset="100%" stop-color="#256642"/></linearGradient>
    <linearGradient id="pA${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4fae71"/><stop offset="100%" stop-color="#2f7f52"/></linearGradient>
    <linearGradient id="pB${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#67c588"/><stop offset="100%" stop-color="#3f9760"/></linearGradient>
    <linearGradient id="brd${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eccf96"/><stop offset="100%" stop-color="#cfa463"/></linearGradient>
    <linearGradient id="stm${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecdcb8"/><stop offset="100%" stop-color="#c2a97e"/></linearGradient>
  </defs>`;

  let base = '';
  if(o.base==='tong'){
    const fan=(angles,cy,rx,ry,f1,f2)=>angles.map((a,i)=>`<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${i%2?f2:f1}" transform="rotate(${a} 100 134)"/>`).join('');
    base += `<path d="M44,134 C44,168 156,168 156,134 Z" fill="url(#bowl${u})"/>`;
    base += fan([-78,-47,-16,16,47,78],104,14,33,`url(#pA${u})`,`url(#pB${u})`);
    base += fan([-52,-18,18,52],110,11.5,26,`url(#pB${u})`,`url(#pA${u})`);
    base += fan([-26,0,26],116,8.5,19,'#79cf92','#8fdda5');
    base += `<ellipse cx="100" cy="130" rx="36" ry="11" fill="#a9e2b4"/><ellipse cx="100" cy="128" rx="29" ry="8" fill="#c2eed0"/>`;
  } else if(o.base==='stem'){
    base += `<path d="M58,112 L142,112 L136,160 C118,168 82,168 64,160 Z" fill="url(#stm${u})"/>
    <ellipse cx="100" cy="112" rx="42" ry="12.5" fill="#f1e6c8"/>
    <ellipse cx="100" cy="112" rx="42" ry="12.5" fill="none" stroke="#c2a97e" stroke-width="2"/>
    <path d="M64,136 C82,146 118,146 136,136 L134,148 C116,156 84,156 66,148 Z" fill="#3c9a63"/>
    <path d="M58,112 L142,112 L136,160 C118,168 82,168 64,160 Z" fill="none" stroke="rgba(120,96,60,.35)" stroke-width="2"/>`;
  } else {
    base += `<rect x="52" y="108" width="96" height="38" rx="12" fill="url(#brd${u})"/>
    <ellipse cx="100" cy="108" rx="48" ry="12" fill="#f3ddb0"/>
    <ellipse cx="100" cy="108" rx="48" ry="12" fill="none" stroke="#d8b678" stroke-width="2"/>
    <circle cx="70" cy="128" r="2" fill="#c9a35e"/><circle cx="96" cy="137" r="2.2" fill="#c9a35e"/><circle cx="126" cy="131" r="1.8" fill="#c9a35e"/><circle cx="112" cy="141" r="2" fill="#c9a35e"/>`;
  }

  const FS = (FLOWERS[o.flower]||FLOWERS.lotus).scale;
  const ring = [[72,ay-10,.92],[128,ay-10,.92],[86,ay-20,.78],[114,ay-20,.78],[100,ay+2,1.05]];
  let deco = ring.map(([fx,fy,rs])=>flowerSVG(o.flower,fx,fy,FS*rs)).join('');

  deco += `<g>
    <circle cx="100" cy="${ay-38}" r="19" fill="url(#glow${u})" class="glow"/>
    <rect x="92" y="${ay-26}" width="16" height="26" rx="3.5" fill="${c}"/>
    <rect x="92" y="${ay-26}" width="7" height="26" rx="3.5" fill="rgba(255,255,255,.3)"/>
    <ellipse cx="100" cy="${ay-26}" rx="8" ry="3" fill="rgba(255,255,255,.55)"/>
    <line x1="100" y1="${ay-27}" x2="100" y2="${ay-32}" stroke="#4a3826" stroke-width="2" stroke-linecap="round"/>
    <g transform="translate(100,${ay-34})"><g class="flame">
      <path d="M0,8 C8,3 7,-6 0,-17 C-7,-6 -8,3 0,8" fill="#ffb13d"/>
      <path class="core" d="M0,5 C4,2 4,-4 0,-10 C-4,-4 -4,2 0,5" fill="#fff4c8"/>
    </g></g>
  </g>`;

  if(o.incense){
    const stick=(x,r)=>`<g transform="translate(${x},${ay-8}) rotate(${r})">
      <line x1="0" y1="0" x2="0" y2="-40" stroke="#9a7754" stroke-width="2.6" stroke-linecap="round"/>
      <circle cy="-40" r="2.8" fill="#e2543f"/>
      <path class="smoke" d="M0,-43 C5,-49 -5,-55 0,-62" stroke="rgba(255,255,255,.55)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>`;
    deco += stick(82,-13)+stick(118,13);
  }

  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${base}${deco}</svg>`;
}
