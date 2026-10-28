const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,locale:'tr-TR'});
const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});   // orta seviye telefon benzetimi
const url='http://127.0.0.1:8765/test.html';await p.goto(url);
await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:900000,gun:9,bolge:2,acik:[true,true,true,false,false],ilk:false,dukkan:true,yuk:{makine:3,depo:6,cila:3,fener:3,eleman:2},
 taslar:[{id:'t1',seed:5,bolge:2,sat:1,odenen:9000,fener:[],fire:0}],sec:'t1',urunler:[],vitrin:[]})));
await p.goto(url);await p.waitForTimeout(2500);
for(const ek of ['pazar','atolye','dukkan','gelistir']){await p.click('#alt button[data-ekran="'+ek+'"]');await p.waitForTimeout(800);
 const r=await p.evaluate(async()=>{let kare=0;const t0=performance.now();await new Promise(res=>{function f(){kare++;if(performance.now()-t0<3000)requestAnimationFrame(f);else res();}requestAnimationFrame(f);});return {fps:(kare/3).toFixed(1),x:0};});
 console.log(ek,JSON.stringify(r));}
await b.close();})();
