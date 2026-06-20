import type { Tense } from '../../shared/types';

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// LoremFlickr ile anahtarsız GERÇEK stok fotoğraf. imgPrompt artık tek güçlü
// anahtar kelime; seed (option.id) sabit "lock" verir → aynı şık hep aynı foto.
export function imageUrl(keyword: string, seed: string): string {
  const tag = encodeURIComponent(keyword.trim().toLowerCase() || 'love');
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
