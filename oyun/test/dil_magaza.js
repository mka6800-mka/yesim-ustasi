const {chromium}=require('playwright');const fs=require('fs');
const kopru=fs.readFileSync(__dirname+'/../../www/magaza.js','utf8');
const sahte=`window.__test=1;window.Capacitor={isNativePlatform:function(){return true;},Plugins:{NativePurchases:{configure:function(){return Promise.resolve();},getProducts:function(o){return Promise.resolve({products:o.productIdentifiers.map(function(id){return {identifier:id,priceString:'$0.99'};})});},getUnfinishedTransactions:function(){return Promise.resolve({transactions:[]});},getPurchases:function(){return Promise.resolve({purchases:[]});}}}};`;
(async()=>{const b=await chromium.launch();
for(const d of ['en','es','pt','de','fr','ru','id']){const p=await b.newPage({viewport:{width:360,height:780}});await p.addInitScript(sahte);await p.addInitScript(kopru);
 await p.goto('http://127.0.0.1:8765/test.html');await p.evaluate(d=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:9000,gun:3,elmas:40,acik:[true,true,false,false,false,false,false,false],ilk:false,ekran:'pazar',taslar:[],prem:{bitis:Date.now()+3*864e5},ayar:{dil:d}})),d);
 await p.goto('http://127.0.0.1:8765/test.html');await p.waitForTimeout(1500);const kalan=new Set();
 const bak=async()=>{(await p.evaluate(()=>document.body.innerText)).split('\n').forEach(l=>{if(/(ş|ğ|ı[a-z]|İ|Ş|Ğ|ü[a-z]|ç[a-z])/.test(l)&&!/Türkçe|Yeşim Ustası|Español|Português|Français/.test(l))kalan.add(l.slice(0,80));});};
 await bak();for(const s of ['tas','guc','kalici','al']){await p.evaluate(s=>window.__dbg('function(){elmasDukkan("'+s+'");}'),s);await p.waitForTimeout(250);await bak();if(d==='de'||d==='ru')await p.screenshot({path:'dm_'+d+'_'+s+'.png'});}
 await p.evaluate(()=>window.__dbg('function(){olasilikAc(DEGERLI[2],1);}'));await p.waitForTimeout(200);await bak();
 console.log(d,JSON.stringify([...kalan]));await p.close();}
await b.close();})();
