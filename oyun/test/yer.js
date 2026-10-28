const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:380,height:820},deviceScaleFactor:2});const hat=[];p.on('pageerror',e=>hat.push(e.message+' '+e.stack.split('\n')[1]));
const url='http://127.0.0.1:8765/test.html';await p.goto(url);
await p.evaluate(()=>localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:900000,gun:4,acik:[true,true,true,false,false],ilk:false,ekran:'atolye',yuk:{makine:3,depo:6,cila:5,fener:3,taslama:3,testere:3},
 taslar:[{id:'t1',seed:5,bolge:2,sat:1,odenen:9000,fener:[],fire:0},{id:'t2',seed:185,bolge:2,sat:1,odenen:20000,fener:[],fire:0},{id:'t3',seed:238,bolge:2,sat:1,odenen:9000,fener:[],fire:0}],sec:'t1'})));
await p.goto(url);await p.waitForTimeout(1500);
for(const id of ['t1','t2','t3']){
 await p.evaluate(i=>{},id);
 const kartlar=await p.$$('#icerik .kart');// atölyedeki taşlar listesi
 await p.click('text=/Makineyle aç/');await p.waitForTimeout(700);
 await p.click('button:has-text("Ürün kes")');await p.waitForTimeout(500);
 await p.screenshot({path:'y_'+id+'_a.png'});
 // elle: taşın ortasına dokun
 const s=await (await p.$('#sahne')).boundingBox();await p.mouse.click(s.x+s.width*0.5,s.y+s.height*0.45);await p.waitForTimeout(300);console.log(id,'elle:',await p.textContent('#haber'));
 const once=await p.evaluate(()=>JSON.parse(localStorage.getItem('yesimUstasi.v1')).urunler.length);
 await p.click('button:has-text("Otomatik yerleştir")');await p.waitForTimeout(800);
 const ara=await p.evaluate(()=>JSON.parse(localStorage.getItem('yesimUstasi.v1')).urunler.length);
 console.log(id,'öneri:',await p.evaluate(()=>{var k=document.querySelector('.oneriKutu');return k?k.innerText.replace(/\n/g,' | '):'YOK';}),'• öneride kesilen:',ara-once);
 await p.screenshot({path:'y_'+id+'_b.png'});
 const hk=await p.$('button:has-text("Hepsini kes")');if(hk){await hk.click();await p.waitForTimeout(500);}console.log(id,'oto:',await p.textContent('#haber'));
 console.log(id,'ürünler:',await p.evaluate(()=>JSON.parse(localStorage.getItem('yesimUstasi.v1')).urunler.map(u=>u.ad).join(', ')));
 const sat=await p.$('button:has-text("toptancıya sat")');console.log(id,'kalan:',sat?await sat.textContent():'-');
 if(sat){await sat.click();await p.waitForTimeout(400);}
}
console.log('ürün sayısı',await p.evaluate(()=>JSON.parse(localStorage.getItem('yesimUstasi.v1')).urunler.length));
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
