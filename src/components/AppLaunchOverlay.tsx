import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ScenarioPlatform } from '../App';
import { brandColor } from './BrandIcon';
import '../styles/AppLaunchOverlay.css';

export interface LaunchTarget {
  platform: ScenarioPlatform;
  rect: DOMRect;
}

interface AppLaunchOverlayProps {
  launch: LaunchTarget | null;
  /** fires the instant the icon has finished expanding to fill the screen —
   * this is the moment to swap the page underneath, while the overlay's
   * solid colour is still hiding the cut */
  onExpandComplete: () => void;
  /** fires after the overlay has faded out over the new page, revealing it */
  onDone: () => void;
}

/**
 * A real phone's app doesn't cut to a new screen — the icon itself grows to
 * fill the display, then the app fades in. This plays that same beat: a
 * solid tile (colour-matched to the app) grows from the tapped icon's exact
 * screen position to fill the viewport, then dissolves once the real
 * scenario page is mounted underneath it.
 */
export default function AppLaunchOverlay({ launch, onExpandComplete, onDone }: AppLaunchOverlayProps) {
  const [phase, setPhase] = useState<'expand' | 'fade'>('expand');

  useEffect(() => {
    if (launch) setPhase('expand');
  }, [launch]);

  if (!launch) return null;

  return (
    <motion.div
      className="app-launch-overlay"
      style={{ background: brandColor(launch.platform) }}
      initial={{
        top: launch.rect.top,
        left: launch.rect.left,
        width: launch.rect.width,
        height: launch.rect.height,
        borderRadius: 24,
        opacity: 1,
      }}
      animate={{
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        opacity: phase === 'expand' ? 1 : 0,
      }}
      transition={
        phase === 'expand'
          ? { duration: 0.42, ease: [0.32, 0.72, 0, 1] }
          : { duration: 0.3, ease: 'easeOut' }
      }
      onAnimationComplete={() => {
        if (phase === 'expand') {
          onExpandComplete();
          setPhase('fade');
        } else {
          onDone();
        }
      }}
    />
  );
}
