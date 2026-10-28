const M=require('../mantik.js');
for(let b=0;b<8;b++){let top=[],kor=0,odenen=0,deger=0,yP=0,yD=0,pY=0,pYD=0,nP=0,nPY=0,s=0,max=0,sifir=0;
 for(let i=0;i<3000;i++){const sat=i%5;const T=M.tasUret(1000+i*7919+b*13,b,sat);const r=M.mulberry32(i*31+b);const f=M.istenenFiyat(T,sat,r);const d=M.gercekDeger(T);
  odenen+=f;deger+=d;top.push(d/f);if(d>max)max=d;if(d<f*0.2)sifir++;
  if(T.yosun){yP+=f;yD+=d;} const P=M.pencereBilgi(T); if(P&&P.oran>0.3){pY+=f;pYD+=d;nP++;}
 }
 top.sort((a,b)=>a-b);
 console.log(M.BOLGE[b].ad,'ort fiyat',Math.round(odenen/3000),'ort değer',Math.round(deger/3000),'kör oran',(deger/odenen).toFixed(2),'medyan',top[1500].toFixed(2),'%90',top[2700].toFixed(2),'%99',top[2970].toFixed(2),'en yüksek değer',max,'çöp(<%20)',(sifir/30).toFixed(0)+'%','yosunlu oran',(yD/yP).toFixed(2),'yeşil pencere oran',(pYD/pY).toFixed(2),'n',nP);}
