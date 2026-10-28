# Devir notu — Yeşim Ustası (28 Ekim 2026)

## Durum
- Oyun özellik olarak tamam ve test edildi: 8 pazar, 24 yeşim rengi, 11 kabuk, 36 ürün (12 bedava, 6 her kesimde reklamlı, 18 elmas kalıplı), ölçülü ürün yerleşimi + otomatik öneri, kapalı taşlar, ihale, dükkân/eleman/çırak, günlük görevler, sen-yokken satışı, sıralama (+ isteğe bağlı Play Games), elmas sistemi ve elmas dükkânı, 7 Google Play ürünü, giriş ekranı + yerel profil, ilk oyun rehberi, 8 dil.
- Kör kutu dengesi: beklenen getiri ~%92, günde 8 satın alma; atölye doluyken taş yerine küçük para.
- Android derlemesi GitHub'da **başarılı** (test APK). Yeni ikon/amblem/afiş yerleşti.
- Web önizleme: claude.ai artifact (eski oturumda yayınlandı; yeni oturum yeni bir artifact açabilir).

## Bekleyenler (oyun sahibinde)
1. İmza anahtarı → GitHub Secrets: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` (rehber §3). Sonra imzalı AAB derlemesi.
2. Gizlilik politikası: `docs/gizlilik.html` içindeki [GELİŞTİRİCİ ADI] ve [E-POSTA ADRESİ] (oyun sahibinden alınacak), sonra Settings → Pages: `main` `/docs` → `https://mka6800-mka.github.io/yesim-ustasi/gizlilik.html`; bu adresi `GIZLILIK_URL` gizlisine ekle. (Pages API'si oturumdan kapalı; oyun sahibi açar.)
3. AdMob: `ADMOB_APP_ID`, `ADMOB_ODULLU_ID` gizlileri (yoksa test reklamı).
4. Play Console: ödeme profili, AAB'yi kapalı teste yükle, 7 ürün (rehber §13 tablo), formlar (§6: IARC simüle kumar + rastgele öğe evet, hedef kitle 18+), mağaza sayfası (`magaza/metinler.md`, `magaza/ekran/tr|en`, ikon, afiş).
5. Kapalı test: 12 kişi, 14 gün kesintisiz (yeni kişisel hesap kuralı) → üretim başvurusu.

## Bilinen küçük işler
- Gerçek telefonda deneme yapılmadı (yalnız derleme başarılı). İlk APK denemesinden gelen geri bildirimleri düzelt.
- Gerçek satın alma ve reklam yalnız dahili/kapalı test kanalında denenebilir.
- Eksik görsel: `kisi_satici.webp` (satış elemanı), `elmas.webp` ve `paket_*.webp` (komut rehber §15). Yoksa oyun 💎 işareti ve görselsiz kart kullanır.
- Pazar sahnesinde yürüyen müşteriler bazen satıcı adlarının önünden geçiyor (kozmetik).
- Ekran görüntüleri (`oyun/test/ekran.js`) yeni ürünler ve logodan önce çekildi; istenirse yeniden üret.
