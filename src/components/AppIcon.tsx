import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { ScenarioPlatform } from '../App';
import BrandIcon from './BrandIcon';

interface AppIconProps {
  platform: ScenarioPlatform;
  label: string;
  completed?: boolean;
  /** called with the tile's on-screen position, so the caller can animate an
   * "app opening" expansion starting from exactly where the icon was */
  onOpen: (tileRect: DOMRect) => void;
}

export default function AppIcon({ platform, label, completed, onOpen }: AppIconProps) {
  const tileRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    const rect = tileRef.current?.getBoundingClientRect();
    if (rect) onOpen(rect);
  };

  return (
    <motion.button
      className="app-icon"
      onClick={handleClick}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <span className="app-icon-tile" ref={tileRef}>
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
