import re
s=open('kaynak.html',encoding='utf8').read()
s=s.replace("// ================= DURUM =================","var FG=\"'Alegreya Sans',sans-serif\",FB=\"'Alegreya SC',serif\",FM=\"'Ma Shan Zheng',serif\";\n// ================= DURUM =================",1)
for k,v in [("getComputedStyle(document.body).getPropertyValue('--f-govde')","FG"),("getComputedStyle(document.body).getPropertyValue('--f-bas')","FB"),("getComputedStyle(document.body).getPropertyValue('--f-muhur')","FM")]: s=s.replace(k,v)
# çeviri sözlükleri: ceviri/<dil>.json (isim_<dil>.json + kalip_<dil>.json birleşimi) → window.YESIM_CEVIRI
import glob,json,os
cev={}
for f in sorted(glob.glob('ceviri/*.json')):
  ad=os.path.basename(f)[:-5]; dil=ad.split('_')[-1]
  cev.setdefault(dil,{}).update(json.load(open(f,encoding='utf8')))
s=s.replace('<script>\n/*MANTIK*/','<script>window.YESIM_CEVIRI='+json.dumps(cev,ensure_ascii=False)+';</script>\n<script>\n/*MANTIK*/',1)
s=s.replace("/*MANTIK*/",open('mantik.js',encoding='utf8').read().replace("if(typeof module!=='undefined')module.exports=","if(typeof module!=='undefined'&&module.exports)module.exports="))
open('yesim_ustasi.html','w',encoding='utf8').write(s)
for i,x in enumerate(re.findall(r'<script>(.*?)</script>',s,re.S)): open(f'_s{i}.js','w').write(x)
open('test.html','w',encoding='utf8').write('<!doctype html><html><head><meta charset="utf-8"><script>if(!window.__girisTest)window.__girisAtla=1;</script><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>'+s+'</body></html>')
print(len(s)//1024,'KB')
# Android (Capacitor) için tam sayfa: ../yesim-android/www/index.html ya da (depo içinde çalışırken) ../www/index.html
import os
for hedef in ['../yesim-android/www','../www']:
  if os.path.isdir(hedef):
    open(hedef+'/index.html','w',encoding='utf8').write('<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no"><meta name="theme-color" content="#5b1411"><style>body{margin:0}[hidden]{display:none!important}</style><script src="ayar.js"></script><script src="reklam.js"></script><script src="magaza.js"></script></head><body>'+s+'</body></html>')
    print('android:',hedef+'/index.html')
    break
