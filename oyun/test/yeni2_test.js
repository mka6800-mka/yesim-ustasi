const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.5});const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.addInitScript(()=>{window.__test=1;try{localStorage.removeItem('yesimUstasi.v1.gizlendi');}catch(e){}});const url='http://127.0.0.1:8765/test.html';await p.goto(url);
const D=f=>p.evaluate(f=>window.__dbg(f),f.toString());
// sen yokken: 3 saat önce, eleman 2, vitrin 3 ürün + depoda 5
await p.evaluate(()=>{localStorage.clear();const u=i=>({id:'u'+i,t:'kupe',ad:'Küpe çifti',tur:3,g:0.5,deger:1000+i*100});localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:5000,gun:8,ilk:false,egitim:'bitti',dukkan:true,acik:[true,true,false,false,false,false,false,false],yuk:{eleman:2,tabela:1,vitrin:1},vitrin:[u(1),u(2),u(3)],urunler:[4,5,6,7,8].map(u),sonZ:Date.now()-3*3600e3,taslar:[]}));});
await p.goto(url);await p.waitForTimeout(2200);
console.log('yokken penceresi:',await p.evaluate(()=>document.querySelector('#kagit').innerText.replace(/\n/g,' | ')));
await p.screenshot({path:'yk.png'});
let s=await D(function(){return {para:S.para,vitrin:S.vitrin.filter(Boolean).length,urunler:S.urunler.length,satilan:S.ist.satilan};});console.log(JSON.stringify(s));
await p.click('#kagit .btn-rek');await p.waitForTimeout(6500);console.log('2 kat sonrası para',await D(function(){return S.para;}));
// yeniden açınca ikinci kez vermemeli
await p.goto(url);await p.waitForTimeout(2000);console.log('tekrar açılış penceresi açık mı:',await p.evaluate(()=>!document.querySelector('#perde').hidden));
// günlük görevler
await p.click('#alt button[data-ekran="pazar"]');await p.waitForTimeout(300);
console.log('günlük:',await p.evaluate(()=>document.querySelector('.gunluk').innerText.replace(/\n/g,' | ')));
await D(function(){S.gg.L.forEach(function(q){S.ist[q.k]=(S.ist[q.k]||0)+q.n;});goster('pazar');});await p.waitForTimeout(200);
const e0=await D(function(){return S.elmas;});
for(let i=0;i<3;i++){await p.click('.gunluk .gSatir button:not([disabled])');await p.waitForTimeout(250);}
await p.click('.gunluk .btn-ana');await p.waitForTimeout(400);
console.log('günlük elmas farkı (3+2=5 beklenir):',(await D(function(){return S.elmas;}))-e0,'kör kutu açıldı:',await p.evaluate(()=>document.querySelector('#kagit').innerText.slice(0,40)));
await p.click('#kagit .satir button');await p.screenshot({path:'gg.png'});
// bozuk kayıt → yedekten dönüş
await p.evaluate(()=>{localStorage.setItem('yesimUstasi.v1','{bozuk');});await p.goto(url);await p.waitForTimeout(2500);console.log('yedekten:',await p.textContent('#haber'),'para',await D(function(){return S.para;}));
// tezgahlarda farklı satıcılar
console.log('satıcılar:',await D(function(){return S.pazar.tezgah.map(function(z){return z.sat;}).join(',');}));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
