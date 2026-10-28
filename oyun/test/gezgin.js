const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:860}});const hat=[];p.on('pageerror',e=>hat.push(e.message));
const url='http://127.0.0.1:8765/test.html';const tik=async(s,t=150)=>{const e=await p.$(s);if(e){try{await e.click({timeout:2000});}catch(x){}await p.waitForTimeout(t);}return !!e;};
await p.goto(url);
await p.evaluate(()=>{const ts=['kupe','yuzuk','kolye','bileklik','plaka','heykel'];const u=[];for(let i=0;i<8;i++)u.push({id:'u'+i,t:ts[i%6],ad:'Bileklik',tur:i%14,g:0.4,deger:2000+i*500});
 localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:2000000,gun:6,bolge:2,acik:[true,true,true,false,false],ilk:false,yuk:{makine:2,depo:6,cila:3,cirak:2,fener:3},urunler:u,dukkan:false,taslar:[{id:'t1',seed:77,bolge:1,sat:0,odenen:900,fener:[],fire:0},{id:'t2',seed:78,bolge:1,sat:0,odenen:900,fener:[],fire:0}],ist:{kazanc:3000000,acilan:3,satilan:0},gorev:0}));});
await p.goto(url);await p.waitForTimeout(1500);
// geliştirme al, görev ödülü
await tik('#alt button[data-ekran="gelistir"]');for(let i=0;i<4;i++)await tik('.gorev button:not([disabled])');for(let i=0;i<5;i++)await tik('.gel button.btn-ana:not([disabled])');
await tik('button:has-text("Ayarları aç")');await tik('button:has-text("Kaydı yedekle")');await tik('#kagit button:has-text("Kapat")');
// pazarlık
await tik('#alt button[data-ekran="pazar"]');await tik('#icerik .kart.satici');await tik('#kagit .kart');await tik('#kagit button:has-text("Pazarlık")');await tik('#kagit button:has-text("Tezgâha dön")');await tik('#kagit button:has-text("Tezgâhtan ayrıl")');
// ihale çekil
await tik('.ihaleKart');await tik('#kagit button:has-text("İçeriden")',6000);await tik('#kagit button.btn-ana:not([disabled])');await tik('#kagit button:has-text("Çekil")');await tik('#kagit button:has-text("Kapat")');
// kör kutu x4, çark
for(let i=0;i<4;i++){await tik('.hediye button:nth-child(3)');await tik('#kagit button.btn-ana');await tik('#kagit button:has-text("Tamam")');}
await tik('.hediye button:nth-child(1)');await tik('#kagit button.btn-ana');
// dükkân kirala, vitrine koy, müşteri bekle
await tik('#alt button[data-ekran="dukkan"]');await tik('button:has-text("Dükkânı kirala")');for(let i=0;i<6;i++)await tik('button:has-text("Vitrine koy"):not([disabled])');
await p.waitForTimeout(16000);await tik('button:has-text("İkna et")',6000);await tik('button:has-text("Kabul")');await tik('button:has-text("Reddet")');
await p.waitForTimeout(20000);await tik('#icerik .kart[role=button]');await tik('#kagit button:has-text("Vazgeç")');await tik('button:has-text("Geri al")');
// atölye: taşla, kes, fener, makine
await tik('#alt button[data-ekran="atolye"]');const s=await (await p.$('#sahne')).boundingBox();await p.mouse.move(s.x+s.width*0.3,s.y+s.height*0.5);await p.mouse.down();await p.mouse.move(s.x+s.width*0.7,s.y+s.height*0.5,{steps:5});await p.mouse.up();
await tik('button:has-text("Kes")');await p.mouse.move(s.x+s.width*0.5,s.y+s.height*0.1);await p.mouse.down();await p.mouse.move(s.x+s.width*0.5,s.y+s.height*0.9,{steps:6});await p.mouse.up();await p.waitForTimeout(200);
await tik('button:has-text("Fener")');await p.mouse.click(s.x+s.width*0.5,s.y+s.height*0.5);
// günler
for(let g=0;g<6;g++){await tik('#gunBtn',300);await tik('#kagit button.btn-rek',6000);await tik('#kagit button:has-text("Güne başla")');}
await tik('#alt button[data-ekran="dukkan"]');await tik('button:has-text("Teslim et"):not([disabled])');
await tik('#alt button[data-ekran="gelistir"]');await tik('button:has-text("Yeni nesil başlat")');await tik('#kagit button:has-text("Vazgeç")');
await tik('button:has-text("Ayarları aç")');await tik('#kagit button:has-text("Oyunu baştan başlat")');await tik('#kagit button:has-text("Vazgeç")');
await tik('#alt button[data-ekran="siralama"]',400);
// batma
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('yesimUstasi.v1'));d.para=10;d.taslar=[];d.urunler=[];d.vitrin=[];d.dukkan=false;localStorage.setItem('yesimUstasi.v1',JSON.stringify(d));});await p.goto(url);await p.waitForTimeout(1200);await tik('#gunBtn',300);
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
