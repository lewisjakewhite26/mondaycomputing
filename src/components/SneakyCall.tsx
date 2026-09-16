import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SlideToAnswer from './SlideToAnswer';
import { startRingtone } from '../utils/ringtone';
import { useClock } from '../utils/useClock';
import '../styles/SneakyCall.css';

const RING_DELAY_MS = 10000;

/**
 * A hidden-shortcut jump scare for mid-lesson: press F9 from anywhere in
 * the app and, 10 seconds later (silent — nothing shows yet, so
 * you can carry on talking), an "Unknown Number" call lights up over
 * whatever is currently on screen and rings until it's slid to answer.
 * Mounted once at the App level so it works regardless of which page is
 * showing.
 */
export default function SneakyCall() {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const ringDelayTimer = useRef<number | undefined>(undefined);
  const time = useClock();

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        if (pending || visible) return; // already queued or ringing — ignore repeats
        setPending(true);
        ringDelayTimer.current = window.setTimeout(() => {
          setPending(false);
          setVisible(true);
        }, RING_DELAY_MS);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pending, visible]);

  useEffect(() => {
    return () => {
      if (ringDelayTimer.current) window.clearTimeout(ringDelayTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const stopRing = startRingtone();
    return stopRing;
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sneaky-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <motion.div
            className="sneaky-phone splash-phone-ringing"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="call-screen">
              <div className="call-time">{time}</div>

              <div className="call-id">
                <div className="call-avatar-wrap">
                  <motion.span
                    className="call-ring"
                    animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.span
                    className="call-ring call-ring-2"
                    animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                  />
                  <div className="call-avatar">
                    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden fill="currentColor">
                      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-9 2.2-9 5v3h18v-3c0-2.8-4.6-5-9-5Z" />
                    </svg>
                  </div>
                </div>
                <p className="call-name">Unknown Number</p>
                <p className="call-sub">mobile &middot; incoming call</p>
              </div>

              <SlideToAnswer onAnswer={dismiss} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
