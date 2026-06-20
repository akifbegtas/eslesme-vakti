import type { Tense } from '../../shared/types';

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'for', 'to', 'and', 'with', 'two',
  'some', 'few', 'very', 'as', 'by',
]);

// LoremFlickr ile anahtarsız GERÇEK stok fotoğraf. Prompt'tan anahtar kelimeler
// çıkarılır; seed (option.id) sabit "lock" verir → aynı şık hep aynı fotoğraf.
export function imageUrl(prompt: string, seed: string): string {
  const kws = prompt
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .slice(0, 3)
    .join(',');
  const tag = encodeURIComponent(kws || 'love');
  return `https://loremflickr.com/400/320/${tag}?lock=${hashString(seed)}`;
}

export function tenseLabel(t: Tense): string {
  switch (t) {
    case 'past':
      return 'GEÇMİŞ ⏮';
    case 'present':
      return 'ŞİMDİ ▶';
    case 'future':
      return 'GELECEK ⏭';
    default:
      return '';
  }
}
