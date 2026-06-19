import { gradientCss, resolveIcon } from '../../../shared/illustrations';
import type { Option } from '../../../shared/types';

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
  const icon = resolveIcon(option.icon);
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
      {badges && badges.length > 0 && (
        <div className="option-badge">
          {badges.map((b, i) => (
            <span key={i} className="avatar-chip">
              {b}
            </span>
          ))}
        </div>
      )}
      {icon.kind === 'svg' ? (
        <div
          className="option-emoji"
          dangerouslySetInnerHTML={{ __html: icon.value }}
        />
      ) : (
        <div className="option-emoji">{icon.value}</div>
      )}
      <div className="option-label">{option.label}</div>
    </div>
  );
}
