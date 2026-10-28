const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:380,height:760},deviceScaleFactor:2});const hat=[];p.on('pageerror',e=>hat.push(e.message));
const url='http://127.0.0.1:8765/test.html';await p.goto(url);await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:50000,gun:4,acik:[true,true,false,false,false],ilk:false})));await p.goto(url);await p.waitForTimeout(1800);
await p.click('.kapaliKart');await p.waitForTimeout(400);await p.screenshot({path:'c1_tezgah.png'});
await p.click('#kagit button.btn-ana');await p.waitForTimeout(1300);await p.screenshot({path:'c2_kesim.png'});await p.waitForTimeout(1500);await p.screenshot({path:'c3_sonuc.png'});
console.log('sonuç:',await p.textContent('.kesimSonuc'));
for(let i=0;i<3;i++){const bt=await p.$('#kagit button:has-text("Bir tane daha")');if(!bt)break;await bt.click();await p.waitForTimeout(2900);console.log('sonuç:',await p.textContent('.kesimSonuc'));}
await p.click('#kagit button:has-text("Kapat")');await p.waitForTimeout(200);
await p.click('#ayarBtn');await p.waitForTimeout(300);await p.screenshot({path:'c4_ayar.png'});
console.log('para',await p.textContent('#paraYazi'),'atölye taş',await p.evaluate(()=>JSON.parse(localStorage.getItem('yesimUstasi.v1')).taslar.length));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
