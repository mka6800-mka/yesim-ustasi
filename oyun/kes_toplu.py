# Kullanım: python3 kes_toplu.py <görsel.png>  — MAGENTA (#FF00FF) arka planlı 6×6 ürün ızgarası (36 ürün), soldan sağa, yukarıdan aşağı:
ADLAR=('kupe yuzuk kolye bileklik plaka heykel boncuk kelebek buda muhur kurbaga kase vazo ejderha firkete yelpaze balik bambu '
       'fincan lotus ruyi demlik aslan at satranc gemi anka dag oturanbuda tac impyuzuk boncukkolye ejderbilezik tavus pagoda kirin').split()
import sys,os,numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
SUT=SAT=6
im=Image.open(sys.argv[1]).convert('RGB');A=np.asarray(im).astype(float);H,W,_=A.shape
def magenta(a):r,g,b=a[...,0],a[...,1],a[...,2];return (r>140)&(b>140)&(g<0.65*np.minimum(r,b))
def kes(a,boy=360):
  m=magenta(a);lab,_=nd.label(m);kenar=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
  obj=nd.binary_fill_holes(nd.binary_opening(~np.isin(lab,list(kenar)),iterations=1))|(~m&~np.isin(lab,list(kenar)))
  obj&=~np.isin(lab,list(kenar))
  lab2,n=nd.label(obj)
  if n==0:return None
  sz=nd.sum(obj,lab2,range(1,n+1));obj=np.isin(lab2,[i+1 for i,v in enumerate(sz) if v>sz.max()*0.03])
  # keskin kenar: çok hafif yumuşatma, sonra eşik
  al=np.array(Image.fromarray((obj*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(float)
  b=a.copy();ort=(b[...,0]+b[...,2])/2;tasma=np.clip((ort-b[...,1]-35)/70,0,1)*(al<255)   # pembe sızıntıyı temizle
  for c in (0,2):b[...,c]=b[...,c]*(1-tasma)+b[...,1]*tasma
  out=Image.fromarray(np.dstack([b,al]).clip(0,255).astype(np.uint8),'RGBA');out=out.crop(out.getbbox())
  r=boy/max(out.size);return out.resize((max(1,int(out.width*r)),max(1,int(out.height*r))),Image.LANCZOS)
hedef=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','gorsel')
k=0
for j in range(SAT):
  for i in range(SUT):
    x0,x1=round(W*i/SUT),round(W*(i+1)/SUT);y0,y1=round(H*j/SAT),round(H*(j+1)/SAT)
    o=kes(A[y0+3:y1-3,x0+3:x1-3])
    if o is not None:o.save(os.path.join(hedef,'urun_'+ADLAR[k]+'.webp'),'WEBP',quality=90,method=6);print('urun_'+ADLAR[k],o.size)
    k+=1
