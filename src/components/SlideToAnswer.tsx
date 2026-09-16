import { useRef, useState } from 'react';
import { motion, useMotionValue, animate as animateValue } from 'framer-motion';
import '../styles/SlideToAnswer.css';

const PHONE_ICON = (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.6 2.5 1 3.9 1.1.6 0 1 .5 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h3.7c.5 0 1 .4 1 1 .1 1.4.5 2.7 1.1 3.9.2.3.1.7-.2 1z" />
  </svg>
);

export default function SlideToAnswer({ onAnswer }: { onAnswer: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [armed, setArmed] = useState(false);

  const handleDragEnd = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.offsetWidth - 56; // handle width + a little padding
    if (x.get() > max * 0.72) {
      setArmed(true);
      animateValue(x, max, { type: 'spring', stiffness: 500, damping: 40 });
      setTimeout(onAnswer, 180);
    } else {
      animateValue(x, 0, { type: 'spring', stiffness: 500, damping: 34 });
    }
  };

  return (
    <div className="slide-track" ref={trackRef}>
      <motion.div
        className="slide-hint"
        animate={armed ? { opacity: 0 } : { opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      >
        slide to answer
      </motion.div>
      <motion.div
        className="slide-handle"
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0.02}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.05 }}
      >
        {PHONE_ICON}
      </motion.div>
    </div>
  );
}
