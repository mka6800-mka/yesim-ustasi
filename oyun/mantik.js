// ===== YEŞİM USTASI — oyun mantığı (taş üretimi, iç yapı, değer, fiyat). Tarayıcıda ve düğümde (denge simülasyonu) aynı kod. =====
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash2(x,y,s){var h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(s|0,1274126177);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
function vnoise(x,y,s){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  var a=hash2(xi,yi,s),b=hash2(xi+1,yi,s),c=hash2(xi,yi+1,s),d=hash2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y,s,o){o=o||4;var t=0,a=0.5,f=1;for(var i=0;i<o;i++){t+=a*vnoise(x*f,y*f,s+i*131);f*=2;a*=0.5;}return t/(1-Math.pow(0.5,o));}
function kis(x,a,b){return x<a?a:x>b?b:x;}
function lerp(a,b,t){return a+(b-a)*t;}

// yeşim türleri: p = cm² başına değer; c1 açık ton, c2 koyu ton
var TUR=[
  {k:'imp', ad:'İmparator yeşili', p:420, c1:[46,150,78], c2:[6,92,44], sef:0.85, nadir:'efsane'},
  {k:'mor', ad:'Kraliyet moru', p:150, c1:[184,140,220], c2:[98,52,152], sef:0.7, nadir:'çok nadir'},
  {k:'uc', ad:'Üç renk', p:200, c1:[92,170,110], c2:[24,112,62], sef:0.7, nadir:'çok nadir', coklu:[[[92,170,110],[24,112,62]],[[214,196,230],[150,118,182]],[[232,150,108],[170,64,40]]]},
  {k:'cam', ad:'Çam yeşili', p:130, c1:[92,170,110], c2:[24,112,62], sef:0.7, nadir:'nadir'},
  {k:'mavi', ad:'Mavi su', p:110, c1:[156,206,210], c2:[40,116,128], sef:0.95, nadir:'nadir'},
  {k:'buz', ad:'Buz yeşimi', p:95, c1:[228,238,234], c2:[178,208,198], sef:1.0, nadir:'nadir'},
  {k:'siyah', ad:'Siyah yeşim', p:85, c1:[64,84,70], c2:[14,22,18], sef:0.4, nadir:'nadir'},
  {k:'kizil', ad:'Kızıl yeşim', p:70, c1:[218,116,84], c2:[142,40,28], sef:0.55, nadir:'az'},
  {k:'yag', ad:'Yağ yeşili', p:58, c1:[120,146,84], c2:[54,84,40], sef:0.5, nadir:'az'},
  {k:'elma', ad:'Elma yeşili', p:48, c1:[170,206,128], c2:[96,160,74], sef:0.55, nadir:'sık'},
  {k:'lav', ad:'Lavanta', p:40, c1:[214,196,230], c2:[150,118,182], sef:0.6, nadir:'sık'},
  {k:'fei', ad:'Bal sarısı', p:26, c1:[232,186,110], c2:[176,104,46], sef:0.5, nadir:'sık'},
  {k:'kar', ad:'Kar beyazı', p:9, c1:[236,234,224], c2:[206,204,192], sef:0.35, nadir:'yaygın'},
  {k:'kur', ad:'Kurşuni', p:2.5, c1:[120,130,124], c2:[70,80,76], sef:0.2, nadir:'yaygın'}
];
// karışık renkler: iki gerçek iç dokusu (mix) leke ya da damar desenle birleştirilir
[['yeslav','Yeşil lavanta',['cam','lav'],'leke',150,'nadir'],['buzdamar','Damarlı buz',['buz','imp'],'damar',170,'çok nadir'],['karyesil','Karda yeşil',['kar','elma'],'leke',35,'sık'],
 ['mormavi','Gece moru',['mor','mavi'],'leke',160,'çok nadir'],['altinyesil','Altın yeşil',['fei','cam'],'leke',95,'nadir'],['ejderkani','Ejder kanı',['kizil','imp'],'damar',260,'efsane'],
 ['gecemavi','Gece mavisi',['mavi','siyah'],'damar',120,'nadir'],['ayisigi','Ay ışığı',['buz','lav'],'leke',130,'nadir'],['pas','Pas yeşili',['yag','kizil'],'leke',55,'az'],['dumanli','Dumanlı kar',['kar','kur'],'damar',7,'yaygın']
].forEach(function(m){var A=TUR.find(function(t){return t.k===m[2][0];}),B=TUR.find(function(t){return t.k===m[2][1];});
  var ort=function(a,b){return [0,1,2].map(function(i){return Math.round((a[i]+b[i])/2);});};
  TUR.push({k:m[0],ad:m[1],p:Math.round(m[4]*0.8),c1:ort(A.c1,B.c1),c2:ort(A.c2,B.c2),sef:+((A.sef+B.sef)/2).toFixed(2),nadir:m[5],mix:m[2],desen:m[3],coklu:[[A.c1,A.c2],[B.c1,B.c2]]});});
// çok renkli yeşimde bir noktanın paleti (n: 0..1 gürültü); damar deseni ikinci rengi ince çizgiler halinde verir
function paletSec(R,n){var L=R.coklu;if(L.length===3)return L[n<0.44?0:n<0.58?1:2];
  var t=R.desen==='damar'?1-kis((Math.abs(n-0.5)-0.02)/0.03,0,1):kis((n-0.45)/0.1,0,1);if(t<=0)return L[0];if(t>=1)return L[1];
  var k=function(a,b){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];};return [k(L[0][0],L[1][0]),k(L[0][1],L[1][1])];}
