// Yeşim Ustası — AdMob ödüllü reklam köprüsü (yalnız Android uygulamasında çalışır; tarayıcıda hiçbir şey yapmaz).
// Oyun, window.YesimReklam.odullu(yer, geriCagri(ok, neden)) çağırır. Reklam izlenip ödül hak edilirse ok=true.
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var P = C.Plugins || {};
  var AdMob = P.AdMob || (C.registerPlugin && C.registerPlugin('AdMob'));
  var App = P.App || (C.registerPlugin && C.registerPlugin('App'));
  var A = window.YESIM_AYAR || {};
  var hazir = false, yukleniyor = false, odulVar = false, bekleyen = null, izinVar = true;

  function bitir(ok, neden) { var cb = bekleyen; bekleyen = null; hazir = false; yukle(); if (cb) cb(ok, neden); }
  function yukle() {
    if (!AdMob || !izinVar || hazir || yukleniyor) return;
    yukleniyor = true;
    AdMob.prepareRewardVideoAd({ adId: A.odulluReklam, isTesting: !!A.test })
      .then(function () { hazir = true; yukleniyor = false; })
      .catch(function () { yukleniyor = false; setTimeout(yukle, 30000); });
  }
  async function baslat() {
    if (!AdMob) return;
    try {
      await AdMob.initialize({ initializeForTesting: !!A.test });
      // GDPR / Birleşik Krallık rızası (Google UMP). Gerekliyse rıza formu bir kez gösterilir.
      var bilgi = await AdMob.requestConsentInfo();
      if (bilgi && bilgi.isConsentFormAvailable && bilgi.status === 'REQUIRED') bilgi = await AdMob.showConsentForm();
      if (bilgi && bilgi.canRequestAds === false) izinVar = false;
    } catch (e) { /* rıza hatası: yine de reklam yüklemeyi dener */ }
    yukle();
  }
  if (AdMob) {
    AdMob.addListener('onRewardedVideoAdReward', function () { odulVar = true; });
    AdMob.addListener('onRewardedVideoAdDismissed', function () { setTimeout(function () { bitir(odulVar, odulVar ? '' : 'yarim'); }, 400); });
    AdMob.addListener('onRewardedVideoAdFailedToShow', function () { bitir(false, 'yok'); });
  }
  window.YesimReklam = {
    odullu: function (yer, cb) {
      if (!AdMob || !hazir) { yukle(); cb(false, 'yok'); return; }
      odulVar = false; bekleyen = cb;
      AdMob.showRewardVideoAd().catch(function () { bitir(false, 'yok'); });
    },
    tercih: function () {
      if (!AdMob) return;
      var f = AdMob.showPrivacyOptionsForm || AdMob.showConsentForm;
      if (f) f.call(AdMob).then(function () { izinVar = true; yukle(); }).catch(function () {});
    }
  };
  // Google Play Oyunlar: dünya sıralaması (ayar.js'te siralamaId varsa)
  var PG = P.PlayGames || (C.registerPlugin && C.registerPlugin('PlayGames'));
  if (PG && A.siralamaId) {
    var girildi = false;
    PG.signIn({ silent: true }).then(function (r) { girildi = !!(r && r.signedIn); }).catch(function () {});
    window.YesimSiralama = {
      gonder: function (puan) { if (girildi) PG.submitScore({ leaderboardId: A.siralamaId, score: puan }).catch(function () {}); },
      goster: function () {
        var ac = function () { PG.showLeaderboard({ leaderboardId: A.siralamaId }).catch(function () {}); };
        if (girildi) ac(); else PG.signIn({ silent: false }).then(function (r) { girildi = !!(r && r.signedIn); if (girildi) ac(); }).catch(function () {});
      }
    };
  }
  // Android geri tuşu: önce oyundaki pencereyi kapatır, sonra pazara döner, pazardaysa uygulamayı arka plana alır.
  if (App) App.addListener('backButton', function () { if (!(window.YesimGeri && window.YesimGeri())) App.minimizeApp(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat); else baslat();
})();
