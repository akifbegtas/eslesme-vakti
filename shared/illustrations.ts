// Görsel sistemi: her şık bir "kart" olarak çizilir —
// renkli gradient arka plan + büyük emoji/illüstrasyon + etiket.
// Emoji kullanımı "istisnasız her şıkta görsel" şartını %100 karşılar;
// gradient ise her şıkka tutarlı, şık bir görünüm verir.

export interface Gradient {
  from: string;
  to: string;
}

// Lacivert / gri / çelik mavisi palet (koyu tema).
export const GRADIENTS: Gradient[] = [
  { from: '#1e3c72', to: '#2a5298' },
  { from: '#141e30', to: '#243b55' },
  { from: '#0f2027', to: '#2c5364' },
  { from: '#283e51', to: '#4b79a1' },
  { from: '#232526', to: '#414345' },
  { from: '#16222a', to: '#3a6073' },
  { from: '#2c3e50', to: '#3f5e76' },
  { from: '#1c1f2b', to: '#3b4a6b' },
  { from: '#0b486b', to: '#3a7bd5' },
  { from: '#36464e', to: '#5e7c8b' },
  { from: '#1a2980', to: '#26415e' },
  { from: '#42475a', to: '#1c1f2b' },
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
