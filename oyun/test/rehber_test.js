const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.5,locale:'tr-TR'});const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.addInitScript(()=>{window.__test=1;});const url='http://127.0.0.1:8765/test.html';await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.goto(url);await p.waitForTimeout(2200);
const D=f=>p.evaluate(f=>window.__dbg(f),f.toString());
let son=-1,ayni=0;
for(let i=0;i<60;i++){const adim=await D(function(){return S.egitim;});const yazi=await p.evaluate(()=>{var r=document.querySelector('#rehber');return r&&!r.hidden?r.querySelector('p').textContent:'';});
 if(adim!==son){console.log('adım',adim,'→',yazi);await p.screenshot({path:'rh_'+adim+'.png'});son=adim;ayni=0;}else ayni++;
 if(adim==='bitti'){break;}
 if(ayni>6){console.log('TAKILDI',adim,yazi);break;}
 if(adim===5){await D(function(){var st=seciliTas();tamamenAc(st);acKaydet(st);atolyePanel();});await p.waitForTimeout(500);continue;}
 if(adim===2){const c=await p.$('#kagit canvas.buyuk');const bb=await c.boundingBox();await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(500);continue;}
 if(adim===9){await p.click('#rehber .rTamam');await p.waitForTimeout(500);continue;}
 const h=await p.evaluate(()=>{var r=document.querySelector('#rehberHalka');if(!r||r.hidden)return null;var b=r.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
 if(h){await p.mouse.click(h.x,h.y);}await p.waitForTimeout(600);}
const s=await D(function(){return {elmas:S.elmas,urun:S.urunler.length,taslar:S.taslar.length,egitim:S.egitim,kazanc:S.ist.kazanc};});console.log(JSON.stringify(s));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
