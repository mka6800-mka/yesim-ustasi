# Yeşim Ustası — ChatGPT'den gelen logo görsellerini uygulamaya yerleştirir.
# Kullanım (oyun/ klasöründen):
#   python3 logo_hazirla.py ikon.png            → uygulama ikonu (Play 512 + Android tüm boyutlar, yuvarlak ve uyarlanabilir)
#   python3 logo_hazirla.py ikon.png amblem.png → ayrıca giriş ekranındaki amblem (şeffaf arka planlı)
#   python3 logo_hazirla.py ikon.png amblem.png afis.png → ayrıca Play "öne çıkan görsel" 1024×500
import sys, os
from PIL import Image, ImageDraw, ImageFilter

KOK = os.path.dirname(os.path.abspath(__file__))
MAGAZA = os.path.join(KOK, '..', 'magaza')
RES = os.path.join(MAGAZA, 'ikon', 'android', 'res')
YOGUNLUK = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

def kare(im):
    w, h = im.size; k = min(w, h)
    return im.crop(((w - k) // 2, (h - k) // 2, (w - k) // 2 + k, (h - k) // 2 + k))

def yuvarlak(im):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).ellipse((0, 0) + im.size, fill=255)
    o = im.convert('RGBA'); o.putalpha(m); return o

def ikon(yol):
    im = kare(Image.open(yol).convert('RGB'))
    im.resize((512, 512), Image.LANCZOS).save(os.path.join(MAGAZA, 'ikon', 'ikon_512.png'))
    for ad, k in YOGUNLUK.items():
        d = os.path.join(RES, 'mipmap-' + ad); os.makedirs(d, exist_ok=True)
        n = round(48 * k); u = round(108 * k)
        im.resize((n, n), Image.LANCZOS).save(os.path.join(d, 'ic_launcher.png'))
        yuvarlak(im.resize((n, n), Image.LANCZOS)).save(os.path.join(d, 'ic_launcher_round.png'))
        # uyarlanabilir ikon: ön yüz görselin kendisi (telefon kenarları maskeler), arka yüz bulanık hâli
        im.resize((u, u), Image.LANCZOS).save(os.path.join(d, 'ic_launcher_foreground.png'))
        im.resize((u, u), Image.LANCZOS).filter(ImageFilter.GaussianBlur(u / 10)).save(os.path.join(d, 'ic_launcher_background.png'))
    print('ikon tamam: magaza/ikon/ikon_512.png ve', RES)

def amblem(yol):
    im = Image.open(yol).convert('RGBA')
    bb = im.getbbox()
    if bb: im = im.crop(bb)
    r = 360 / max(im.size); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    for hedef in [os.path.join(KOK, 'gorsel'), os.path.join(KOK, '..', 'www', 'gorsel')]:
        if os.path.isdir(hedef): im.save(os.path.join(hedef, 'logo.webp'), 'WEBP', quality=92, method=6); print('amblem:', os.path.join(hedef, 'logo.webp'))

def afis(yol):
    im = Image.open(yol).convert('RGB'); w, h = im.size; hedef = 1024 / 500
    if w / h > hedef: nw = round(h * hedef); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = round(w / hedef); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im.resize((1024, 500), Image.LANCZOS).save(os.path.join(MAGAZA, 'one_cikan_1024x500.png')); print('afiş tamam: magaza/one_cikan_1024x500.png')

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__ or 'python3 logo_hazirla.py ikon.png [amblem.png] [afis.png]'); sys.exit(1)
    ikon(sys.argv[1])
    if len(sys.argv) > 2: amblem(sys.argv[2])
    if len(sys.argv) > 3: afis(sys.argv[3])
