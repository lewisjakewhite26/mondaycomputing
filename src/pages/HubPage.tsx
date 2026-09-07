import { motion } from 'framer-motion';
import type { ScenarioPlatform } from '../App';
import AppIcon from '../components/AppIcon';
import PhoneStatusBar from '../components/PhoneStatusBar';
import '../styles/HubPage.css';

interface HubPageProps {
  onSelectScenario: (platform: ScenarioPlatform) => void;
  completed: ScenarioPlatform[];
}

const apps: { id: ScenarioPlatform; label: string }[] = [
  { id: 'roblox', label: 'Roblox' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'snapchat', label: 'Snapchat' },
];

const dockIcons = [
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
    name: 'Settings',
    d: 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm8.4 3.5c0-.5-.05-1-.13-1.47l2.06-1.6-2-3.46-2.43.98a7.9 7.9 0 00-2.55-1.47L14.4 1h-4l-.36 2.5A7.9 7.9 0 007.5 5L5.06 4 3.06 7.46l2.06 1.6a8 8 0 000 2.94L3.06 13.6l2 3.46 2.44-.98A7.9 7.9 0 009.63 20.5l.37 2.5h4l.36-2.5a7.9 7.9 0 002.55-1.47l2.43.98 2-3.46-2.06-1.6c.08-.48.13-.97.13-1.47z',
    bg: 'linear-gradient(160deg,#8b93a5,#5b6272)',
  },
];

export default function HubPage({ onSelectScenario, completed }: HubPageProps) {
  const allDone = completed.length === apps.length;

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
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
          >
            <motion.h2
              className="tablet-heading"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              Tap an app to see what happens
            </motion.h2>

            <div className="app-grid">
              {apps.map((app) => (
                <motion.div
                  key={app.id}
                  variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } }}
                >
                  <AppIcon
                    platform={app.id}
                    label={app.label}
                    completed={completed.includes(app.id)}
                    onOpen={() => onSelectScenario(app.id)}
                  />
                </motion.div>
              ))}
            </div>

            <motion.p
              className="tablet-progress"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            >
              {allDone
                ? 'All three done — tap any app again to talk it over'
                : `${completed.length} of ${apps.length} done`}
            </motion.p>
          </motion.div>

          <div className="tablet-dock" aria-hidden>
            {dockIcons.map((icon) => (
              <span
                key={icon.name}
                className="dock-icon"
                style={{ background: icon.bg }}
              >
                <svg viewBox="0 0 24 24" width="58%" height="58%">
                  <path fill={icon.dark ? '#2b2f3a' : '#ffffff'} d={icon.d} />
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
