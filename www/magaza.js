// Yeşim Ustası — Google Play satın alma köprüsü (@capgo/native-purchases, Play Billing Library 9).
// Yalnız Android uygulamasında çalışır; tarayıcıda window.YesimMagaza tanımlanmaz ve oyun satın alma düğmelerini kapatır.
//
// Akış (sunucusuz, çevrimdışı oyun için):
//  1) purchaseProduct otomatik onaylamadan çağrılır.
//  2) Oyun ödülü verir (ver(id, jeton) → true); aynı jeton iki kez verilmez (oyun kaydında tutulur).
//  3) Sonra tüketilebilir ürün "consume", kalıcı ürün "acknowledge" edilir. (Google Play 3 gün içinde onaylanmayanı iade eder.)
//  4) Açılışta ve uygulamaya geri dönüldüğünde yarım kalan / bekleyen (PENDING → PURCHASED) satın alımlar tamamlanır.
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var P = C.Plugins || {};
  var NP = P.NativePurchases || (C.registerPlugin && C.registerPlugin('NativePurchases'));
  var App = P.App || (C.registerPlugin && C.registerPlugin('App'));
  if (!NP) return;
  var ayar = { tuketilen: [], ver: function () { return false; } };
  var calisiyor = false;

  function tuketilir(id) { return ayar.tuketilen.indexOf(id) >= 0; }
  // bir satın almayı oyuna ver ve Google Play'de kapat
  function tamamla(t) {
    if (!t || !t.purchaseToken) return Promise.resolve(false);
    if (t.purchaseState && String(t.purchaseState) !== '1') return Promise.resolve(false); // 1 = PURCHASED (2 = PENDING)
    var verildi = false;
    try { verildi = !!ayar.ver(t.productIdentifier, t.purchaseToken); } catch (e) { verildi = false; }
    if (!verildi) return Promise.resolve(false);
    var kapat = tuketilir(t.productIdentifier)
      ? NP.consumePurchase({ purchaseToken: t.purchaseToken })
      : (t.isAcknowledged ? Promise.resolve() : NP.acknowledgePurchase({ purchaseToken: t.purchaseToken }));
    return kapat.then(function () { return true; }, function () { return true; }); // ödül verildi; kapatma bir sonraki açılışta yeniden denenir
  }
  function yarimKalanlar() {
    if (calisiyor) return Promise.resolve(0);
    calisiyor = true;
    return NP.getUnfinishedTransactions()
      .then(function (r) {
        var L = (r && r.transactions) || [];
        return Promise.all(L.map(tamamla)).then(function (s) { return s.filter(Boolean).length; });
      })
      .catch(function () { return 0; })
      .then(function (n) { calisiyor = false; return n; });
  }

  window.YesimMagaza = {
    baslat: function (o) {
      ayar = o || ayar;
      NP.configure({ autoFinishTransactions: false }).catch(function () {}).then(yarimKalanlar)
        .then(function () { return window.YesimMagaza.geriYukle(); }).catch(function () {}); // kalıcı paketleri sessizce geri getir
      if (App) App.addListener('resume', function () { yarimKalanlar(); });
    },
    // { kimlik: 'yerel fiyat yazısı' }
    fiyatlar: function (ids) {
      return NP.getProducts({ productIdentifiers: ids, productType: 'inapp' }).then(function (r) {
        var f = {};
        ((r && r.products) || []).forEach(function (p) { f[p.identifier] = p.priceString; });
        return f;
      });
    },
    al: function (id, tuket) {
      return NP.purchaseProduct({ productIdentifier: id, productType: 'inapp', isConsumable: !!tuket, autoAcknowledgePurchases: false })
        .then(function (t) {
          if (t && !t.productIdentifier) t.productIdentifier = id;
          return tamamla(t);
        }, function (e) {
          var m = String((e && (e.message || e.code)) || e || '');
          if (/pending/i.test(m)) throw new Error('bekliyor');
          if (/cancel/i.test(m)) throw new Error('iptal');
          throw e;
        });
    },
    // kalıcı paketleri (reklamsız, başlangıç) yeniden kurulumdan sonra geri getirir
    geriYukle: function () {
      return NP.getPurchases({ productType: 'inapp' }).then(function (r) {
        var L = (r && r.purchases) || [];
        return Promise.all(L.map(tamamla)).then(function (s) {
          return yarimKalanlar().then(function (n) { return s.filter(Boolean).length + n; });
        });
      });
    }
  };
})();
