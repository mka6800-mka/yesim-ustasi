# Kullanım: python3 kes_elmas.py <görsel.png>   — MAGENTA (#FF00FF) arka planlı 4×2 ızgara, sırayla:
# elmas, paket_elmas_100, paket_elmas_550, paket_elmas_1200 / paket_elmas_3000, paket_haftalik_premium, paket_reklamsiz, paket_baslangic_paketi
import sys,numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
ADLAR='elmas paket_elmas_100 paket_elmas_550 paket_elmas_1200 paket_elmas_3000 paket_haftalik_premium paket_reklamsiz paket_baslangic_paketi'.split()
im=Image.open(sys.argv[1]).convert('RGB');A=np.asarray(im).astype(float);H,W,_=A.shape
def magentaMi(a):  # arka plan: kırmızı ve mavi yüksek, yeşil düşük
  r,g,b=a[...,0],a[...,1],a[...,2];return (r>150)&(b>150)&(g<0.62*np.minimum(r,b))
def kes(a,boy=256):
  m=magentaMi(a);lab,_=nd.label(m);kenar=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
  arka=np.isin(lab,list(kenar));obj=nd.binary_opening(~arka,iterations=2)
  lab2,n=nd.label(obj)
  if n==0:return None
  sz=nd.sum(obj,lab2,range(1,n+1));obj=np.isin(lab2,[i+1 for i,v in enumerate(sz) if v>sz.max()*0.04])
  al=np.array(Image.fromarray((obj*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))).astype(float)
  # kenardaki pembe sızıntıyı temizle: yeşili kırmızı/mavinin altına düşen pikselleri griye çek
  b=a.copy();ort=(b[...,0]+b[...,2])/2;tasma=np.clip((ort-b[...,1]-40)/80,0,1)*(al<250)
  for c in (0,2):b[...,c]=b[...,c]*(1-tasma)+b[...,1]*tasma
  out=Image.fromarray(np.dstack([b,al]).clip(0,255).astype(np.uint8),'RGBA');out=out.crop(out.getbbox())
  r=boy/max(out.size);return out.resize((max(1,int(out.width*r)),max(1,int(out.height*r))),Image.LANCZOS)
k=0
for j in range(2):
  for i in range(4):
    x0,x1=round(W*i/4),round(W*(i+1)/4);y0,y1=round(H*j/2),round(H*(j+1)/2)
    o=kes(A[y0+4:y1-4,x0+4:x1-4]);
    if o is not None:o.save('../www/gorsel/'+ADLAR[k]+'.webp','WEBP',quality=90,method=6);print(ADLAR[k],o.size)
    k+=1
