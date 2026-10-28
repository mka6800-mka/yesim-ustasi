const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const hat=[];p.on('pageerror',e=>hat.push(e.message));
const url='http://127.0.0.1:8765/test.html';await p.goto(url);
// eski kayıt biçimi (acik 3 eleman, ist eksik alanlı)
await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:600000,gun:9,bolge:2,acik:[true,true,true],yuk:{fener:4,su:1,taslama:4,testere:4,makine:2,depo:3,cila:3,pazarlik:2,cirak:0,vitrin:0,isik:0,tabela:0},un:500,bulunan:{3:1,9:1},surum:2,taslar:[],urunler:[],vitrin:[],dukkan:true,pazar:null,gelen:[],teklif:[],ist:{harcanan:0,kazanc:2600000,acilan:5,enIyi:null,satilan:12},sec:null,ekran:'pazar',idSay:50,ilk:false})));
await p.goto(url);await p.waitForTimeout(2000);
await p.screenshot({path:'i1_pazar.png'});
await p.click('.ihaleKart');await p.waitForTimeout(400);
// fenerle iki bak
const c=await (await p.$('#kagit canvas')).boundingBox();await p.mouse.click(c.x+c.width*0.45,c.y+c.height*0.5);await p.mouse.click(c.x+c.width*0.55,c.y+c.height*0.45);
for(let i=0;i<12;i++){const bt=await p.$('#kagit button.btn-ana:not([disabled])');if(!bt)break;await bt.click();await p.waitForTimeout(150);}
await p.screenshot({path:'i2_ihale.png',fullPage:true});
console.log((await p.$$eval('.ihaleLog div',d=>d.map(x=>x.textContent))).join(' | '));
await p.click('#kagit >> text=/Kapat|Çekil/');await p.waitForTimeout(200);if(await p.$('#perde:not([hidden])'))await p.click('#kagit >> text=Kapat');
await p.click('#alt button[data-ekran="gelistir"]');await p.waitForTimeout(300);await p.screenshot({path:'i3_gorev.png'});
for(let i=0;i<10;i++){const g=await p.$('.gorev button:not([disabled])');if(!g)break;await g.click();await p.waitForTimeout(150);}
console.log('görev:',await p.textContent('.gorev'));
await p.evaluate(()=>document.querySelector('#icerik').scrollTop=99999);await p.waitForTimeout(200);await p.screenshot({path:'i4_ustalik.png'});
await p.click('button:has-text("Yeni nesil başlat (")');await p.waitForTimeout(200);await p.click('#kagit button.btn-lake');await p.waitForTimeout(400);
console.log('üst:',await p.textContent('#gunYazi'),await p.textContent('#paraYazi'));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
