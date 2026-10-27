// `npx cap add android` sonrasında çalışır: AdMob uygulama kimliği, hedef API 36, sürüm numarası, imzalama, ikonlar ve ayar.js.
// Ortam değişkenleri (GitHub Actions sırlarından gelir, hepsi isteğe bağlı):
//   ADMOB_APP_ID, ADMOB_ODULLU_ID, GIZLILIK_URL, SURUM_KODU, KEYSTORE_PATH, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD
const fs = require('fs'), path = require('path');
const kok = path.join(__dirname, '..'), and = path.join(kok, 'android');
const oku = p => fs.readFileSync(p, 'utf8'), yaz = (p, s) => fs.writeFileSync(p, s);
if (!fs.existsSync(and)) { console.error('android/ klasörü yok: önce "npx cap add android" çalıştır.'); process.exit(1); }
const E = process.env;
const TEST_APP = 'ca-app-pub-3940256099942544~3347511713', TEST_ODULLU = 'ca-app-pub-3940256099942544/5224354917';
const appId = E.ADMOB_APP_ID || TEST_APP, odullu = E.ADMOB_ODULLU_ID || TEST_ODULLU, test = !E.ADMOB_ODULLU_ID;

// 1) AndroidManifest: AdMob uygulama kimliği
const man = path.join(and, 'app/src/main/AndroidManifest.xml');
let m = oku(man);
if (!m.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  m = m.replace('</application>', `    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${appId}"/>\n    </application>`);
}
if (!m.includes('com.android.vending.BILLING')) m = m.replace('</manifest>', '    <uses-permission android:name="com.android.vending.BILLING"/>\n</manifest>');
if (!m.includes('com.google.android.gms.permission.AD_ID')) m = m.replace('</manifest>', '    <uses-permission android:name="com.google.android.gms.permission.AD_ID"/>\n</manifest>');
m = m.replace(/android:screenOrientation="[^"]*"/g, '');
m = m.replace('<activity', '<activity android:screenOrientation="portrait"');
yaz(man, m);

// 2) Hedef API 36 (Google Play: 31 Ağustos 2026'dan itibaren yeni uygulamalar ve güncellemeler için zorunlu)
const vg = path.join(and, 'variables.gradle');
if (fs.existsSync(vg)) {
  let v = oku(vg);
  v = v.replace(/compileSdkVersion\s*=\s*\d+/, 'compileSdkVersion = 36').replace(/targetSdkVersion\s*=\s*\d+/, 'targetSdkVersion = 36');
  yaz(vg, v);
}

// 3) Sürüm ve imzalama
const bg = path.join(and, 'app/build.gradle');
let g = oku(bg);
const pk = JSON.parse(oku(path.join(kok, 'package.json')));
const kod = parseInt(E.SURUM_KODU || '1', 10);
g = g.replace(/versionCode\s+\d+/, 'versionCode ' + kod).replace(/versionName\s+"[^"]*"/, 'versionName "' + pk.version + '"');
if (E.KEYSTORE_PATH && !g.includes('signingConfigs')) {
  g = g.replace(/android\s*\{/, `android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH"))
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }`);
  g = g.replace(/buildTypes\s*\{\s*release\s*\{/, 'buildTypes {\n        release {\n            signingConfig signingConfigs.release');
}
yaz(bg, g);

// 4) İkonlar (magaza/ikon/android/res → app/src/main/res)
const ikon = path.join(kok, 'magaza/ikon/android/res');
function kopyala(a, b) { for (const f of fs.readdirSync(a)) { const x = path.join(a, f), y = path.join(b, f); if (fs.statSync(x).isDirectory()) { fs.mkdirSync(y, { recursive: true }); kopyala(x, y); } else fs.copyFileSync(x, y); } }
if (fs.existsSync(ikon)) kopyala(ikon, path.join(and, 'app/src/main/res'));

// 4b) Google Play Oyunlar (dünya sıralaması): PLAY_GAMES_ID varsa proje kimliği eklenir
if (E.PLAY_GAMES_ID) {
  const vdir = path.join(and, 'app/src/main/res/values'); fs.mkdirSync(vdir, { recursive: true });
  yaz(path.join(vdir, 'games-ids.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <string name="game_services_project_id" translatable="false">${E.PLAY_GAMES_ID}</string>\n</resources>\n`);
  let m2 = oku(man);
  if (!m2.includes('com.google.android.gms.games.APP_ID')) m2 = m2.replace('</application>', '    <meta-data android:name="com.google.android.gms.games.APP_ID" android:value="@string/game_services_project_id"/>\n    </application>');
  yaz(man, m2);
}
// 5) ayar.js (reklam kimliği, gizlilik bağlantısı) — cap sync www'yi kopyalamadan önce yazılır
yaz(path.join(kok, 'www/ayar.js'), `window.YESIM_AYAR = ${JSON.stringify({ odulluReklam: odullu, test, gizlilik: E.GIZLILIK_URL || '', siralamaId: E.PLAY_GAMES_ID ? (E.PLAY_LIDER_ID || '') : '' }, null, 2)};\n`);
console.log('Android hazır • AdMob ' + (test ? 'TEST kimlikleri' : 'gerçek kimlikler') + ' • sürüm ' + pk.version + ' (' + kod + ')' + (E.KEYSTORE_PATH ? ' • imzalı' : ' • imzasız'));
