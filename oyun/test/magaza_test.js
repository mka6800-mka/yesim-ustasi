const {chromium}=require('playwright');const fs=require('fs');
const kopru=fs.readFileSync(__dirname+'/../../www/magaza.js','utf8');
const sahte=`window.__test=1;window.__np={tuket:[],onay:[],n:0,bekleyen:JSON.parse(localStorage.getItem('np_bek')||'[]'),sahip:JSON.parse(localStorage.getItem('np_sahip')||'[]'),beklet:false};
window.Capacitor={isNativePlatform:function(){return true;},Plugins:{NativePurchases:{
 configure:function(){return Promise.resolve();},
 getProducts:function(o){return Promise.resolve({products:o.productIdentifiers.map(function(id,i){return {identifier:id,priceString:'₺'+(49.99+i*50).toFixed(2)};})});},
 purchaseProduct:function(o){var N=window.__np;if(N.beklet)return Promise.reject(new Error('Purchase is pending'));N.n++;var t={productIdentifier:o.productIdentifier,purchaseToken:'tok_'+o.productIdentifier+'_'+Date.now()+'_'+N.n,purchaseState:'1',isAcknowledged:false};if(!o.isConsumable){N.sahip.push(t);localStorage.setItem('np_sahip',JSON.stringify(N.sahip));}return Promise.resolve(t);},
 consumePurchase:function(o){window.__np.tuket.push(o.purchaseToken);return Promise.resolve();},
 acknowledgePurchase:function(o){window.__np.onay.push(o.purchaseToken);return Promise.resolve();},
 getUnfinishedTransactions:function(){var L=window.__np.bekleyen;return Promise.resolve({transactions:L});},
 getPurchases:function(){return Promise.resolve({purchases:window.__np.sahip.map(function(t){return Object.assign({},t,{isAcknowledged:true});})});}
}}};`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:360,height:780},deviceScaleFactor:2});const hat=[];p.on('pageerror',e=>hat.push(e.message));
await p.addInitScript(sahte);await p.addInitScript(kopru);
const url='http://127.0.0.1:8765/test.html';await p.goto(url);
await p.evaluate(()=>{localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:50000,gun:3,acik:[true,true,false,false,false,false,false,false],ilk:false,ekran:'pazar',taslar:[]}));localStorage.removeItem('np_sahip');localStorage.setItem('np_bek',JSON.stringify([{productIdentifier:'elmas_550',purchaseToken:'tok_yarim_1',purchaseState:'1',isAcknowledged:false},{productIdentifier:'elmas_100',purchaseToken:'tok_bekleyen_2',purchaseState:'2'}]));});
await p.goto(url);await p.waitForTimeout(2200);
const S=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('yesimUstasi.v1')));
let s=await S();console.log('1) açılış: elmas',s.elmas,'(15+550 yarım kalan = 565 beklenir) tüketilen:',JSON.stringify(await p.evaluate(()=>window.__np.tuket)));
await p.goto(url);await p.waitForTimeout(1800);s=await S();console.log('2) yeniden açılış (çift verme yok): elmas',s.elmas);
await p.evaluate(()=>localStorage.setItem('np_bek','[]'));
await p.screenshot({path:'m_ust.png'});
await p.click('#elmasBtn');await p.waitForTimeout(400);await p.screenshot({path:'m_tas.png'});
await p.click('.sekmeler button:has-text("Elmas al")');await p.waitForTimeout(300);await p.screenshot({path:'m_al.png',fullPage:false});
console.log('3) fiyatlar:',await p.evaluate(()=>[...document.querySelectorAll('.elmasKart button')].map(b=>b.textContent).join(' | ')));
await p.click('.elmasKart:has-text("Bir avuç elmas") button');await p.waitForTimeout(600);s=await S();console.log('4) 100 elmas aldı: elmas',s.elmas,'tüketilen',(await p.evaluate(()=>window.__np.tuket.length)));
await p.click('.elmasKart:has-text("Reklamsız paket") button');await p.waitForTimeout(600);s=await S();console.log('5) reklamsız:',JSON.stringify(s.satin),'onaylanan',(await p.evaluate(()=>window.__np.onay.length)));
const e0=(await S()).elmas;await p.click('.elmasKart:has-text("Reklam izle") button');await p.waitForTimeout(700);console.log('6) reklamsız reklam ödülü (bekleme ekranı yok):',(await S()).elmas-e0,'görünür reklam ekranı:',await p.evaluate(()=>!document.querySelector('#reklam').hidden));
await p.click('.sekmeler button:has-text("Elmas al")').catch(()=>{});await p.waitForTimeout(200);
await p.click('.elmasKart:has-text("Haftalık premium") button');await p.waitForTimeout(600);s=await S();console.log('7) premium bitiş gün:',((s.prem.bitis-Date.now())/864e5).toFixed(2),'elmas',s.elmas);
await p.evaluate(()=>{window.__np.beklet=true;});await p.click('.elmasKart:has-text("Elmas kesesi") button');await p.waitForTimeout(500);console.log('8) bekleyen ödeme:',await p.textContent('#haber'));await p.evaluate(()=>{window.__np.beklet=false;});
// değerli taş
await p.click('.sekmeler button:has-text("Taşlar")');await p.waitForTimeout(300);
await p.click('.olasLink >> nth=2');await p.waitForTimeout(300);
console.log('9) nadir damar olasılıkları:',await p.evaluate(()=>[...document.querySelectorAll('.olasilik div')].map(d=>d.innerText.replace('\n',' ')).join(', ')));
await p.screenshot({path:'m_olas.png'});
await p.click('#kagit button:has-text("Geri")');await p.waitForTimeout(200);
await p.click('.elmasKart:has-text("Premium: bugünkü bedava taş") button');await p.waitForTimeout(400);
await p.click('.elmasKart:has-text("Nadir damar") button');await p.waitForTimeout(400);
await p.click('.elmasKart:has-text("Tam yeşim") button');await p.waitForTimeout(400);s=await S();
console.log('10) atölye taşları:',JSON.stringify(s.taslar.map(t=>({d:t.degerli,el:t.elmas}))),'elmas',s.elmas);
const kontrol=await p.evaluate(()=>window.__dbg(function(){return S.taslar.map(function(t){var T=tasUret(t.seed,t.bolge,t.sat);return TUR[T.tur].ad+'/'+TUR[T.tur].nadir+'/yeşim:'+T.varJ+'/tam:'+!!T.tam;});}.toString()));console.log('    içerik:',kontrol.join(' ; '));
// güçlendirici
await p.click('.sekmeler button:has-text("Güçlendirici")');await p.waitForTimeout(200);
const pz0=await p.evaluate(()=>window.__dbg('function(){return S.pazar.tezgah[0].taslar[0].seed;}'));
await p.click('.elmasKart:has-text("Taze mal") button');await p.waitForTimeout(400);
const pz1=await p.evaluate(()=>window.__dbg('function(){return S.pazar.tezgah[0].taslar[0].seed;}'));console.log('11) taze mal: pazar değişti',pz0!==pz1);
await p.click('.elmasKart:has-text("Bedava makine") button');await p.waitForTimeout(300);
await p.click('.sekmeler button:has-text("Kalıcı")');await p.waitForTimeout(200);
await p.click('.elmasKart:has-text("Geniş atölye") button');await p.waitForTimeout(300);s=await S();
console.log('12) kalıcı:',JSON.stringify(s.kalici),'güç:',JSON.stringify(s.guc),'depoMax:',await p.evaluate(()=>window.__dbg('function(){return depoMax();}')),'fenerHak:',await p.evaluate(()=>window.__dbg('function(){return fenerHak();}')));
await p.click('#kagit button:has-text("Kapat")');await p.waitForTimeout(300);await p.screenshot({path:'m_pazar.png'});
// premium günlük
const e1=(await S()).elmas;const pb=await p.$('.premSerit button');if(pb){await pb.click();await p.waitForTimeout(300);}console.log('13) premium günlük:',(await S()).elmas-e1);
// makine bedava
await p.click('#alt button[data-ekran="atolye"]');await p.waitForTimeout(500);const mb=await p.$('text=/Makineyle aç — bedava/');console.log('14) bedava makine düğmesi:',!!mb);if(mb){await mb.click();await p.waitForTimeout(400);console.log('    kalan:',(await S()).guc.makine);}
// sıfırla
await p.evaluate(()=>window.__dbg('function(){sifirlaSor();}'));await p.click('#kagit button:has-text("Baştan başlat")');await p.waitForTimeout(400);s=await S();console.log('15) sıfırlama sonrası elmas',s.elmas,'satın',JSON.stringify(s.satin),'para',s.para);
// geri yükleme (yeniden kurulum)
await p.evaluate(()=>{localStorage.setItem('yesimUstasi.v1',JSON.stringify({para:2500,gun:1,acik:[true,false,false,false,false,false,false,false],ilk:false,taslar:[]}));});await p.goto(url);await p.waitForTimeout(2000);s=await S();console.log('16) yeniden kurulum sonrası otomatik geri yükleme: satin',JSON.stringify(s.satin),'elmas',s.elmas);
console.log('HATALAR',JSON.stringify(hat));await b.close();})();
