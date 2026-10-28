const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.addInitScript(()=>{window.__test=1;});await p.goto('http://127.0.0.1:8765/test.html');await p.waitForTimeout(1800);
const r=await p.evaluate(()=>window.__dbg(function(){var out=[];for(var m=0;m<8;m++){S.acik=[0,1,2,3,4,5,6,7].map(function(i){return i<=m;});S.yuk.cila=0;var N=1500,tas=0,ur=0,pa=0,f=kutuFiyat();
  for(var i=0;i<N;i++){var T=tasUret((i*2654435761+m*977)>>>0,m,Math.floor(Math.random()*5));tas+=gercekDeger(T);ur+=rastgeleUrun().deger;pa+=Math.round(olcek()*lerp(0.1,1.6,Math.pow(Math.random(),2)));}
  var ev=0.5*tas/N+0.25*ur/N+0.25*pa/N;out.push(BOLGE[m].ad+': fiyat '+f+' • taş ort '+Math.round(tas/N)+' • beklenen '+Math.round(ev)+' • oran '+(ev/f).toFixed(2));}return out.join('\n');}.toString()));
console.log(r);await b.close();})();