// pazar bölgeleri
var BOLGE=[
  {ad:'Sokak Pazarı', boy:[8,15], sans:0.5, pencere:0.25, w:[0.15,0.2,0.2,0.8,0.6,1.2,0.8,1.5,3,5,4,5,13,16,0.15,0.025,0.75,0.025,0.2,0.01,0.2,0.3,0.5,1.5], cm2:4.0, kilit:0},
  {ad:'Ocak Çarşısı', boy:[14,24], sans:0.58, pencere:0.3, w:[0.5,0.6,0.6,2.2,1.6,2.6,1.5,2.5,4,6,4.5,5,9,11,0.4,0.1,1,0.1,0.5,0.04,0.4,0.5,0.75,1.5], cm2:7.4, kilit:25000},
  {ad:'Müzayede Salonu', boy:[22,34], sans:0.64, pencere:0.38, w:[1.3,1.4,1.2,4,3,3.6,2.4,3,4,6,4,4,6,7,0.75,0.25,1,0.25,0.75,0.1,0.6,0.75,1,1], cm2:11.9, kilit:150000, ihale:true},
  {ad:'Hpakant Madeni', boy:[32,46], sans:0.66, pencere:0.42, w:[2.2,2,1.8,5,3.5,4,3,3,3.5,5,3.5,3,4,4,1,0.4,1,0.4,1,0.2,0.75,1,1,0.75], cm2:15.2, kilit:1500000, ihale:true},
  {ad:'Hong Kong Müzayedesi', boy:[44,62], sans:0.7, pencere:0.5, w:[3.5,3,2.6,5.5,4,4,3,3,3,4,3,2.5,3,3,1.25,0.6,0.75,0.6,1,0.35,1,1.25,0.75,0.5], cm2:19.5, kilit:12000000, ihale:true},
  {ad:'Mandalay Mücevher Fuarı', boy:[58,78], sans:0.72, pencere:0.5, w:[4.5,3.5,3,6,4.5,4,3,3,2.5,3.5,2.5,2,2,2,1.5,0.8,0.6,0.8,1,0.5,1,1.5,0.6,0.4], cm2:22, kilit:50000000, ihale:true},
  {ad:'Singapur Gala Müzayedesi', boy:[75,100], sans:0.74, pencere:0.55, w:[6,4,3.5,6,5,4,3,2.5,2,3,2,1.5,1.5,1.5,1.75,1,0.5,1,1,0.7,1,1.5,0.5,0.3], cm2:27, kilit:300000000, ihale:true},
  {ad:'İmparatorluk Hazinesi', boy:[95,130], sans:0.76, pencere:0.6, w:[8,5,4,6,5,4,3,2,1.5,2.5,1.5,1,1,1,2,1.3,0.4,1.3,1,1,1,1.5,0.4,0.25], cm2:29, kilit:2000000000, ihale:true}
];
// kabuk türleri: gec = fener ışığının geçirgenliği, sans = yeşim olasılığı çarpanı
var KABUK=[
  {ad:'İnce kumlu kabuk', renk:[196,170,124], gec:1.0, sans:1.05},
  {ad:'Sarı deri kabuk', renk:[204,158,84], gec:0.85, sans:1.0},
  {ad:'Kara yağlı kabuk', renk:[70,62,52], gec:0.45, sans:1.15},
  {ad:'Kızıl toprak kabuk', renk:[160,92,60], gec:0.7, sans:0.95},
  {ad:'Gri kalın kabuk', renk:[150,150,140], gec:0.55, sans:0.85},
  // karışık kabuklar: iki gerçek kabuk dokusu (dosya adları) birleştirilir
  {ad:'Benekli sarı-kara kabuk', renk:[137,110,68], gec:0.65, sans:1.08, mix:['kabuk_1','kabuk_2'], desen:'leke', fiy:1.05},
  {ad:'Alacalı kızıl kabuk', renk:[182,125,72], gec:0.78, sans:0.98, mix:['kabuk_3','kabuk_1'], desen:'leke', fiy:0.98},
  {ad:'Damarlı kara kabuk', renk:[110,106,96], gec:0.5, sans:1.0, mix:['kabuk_2','kabuk_4'], desen:'damar', fiy:0.98},
  {ad:'Kumlu kızıl kabuk', renk:[178,131,92], gec:0.85, sans:1.0, mix:['kabuk_0','kabuk_3'], desen:'leke', fiy:1.0},
  {ad:'Küllü gri kabuk', renk:[173,160,132], gec:0.78, sans:0.95, mix:['kabuk_4','kabuk_0'], desen:'leke', fiy:0.95},
  {ad:'Yosun damarlı kabuk', renk:[150,160,110], gec:0.9, sans:1.12, mix:['kabuk_0','kabuk_5'], desen:'damar', fiy:1.12}
];
var SATICI=[
  {ad:'Lao Amca', tip:'Dürüst', carp:1.0, oyn:0.12},
  {ad:'Kurnaz Wen', tip:'Pahalı ama iyi taş seçer', carp:1.3, oyn:0.2, secici:true},
  {ad:'Acemi Bo', tip:'Fiyatı tutturamaz', carp:0.85, oyn:0.45},
  {ad:'Mei Teyze', tip:'Pazarlığa açık', carp:1.05, oyn:0.15, pazar:0.15},
  {ad:'Sessiz Han', tip:'Az konuşur', carp:0.95, oyn:0.25}
];
var GW=120, GH=90;
function agirlikSec(w,r){var t=0,i;for(i=0;i<w.length;i++)t+=w[i];var x=r()*t;for(i=0;i<w.length;i++){x-=w[i];if(x<=0)return i;}return w.length-1;}

