# Kullanım: python3 kes_yeni.py <görsel.png> [4x2|4x4]   — beyaz arka planlı ürün ızgarası, sırayla:
# 4x2: boncuk kelebek buda muhur / kurbaga kase vazo ejderha
# 4x4: firkete yelpaze balik bambu / fincan lotus ruyi demlik / aslan at satranc gemi / anka dag oturanbuda tac
import sys,numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
IZ=sys.argv[2] if len(sys.argv)>2 else '4x2'
ADLAR=('boncuk kelebek buda muhur kurbaga kase vazo ejderha' if IZ=='4x2' else 'firkete yelpaze balik bambu fincan lotus ruyi demlik aslan at satranc gemi anka dag oturanbuda tac').split()
SAT=2 if IZ=='4x2' else 4
im=Image.open(sys.argv[1]).convert('RGB');a=np.asarray(im.convert('L')).astype(float);H,W=a.shape
def cizgiler(p,n):
  d=np.where(p<70)[0];g=[]
  for x in d:
    if g and x-g[-1][-1]<=3:g[-1].append(x)
    else:g.append([x])
  orta=[(x[0]+x[-1])//2 for x in g if 0.1*n<(x[0]+x[-1])/2<0.9*n]
  return orta
xs=cizgiler(np.median(a,axis=0),W);ys=cizgiler(np.median(a,axis=1),H)
xs=[0]+xs+[W] if len(xs)==3 else [round(W*i/4) for i in range(5)]
ys=[0]+ys+[H] if len(ys)==SAT-1 else [round(H*i/SAT) for i in range(SAT+1)]
def kes(t,boy=320):
  a=np.asarray(t).astype(float);L=a.mean(2);sat=(a.max(2)-a.min(2))/255
  Lb=nd.gaussian_filter(L,1.2);g=np.hypot(nd.sobel(Lb,0),nd.sobel(Lb,1))/8
  cand=((L>200)&(sat<0.07)&(g<1.5))|((L>244)&(sat<0.05))
  lab,_=nd.label(cand);kenar=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
  obj=nd.binary_fill_holes(nd.binary_opening(~np.isin(lab,list(kenar)),iterations=5))
  lab2,n=nd.label(obj);sz=nd.sum(obj,lab2,range(1,n+1));obj=np.isin(lab2,[i+1 for i,v in enumerate(sz) if v>sz.max()*0.05])
  obj=nd.binary_erosion(obj,iterations=1);al=np.array(Image.fromarray((obj*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)))
  out=Image.fromarray(np.dstack([a,al]).clip(0,255).astype(np.uint8),'RGBA');out=out.crop(out.getbbox())
  r=boy/max(out.size);return out.resize((int(out.width*r),int(out.height*r)),Image.LANCZOS)
k=0
for j in range(SAT):
  for i in range(4):
    t=im.crop((xs[i]+6,ys[j]+6,xs[i+1]-6,ys[j+1]-6));kes(t).save('../gorsel/urun_'+ADLAR[k]+'.webp','WEBP',quality=88,method=6);print('urun_'+ADLAR[k]);k+=1
