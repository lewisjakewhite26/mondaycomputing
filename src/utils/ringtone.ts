let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    if (!sharedAudioContext) sharedAudioContext = new Ctx();
    if (sharedAudioContext.state === 'suspended') void sharedAudioContext.resume();
    return sharedAudioContext;
  } catch {
    return null;
  }
}

function tone(audioContext: AudioContext, freq: number, startOffset: number, dur: number) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = freq;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  const start = audioContext.currentTime + startOffset;
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(0.14, start + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  oscillator.start(start);
  oscillator.stop(start + dur + 0.02);
}

/**
 * Classic two-tone "brring-brring" ring cadence, repeating every ~2.4s.
 * The "vibrate" is handled purely visually (the phone-jitter CSS animation
 * on whichever element uses it) since real device vibration needs actual
 * hardware — there's nothing to fire here for a laptop/projector setup.
 * Returns a stop function; call it to cancel the loop.
 */
export function startRingtone(): () => void {
  let cancelled = false;
  const ringOnce = () => {
    if (cancelled) return;
    const audioContext = getAudioContext();
    if (!audioContext) return;
    [0, 0.42].forEach((offset) => {
      tone(audioContext, 480, offset, 0.32);
      tone(audioContext, 620, offset, 0.32);
    });
  };

  ringOnce();
  const interval = window.setInterval(ringOnce, 2400);

  return () => {
    cancelled = true;
    window.clearInterval(interval);
  };
}