function tasUret(seed,bolge,satici){
  var r=mulberry32(seed),B=BOLGE[bolge],S=SATICI[satici||0];
  var w=lerp(B.boy[0],B.boy[1],r()), h=w*(0.6+r()*0.26), kab=Math.floor(r()*5), K=KABUK[kab];
  var sans=B.sans*K.sans*(S.secici?1.12:1);
  var T={seed:seed,bolge:bolge,w:+w.toFixed(1),h:+h.toFixed(1),kabuk:kab,varJ:r()<sans,tur:agirlikSec(B.w.slice(0,14),r),g:Math.pow(r(),0.75),
    cx:(r()-0.5)*0.6,cy:(r()-0.5)*0.5,rad:0.3+r()*0.6,ns:1.6+r()*2.6,
    sekil:r()*1000|0,catlak:[],yosun:false,pencere:null,fire:0};
  var nc=Math.floor(r()*r()*4.2);for(var i=0;i<nc;i++){var a=r()*Math.PI,cx=(r()-0.5)*0.9,cy=(r()-0.5)*0.7,L=0.3+r()*0.7;T.catlak.push([cx-Math.cos(a)*L,cy-Math.sin(a)*L,cx+Math.cos(a)*L,cy+Math.sin(a)*L]);}
  T.yosun=T.varJ?r()<0.55:r()<0.22;
  if(r()<B.pencere*(S.secici?1.3:1)){T.pencere={x:(r()-0.5)*0.9,y:(r()-0.5)*0.6,r:0.11+r()*0.07};}
  // nadir türler (eski taşların değerleri değişmesin diye ek rastgele sayılar en sonda çekilir)
  var e1=r(),e2=r(),e3=r(),e4=r();
  if(e1<0.06){T.dev=true;T.w=+(T.w*1.65).toFixed(1);T.h=+(T.h*1.65).toFixed(1);}          // dev taş: %6
  if(T.varJ&&e2<0.012){T.tam=true;T.rad=1.3;}                                              // içi baştan sona yeşim: ~%0,7
  if(e3<0.13){var ek=3+Math.floor(e4*4);for(var k=0;k<ek;k++){var a2=r()*Math.PI,cx2=(r()-0.5)*0.9,cy2=(r()-0.5)*0.7,L2=0.25+r()*0.8;T.catlak.push([cx2-Math.cos(a2)*L2,cy2-Math.sin(a2)*L2,cx2+Math.cos(a2)*L2,cy2+Math.sin(a2)*L2]);}T.cokCatlak=true;}
  // karışık renk ve karışık kabuk (en sonda çekilir; eski taşların çoğu aynı kalır)
  var e5=r(),e6=r(),e7=r(),wm=B.w.slice(14),sm=0,so=0;wm.forEach(function(x){sm+=x;});B.w.slice(0,14).forEach(function(x){so+=x;});
  if(e5<sm/(sm+so))T.tur=14+agirlikSec(wm,function(){return e6;});
  if(e7<0.45){var km=[[8,10],[5],[7],[6],[9]][kab];T.kabuk=km[Math.floor(e7*1000)%km.length];}
  w=T.w;h=T.h;
  T.kg=+(w*h*h*0.8*0.5236*2.9/1000).toFixed(2);
  return T;
}
// şekil ve iç yapı (u,v ∈ [-1,1])
function kenar(T,u,v){var a=Math.atan2(v,u);return 0.93-0.13*fbm(Math.cos(a)*1.6+5,Math.sin(a)*1.6+5,T.sekil,3);}
function icinde(T,u,v){return Math.sqrt(u*u+v*v)<kenar(T,u,v);}
function yesimMi(T,u,v){if(!T.varJ)return false;if(T.tam)return Math.sqrt(u*u+v*v)<kenar(T,u,v)-0.03;var d=Math.hypot(u-T.cx,(v-T.cy)*1.15)/T.rad,n=fbm(u*T.ns+11,v*T.ns+7,T.seed%9973,4)-0.5;return 1-d+n*1.25>0.18&&Math.sqrt(u*u+v*v)<kenar(T,u,v)-0.035;}
function yogun(T,u,v){return kis((fbm(u*2.4+3,v*2.4+9,(T.seed+77)%9973,3)-0.25)*1.7,0,1)*0.6+T.g*0.55;}
function catlakta(T,u,v,e){e=e||0.012;for(var i=0;i<T.catlak.length;i++){var c=T.catlak[i],dx=c[2]-c[0],dy=c[3]-c[1],t=kis(((u-c[0])*dx+(v-c[1])*dy)/(dx*dx+dy*dy),0,1),px=c[0]+dx*t-u,py=c[1]+dy*t-v;if(px*px+py*py<e*e)return true;}return false;}
// mantık ızgarası: 0 dışarı, 1 taş, 2 yeşim; yg = renk yoğunluğu
function izgara(T){if(T._iz)return T._iz;var n=GW*GH,h=new Uint8Array(n),yg=new Float32Array(n),ic=0,ys=0,top=0,catJ=false;
  for(var j=0;j<GH;j++)for(var i=0;i<GW;i++){var u=(i+0.5)/GW*2-1,v=(j+0.5)/GH*2-1,k=j*GW+i;if(!icinde(T,u,v))continue;ic++;
    if(yesimMi(T,u,v)){h[k]=2;ys++;yg[k]=yogun(T,u,v);top+=yg[k];if(!catJ&&catlakta(T,u,v,0.02))catJ=true;}else h[k]=1;}
  var hucre=(T.w/GW)*(T.h/GH);T._iz={h:h,yg:yg,ic:ic,ys:ys,ort:ys?top/ys:0,alan:ic*hucre,yAlan:ys*hucre,catJ:catJ,hucre:hucre};return T._iz;}
