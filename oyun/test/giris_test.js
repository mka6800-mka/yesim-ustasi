const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:360,height:740},deviceScaleFactor:2,locale:'tr-TR'});const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.addInitScript(()=>{window.__girisTest=1;window.__test=1;});const url='http://127.0.0.1:8765/test.html';await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.goto(url);await p.waitForTimeout(2200);
const D=f=>p.evaluate(f=>window.__dbg(f),f.toString());
await p.screenshot({path:'g1_kayit.png'});
console.log('rehber giriş açıkken görünür mü:',await p.evaluate(()=>{var r=document.querySelector('#rehber');return !!(r&&!r.hidden);}));
await p.click('#giris .btn-ana');await p.waitForTimeout(300);console.log('boş ad hatası:',await p.textContent('#giris .gHata'));
await p.fill('#giris .gAd','Usta Mehmet');await p.click('#giris .gAv >> nth=3');await p.screenshot({path:'g2_dolu.png'});await p.click('#giris .btn-ana');await p.waitForTimeout(1200);
console.log('kayıt sonrası:',JSON.stringify(await D(function(){return {profil:S.profil,egitim:S.egitim,giris:girisAcik()};})),'| haber:',await p.textContent('#haber'));
console.log('rehber:',await p.evaluate(()=>{var r=document.querySelector('#rehber');return r&&!r.hidden?r.querySelector('p').textContent:'yok';}));
await p.screenshot({path:'g3_sonra.png'});
// sıralamada ad
await p.click('#alt button[data-ekran="siralama"]');await p.waitForTimeout(400);console.log('sıralamada:',await p.evaluate(()=>{var x=document.querySelector('.siraSatir.ben .ad');return x?x.textContent:'?';}));
// geri dönen oyuncu
await p.goto(url);await p.waitForTimeout(2200);await p.screenshot({path:'g4_donus.png'});console.log('dönüş kartı:',await p.evaluate(()=>document.querySelector('#giris .gKart').innerText.replace(/\n/g,' | ')));
await p.click('#giris button:has-text("Profil")');await p.waitForTimeout(300);await p.fill('#giris .gAd','Mehmet Usta');await p.click('#giris .btn-ana');await p.waitForTimeout(800);console.log('ad değişti:',await D(function(){return S.profil.ad;}));
// ingilizce
await p.evaluate(()=>{var s=JSON.parse(localStorage.getItem('yesimUstasi.v1'));s.ayar.dil='en';localStorage.setItem('yesimUstasi.v1',JSON.stringify(s));});await p.goto(url);await p.waitForTimeout(2200);await p.screenshot({path:'g5_en.png'});
console.log('EN:',await p.evaluate(()=>document.querySelector('#giris').innerText.replace(/\n/g,' | ')));
await p.click('#giris .btn-ana');await p.waitForTimeout(600);console.log('kapandı:',await D(function(){return !girisAcik();}));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
