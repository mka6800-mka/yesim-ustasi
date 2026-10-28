# Yeşim Ustası — çalışma kuralları (Claude için)

Bu depo yalnız **Yeşim Ustası** oyunudur. Drakun / `meridyen` deposuyla hiçbir bağı yoktur; o depoya, sunucusuna ve anahtarlarına dokunma.

## Oyun sahibinin kuralları
- Türkçe, sade ve kısa konuş. Raporlar tam ve kopyalanabilir olsun; uzunsa numaralı parçalara böl.
- Bulguları **KOD / TEST / SİMÜLASYON / VARSAYIM** diye etiketle. Testi gerçekten çalıştırmadan "geçti" deme.
- **Kodla resim çizme.** Bütün görseller gerçekçi ve özgündür (oyun sahibi ChatGPT ile üretir, sen kesip yerleştirirsin). Görsel gerekiyorsa toplu ChatGPT komutu hazırla.
- Ücretli servis kullanma, yeni erişim anahtarı oluşturma, erişim engellerini aşmaya çalışma.
- Gizli bilgileri (imza anahtarı, şifre, AdMob kimliği, jeton) asla dosyaya, commit'e ya da sohbete yazma; yalnız GitHub Secrets.
- Göndermeden önce `git pull --rebase origin main`; çakışmada karşı tarafın değişikliğini silme, birleştir. Küçük ve sık commit at. Commit kimliği: `user.name=Claude`, `user.email=noreply@anthropic.com`.
- Geri dönülmez işlerde (veri silme, ödeme/hesap ayarı, mağazaya gönderme) önce oyun sahibine sor.

## Yapı
- `oyun/kaynak.html` arayüz + mantık, `oyun/mantik.js` taş mantığı (Node'da da çalışır), `oyun/ceviri/` 8 dil (tr kaynak; isim_*.json adlar, kalip_*.json kalıplar).
- `cd oyun && python3 derle.py` → `www/index.html` (uygulama) ve `www/test.html` (testler).
- Görseller `www/gorsel/*.webp`. Kesme betikleri: `oyun/kes_toplu.py` (36 ürün, 6×6 magenta ızgara), `kes_elmas.py`, `kes_sahne.py`, `logo_hazirla.py`.
- Android: Capacitor 8 (`package.json`, `capacitor.config.json`, `scripts/android-hazirla.js`), köprüler `www/reklam.js` (AdMob), `www/magaza.js` (Play Billing 9, @capgo/native-purchases).
- Derleme: `.github/workflows/android.yml` (ubuntu-24.04). Test APK her push'ta; imzalı AAB, KEYSTORE_* gizlileri varsa.

## Test
```
cd www && (python3 -m http.server 8765 >/dev/null 2>&1 &)      # aynı komutta başlat, turlar arasında kapanabilir
cd oyun/test && node -r ./toplayici.js gezgin.js                # toplayici: tr-TR + gölge İngilizce, eksik çevirileri eksik.json'a toplar
node -r ./toplayici.js bot.js tam   # 12 günlük bot oyunu
node diller.js                      # 7 dilde Türkçe kalan yazı (toplayici OLMADAN)
node hiz.js ; node sim.js           # hız ve ekonomi simülasyonu
```
Sunucuyu kapatırken `pkill -f` kullanma (kendi kabuğunu da öldürür); `pgrep -f "^python3 -m http.server 8765$"` ile PID bulup `kill`.
`window.__test=1` ile açılan sayfada `window.__dbg("function(){...}")` oyunun içinde kod çalıştırır (yalnız test).

Ayrıntılı durum ve yapılacaklar: `DEVIR.md`. Play Store adımları: `PLAY_STORE_REHBERI.md`.
