import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlideToAnswer from '../components/SlideToAnswer';
import { startRingtone } from '../utils/ringtone';
import { useClock } from '../utils/useClock';
import '../styles/SplashPage.css';

const BLOB = {
  borderRadius: [
    '62% 38% 40% 60% / 58% 62% 38% 42%',
    '38% 62% 63% 37% / 44% 38% 62% 56%',
    '55% 45% 35% 65% / 60% 52% 48% 40%',
    '48% 52% 58% 42% / 38% 44% 56% 62%',
    '62% 38% 40% 60% / 58% 62% 38% 42%',
  ],
};

interface SplashPageProps {
  onStart: () => void;
}

// Creepy chat fragments drifting in the background (thematically on-point)
const PHRASES = [
  'add me on snap',
  'what school do you go to?',
  "don't tell anyone",
  'send a pic',
  'keep the streak going',
  "i've got free robux",
  'turn your location on',
  'you can trust me',
  "it's just a joke",
  'delete this chat',
  'are you home alone?',
  'how old are you really?',
  'add me on discord',
  "why are you being weird",
  "everyone's already seen it",
  'just between us',
  "don't be boring",
  'send it or i tell everyone',
  'what does your uniform look like?',
  "i won't screenshot i promise",
  'move to my private server',
  'you owe me now',
  'stop leaving me on delivered',
  'no one will know',
  'prove it',
  "it'll be our secret",
];