function cm2Deger(T,ort){var R=TUR[T.tur];return R.p*(0.5+0.9*ort);}
function catlakCarp(T){var Z=izgara(T);return Z.catJ?Math.pow(0.93,Math.min(T.catlak.length,8)):1;}
function gercekDeger(T){var Z=izgara(T);var taban=Z.alan*BOLGE[T.bolge].cm2*0.32;if(!Z.ys)return Math.round(taban);return Math.round(Math.max(taban,taban*0.6+Z.yAlan*cm2Deger(T,Z.ort)*catlakCarp(T)*(1-T.fire)));}
// pencereden ne görünüyor (satıcının açtığı küçük pencere)
function pencereBilgi(T){if(!T.pencere)return null;var Z=izgara(T),P=T.pencere,n=0,y=0,t=0;
  for(var j=0;j<GH;j++)for(var i=0;i<GW;i++){var u=(i+0.5)/GW*2-1,v=(j+0.5)/GH*2-1;if(Math.hypot(u-P.x,(v-P.y)*1.2)>P.r)continue;var k=j*GW+i;if(!Z.h[k])continue;n++;if(Z.h[k]===2){y++;t+=Z.yg[k];}}
  return {n:n,oran:n?y/n:0,ort:y?t/y:0};}
// fener: bir noktanın altındaki yeşim (0..1) — kabuk geçirgenliği ve yeşimin şeffaflığıyla
function fenerOlc(T,u,v,yaricap){var Z=izgara(T),n=0,y=0,t=0;yaricap=yaricap||0.16;
  for(var j=0;j<GH;j++)for(var i=0;i<GW;i++){var uu=(i+0.5)/GW*2-1,vv=(j+0.5)/GH*2-1;if(Math.hypot(uu-u,vv-v)>yaricap)continue;var k=j*GW+i;if(!Z.h[k])continue;n++;if(Z.h[k]===2){y++;t+=Z.yg[k];}}
  if(!n)return {g:0,ort:0};var oran=y/n;return {g:kis(oran*KABUK[T.kabuk].gec*(0.55+0.45*TUR[T.tur].sef),0,1),ort:y?t/y:0,oran:oran};}
