import { useState } from 'react';
import { gradientCss } from '../../../shared/illustrations';
import type { Option } from '../../../shared/types';
import { imageUrl, localPhotoUrl } from '../util';

interface Props {
  option: Option;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  matched?: boolean;
  badges?: string[]; // bu şıkkı kim seçti (isimler)
}

const USE_LOCAL = import.meta.env.VITE_USE_LOCAL_PHOTOS === '1';

export function OptionCard({
  option,
  onClick,
  selected,
  dimmed,
  matched,
  badges,
}: Props) {
  const clickable = !!onClick;
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Görsel kaynak sırası: (varsa) yerel Unsplash → LoremFlickr → emoji
  const sources: string[] = [];
  if (USE_LOCAL) sources.push(localPhotoUrl(option.id));
  if (option.imgPrompt) sources.push(imageUrl(option.imgPrompt, option.id));
  const src = stage < sources.length ? sources[stage] : null;
  const showEmoji = !src || !loaded;

  const cls = [
    'option',
    clickable ? 'clickable' : '',
    selected ? 'selected' : '',
    dimmed ? 'dimmed' : '',
    matched ? 'matched' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      style={{ background: gradientCss(option.id) }}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
    >
      {src && (
        <img
          key={src}
          className={`option-img ${loaded ? 'loaded' : ''}`}
          src={src}
          alt={option.label}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setStage((s) => s + 1);
          }}
        />
      )}
      <div className="option-scrim" />

      {badges && badges.length > 0 && (
        <div className="option-badge">
          {badges.map((b, i) => (
            <span key={i} className="avatar-chip">
              {b}
            </span>
          ))}
        </div>
      )}

      {showEmoji && <div className="option-emoji">{option.icon}</div>}
      <div className="option-label">{option.label}</div>
    </div>
  );
}
