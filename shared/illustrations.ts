// Görsel sistemi: her şık bir "kart" olarak çizilir —
// renkli gradient arka plan + büyük emoji/illüstrasyon + etiket.
// Emoji kullanımı "istisnasız her şıkta görsel" şartını %100 karşılar;
// gradient ise her şıkka tutarlı, şık bir görünüm verir.

export interface Gradient {
  from: string;
  to: string;
}

// Romantik / sıcak palet.
export const GRADIENTS: Gradient[] = [
  { from: '#ff9a9e', to: '#fad0c4' },
  { from: '#a18cd1', to: '#fbc2eb' },
  { from: '#ff758c', to: '#ff7eb3' },
  { from: '#f6d365', to: '#fda085' },
  { from: '#fbc2eb', to: '#a6c1ee' },
  { from: '#fccb90', to: '#d57eeb' },
  { from: '#e0c3fc', to: '#8ec5fc' },
  { from: '#f093fb', to: '#f5576c' },
  { from: '#fa709a', to: '#fee140' },
  { from: '#ff6a88', to: '#ff99ac' },
  { from: '#c471f5', to: '#fa71cd' },
  { from: '#48c6ef', to: '#6f86d6' },
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Bir seed (ör. option.id) için deterministik gradient seçer. */
export function gradientFor(seed: string): Gradient {
  return GRADIENTS[hashString(seed) % GRADIENTS.length];
}

export function gradientCss(seed: string): string {
  const g = gradientFor(seed);
  return `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`;
}

// Şık görsel referansları çoğunlukla emoji'dir (zengin + garantili kapsama).
// İleride özel SVG eklemek istenirse buraya anahtar→SVG eşlemesi konabilir.
export const SVG_ICONS: Record<string, string> = {};

export interface ResolvedIcon {
  kind: 'emoji' | 'svg';
  value: string;
}

export function resolveIcon(icon: string): ResolvedIcon {
  if (icon in SVG_ICONS) {
    return { kind: 'svg', value: SVG_ICONS[icon] };
  }
  return { kind: 'emoji', value: icon || '💞' };
}
