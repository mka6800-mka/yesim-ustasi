const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:700}});const hat=[];p.on('pageerror',e=>hat.push(e.message));await p.addInitScript(()=>{window.__test=1;});
await p.goto('http://127.0.0.1:8765/test.html');await p.waitForTimeout(2500);
await p.evaluate(()=>window.__dbg(function(){var c=document.createElement('canvas');c.width=900;c.height=700;c.style='position:fixed;left:0;top:0;z-index:99999;background:#2a1d17';document.body.appendChild(c);var x=c.getContext('2d');
 var L=['kupe','yuzuk','kolye','bileklik','ejderha','lotus','gemi','tac','tavus','kirin','boncukkolye','kurbaga'],T=[0,10,7,2,1,19,12,3];
 T.forEach(function(tu,j){L.forEach(function(t,i){var g=urunGorsel(t,tu,0.5,false,0);if(g){var s=70/Math.max(g.width,g.height);x.drawImage(g,i*74+4,j*86+4,g.width*s,g.height*s);}});});}.toString()));
await p.screenshot({path:'../urun_renk.png'});console.log(JSON.stringify(hat));await b.close();})();
