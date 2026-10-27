# Kullanım: python3 kes_sahne.py <sahneler_2x2.png> [tezgah.png]
# 2×2 ızgara sırası: pazar | dükkân / atölye | galeri.  tezgah.png beyaz arka planlı tek tezgâh (arka planı silinir).
import sys,numpy as np
from PIL import Image
from scipy import ndimage as nd
im=Image.open(sys.argv[1]).convert('RGB');W,H=im.size;a=np.asarray(im.convert('L')).astype(float)
def orta(p,n):
  d=[i for i in range(int(n*0.4),int(n*0.6)) if p[i]<45];return (min(d)+max(d))//2 if d else n//2
cx_=orta(np.median(a,axis=0),W);cy_=orta(np.median(a,axis=1),H)
for ad,(x0,y0,x1,y1) in zip(['pazar','dukkan','atolye','galeri'],[(0,0,cx_,cy_),(cx_,0,W,cy_),(0,cy_,cx_,H),(cx_,cy_,W,H)]):
  t=im.crop((x0+5,y0+5,x1-5,y1-5));t=t.resize((1024,int(1024*t.height/t.width)),Image.LANCZOS);t.save('../gorsel/sahne_'+ad+'.webp','WEBP',quality=80,method=6);print('sahne_'+ad)
if len(sys.argv)>2:
  t=Image.open(sys.argv[2]).convert('RGB');b=np.asarray(t).astype(float);L=b.mean(2);sat=(b.max(2)-b.min(2))/255
  bg=(L>236)&(sat<0.06);lab,n=nd.label(bg);sz=nd.sum(bg,lab,range(1,n+1))
  k=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
  sil=[i+1 for i,v in enumerate(sz) if (i+1) in k or v>bg.size*0.004]   # kenara değen ya da büyük beyaz alanlar (direk arası, masa altı) silinir
  obj=~np.isin(lab,sil);obj=nd.binary_opening(obj,iterations=2)
  H2=obj.shape[0];yy=np.arange(H2)[:,None];obj&=~((yy>H2*0.85)&(L>150)&(sat<0.1))   # ayak altındaki açık gri gölge
  obj=nd.binary_opening(obj,iterations=2)
  o=Image.fromarray(np.dstack([b,obj*255]).astype(np.uint8),'RGBA');o=o.crop(o.getbbox());o.thumbnail((700,700));o.save('../gorsel/tezgah.webp','WEBP',quality=85,method=6);print('tezgah')