interface Ghost {
  t: string;
  left: number;
  top: number;
  w: number;
  dur: number;
  delay: number;
  gap: number;
  peak: number;
  rot: number;
  dx: number;
  dy: number;
  big: boolean;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function overlaps(a: Box, b: Box, pad: number) {
  return (
    a.x - pad < b.x + b.w &&
    a.x + a.w + pad > b.x &&
    a.y - pad < b.y + b.h &&
    a.y + a.h + pad > b.y
  );
}

/**
 * Scatter phrases at random positions across the whole splash, rejecting any
 * placement that would overlap another phrase or the phone. Random but tidy.
 */
function buildGhosts(): Ghost[] {
  // Everything in viewport-% units. The phone sits in the middle.
  const PHONE: Box = { x: 33, y: 4, w: 34, h: 92 };
  const boxes: Box[] = [PHONE];
  const out: Ghost[] = [];

  for (const t of shuffle(PHRASES)) {
    if (out.length >= 13) break;
    const big = t.length <= 18 && Math.random() < 0.3;
    const wantW = Math.min(40, t.length * (big ? 1.5 : 1.0) + 5);
    const h = (wantW >= 34 ? 10 : 5.5) + (big ? 3 : 0);

    for (let attempt = 0; attempt < 80; attempt++) {
      const w = wantW;
      const x = rand(1.5, 98.5 - w);
      const y = rand(3, 95 - h);
      const box: Box = { x, y, w, h };
      if (boxes.some((b) => overlaps(box, b, 2.5))) continue;
      boxes.push(box);
      out.push({
        t,
        left: x,
        top: y,
        w,
        dur: 6 + Math.random() * 8,
        delay: Math.random() * 11,
        gap: 1 + Math.random() * 6,
        peak: 0.24 + Math.random() * 0.24,
        rot: (Math.random() - 0.5) * 10,
        dx: (Math.random() - 0.5) * 12,
        dy: (Math.random() - 0.5) * 8,
        big,
      });
      break;
    }
  }

  return out;
}

export default function SplashPage({ onStart }: SplashPageProps) {
  const ghosts = useMemo(() => buildGhosts(), []);
  const [stage, setStage] = useState<'locked' | 'on'>('locked');
  const time = useClock();

  const handleAnswer = () => setStage('on');

  // Real ring + vibrate while the call is up, stopped the instant it's answered
  useEffect(() => {
    if (stage !== 'locked') return;
    const stop = startRingtone();
    return stop;
  }, [stage]);

  return (
    <div className="splash-container">
      {/* Animated blurry colour field — only once the call is answered */}
      {stage === 'on' && (
        <div className="splash-glows">
          <motion.div
            className="glow glow-coral"
            animate={{ x: [0, 130, -70, 0], y: [0, -80, 60, 0], scale: [1, 1.3, 0.9, 1] }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="glow glow-amber"
            animate={{ x: [0, -120, 80, 0], y: [0, 70, -60, 0], scale: [1, 0.85, 1.3, 1] }}
            transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="glow glow-teal"
            animate={{ x: [0, 90, -100, 0], y: [0, 90, -50, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="glow glow-ember"
            animate={{ x: [0, -80, 50, 0], y: [0, -60, 70, 0], scale: [1, 1.25, 0.88, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Drifting chat fragments — held back until the call is answered */}
      {stage === 'on' && ghosts.map((g, i) => (
        <div
          key={i}
          className="ghost-wrap"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            width: `${g.w}%`,
            rotate: `${g.rot}deg`,
          }}
        >
          <motion.span
            className={`ghost-text${g.big ? ' ghost-big' : ''}`}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, g.peak, g.peak, 0], x: [0, g.dx, g.dx * 1.5], y: [0, g.dy, g.dy * 1.5] }}
            transition={{
              duration: g.dur,
              times: [0, 0.22, 0.68, 1],
              repeat: Infinity,
              repeatDelay: g.gap,
              delay: g.delay,
              ease: 'easeInOut',
            }}
          >
            {g.t}
          </motion.span>
        </div>
      ))}

      {/* Phone */}
      <motion.div
        className={`splash-phone${stage === 'locked' ? ' splash-phone-ringing' : ''}`}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="phone-btn phone-btn-silent" />
        <span className="phone-btn phone-btn-volup" />
        <span className="phone-btn phone-btn-voldown" />
        <span className="phone-btn phone-btn-power" />

        <div className="splash-phone-screen">
          <div className="splash-island" />
          <div className="splash-gloss" />

          {stage === 'on' && (
            <div className="splash-statusbar">
              <span>{time}</span>
              <span className="splash-statusbar-right">
                <svg viewBox="0 0 18 12" width="17" height="11" aria-hidden><path fill="#fff" d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z"/></svg>
                <svg viewBox="0 0 16 12" width="16" height="11" aria-hidden><path fill="#fff" d="M8 2.6c2 0 3.9.8 5.3 2.1l1-1A9 9 0 0 0 8 .7 9 9 0 0 0 1.7 3.7l1 1A7.4 7.4 0 0 1 8 2.6Zm0 3c1.2 0 2.3.5 3.1 1.3l1-1A5.9 5.9 0 0 0 8 3.9c-1.6 0-3 .7-4.1 1.7l1 1c.8-.8 2-1.3 3.1-1.3Zm0 3c.5 0 1 .2 1.4.6l-1.4 1.5-1.4-1.5c.4-.4.9-.6 1.4-.6Z"/></svg>
                <span className="splash-batt" />
              </span>
            </div>
          )}

          {stage === 'on' && <div className="splash-home" />}

          <div className={`splash-screen${stage === 'on' ? '' : ' splash-screen-dark'}`}>
            <AnimatePresence mode="wait">
              {stage === 'locked' && (
                <motion.div
                  key="locked"
                  className="call-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.4 }}
                >
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

                  <SlideToAnswer onAnswer={handleAnswer} />
                </motion.div>
              )}

              {stage === 'on' && (
                <motion.div
                  key="on"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  {/* Animated orb (Lottie) */}
                  <motion.div
                    className="orb"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.span
                      className="orb-glow"
                      animate={{ ...BLOB, scale: [1, 1.14, 0.95, 1.05, 1], opacity: [0.55, 0.9, 0.6, 0.85, 0.55] }}
                      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="orb-body"
                      animate={{ ...BLOB, rotate: [0, 10, -8, 4, 0], scale: [1, 1.05, 0.96, 1.02, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="orb-body orb-body-2"
                      animate={{
                        borderRadius: BLOB.borderRadius.slice().reverse(),
                        rotate: [0, -12, 6, -3, 0],
                        x: [0, 6, -5, 3, 0],
                        y: [0, -4, 6, -2, 0],
                      }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="orb-core"
                      animate={{ x: [0, 5, -4, 0], y: [0, -3, 4, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>

                  <motion.h1
                    className="splash-name"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                  >
                    Mr White
                  </motion.h1>

                  <motion.p
                    className="splash-tag"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    Computing
                  </motion.p>

                  <motion.button
                    className="splash-cta"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.5 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onStart}
                  >
                    <span>Begin lesson</span>
                    <span className="splash-cta-arrow" aria-hidden>→</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
