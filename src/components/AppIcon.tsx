import { motion } from 'framer-motion';
import type { ScenarioPlatform } from '../App';
import BrandIcon from './BrandIcon';

interface AppIconProps {
  platform: ScenarioPlatform;
  label: string;
  completed?: boolean;
  onOpen: () => void;
}

export default function AppIcon({ platform, label, completed, onOpen }: AppIconProps) {
  return (
    <motion.button
      className="app-icon"
      onClick={onOpen}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <span className="app-icon-tile">
        <BrandIcon platform={platform} fill />
        {completed && (
          <span className="app-icon-badge" aria-label="Completed">
            ✓
          </span>
        )}
      </span>
      <span className="app-label">{label}</span>
    </motion.button>
  );
}
