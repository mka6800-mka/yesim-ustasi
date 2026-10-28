const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const hat=[];p.on('pageerror',e=>hat.push(e.message));
const url='http://127.0.0.1:8765/test.html';await p.goto(url);
await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:800000,gun:40,bolge:4,acik:[true,true,true,true,true,false,false,false],ilk:false,yuk:{cila:5},gorev:17})));
await p.goto(url);await p.waitForTimeout(1500);
await p.click('#alt button[data-ekran="siralama"]');await p.waitForTimeout(500);await p.screenshot({path:'r1.png'});
await p.click('#alt button[data-ekran="gelistir"]');await p.waitForTimeout(300);
await p.click('#alt button[data-ekran="pazar"]');await p.waitForTimeout(300);await p.click('.kapaliKart');await p.waitForTimeout(300);
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
