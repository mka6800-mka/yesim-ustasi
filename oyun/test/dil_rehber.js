const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const d of ['en','es','pt','de','fr','ru','id']){const p=await b.newPage({viewport:{width:360,height:780}});await p.addInitScript(()=>{window.__test=1;});
 await p.goto('http://127.0.0.1:8765/test.html');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:2500,gun:1,ayar:{dil:d},egitim:0,dukkan:true,yuk:{eleman:1},vitrin:[{id:'a',t:'kupe',ad:'Küpe çifti',tur:2,g:.5,deger:900}],sonZ:Date.now()-2*3600e3,taslar:[]}));},d);
 await p.goto('http://127.0.0.1:8765/test.html');await p.waitForTimeout(1600);const kalan=new Set();
 const bak=async()=>{(await p.evaluate(()=>document.body.innerText)).split('\n').forEach(l=>{if(/(ş|ğ|ı[a-z]|İ|Ş|Ğ)/.test(l)&&!/Türkçe|Yeşim Ustası/.test(l))kalan.add(l.slice(0,90));});};
 await bak();await p.evaluate(()=>window.__dbg('function(){perdeKapat();}'));
 for(const st of [1,2,3,4,5,7,8,9]){await p.evaluate(st=>window.__dbg('function(){S.egitim='+st+';rehberSonYazi="";rehberCiz();}'),st);await p.waitForTimeout(80);await bak();}
 await p.evaluate(()=>window.__dbg('function(){var L=GUNLUK.map(function(g){return {k:g.k,n:g.para?5000:2,base:0,al:false};});S.gg={tarih:bugun(),L:L,bonus:false};S.egitim="bitti";goster("pazar");}'));await p.waitForTimeout(300);await bak();
 if(d==='de')await p.screenshot({path:'dr_de.png',fullPage:false});
 console.log(d,JSON.stringify([...kalan]));await p.close();}
await b.close();})();
