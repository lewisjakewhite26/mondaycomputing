import { motion } from 'framer-motion';
import type { Message } from '../data/scenarios';
import type { PlatformTheme } from '../data/platforms';
import '../styles/ChatBubble.css';

interface ChatBubbleProps {
  message: Message;
  platform: string;
  theme: PlatformTheme;
  /** Clock time to show under the bubble, e.g. "16:04" */
  time: string;
  /** snapchat mode: has the incoming chat been tapped open yet? */
  opened?: boolean;
  /** snapchat mode: reveal this incoming chat */
  onOpen?: () => void;
}

/** Stable colour for a group member's name, WhatsApp-style. */
const WA_NAME_COLOURS = ['#e5457f', '#3a97d4', '#d9840d', '#00a884', '#6a5acd', '#c9911a', '#0a7ea3'];
function nameColour(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return WA_NAME_COLOURS[h % WA_NAME_COLOURS.length];
}

export default function ChatBubble({ message, platform, theme, time, opened, onOpen }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  /* ---------- Roblox styling ---------- */
  if (theme.renderStyle === 'roblox') {
    if (message.sender === 'system') {
      return (
        <motion.div
          className="rbx-line rbx-system"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="rbx-tag" aria-hidden>[ 🤖 ]</span> {message.text}
        </motion.div>
      );
    }
    const name = isUser ? 'You' : theme.contactName;
    const colour = isUser ? theme.meColor : theme.themColor;
    return (
      <motion.div
        className="rbx-line"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      >
        <span className="rbx-name" style={{ color: colour }}>{name}:</span>{' '}
        <span className="rbx-text">{message.text}</span>
      </motion.div>
    );
  }

  /* ---------- WhatsApp styling ---------- */
  if (theme.renderStyle === 'whatsapp') {
    if (message.sender === 'system') {
      return (
        <motion.div
          className="wa-system"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span>{message.text}</span>
        </motion.div>
      );
    }
    return (
      <motion.div
        className={`wa-row ${isUser ? 'me' : 'them'}`}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      >
        {!isUser && (
          <span
            className="wa-avatar"
            style={{ background: message.senderName ? nameColour(message.senderName) : '#8696a0' }}
            aria-hidden
          >
            {message.avatar ?? '👤'}
          </span>
        )}
        <div
          className={`wa-bubble ${isUser ? 'me' : 'them'}`}
          style={{ background: isUser ? theme.myBubbleBg : theme.theirBubbleBg }}
        >
          {!isUser && message.senderName && (
            <span className="wa-sender" style={{ color: nameColour(message.senderName) }}>
              {message.senderName}
            </span>
          )}
          <span className="wa-text">{message.text}</span>
          <span className="wa-meta">
            {time}
            {isUser && <span className="wa-ticks"> ✓✓</span>}
          </span>
        </div>
      </motion.div>
    );
  }

  /* ---------- Snapchat styling ---------- */
  if (theme.renderStyle === 'snapchat') {
    if (message.sender === 'system') {
      return (
        <motion.div
          className="snap-system"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {message.text}
        </motion.div>
      );
    }

    const accent = isUser ? theme.meColor : theme.themColor;
    const label = isUser ? 'ME' : theme.contactName.toUpperCase();

    if (!isUser && !opened) {
      return (
        <motion.button
          className="snap-unopened"
          onClick={onOpen}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="snap-square" style={{ background: theme.themColor }} />
          <span className="snap-unopened-text">
            <span className="snap-name" style={{ color: theme.themColor }}>{label}</span>
            <span className="snap-tap" style={{ color: theme.themColor }}>Tap to read · {time}</span>
          </span>
        </motion.button>
      );
    }

    return (
      <motion.div
        className="snap-msg"
        style={{ borderLeftColor: accent }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        <span className="snap-name" style={{ color: accent }}>{label}</span>
        <span className="snap-body">{message.text}</span>
        {isUser && <span className="snap-status">{theme.sentLabel}</span>}
      </motion.div>
    );
  }

  /* ---------- Default bubble styling (Roblox) ---------- */
  if (message.sender === 'system') {
    return (
      <motion.div
        className="system-message"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="system-pill">SCENE</span>
        <p>{message.text}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`chat-bubble ${isUser ? 'user' : 'other'} platform-${platform}`}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      {!isUser && message.avatar && (
        <div className="avatar" aria-hidden>{message.avatar}</div>
      )}
      <div className="bubble-content">
        {!isUser && (
          <span className="sender-name">{message.senderName ?? theme.contactName.split(' ')[0]}</span>
        )}
        <div
          className="message-text"
          style={{
            background: isUser ? theme.myBubbleBg : theme.theirBubbleBg,
            color: isUser ? theme.myBubbleFg : theme.theirBubbleFg,
          }}
        >
          {message.text}
        </div>
        <span className="message-meta">
          {time}
          {isUser && <span className="sent-label"> · {theme.sentLabel}</span>}
        </span>
      </div>
    </motion.div>
  );
}
