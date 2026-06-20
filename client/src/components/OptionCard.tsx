import { useState } from 'react';
import { gradientCss } from '../../../shared/illustrations';
import type { Option } from '../../../shared/types';
import { imageUrl } from '../util';

interface Props {
  option: Option;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  matched?: boolean;
  badges?: string[]; // bu şıkkı kim seçti (isimler)
}

export function OptionCard({
  option,
  onClick,
  selected,
  dimmed,
  matched,
  badges,
}: Props) {
  const clickable = !!onClick;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const url = option.imgPrompt ? imageUrl(option.imgPrompt, option.id) : null;
  // Foto yüklenene kadar (ya da hata olursa) emoji + gradient yedek olarak görünür.
  const showEmoji = !url || !loaded || failed;

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
      {url && !failed && (
        <img
          className={`option-img ${loaded ? 'loaded' : ''}`}
          src={url}
          alt={option.label}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
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
