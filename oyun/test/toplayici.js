// playwright'ı sarar: her sayfa en-US dilinde açılır, kapanırken çevrilmemiş metinler toplanır
const pw=require('playwright'),fs=require('fs');const DOSYA=__dirname+'/eksik.json';
const asil=pw.chromium.launch.bind(pw.chromium);
pw.chromium.launch=async(...a)=>{const b=await asil(...a);const sayfalar=[];const np=b.newPage.bind(b);
 b.newPage=async(o={})=>{const p=await np(Object.assign({},o,{locale:'tr-TR'}));sayfalar.push(p);await p.addInitScript(()=>{window.__cevGolge='en';});
   const topla=async()=>{try{const e=await p.evaluate(()=>window.__cevEksik||{});const v=fs.existsSync(DOSYA)?JSON.parse(fs.readFileSync(DOSYA)):{};Object.assign(v,e);fs.writeFileSync(DOSYA,JSON.stringify(v,null,1));}catch(x){}};
   const g=p.goto.bind(p);p.goto=async(...x)=>{await topla();return g(...x);};const rl=p.reload.bind(p);p.reload=async(...x)=>{await topla();return rl(...x);};p.__topla=topla;return p;};
 const kp=b.close.bind(b);b.close=async()=>{for(const p of sayfalar)await p.__topla();return kp();};return b;};
