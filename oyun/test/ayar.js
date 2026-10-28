const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.goto('http://127.0.0.1:8765/test.html');await p.waitForTimeout(1500);
await p.click('#alt button[data-ekran="gelistir"]');await p.waitForTimeout(300);await p.evaluate(()=>document.querySelector('#icerik').scrollTop=99999);await p.waitForTimeout(200);await p.screenshot({path:'a1_ayar.png'});
await p.click('#ayarBtn');await p.waitForTimeout(200);await p.click('text=Kaydı yedekle / geri yükle');await p.waitForTimeout(200);await p.click('#kagit button.btn-lake');await p.waitForTimeout(200);console.log(await p.textContent('#haber'));
await p.click('#kagit >> text=Kapat').catch(()=>{});
console.log('geri:',await p.evaluate(()=>[window.YesimGeri(),window.YesimGeri()]));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