// satıcının istediği fiyat: yalnız GÖRÜNEN ipuçlarından (boyut, kabuk, yosun, pencere) — gizli içten değil
function istenenFiyat(T,satici,r){var Z=izgara(T),B=BOLGE[T.bolge],S=SATICI[satici],c=1;
  if(T.yosun)c*=1.35;var P=pencereBilgi(T);
  if(P){if(P.oran>0.3){c*=1+0.9*P.oran*kis(Math.sqrt(TUR[T.tur].p/40),0.4,3.2);}else c*=0.55;}
  c*=KABUK[T.kabuk].fiy||[1.08,1,1.1,0.95,0.88][T.kabuk]||1;
  return Math.max(20,Math.round(Z.alan*B.cm2*0.9*c*S.carp*lerp(1-S.oyn,1+S.oyn,r())/10)*10);}
if(typeof module!=='undefined')module.exports={paletSec:paletSec,mulberry32:mulberry32,tasUret:tasUret,izgara:izgara,gercekDeger:gercekDeger,istenenFiyat:istenenFiyat,pencereBilgi:pencereBilgi,fenerOlc:fenerOlc,TUR:TUR,BOLGE:BOLGE,SATICI:SATICI,KABUK:KABUK,GW:GW,GH:GH,icinde:icinde,yesimMi:yesimMi,yogun:yogun,catlakta:catlakta,fbm:fbm,kis:kis,lerp:lerp,catlakCarp:catlakCarp,cm2Deger:cm2Deger};
