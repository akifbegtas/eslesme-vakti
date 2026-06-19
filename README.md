# Eşleşme Vakti 💞

Çiftler için web tabanlı **eşleşme oyunu**. Bir ana ekran (TV/bilgisayar) oda açar,
herkes telefonundan **oda koduyla** lobiye girer. Çiftler ilişkileriyle ilgili
**geçmiş / şimdi / gelecek** sorularına ayrı ayrı cevap verir; **ikisi de aynı şıkkı
seçerse eşleşme = +1 puan**. 3 yanlışta (eşleşmeme) sıra sıradaki çifte geçer.

- 🎯 110 soru (geçmiş/şimdi/gelecek), **+18 içermez**
- 🖼️ Her şıkkın görseli var (emoji/SVG illüstrasyon kartları)
- ⏱️ Soru başına ~15 sn; **ikisi de seçince** anında doğru/yanlış açılır
- 💞 Eşleşmede **+1 efekti** + konfeti
- ⏭️ Sıradaki soruya **ancak iki eş de butona basınca** geçilir
- ❌❌❌ 3 yanlışta sıra yeni çifte; sonunda skor tablosu

## Teknoloji
- **Sunucu:** Node + Express + Socket.IO (oyun durumu bellekte)
- **İstemci:** Vite + React + TypeScript
- **Paylaşılan:** `shared/` (tipler, 110 soru, görsel sistemi)

## Kurulum
```bash
npm install
```

## Geliştirme
Sunucu (3001) + Vite (5173) birlikte çalışır:
```bash
npm run dev
```
Tarayıcıda **http://localhost:5173** → "Oda Kur".

## Üretim / gerçek oynanış (telefonlardan)
```bash
npm run build   # istemciyi derler
npm start       # sunucu hem oyunu hem istemciyi 3001'de servis eder
```
Ana ekranı açan cihaz ve telefonlar **aynı Wi-Fi'da** olmalı. Sunucu açılışta LAN
adresini yazar (ör. `http://192.168.1.20:3001`). Ana ekranı bu adresten açın; oyuncular
host ekranındaki **QR'ı okutarak** ya da adrese gidip **oda kodunu** girerek katılır.

Port değiştirmek için: `PORT=4000 npm start`.

## Nasıl oynanır
1. Ana ekranda **Oda Kur** → oda kodu + QR görünür.
2. Herkes telefondan katılır; her çift bir "çift" oluşturur (1 kişi kurar, eşi katılır).
3. Tüm çiftler 2 kişi olunca host **Oyunu Başlat**'a basar.
4. Aktif çiftin iki üyesi de soruyu cevaplar → aynıysa **+1**, değilse yanlış.
5. İki üye de **Sıradaki Soru**'ya basınca devam edilir.
6. 3 yanlışta sıra sonraki çifte; tüm çiftler bitince **skor tablosu**.

## Canlıya alma (github.io + Render)

Oyunun gerçek-zaman sunucusu Node gerektirir; GitHub Pages statik olduğu için
**arayüz Pages'te, sunucu Render'da** barınır.

**1) Backend → Render**
1. [render.com](https://render.com) → GitHub ile giriş → **New → Blueprint**.
2. Bu repoyu seç → `render.yaml` otomatik okunur → **Apply**.
3. Deploy bitince servis URL'sini kopyala (ör. `https://eslesme-vakti.onrender.com`).
   - Not: Ücretsiz katman uykuya geçer; ilk açılış ~30-60 sn sürebilir.

**2) Frontend → GitHub Pages**
İstemci, Render adresine bağlanacak şekilde derlenip `gh-pages` dalına yayınlanır:
```bash
VITE_BASE=/eslesme-vakti/ VITE_SERVER_URL=https://<render-url> npm run build
npx gh-pages -d client/dist
```
Repo **Settings → Pages → Source: gh-pages / (root)**. Yayında:
**https://<kullanıcı-adın>.github.io/eslesme-vakti/**

## Yapı
```
shared/    types.ts · questions.ts (110 soru) · illustrations.ts
server/    src/index.ts (Socket.IO) · rooms.ts (oda) · game.ts (durum makinesi)
client/    src/screens · components · store.tsx (durum) · styles
```
