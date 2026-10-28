const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const hat=[];p.on('pageerror',e=>hat.push(e.message));
const url='http://127.0.0.1:8765/test.html';await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.goto(url);await p.waitForTimeout(1800);
await p.screenshot({path:'n1_pazar.png'});
await p.click('.hediye button:nth-child(1)');await p.waitForTimeout(300);await p.screenshot({path:'n2_hediye.png'});
await p.click('#kagit .btn-rek');await p.waitForTimeout(1500);await p.screenshot({path:'n3_reklam.png'});await p.waitForTimeout(4500);
console.log('hediye sonrası:',await p.textContent('#haber'));
await p.click('.hediye button:nth-child(2)');await p.waitForTimeout(300);await p.click('#kagit button.btn-ana');await p.waitForTimeout(1500);await p.screenshot({path:'n4_cark.png'});await p.waitForTimeout(2500);
console.log('çark:',await p.textContent('#haber'));if(await p.$('#perde:not([hidden])')){const k=await p.$('#kagit >> text=/Kapat|Tamam/');if(k)await k.click();}
await p.click('.hediye button:nth-child(3)');await p.waitForTimeout(300);await p.click('#kagit button.btn-ana');await p.waitForTimeout(400);await p.screenshot({path:'n5_kutu.png'});
console.log('kutu:',await p.textContent('#kagit p'));await p.click('#kagit >> text=Tamam');
// taş al, atölyede ustaya sor
const k=await p.$$('#icerik .kart');await k[k.length-1].click();await p.waitForTimeout(200);await (await p.$$('#kagit .kart'))[0].click();await p.waitForTimeout(200);await p.click('#kagit >> text=Satın al');await p.waitForTimeout(200);
await p.click('#alt button[data-ekran="atolye"]');await p.waitForTimeout(300);await p.click('text=/Ustaya sor/');await p.waitForTimeout(5600);await p.waitForTimeout(300);await p.screenshot({path:'n6_usta.png'});
// birkaç gün geç
for(let g=0;g<4;g++){await p.click('#gunBtn');await p.waitForTimeout(300);if(g<3)await p.click('#kagit >> text=Güne başla');}
await p.screenshot({path:'n7_gunsonu.png'});await p.click('#kagit >> text=Güne başla');
await p.click('#alt button[data-ekran="dukkan"]');await p.waitForTimeout(300);await p.screenshot({path:'n8_dukkan.png'});
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
