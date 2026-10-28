const {chromium}=require('playwright');
const DIL=process.env.DIL||'tr';const O=__dirname+'/../../magaza/ekran/'+DIL+'/';require('fs').mkdirSync(O,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3,locale:DIL==='tr'?'tr-TR':'en-US'});const hat=[];p.on('pageerror',e=>hat.push(e.message));
const url='http://127.0.0.1:8765/test.html';
async function durum(ek){await p.goto(url);await p.evaluate(e=>{const ts=['kupe','yuzuk','kolye','bileklik','plaka','heykel'],ad=['Küpe çifti','Yüzük','Halka kolye ucu','Bileklik','Oymalı plaka','Su kabağı oyması'];const v=[];
 [[0,0],[3,1],[2,2],[4,3],[1,4],[11,5],[6,0],[0,3],[9,2]].forEach((x,i)=>v.push({id:'u'+i,t:ts[x[1]],ad:ad[x[1]],tur:x[0],g:0.45,deger:12000+i*3000}));
 const S=Object.assign({para:486250,gun:23,bolge:2,acik:[true,true,true,false,false],yuk:{fener:6,su:2,taslama:5,testere:5,makine:3,depo:5,cila:4,pazarlik:3,cirak:1,vitrin:6,isik:3,tabela:3},un:9000,bulunan:{0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1,9:1,10:1,11:1,12:1,13:1,14:1,15:1,17:1,18:1,19:1,21:1,22:1},surum:2,taslar:[],urunler:[],vitrin:v,dukkan:true,pazar:null,gelen:[],teklif:[],ist:{harcanan:0,kazanc:1200000,acilan:80,enIyi:{d:186000,tur:0,g:0.5,t:'bileklik'},satilan:60,urun:70,ihale:3},sec:null,ekran:'pazar',idSay:500,ilk:false,egitim:'bitti',elmas:240,gorev:11,olay:'turist',siparis:[{id:1,kim:0,t:'bileklik',ad:'Bileklik',tur:0,carp:2.2,son:26},{id:2,kim:5,t:'plaka',ad:'Oymalı plaka',tur:1,carp:1.9,son:25}],gunluk:{tarih:'x',seri:4},basarim:{ilk:1,tas10:1,tas50:1}},e);
 localStorage.setItem('yesimUstasi.v1',JSON.stringify(S));},ek||{});await p.goto(url);await p.waitForTimeout(2200);await p.evaluate(()=>{document.querySelector('#haber').textContent='';});}
// 1 pazar
await durum({sirOdul:{20:1,10:1,5:1,3:1,1:1}});await p.waitForTimeout(1500);await p.evaluate(d=>document.querySelector('#haber').textContent=d==='tr'?'Turist otobüsü geldi: müşteriler bugün cömert!':'A tourist bus arrived: customers are generous today!',DIL);await p.screenshot({path:O+'1_pazar.png'});
// 2 tezgâh + 3 fener
await p.click('#icerik .kart.satici');await p.waitForTimeout(500);await p.screenshot({path:O+'2_tezgah.png'});
await (await p.$$('#kagit .kart'))[0].click();await p.waitForTimeout(400);
const c=await (await p.$('#kagit canvas')).boundingBox();for(const [x,y] of [[0.35,0.45],[0.5,0.55],[0.62,0.4],[0.45,0.3]]){await p.mouse.click(c.x+c.width*x,c.y+c.height*y);await p.waitForTimeout(120);}
await p.evaluate(()=>document.querySelector('#kagit').scrollTop=0);await p.screenshot({path:O+'3_fener.png'});
// 4 atölye: imparator yeşili
await durum({taslar:[{id:'t1',seed:185,bolge:2,sat:1,odenen:9800,fener:[],fire:0}],sec:'t1',ekran:'atolye'});
const s=await (await p.$('#sahne')).boundingBox();for(let i=0;i<9;i++){const y=s.y+s.height*(0.3+0.4*i/8);await p.mouse.move(s.x+s.width*0.32,y);await p.mouse.down();await p.mouse.move(s.x+s.width*0.68,y,{steps:5});await p.mouse.up();}
await p.waitForTimeout(500);await p.evaluate(d=>document.querySelector('#haber').textContent=d==='tr'?'Büyük buluş! İmparator yeşili görünüyor…':'Big find! Imperial green is showing…',DIL);await p.screenshot({path:O+'4_atolye.png'});
// 5 ürün yerleşimi önerisi
await durum({taslar:[{id:'t1',seed:185,bolge:2,sat:1,odenen:9800,fener:[],fire:0}],sec:'t1',ekran:'atolye'});
await p.click('#icerik .satir .btn-ana');await p.waitForTimeout(700);await p.click('#icerik .btn-yesim');await p.waitForTimeout(400);await p.click('#icerik .btn-ana.btn-kucuk');await p.waitForTimeout(700);
await p.evaluate(d=>{document.querySelector('#haber').textContent=d==='tr'?'Otomatik yerleşim: kesmeden önce önizle.':'Auto-place: preview before you cut.';var k=document.querySelector('.oneriKutu');if(k)k.scrollIntoView({block:'end'});},DIL);await p.screenshot({path:O+'5_kesim.png'});
// 6 dükkân
await durum({ekran:'dukkan'});await p.waitForTimeout(9000);await p.screenshot({path:O+'6_dukkan.png'});
// 7 elmas dükkânı
await durum({sirOdul:{20:1,10:1,5:1,3:1,1:1}});await p.waitForTimeout(1200);await p.click('#elmasBtn');await p.waitForTimeout(500);await p.screenshot({path:O+'7_elmas.png'});
// 8 renk koleksiyonu
await durum({sirOdul:{20:1,10:1,5:1,3:1,1:1}});await p.click('#alt button[data-ekran="gelistir"]');await p.waitForTimeout(500);await p.evaluate(()=>{var k=document.querySelector('.koleksiyon'),h=k&&k.previousElementSibling;if(h)h.scrollIntoView({block:'start'});});await p.waitForTimeout(300);await p.screenshot({path:O+'8_koleksiyon.png'});
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
