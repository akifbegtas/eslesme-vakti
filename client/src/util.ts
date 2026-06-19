import type { Tense } from '../../shared/types';

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
