import { useClock } from '../utils/useClock';

interface PhoneStatusBarProps {
  /** dark text on a light header (Snapchat), otherwise white */
  dark?: boolean;
}

/** iOS-style status bar: time, signal, wifi, battery. */
export default function PhoneStatusBar({ dark }: PhoneStatusBarProps) {
  const fill = dark ? '#111' : '#fff';
  const time = useClock();
  return (
    <div className={`phone-statusbar ${dark ? 'is-dark' : ''}`}>
      <span className="phone-statusbar-time">{time}</span>
      <span className="phone-statusbar-right">
        <svg viewBox="0 0 18 12" width="17" height="11" aria-hidden>
          <path fill={fill} d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z" />
        </svg>
        <svg viewBox="0 0 16 12" width="16" height="11" aria-hidden>
          <path
            fill={fill}
            d="M8 2.6c2 0 3.9.8 5.3 2.1l1-1A9 9 0 0 0 8 .7 9 9 0 0 0 1.7 3.7l1 1A7.4 7.4 0 0 1 8 2.6Zm0 3c1.2 0 2.3.5 3.1 1.3l1-1A5.9 5.9 0 0 0 8 3.9c-1.6 0-3 .7-4.1 1.7l1 1c.8-.8 2-1.3 3.1-1.3Zm0 3c.5 0 1 .2 1.4.6l-1.4 1.5-1.4-1.5c.4-.4.9-.6 1.4-.6Z"
          />
        </svg>
        <span className="phone-batt" style={{ borderColor: dark ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,.55)' }}>
          <span
            className="phone-batt-fill"
            style={{ background: dark ? '#111' : '#fff' }}
          />
        </span>
      </span>
    </div>
  );
}
