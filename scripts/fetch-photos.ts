/**
 * Her şık için yüksek kaliteli stok fotoğrafı indirir ve client/public/photos/<id>.jpg
 * olarak kaydeder (kendi makinende çalışır; anahtar dışarı GİTMEZ, repoya da girmez).
 *
 * Kullanım (ikisinden biri — Pexels önerilir, ücretsiz limiti daha yüksek):
 *   PEXELS_KEY=xxxx   npm run photos
 *   UNSPLASH_KEY=xxxx npm run photos
 *
 * Tekrar çalıştırılabilir: indirilmiş dosyaları atlar (limit dolarsa 1 saat sonra
 * tekrar çalıştır, kaldığı yerden devam eder).
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QUESTIONS } from '../shared/questions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../client/public/photos');

const PEXELS_KEY = process.env.PEXELS_KEY;
const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
const provider = PEXELS_KEY ? 'pexels' : UNSPLASH_KEY ? 'unsplash' : null;

if (!provider) {
  console.error('Anahtar yok. Şunlardan birini ver:');
  console.error('  PEXELS_KEY=xxxx npm run photos    (https://www.pexels.com/api/)');
  console.error('  UNSPLASH_KEY=xxxx npm run photos  (https://unsplash.com/developers)');
  process.exit(1);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// keyword -> optionId[]
const byKeyword = new Map<string, string[]>();
for (const q of QUESTIONS) {
  for (const o of q.options) {
    const kw = (o.imgPrompt ?? '').trim().toLowerCase();
    if (!kw) continue;
    if (!byKeyword.has(kw)) byKeyword.set(kw, []);
    byKeyword.get(kw)!.push(o.id);
  }
}

async function searchPool(keyword: string): Promise<string[]> {
  if (provider === 'pexels') {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=12&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY! } });
    if (res.status === 429) throw new Error('RATE');
    if (!res.ok) return [];
    const data: any = await res.json();
    return (data.photos ?? []).map((p: any) => p.src?.large || p.src?.medium).filter(Boolean);
  } else {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=12&orientation=landscape&content_filter=high`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
    if (res.status === 429) throw new Error('RATE');
    if (!res.ok) return [];
    const data: any = await res.json();
    return (data.results ?? []).map((p: any) => p.urls?.small).filter(Boolean);
  }
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const existing = new Set(
    existsSync(OUT) ? (await readdir(OUT)).map((f) => f.replace(/\.jpg$/, '')) : []
  );

  const keywords = [...byKeyword.keys()];
  console.log(`Sağlayıcı: ${provider} · ${keywords.length} benzersiz anahtar · ${QUESTIONS.reduce((n, q) => n + q.options.length, 0)} şık`);

  let done = 0;
  let fetched = 0;
  let rateHit = false;

  for (const kw of keywords) {
    const ids = byKeyword.get(kw)!;
    const missing = ids.filter((id) => !existing.has(id));
    if (missing.length === 0) {
      done += ids.length;
      continue;
    }

    let pool: string[];
    try {
      pool = await searchPool(kw);
    } catch (e: any) {
      if (e.message === 'RATE') {
        rateHit = true;
        break;
      }
      pool = [];
    }
    fetched++;

    if (pool.length === 0) {
      console.log(`  ⚠ "${kw}" için sonuç yok (atlandı, LoremFlickr'a düşecek)`);
      continue;
    }

    for (const id of missing) {
      const pick = pool[hash(id) % pool.length];
      const ok = await download(pick, join(OUT, `${id}.jpg`));
      if (ok) {
        existing.add(id);
        done++;
      }
      await sleep(60);
    }
    process.stdout.write(`\r  indirilen şık: ${done}   `);
    await sleep(120); // sağlayıcıya nazik ol
  }

  console.log('');
  const total = QUESTIONS.reduce((n, q) => n + q.options.length, 0);
  console.log(`Bitti: ${done}/${total} şık görseli hazır (bu çalıştırmada ${fetched} arama).`);
  if (rateHit) {
    console.log('⏳ Saatlik limit doldu. ~1 saat sonra `npm run photos` ile tekrar çalıştır — kaldığı yerden devam eder.');
  } else if (done >= total) {
    console.log('🎉 Hepsi indirildi! Yayınlamak için:  npm run deploy:photos');
  } else {
    console.log('Bazıları eksik kaldı; tekrar çalıştırırsan dener. Yayın:  npm run deploy:photos');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
