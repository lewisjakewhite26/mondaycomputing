import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ScenarioPlatform } from '../App';
import { scenarios } from '../data/scenarios';
import { platformThemes } from '../data/platforms';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import ChoiceButton from '../components/ChoiceButton';
import OutcomeReview from '../components/OutcomeReview';
import PhoneStatusBar from '../components/PhoneStatusBar';
import '../styles/ScenarioPage.css';

interface ScenarioPageProps {
  platform: ScenarioPlatform;
  onBack: () => void;
  onComplete: () => void;
}

type Phase = 'playing' | 'compose' | 'choosing' | 'outcome';

let sharedAudioContext: AudioContext | null = null;

function playSound(type: 'message' | 'choice') {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!sharedAudioContext) sharedAudioContext = new Ctx();
    const audioContext = sharedAudioContext;
    if (audioContext.state === 'suspended') void audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = type === 'message' ? 880 : 560;
    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
  } catch {
    /* audio not available */
  }
}

const wait = (ms: number, bucket: number[]) =>
  new Promise<void>((resolve) => bucket.push(window.setTimeout(resolve, ms)));

function stampFor(index: number) {
  const start = 16 * 60 + 3; // 16:03
  const total = start + index * 2;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function ScenarioPage({ platform, onBack, onComplete }: ScenarioPageProps) {
  const scenario = scenarios[platform];
  const theme = platformThemes[platform];
  const snapMode = theme.renderStyle === 'snapchat';
  const rbxMode = theme.renderStyle === 'roblox';

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [opened, setOpened] = useState<number[]>([]);
  const [typingSide, setTypingSide] = useState<'other' | 'user' | null>(null);
  const [typingName, setTypingName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('playing');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [choiceHistory, setChoiceHistory] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [armRestart, setArmRestart] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const choiceTimer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);

  const currentStage = scenario.stages[currentStageIndex];
  const stageCount = scenario.stages.length;
  const isLastStage = currentStageIndex === stageCount - 1;

  // Sequential reveal of the stage's messages
  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    setRevealed([]);
    setOpened([]);
    setTypingSide(null);
    setTypingName(null);
    setPhase('playing');
    setSelectedChoiceId(null);

    (async () => {
      await wait(450, timers);
      for (let i = 0; i < currentStage.messages.length; i++) {
        if (cancelled) return;
        const m = currentStage.messages[i];
        if (m.sender === 'system') {
          setTypingSide(null);
          setTypingName(null);
          await wait(280, timers);
          if (cancelled) return;
          setRevealed((r) => [...r, i]);
          await wait(1100, timers);
        } else {
          const side = m.sender === 'user' ? 'user' : 'other';
          setTypingSide(side);
          setTypingName(side === 'other' ? (m.senderName ?? null) : null);
          await wait(Math.min(2400, 650 + m.text.length * 24), timers);
          if (cancelled) return;
          setTypingSide(null);
          setTypingName(null);
          setRevealed((r) => [...r, i]);
          if (!snapMode || m.sender === 'user') setOpened((o) => [...o, i]);
          playSound('message');
          await wait(520, timers);
        }
      }
      if (cancelled) return;
      setTypingSide(null);
      setTypingName(null);
      setPhase('compose');
    })();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [currentStage, snapMode, runId]);

  // Keep the conversation scrolled to the newest content
  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [revealed, opened, typingSide, phase]);

  // Clear pending timers on unmount
  useEffect(
    () => () => {
      if (choiceTimer.current) window.clearTimeout(choiceTimer.current);
      if (restartTimer.current) window.clearTimeout(restartTimer.current);
    },
    [],
  );

  const handleReply = () => {
    if (phase !== 'compose') return;
    playSound('choice');
    setPhase('choosing');
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (phase !== 'choosing') return;
    playSound('choice');
    setSelectedChoiceId(choiceId);
    setChoiceHistory((h) => ({ ...h, [currentStage.id]: choiceId }));
    const choice = currentStage.choices.find((c) => c.id === choiceId);
    if (choice) {
      setTypingSide('other');
      if (choiceTimer.current) window.clearTimeout(choiceTimer.current);
      choiceTimer.current = window.setTimeout(() => {
        setTypingSide(null);
        setPhase('outcome');
      }, 1400);
    }
  };

  const handleNextStage = () => {
    if (isLastStage) {
      onComplete();
      setShowReview(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
  };

  const doReset = () => {
    if (choiceTimer.current) window.clearTimeout(choiceTimer.current);
    setArmRestart(false);
    setCurrentStageIndex(0);
    setShowReview(false);
    setPhase('playing');
    setSelectedChoiceId(null);
    setChoiceHistory({});
    setRevealed([]);
    setOpened([]);
    setRunId((n) => n + 1);
  };

  const handleRestartClick = () => {
    if (armRestart) {
      doReset();
      return;
    }
    setArmRestart(true);
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => setArmRestart(false), 3500);
  };

  if (showReview) {
    return (
      <OutcomeReview
        scenario={scenario}
        choiceHistory={choiceHistory}
        onReset={doReset}
        onBack={onBack}
      />
    );
  }

  const selectedChoice = currentStage.choices.find((c) => c.id === selectedChoiceId);
  const revealedValid = revealed.filter((i) => i < currentStage.messages.length);
  const allMessagesShown = revealedValid.length === currentStage.messages.length;
  const unreadCount = revealedValid.filter(
    (i) => currentStage.messages[i].sender !== 'system' && !opened.includes(i),
  ).length;
  const choicesReady = allMessagesShown && unreadCount === 0;
  const replyActive = phase === 'compose' && choicesReady;

  const barProps = replyActive
    ? {
        onClick: handleReply,
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') handleReply();
        },
        role: 'button' as const,
        tabIndex: 0,
      }
    : { 'aria-hidden': true };

  const inputBar = snapMode ? (
    <div className={`snap-inputbar ${replyActive ? 'inputbar-active' : ''}`} {...barProps}>
      <span className="snap-camera" />
      <span className="snap-chatfield">{replyActive ? 'Tap to reply…' : 'Chat'}</span>
      <span className="snap-mic">🎙️</span>
      <span className="snap-plus">＋</span>
    </div>
  ) : rbxMode ? (
    <div className={`rbx-inputbar ${replyActive ? 'inputbar-active' : ''}`} {...barProps}>
      <span className="rbx-chatfield">
        {replyActive ? 'Click here to reply…' : 'To chat click here or press "/" key'}
      </span>
      <span className="rbx-send">➤</span>
    </div>
  ) : (
    <div className={`wa-inputbar ${replyActive ? 'inputbar-active' : ''}`} {...barProps}>
      <span className="wa-emoji">☺</span>
      <span className="wa-chatfield">{replyActive ? 'Tap to reply…' : 'Message'}</span>
      <span className="wa-clip">📎</span>
      <span className="wa-cam">📷</span>
      <span className="wa-mic">🎤</span>
    </div>
  );

  return (
    <motion.div
      className={`scenario-container scenario-${platform}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="scenario-topbar">
        <button className="hub-button" onClick={onBack}>← Hub</button>
        <div className="stage-progress" aria-hidden>
          {scenario.stages.map((s, i) => (
            <span
              key={s.id}
              className={`progress-dot ${i === currentStageIndex ? 'active' : ''} ${
                i < currentStageIndex ? 'done' : ''
              }`}
            />
          ))}
        </div>
        <button
          className={`reset-inline ${armRestart ? 'is-armed' : ''}`}
          onClick={handleRestartClick}
        >
          {armRestart ? 'Tap again to restart' : '↻ Restart'}
        </button>
      </div>

      <div className="scenario-stagebar">
        <span className="stagebar-count">Stage {currentStageIndex + 1} of {stageCount}</span>
        <span className="stagebar-title">{currentStage.title.replace(/^Stage \d+:\s*/, '')}</span>
      </div>

      <div className="scenario-stage">
        <div className={`phone-frame phone-${theme.renderStyle}`}>
          <span className="phone-btn phone-btn-silent" />
          <span className="phone-btn phone-btn-volup" />
          <span className="phone-btn phone-btn-voldown" />
          <span className="phone-btn phone-btn-power" />
          <div className="phone-island" />
          <div className="phone-gloss" />

          <PhoneStatusBar dark={snapMode} />

          {rbxMode ? (
            <div className="rbx-topbar">
              <span className="rbx-circle rbx-logo" aria-hidden>
                <span />
              </span>
              <span className="rbx-circle" aria-hidden>☰</span>
            </div>
          ) : (
            <div
              className="phone-header"
              style={{ background: theme.headerBg, color: theme.headerFg }}
            >
              <span className="phone-back">‹</span>
              <div className="phone-avatar" aria-hidden>{theme.contactAvatar}</div>
              <div className="phone-contact">
                <span className="phone-name">{theme.contactName}</span>
                <span className="phone-status">
                  {typingSide === 'other'
                    ? typingName
                      ? `${typingName} is typing…`
                      : 'typing…'
                    : theme.contactStatus}
                </span>
              </div>
              <span className="phone-callicons">
                <span aria-hidden>📹</span>
                <span aria-hidden>📞</span>
              </span>
            </div>
          )}

          <div className="phone-body" style={{ background: theme.chatBg }} ref={scrollRef}>
            {rbxMode ? <div className="rbx-tab">Main</div> : <div className="chat-day">Today</div>}

            <div className={rbxMode ? 'rbx-panel' : undefined}>
              {currentStage.messages.map((message, index) =>
                revealed.includes(index) ? (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    platform={platform}
                    theme={theme}
                    time={stampFor(index)}
                    opened={opened.includes(index)}
                    onOpen={() =>
                      setOpened((o) => (o.includes(index) ? o : [...o, index]))
                    }
                  />
                ) : null,
              )}

              <AnimatePresence>
                {typingSide && (
                  <TypingIndicator
                    key="typing"
                    theme={theme}
                    side={typingSide}
                    avatar={theme.contactAvatar}
                    name={typingName}
                  />
                )}
              </AnimatePresence>

              {phase === 'outcome' && selectedChoice && (
                <motion.div
                  className="your-move"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="your-move-label">Your move</span>
                  <p>{selectedChoice.text}</p>
                </motion.div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {replyActive && (
              <motion.div
                className="reply-cue"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Your turn — tap the bar to reply
                <span className="reply-cue-arrow" aria-hidden>▾</span>
              </motion.div>
            )}
          </AnimatePresence>

          {inputBar}
        </div>

        <div className="phone-dock">
          <AnimatePresence mode="wait">
            {(phase === 'playing' || phase === 'compose') && (
              <motion.div
                key="waiting"
                className="dock-waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {!allMessagesShown
                  ? 'Messages coming in…'
                  : unreadCount > 0
                    ? `Tap the ${unreadCount} unopened message${unreadCount > 1 ? 's' : ''} in the chat to read ${unreadCount > 1 ? 'them' : 'it'}`
                    : 'Read the messages together, then tap the reply bar when the class is ready'}
              </motion.div>
            )}

            {phase === 'choosing' && (
              <motion.div
                key="choices"
                className="choices-container"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: 12 }}
                variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }}
              >
                <p className="choice-prompt">What do you do?</p>
                {currentStage.choices.map((choice) => (
                  <motion.div
                    key={choice.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  >
                    <ChoiceButton choice={choice} onClick={() => handleChoiceSelect(choice.id)} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {phase === 'outcome' && selectedChoice && (
              <motion.div
                key="outcome"
                className="outcome-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="outcome-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.25 } }}
                >
                  <h3>What happens next</h3>
                  <p>{selectedChoice.consequence}</p>
                </motion.div>
                <motion.button
                  className={`continue-button ${isLastStage ? 'review-button' : ''}`}
                  onClick={handleNextStage}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
                >
                  {isLastStage ? 'See what we learned →' : 'Continue →'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
