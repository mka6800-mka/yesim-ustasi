const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const hat=[];
for(const [d,loc] of [['en','en-US'],['es','es-ES'],['pt','pt-BR'],['de','de-DE'],['fr','fr-FR'],['ru','ru-RU'],['id','id-ID']]){
 const p=await b.newPage({viewport:{width:380,height:820},deviceScaleFactor:1.5,locale:loc});p.on('pageerror',e=>hat.push(d+': '+e.message));
 const url='http://127.0.0.1:8765/test.html';await p.goto(url);
 await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:400000,gun:9,acik:[true,true,true,true,true,true,false,false],ilk:false,dukkan:true,yuk:{makine:3,depo:6,cila:3,fener:3},taslar:[{id:'t1',seed:5,bolge:2,sat:1,odenen:9000,fener:[],fire:0}],sec:'t1',olay:'ay'})));
 await p.goto(url);await p.waitForTimeout(1300);await p.screenshot({path:'d_'+d+'_1.png'});
 const kalan=[];const bak=async()=>{const t=await p.evaluate(()=>document.body.innerText);t.split('\n').forEach(l=>{if(/(ş|ğ|ı[a-z]|İ|Ş|Ğ)/.test(l)&&!/Türkçe|Yeşim Ustası/.test(l))kalan.push(l.slice(0,70));});};
 await bak();await p.click('#alt button[data-ekran="atolye"]');await p.waitForTimeout(200);await p.click('#icerik button.btn-ana');await p.waitForTimeout(500);await p.click('#icerik button.btn-yesim');await p.waitForTimeout(400);
 await p.click('#icerik button.btn-ana.btn-kucuk');await p.waitForTimeout(500);await p.screenshot({path:'d_'+d+'_2.png'});await bak();
 for(const t of ['dukkan','gelistir','siralama']){await p.click('#alt button[data-ekran="'+t+'"]');await p.waitForTimeout(200);await bak();}
 await p.click('#alt button[data-ekran="pazar"]');await p.click('.kapaliKart');await p.waitForTimeout(200);await p.click('#kagit button.btn-ana');await p.waitForTimeout(3200);await p.screenshot({path:'d_'+d+'_3.png'});await bak();
 console.log(d,'Türkçe kalan:',JSON.stringify([...new Set(kalan)].slice(0,6)));await p.close();}
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
