import { motion } from 'framer-motion';
import type { ScenarioPlatform } from '../App';
import AppIcon from '../components/AppIcon';
import PhoneStatusBar from '../components/PhoneStatusBar';
import '../styles/HubPage.css';

interface HubPageProps {
  onLaunch: (platform: ScenarioPlatform, tileRect: DOMRect) => void;
  completed: ScenarioPlatform[];
}

// Generic decoy apps — plain, unbranded icon shapes (not real logos), just
// there so the three real apps sit among an ordinary-looking home screen
// instead of standing alone.
const decoys = [
  {
    name: 'Camera',
    d: 'M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 3l-1.5 2H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2.5L15 3H9z',
    bg: 'linear-gradient(160deg,#3a3f4c,#1d2029)',
  },
  {
    name: 'Photos',
    d: 'M4 4h16v16H4zM4 15l4-4 3 3 5-5 4 4v3H4z M9 9a1.6 1.6 0 100-3.2A1.6 1.6 0 009 9z',
    bg: 'linear-gradient(160deg,#ffffff,#e9edf3)',
    dark: true,
  },
  {
    name: 'Notes',
    d: 'M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1.5V7h3.5L14 3.5zM7 11h10v1.5H7V11zm0 4h10v1.5H7V15zm0-8h6v1.5H7V7z',
    bg: 'linear-gradient(160deg,#ffe27a,#f6c94a)',
    dark: true,
  },
  {
    name: 'Calculator',
    d: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm2 3v3h8V5H8zm0 5.5v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zM8 14v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zM8 18v2h2v-2H8zm4 0v2h6v-2h-6z',
    bg: 'linear-gradient(160deg,#4a4f57,#232629)',
  },
  {
    name: 'Weather',
    d: 'M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm6.36 2.64a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.7-.71a1 1 0 011.42 0zM21 12a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM6.76 6.05a1 1 0 01-1.41 0l-.71-.7A1 1 0 116.05 3.94l.71.71a1 1 0 010 1.4zM4 11a1 1 0 100 2h1a1 1 0 100-2H4zm4.5 1.5A4.5 4.5 0 0117 13a3.5 3.5 0 11-.34 6.98H8a3.5 3.5 0 01-.5-6.96 4.48 4.48 0 011-1.52z',
    bg: 'linear-gradient(160deg,#6cc7ff,#3b8fe0)',
  },
  {
    name: 'Mail',
    d: 'M3 5h18a1 1 0 011 1v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a1 1 0 011-1zm1.4 1.5L12 12l7.6-5.5H4.4z',
    bg: 'linear-gradient(160deg,#6ea8ff,#2f6be0)',
  },
  {
    name: 'Calendar',
    d: 'M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zM5 8h14v10H5V8zm2 2v2h4v-2H7zm6 0v2h4v-2h-4z',
    bg: 'linear-gradient(160deg,#ff6b57,#e0402f)',
  },
  {
    name: 'Maps',
    d: 'M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z',
    bg: 'linear-gradient(160deg,#8ee08a,#3fae4a)',
  },
  {
    name: 'Music',
    d: 'M12 3v10.55A4 4 0 1014 17V7h4V3h-6z',
    bg: 'linear-gradient(160deg,#ff7ad1,#e0389e)',
  },
];

const dockIcons = [
  {
    name: 'Settings',
    d: 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm8.4 3.5c0-.5-.05-1-.13-1.47l2.06-1.6-2-3.46-2.43.98a7.9 7.9 0 00-2.55-1.47L14.4 1h-4l-.36 2.5A7.9 7.9 0 007.5 5L5.06 4 3.06 7.46l2.06 1.6a8 8 0 000 2.94L3.06 13.6l2 3.46 2.44-.98A7.9 7.9 0 009.63 20.5l.37 2.5h4l.36-2.5a7.9 7.9 0 002.55-1.47l2.43.98 2-3.46-2.06-1.6c.08-.48.13-.97.13-1.47z',
    bg: 'linear-gradient(160deg,#8b93a5,#5b6272)',
  },
  {
    name: 'Clock',
    d: 'M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5v5.4l4 2.4-.75 1.3-4.75-2.9V7h1.5z',
    bg: 'linear-gradient(160deg,#3a3f4c,#1d2029)',
  },
  {
    name: 'Phone',
    d: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.6 2.5 1 3.9 1.1.6 0 1 .5 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h3.7c.5 0 1 .4 1 1 .1 1.4.5 2.7 1.1 3.9.2.3.1.7-.2 1z',
    bg: 'linear-gradient(160deg,#8ee08a,#3fae4a)',
  },
  {
    name: 'Safari',
    d: 'M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5-2 5.5-5.5 2 2-5.5z',
    bg: 'linear-gradient(160deg,#6cc7ff,#3b8fe0)',
  },
];

export default function HubPage({ onLaunch, completed }: HubPageProps) {
  // real apps scattered among the decoys, same tile size, no special
  // highlight — they're meant to look like just another app on the screen
  const grid: ({ kind: 'real'; id: ScenarioPlatform; label: string } | { kind: 'decoy'; name: string; d: string; bg: string; dark?: boolean })[] = [
    { kind: 'decoy', ...decoys[0] },
    { kind: 'decoy', ...decoys[1] },
    { kind: 'real', id: 'roblox', label: 'Roblox' },
    { kind: 'decoy', ...decoys[2] },
    { kind: 'decoy', ...decoys[3] },
    { kind: 'real', id: 'whatsapp', label: 'WhatsApp' },
    { kind: 'decoy', ...decoys[4] },
    { kind: 'decoy', ...decoys[5] },
    { kind: 'decoy', ...decoys[6] },
    { kind: 'real', id: 'snapchat', label: 'Snapchat' },
    { kind: 'decoy', ...decoys[7] },
    { kind: 'decoy', ...decoys[8] },
  ];

  return (
    <div className="hub-stage">
      <motion.div
        className="tablet"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="tablet-cam" />
        <div className="tablet-screen">
          <div className="tablet-gloss" />
          <PhoneStatusBar />

          <motion.div
            className="tablet-desktop"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
          >
            <div className="app-grid">
              {grid.map((item, i) =>
                item.kind === 'real' ? (
                  <motion.div
                    key={item.id}
                    variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } }}
                  >
                    <AppIcon
                      platform={item.id}
                      label={item.label}
                      completed={completed.includes(item.id)}
                      onOpen={(rect) => onLaunch(item.id, rect)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.name + i}
                    className="app-icon decoy-icon"
                    variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } }}
                  >
                    <span className="app-icon-tile" style={{ background: item.bg }}>
                      <svg viewBox="0 0 24 24" width="58%" height="58%">
                        <path fill={item.dark ? '#2b2f3a' : '#ffffff'} d={item.d} />
                      </svg>
                    </span>
                    <span className="app-label">{item.name}</span>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          <div className="tablet-dock" aria-hidden>
            {dockIcons.map((icon) => (
              <span key={icon.name} className="dock-icon" style={{ background: icon.bg }}>
                <svg viewBox="0 0 24 24" width="58%" height="58%">
                  <path fill="#ffffff" d={icon.d} />
                </svg>
              </span>
            ))}
          </div>

          <span className="tablet-home" />
        </div>
      </motion.div>
    </div>
  );
}
