// web (satın alma köprüsü yok) + hata yolları: çeviri toplamak için
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:380,height:820}});const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.addInitScript(()=>{window.__test=1;});const url='http://127.0.0.1:8765/test.html';await p.goto(url);
await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:500,gun:2,elmas:3,acik:[true,false,false,false,false,false,false,false],ilk:false,ekran:'pazar',taslar:[{id:'a',seed:1,bolge:0,sat:0,odenen:100,fener:[],fire:0},{id:'b',seed:2,bolge:0,sat:0,odenen:100,fener:[],fire:0},{id:'c',seed:3,bolge:0,sat:0,odenen:100,fener:[],fire:0}]})));
await p.goto(url);await p.waitForTimeout(1800);
await p.click('#elmasBtn');await p.waitForTimeout(300);
await p.evaluate(()=>window.__dbg('function(){S.elmas=500;degerliAl(DEGERLI[0],false);S.elmas=3;degerliAl(DEGERLI[1],false);elmasHarca(10);magazaAl(MAGAZA[0]);geriYukle();elmasDukkan("al");}'));await p.waitForTimeout(300);
await p.evaluate(()=>window.__dbg('function(){S.taslar=[];S.elmas=999;degerliAl(DEGERLI[0],false);degerliAl(DEGERLI[0],false);elmasDukkan("guc");}'));
for(const t of ['Usta feneri','Müşteri akını','Kuyumcu kartı','Altın kese','Hazine sandığı']){await p.click('.elmasKart:has-text("'+t+'") button');await p.waitForTimeout(150);}
await p.click('.sekmeler button:has-text("Kalıcı")');for(const t of ['Altın vitrin','Keskin göz','Seçkin müşteriler','Elmas testere']){await p.click('.elmasKart:has-text("'+t+'") button');await p.waitForTimeout(150);}
await p.click('.sekmeler button:has-text("Taşlar")');await p.click('.olasLink >> nth=0');await p.waitForTimeout(200);await p.click('#kagit button:has-text("Geri")');
await p.click('.sekmeler button:has-text("Elmas al")');await p.waitForTimeout(200);
await p.evaluate(()=>window.__dbg('function(){S.satin={reklamsiz:true};window.YesimMagaza={al:function(){return Promise.reject(new Error("x"));},geriYukle:function(){return Promise.resolve(0);}};magazaAl(MAGAZA[5]);magazaAl(MAGAZA[0]);geriYukle();elmasDukkan("al");}'));await p.waitForTimeout(400);
await p.evaluate(()=>window.__dbg('function(){window.YesimMagaza.geriYukle=function(){return Promise.reject(1);};geriYukle();}'));await p.waitForTimeout(300);
await p.evaluate(()=>window.__dbg('function(){magazaVer("baslangic_paketi","t1");elmasDukkan("al");}'));await p.waitForTimeout(600);
await p.evaluate(()=>window.__dbg('function(){perdeKapat();goster("pazar");kapaliTezgah();}'));await p.waitForTimeout(500);
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
