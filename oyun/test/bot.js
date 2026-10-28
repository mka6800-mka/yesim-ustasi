const {chromium}=require('playwright');
const mod=process.argv[2]||'yari';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:860}});
const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.goto('http://127.0.0.1:8765/test.html');await p.evaluate(()=>localStorage.clear());await p.goto('http://127.0.0.1:8765/test.html');await p.waitForTimeout(1500);
const gec=await p.$('#rehber .rGec');if(gec&&await gec.isVisible())await gec.click();
const para=async()=>parseInt((await p.evaluate(()=>document.querySelector('#paraYazi').firstChild.nodeValue)).replace(/[^0-9]/g,''));
const izler=[];
for(let gun=1;gun<=12;gun++){
 for(let a=0;a<3;a++){
  await p.click('#alt button[data-ekran="pazar"]');await p.waitForTimeout(80);
  const k=await p.$$('#icerik .kart.satici');if(!k.length)break;await k[(gun*3+a)%k.length].click();await p.waitForTimeout(80);const tk=await p.$$('#kagit .kart');if(!tk.length){await p.click('#kagit >> text=Tezgâhtan ayrıl');continue;}await tk[0].click();await p.waitForTimeout(80);
  const al=await p.$('#kagit >> text=Satın al');await al.click();await p.waitForTimeout(80);
  if(await p.$('#perde:not([hidden])')){await p.click('#kagit >> text=Tezgâha dön');await p.click('#kagit >> text=Tezgâhtan ayrıl');break;}
  await p.click('#alt button[data-ekran="atolye"]');await p.waitForTimeout(80);
  const s=await (await p.$('#sahne')).boundingBox();
  const sat=mod==='yari'?3:14;
  for(let i=0;i<sat;i++){const y=s.y+s.height*(0.15+0.7*i/Math.max(1,sat-1));await p.mouse.move(s.x+s.width*0.1,y);await p.mouse.down();await p.mouse.move(s.x+s.width*0.9,y,{steps:6});await p.mouse.up();await p.waitForTimeout(30);}
  const ur=await p.$('#icerik button.btn-yesim:not([disabled])');
  if(ur&&mod!=='yari'&&!(await ur.textContent()).includes('önce')){await ur.click();await p.waitForTimeout(150);const oto=await p.$('button:has-text("Otomatik yerleştir")');if(oto){await oto.click();await p.waitForTimeout(250);const hk=await p.$('button:has-text("Hepsini kes")');if(hk){await hk.click();await p.waitForTimeout(200);}}
    const kts=await p.$$("button:has-text(\"toptancıya sat\")");for(const x of kts){const v=await x.isVisible();if(!v){console.log("GÖRÜNMEZ:",await x.evaluate(e=>e.outerHTML.slice(0,200)+" | ebeveyn: "+(e.parentElement&&e.parentElement.className)+" | perde gizli: "+document.querySelector("#perde").hidden));}}const kt=kts.find(Boolean);if(kt&&await kt.isVisible())await kt.click();await p.waitForTimeout(100);
    await p.click('#alt button[data-ekran="dukkan"]');await p.waitForTimeout(100);const hk=await p.$('button:has-text("Hepsini kuyumcuya")');if(hk)await hk.click();await p.waitForTimeout(100);}
  else{const t=await p.$('text=/Toptancıya sat/');if(t)await t.click();}
  await p.waitForTimeout(80);}
 izler.push(await para());await p.click('#gunBtn');await p.waitForTimeout(100);await p.click('#kagit >> text=Güne başla');}
await p.click('#alt button[data-ekran="pazar"]');await p.waitForTimeout(200);await p.screenshot({path:'b_'+mod+'_pazar.png'});const k0=await p.$$('#icerik .kart');if(k0.length){await k0[0].click();await p.waitForTimeout(300);await p.screenshot({path:'b_'+mod+'_tezgah.png'});}
console.log(mod,'gün sonu paralar:',izler.join(' '),'hatalar',hat.length);await b.close();})();
