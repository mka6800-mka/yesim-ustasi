# Yeşim Ustası — Play Store'a çıkış rehberi

Bu klasör, Yeşim Ustası'nın Android uygulaması için eksiksiz projedir. **Drakun'dan tamamen ayrıdır**: Drakun deposu (meridyen), Drakun sunucusu, veritabanı ya da anahtarlarıyla hiçbir bağı yoktur. Kendi ayrı GitHub deposunda durmalıdır.

Durum etiketleri: ✅ hazır • 🔧 senin yapman gereken (hesap, ödeme, kimlik — bunları senin adına yapamam).

---

## 0. Klasörde ne var?

| Yol | İçerik |
|---|---|
| `www/` | Oyunun kendisi (index.html + gorsel/) — ✅ |
| `www/reklam.js` | AdMob ödüllü reklam köprüsü + Google rıza formu (GDPR/İngiltere) + Android geri tuşu — ✅ |
| `www/magaza.js` | Google Play satın alma köprüsü (@capgo/native-purchases 8, **Play Billing Library 9**): satın al, tüket/onayla, yarım kalanları tamamla, geri yükle — ✅ |
| `www/ayar.js` | Reklam kimlikleri ve gizlilik bağlantısı (derlemede sırlardan otomatik yazılır) — ✅ |
| `oyun/` | Oyunun kaynak dosyaları; değişiklikten sonra `cd oyun && python3 derle.py` → `www/index.html` — ✅ |
| `capacitor.config.json`, `package.json` | Capacitor 8 + AdMob (@capacitor-community/admob 8) + satın alma (@capgo/native-purchases 8) — ✅ |
| `scripts/android-hazirla.js` | AdMob kimliği, BILLING ve AD_ID izinleri, hedef API 36, sürüm no, imzalama, ikonlar — ✅ |
| `.github/workflows/android.yml` | GitHub'da otomatik derleme: test APK + imzalı AAB — ✅ |
| `docs/gizlilik.html` | Gizlilik politikası (Türkçe + İngilizce) — ✅ (içindeki [GELİŞTİRİCİ ADI] ve [E-POSTA ADRESİ] yerlerini doldur 🔧) |
| `magaza/` | İkon 512, öne çıkan görsel 1024×500, ekran görüntüleri 1080×1920 (`ekran/tr` ve `ekran/en`, 8'er adet), mağaza metinleri (TR+EN) — ✅ |

Uygulama kimliği: `com.yesimustasi.oyun` (yayından sonra değiştirilemez; değiştirmek istersen şimdi `capacitor.config.json` içinde değiştir).

> Not: Bu proje Claude'un ortamında **derlenmedi** (orada Android SDK yok). İlk GitHub derlemesinde küçük bir düzeltme gerekebilir; depoya erişim verirsen derleme kayıtlarına bakıp düzeltirim.

---

## 1. Ayrı GitHub deposu 🔧
1. GitHub'da yeni bir depo aç: ad **yesim-ustasi**. Gizlilik politikasını GitHub Pages'te yayınlamak istiyorsan depo **Public** olmalı (ücretsiz planda Pages yalnız açık depolarda çalışır). Oyunun kodu görünür olur; istemezsen depoyu Private aç ve gizlilik politikasını Google Sites gibi başka bir yerde yayınla.
2. Bu klasörün içeriğini depoya yükle (GitHub web sayfasında "Add file → Upload files" ile sürükle-bırak yeterli; `.github` klasörünün de yüklendiğinden emin ol).
3. Ya da depoyu açtıktan sonra bana adını söyle; erişimim olursa ben yüklerim.

## 2. İlk test derlemesi
1. Depoda **Actions** sekmesi → "Android derle" → **Run workflow**.
2. Bitince çalıştırmanın altındaki **Artifacts** bölümünden `yesim-ustasi-apk` dosyasını indir, telefonuna kurup dene (bilinmeyen kaynaklara izin vermen gerekir). Bu sürüm Google'ın **test reklamlarını** gösterir.

## 3. Yükleme anahtarı (imza) 🔧 — kendi bilgisayarında
Play Store'a yüklenen her sürüm aynı anahtarla imzalanmalı. Anahtarı **sen** oluştur ve sakla (Java yüklü bir bilgisayarda):
```
keytool -genkeypair -v -keystore yukleme.jks -keyalg RSA -keysize 2048 -validity 10000 -alias yesim
```
Sonra dosyayı metne çevir:
- Linux/Mac: `base64 -w0 yukleme.jks > anahtar.txt` (Mac'te: `base64 -i yukleme.jks -o anahtar.txt`)
- Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("yukleme.jks")) > anahtar.txt`

Depo → Settings → Secrets and variables → Actions → **New repository secret**:

| Sır adı | Değer |
|---|---|
| `KEYSTORE_BASE64` | anahtar.txt içeriği |
| `KEYSTORE_PASSWORD` | anahtar deposu şifresi |
| `KEY_ALIAS` | `yesim` |
| `KEY_PASSWORD` | anahtar şifresi |

`yukleme.jks` dosyasını ve şifreleri güvenli bir yerde yedekle; kimseyle paylaşma, depoya koyma. Bundan sonraki her derleme Actions'ta `yesim-ustasi-aab` (Play Store'a yüklenecek dosya) da üretir.

## 4. AdMob (reklam geliri) 🔧
1. [admob.google.com](https://admob.google.com) → Google hesabınla kaydol (ücretsiz), ödeme ve vergi bilgilerini gir.
2. **Uygulamalar → Uygulama ekle** → Android → "Henüz yayınlanmadı" → ad: Yeşim Ustası. Çıkan **Uygulama kimliği** (`ca-app-pub-…~…`).
3. Bu uygulamada **Reklam birimi ekle → Ödüllü** → ad: "Ödüllü genel". Çıkan **reklam birimi kimliği** (`ca-app-pub-…/…`).
4. **Gizlilik ve mesajlaşma → GDPR**: bir rıza mesajı oluştur ve yayınla (Birleşik Krallık/AB oyuncuları için zorunlu; oyundaki rıza formu bunu gösterir).
5. GitHub sırları: `ADMOB_APP_ID` = uygulama kimliği, `ADMOB_ODULLU_ID` = reklam birimi kimliği, `GIZLILIK_URL` = gizlilik sayfası adresi.
6. **Kendi reklamlarına asla tıklama**, test için kendi telefonunu AdMob'da test cihazı olarak ekle — aksi halde AdMob hesabı kapatılabilir.
7. Uygulama yayınlandıktan sonra AdMob'da uygulamayı Play Store kaydına bağla. AdMob, `app-ads.txt` dosyasını mağaza kaydındaki web sitesinin kökünde ister (ör. `kullaniciadin.github.io/app-ads.txt`; bunun için GitHub'da `kullaniciadin.github.io` adlı ayrı bir depo gerekir). İçeriği AdMob'daki "app-ads.txt" sayfasında verilir.

## 5. Gizlilik politikası
- `docs/gizlilik.html` içindeki köşeli parantezli yerleri doldur.
- Açık depoda: Settings → Pages → Source: "Deploy from a branch" → `main` / `/docs`. Adres: `https://KULLANICIADIN.github.io/yesim-ustasi/gizlilik.html`.

## 6. Google Play Console 🔧
1. [play.google.com/console](https://play.google.com/console) → geliştirici hesabı (bir kerelik **25 $**, kimlik doğrulaması ister).
2. **Uygulama oluştur**: ad "Yeşim Ustası: Taş Avcısı", varsayılan dil Türkçe, **Oyun**, **Ücretsiz**.
3. **Mağaza girişi**: `magaza/metinler.md` içindeki metinleri, ikonu, öne çıkan görseli ve `magaza/ekran/tr` içindeki 8 ekran görüntüsünü yükle. İngilizce çeviriyi eklerken `magaza/ekran/en` görüntülerini kullan.
4. **Uygulama içeriği** bölümündeki formlar (önerilen yanıtlar):
   - **Gizlilik politikası**: GitHub Pages adresi.
   - **Reklamlar**: Evet, reklam içeriyor.
   - **Uygulama erişimi**: Tüm işlevler kısıtlama olmadan kullanılabilir.
   - **İçerik derecelendirmesi** (IARC anketi): Kategori Oyun. Şiddet/cinsellik/küfür yok. **Simüle kumar: Evet** (şans çarkı, kör kutu, kapalı taş alımı oyun içi parayla yapılıyor; gerçek para yok). **Dijital ürün satın alma: Evet**, **rastgele öğe satın alma: Evet** (değerli taşlar elmasla alınıyor ve elmas gerçek parayla alınabiliyor). Kullanıcı etkileşimi/paylaşım yok. Dürüst yanıt ver; derece büyük ihtimalle 12+/16+ civarı çıkar ve mağazada "Uygulama içi satın alma (rastgele öğeler içerir)" etiketi görünür — bu normaldir.
   - **Hedef kitle**: Önerim yalnız **"18 ve üstü"**. Simüle kumar + gerçek parayla rastgele öğe olduğu için en güvenlisi budur ve Aileler (çocuk) politikasına girmez. "Uygulama çocuklara hitap ediyor mu?" → Hayır.
   - **Veri güvenliği**: Uygulamanın kendisi veri toplamaz; AdMob SDK'sı toplar. Google'ın AdMob açıklama rehberine göre doldur ([AdMob veri açıklama rehberi](https://developers.google.com/admob/android/privacy/play-data-disclosure)). Genel olarak: *Konum → Yaklaşık konum*, *Uygulama etkinliği → Uygulama etkileşimleri*, *Uygulama bilgisi ve performansı → Kilitlenme kayıtları, Tanılama*, *Cihaz veya diğer kimlikler* — toplanır ve reklam amacıyla Google ile paylaşılır; aktarımda şifrelidir; hesap olmadığı için silme isteği yoktur (oyun kaydı cihazda, oyundan silinebilir).
   - **Veri güvenliği — satın alma**: Satın almayı Google Play yapar; oyun satın alma bilgisini (ürün kimliği + jeton) yalnız cihazda tutar, hiçbir sunucuya göndermez. Play'in tanımına göre cihazdan çıkmayan veri "toplanan veri" sayılmaz; bu yüzden ek bir satır gerekmez. Play Console bir uyarı gösterirse "Finansal bilgiler → Satın alma geçmişi" için "toplanmaz" seçeneğiyle devam et ya da bana yaz.
   - **Reklam kimliği** beyanı: Evet, reklam için kullanılıyor (AD_ID izni projede var).
   - Haber, sağlık, finans, devlet uygulaması: Hayır.
5. **Kapalı test (zorunlu)**: 2023 sonrası açılan kişisel hesaplarda üretime çıkmadan önce **en az 12 test kullanıcısının 14 gün kesintisiz** kapalı teste katılması gerekir. Test → Kapalı test → yeni kanal → AAB'yi yükle → test kullanıcılarının e-postalarını ekle → onların katılım bağlantısıyla uygulamayı kurmalarını iste. 14 gün dolunca "Üretime erişim başvurusu" yap.
6. **Üretim**: Onaydan sonra Üretim → Yeni sürüm → aynı ya da yeni AAB → sürüm notu → incelemeye gönder.

> Hedef API: 31 Ağustos 2026'dan beri yeni uygulamalar **API 36 (Android 16)** hedeflemeli; proje bunu ayarlıyor.

## 7. Güncelleme yapmak
Oyunda değişiklik → `oyun/` içinde düzenle → `python3 derle.py` → depoya gönder. Actions sürüm kodunu otomatik artırır. Yeni AAB'yi Play Console'a yükle.

## 8. Daha profesyonel ikon ve afiş (isteğe bağlı) — ChatGPT komutları
Şu anki ikon ve afiş oyunun kendi görsellerinden birleştirildi. Daha iyisi için:

**İkon (1024×1024):**
```
Mobile game app icon, square 1024x1024, photorealistic 3D render: a glowing translucent imperial-green jade bi disc pendant on a red silk cord, resting on a cracked-open rough brown jade boulder that shows bright green jade inside, deep red lacquer background with soft warm rim light, centered, bold and readable at small sizes, no text, no border.
```
**Öne çıkan görsel (1024×500):**
```
Wide banner 1024x500, photorealistic 3D render for a mobile game: a night jade market street with red paper lanterns, on the right side a large rough jade boulder cut open revealing glowing imperial green jade, a few finished jade jewels (bangle, ring, pendant) on dark cloth, warm cinematic light, empty darker area on the left third for a title, no text.
```
Üretince bana gönder, yerleştiririm.

## 9. Diller
Oyun 8 dilde: Türkçe, English, Español, Português, Deutsch, Français, Русский, Bahasa Indonesia. Telefonun diline göre kendiliğinden açılır; Ayarlar → "Dil / Language" ile değiştirilir. Çeviriler `oyun/ceviri/` klasöründe (isim_*.json = adlar, kalip_*.json = cümleler). Play Console'da mağaza girişini de bu dillere çevirmek indirmeleri artırır (Play Console → Ana mağaza girişi → Çevirileri yönet).

## 10. Yeni ürün görselleri
8 yeni ürün (boncuk, kelebek broş, Buda kolye ucu, mühür, bereket kurbağası, kâse, vazo, ejderha heykeli) oyunda hazır; görselleri gelince kendiliğinden görünür. 4×2 ızgaralı görseli `oyun/kes_yeni.py` ile kes: `python3 kes_yeni.py gorsel.png` → `gorsel/urun_*.webp`.

## 11. Dünya sıralaması (Google Play Oyunlar)
Oyunda iki sıralama var: herkesin cihazında çalışan **pazar tüccarları sıralaması** (her zaman açık) ve Android'de **dünya sıralaması** (Google Play Oyunlar). Puan = oyuncunun o anki parası; her gün sonunda gönderilir.

Kurulum (Play Console):
1. Play Console → uygulaman → **Play Games Services → Kurulum ve yönetim → Yapılandırma**. "Hayır, oyunum Google API kullanmıyor" seç, oluştur.
2. Aynı sayfada **Kimlik bilgisi ekle → Android**: paket adı `com.yesimustasi.oyun`, imza sertifikası parmak izi (SHA-1) yükleme anahtarının ve Play uygulama imzalama anahtarının (Play Console → Kurulum → Uygulama imzalama) SHA-1'leri.
3. **Skor tabloları → Skor tablosu oluştur**: ad "En zengin tüccarlar", biçim **Para birimi yok, sayısal**, sıralama **Büyükten küçüğe**.
4. İki kimliği GitHub sırlarına ekle:
   - `PLAY_GAMES_ID` = Yapılandırma sayfasındaki proje kimliği (yalnızca rakamlar)
   - `PLAY_LIDER_ID` = skor tablosu kimliği (`Cgk…` ile başlar)
5. Play Games Services yapılandırmasını **Yayınla**. (Test aşamasında test kullanıcılarını "Test kullanıcıları" listesine ekle.)

Sırlar yoksa uygulama dünya sıralaması düğmesini göstermez; geri kalan her şey çalışır.

## 12. Uzun oyun sonu
8 pazar var; son üçü Mandalay Mücevher Fuarı (50 milyon ¥), Singapur Gala Müzayedesi (300 milyon ¥), İmparatorluk Hazinesi (2 milyar ¥). Her pazar bir öncekinden biraz daha zor (rastgele alımda geri dönüş %99 → %95 → %92). Cila tezgâhı 25 seviye; en büyük ürünler (İmparator tacı, Oturan Buda) 23–24. seviye ve 1 metreyi aşan taşlar ister.

## 13. Uygulama içi satın alımlar (Google Play Faturalandırma) 🔧
Oyun tarafı hazır ✅: elmas, elmas dükkânı, 7 satın alma ürünü, Reklamsız paket, Haftalık premium, geri yükleme, olasılık gösterimi. Senin yapacakların:

1. **Ödeme profili**: Play Console → Ayarlar → **Ödeme profili** (satıcı hesabı) oluştur, banka ve vergi bilgilerini gir. Bu olmadan ürün satılamaz.
2. **Önce bir AAB yükle**: Ürün oluşturma ekranı, BILLING izni olan bir derleme yüklenmeden açılmaz. İmzalı AAB'yi **Dahili test** kanalına yükle (kapalı test de olur).
3. **Ürünleri oluştur**: Para kazanma → Ürünler → **Uygulama içi ürünler** (tek seferlik ürün). Kimlikler **aynen** şöyle olmalı (sonradan değiştirilemez):

| Ürün kimliği | Ad (mağazada görünür) | Tür (oyunun davranışı) | Önerilen fiyat |
|---|---|---|---|
| `elmas_100` | Bir avuç elmas — 100 elmas | tüketilir | 0,99 $ |
| `elmas_550` | Elmas kesesi — 550 elmas | tüketilir | 4,99 $ |
| `elmas_1200` | Elmas sandığı — 1200 elmas | tüketilir | 9,99 $ |
| `elmas_3000` | Elmas hazinesi — 3000 elmas | tüketilir | 19,99 $ |
| `haftalik_premium` | Haftalık premium (7 gün, otomatik yenilenmez) | tüketilir | 2,99 $ |
| `reklamsiz` | Reklamsız paket | kalıcı (bir kez) | 3,99 $ |
| `baslangic_paketi` | Başlangıç paketi | kalıcı (bir kez) | 1,99 $ |

   Fiyatı dolar olarak gir, "Fiyatları diğer ülkelere dönüştür" ile diğer ülkeler otomatik dolar. Oyun fiyatı Google Play'den okur, kendisi yazmaz. Her ürünü **Etkinleştir**.
   "Tüketilir/kalıcı" ayrımı Play Console'da seçilmez; oyun bunu kendisi yapar (tüketilenleri tekrar satın alınabilir yapar).
4. **Lisans testi**: Ayarlar → **Lisans testi** → kendi Gmail adresini ve test kullanıcılarını ekle. Bu hesaplar test kartıyla para ödemeden satın alır.
5. **Test et** (dahili test bağlantısından kurulan uygulamada):
   - Her ürünü bir kez al → elmas/paket geldi mi?
   - "Yavaş test kartı, birkaç dakika sonra onaylanır" ile al → oyunu kapat-aç → ödül geldi mi? (bekleyen ödeme yolu)
   - Uygulamayı sil, yeniden kur → ⚙ Ayarlar → **Satın alımları geri yükle** → Reklamsız paket geri geldi mi? (Açılışta zaten sessizce geri yüklenir.)
6. **Neden bu yapı Play kurallarına uygun**:
   - Ödeme yalnız Google Play Faturalandırma ile (Billing Library 9; 1 Kasım 2026'dan sonra en az sürüm 8 zorunlu).
   - Satın alımlar 3 gün içinde onaylanır/tüketilir (oyun ödülü verir vermez yapar; yarım kalan açılışta tamamlanır), yoksa Google iade ederdi.
   - Rastgele içerikli ürünlerin (değerli taşlar, kör kutu, kapalı taş) olasılıkları **satın almadan önce** gösteriliyor (Play'in "loot box" kuralı).
   - Haftalık premium otomatik yenilenmez, açıklamada yazıyor; abonelik kurallarına girmez.
   - Fiyatlar Google Play'in yerel fiyatıdır; oyun hiçbir şeyi gerçek paraya çevirmez; gizlilik politikası satın almayı anlatıyor.
   - Oyun satın alma yapmadan baştan sona oynanabilir.
7. **Sunucu doğrulaması yok**: Oyun çevrimdışı ve tek oyunculu olduğu için satın almaları kendi sunucumuzda doğrulamıyoruz (ücretli servis yok). Play buna izin verir; tek risk, cihazı kurcalayan birinin kendi oyununda elmas hilesi yapabilmesi — başkalarını etkilemez.
8. **Gelir**: Google satıştan hizmet bedeli keser (geliştiricinin yıllık ilk 1 milyon $ geliri için %15; güncel oranı Play Console'daki hizmet bedeli sayfasından kontrol et). Ödemeler Ödeme profiline aylık gelir.

## 14. İlk yayın kontrol listesi
- [ ] `docs/gizlilik.html`: [GELİŞTİRİCİ ADI], [E-POSTA ADRESİ] dolduruldu, GitHub Pages'te açılıyor.
- [ ] GitHub sırları: KEYSTORE_* (zorunlu), ADMOB_APP_ID, ADMOB_ODULLU_ID, GIZLILIK_URL (zorunlu), PLAY_GAMES_ID/PLAY_LIDER_ID (isteğe bağlı).
- [ ] Actions'ta imzalı AAB üretildi → Dahili teste yüklendi.
- [ ] Ödeme profili + 7 ürün oluşturuldu ve etkin; lisans testiyle hepsi denendi.
- [ ] Uygulama içeriği formları (bölüm 6) dolduruldu: gizlilik, reklam, erişim, IARC, hedef kitle 18+, veri güvenliği, reklam kimliği.
- [ ] Mağaza girişi: `magaza/metinler.md` (TR + EN), ikon, öne çıkan görsel, ekran görüntüleri. İstersen yeni ekran görüntüsü için elmas dükkânını da çekeriz.
- [ ] **Kapalı test: en az 12 kişi, 14 gün kesintisiz** → sonra üretim erişimi başvurusu → üretime gönder.

## 15. Elmas ve paket görselleri (ChatGPT, tek görsel) 🔧
Şimdilik elmas simgesi yerine 💎 işareti ve görselsiz paket kartları var. Aşağıdaki komutla tek bir görsel üret, bana gönder (ya da `oyun/` içinde `python3 kes_elmas.py gorsel.png` çalıştır); oyun görselleri otomatik kullanır:

> Create one square, high-resolution image: a 4×2 grid of 8 separate photorealistic game item renders, studio product lighting, each item centered in its own cell, on a perfectly flat solid magenta background (#FF00FF) everywhere — no shadows, no gradients, no text, no letters, no borders, no grid lines. Top row, left to right: 1) a single brilliant-cut blue-white diamond; 2) a small pile of 5–6 cut diamonds; 3) a red silk drawstring pouch overflowing with diamonds; 4) an open antique Chinese wooden chest with brass fittings, full of diamonds. Bottom row: 5) a large ornate treasure chest overflowing with diamonds and gold; 6) a golden imperial medallion with a green jade center; 7) a red lacquer Chinese seal stamp resting on a rolled scroll with a small golden padlock; 8) a small wooden merchant case with a brass flashlight, a jeweller's loupe, a few gold coins and three diamonds.
