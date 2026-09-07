import { motion } from 'framer-motion';
import type { PlatformTheme } from '../data/platforms';
import '../styles/ChatBubble.css';

interface TypingIndicatorProps {
  theme: PlatformTheme;
  avatar?: string;
  /** "other" shows on the left, "user" on the right */
  side: 'other' | 'user';
  /** Name of the person typing (group chats) */
  name?: string | null;
}

export default function TypingIndicator({ theme, avatar, side, name }: TypingIndicatorProps) {
  if (theme.renderStyle === 'roblox') {
    const who = side === 'user' ? 'You' : (name ?? theme.contactName);
    return (
      <motion.div
        className="rbx-line rbx-typing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <span style={{ color: side === 'user' ? theme.meColor : theme.themColor }}>{who}</span>
        <span className="typing-dots inline"><span /><span /><span /></span>
      </motion.div>
    );
  }

  if (theme.renderStyle === 'whatsapp') {
    return (
      <motion.div
        className={`wa-row ${side === 'user' ? 'me' : 'them'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
      >
        <div
          className={`wa-bubble ${side === 'user' ? 'me' : 'them'} wa-typing`}
          style={{ background: side === 'user' ? theme.myBubbleBg : theme.theirBubbleBg }}
        >
          {side === 'other' && name && <span className="wa-sender">{name}</span>}
          <span className="typing-dots inline"><span /><span /><span /></span>
        </div>
      </motion.div>
    );
  }

  if (theme.renderStyle === 'snapchat') {
    const who = side === 'user' ? 'ME' : (name ?? theme.contactName);
    const colour = side === 'user' ? theme.meColor : theme.themColor;
    return (
      <motion.div
        className="snap-typing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <span style={{ color: colour, fontWeight: 700 }}>{who}</span>
        <span className="typing-dots inline">
          <span /><span /><span />
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`chat-bubble ${side === 'user' ? 'user' : 'other'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
    >
      {side === 'other' && avatar && <div className="avatar" aria-hidden>{avatar}</div>}
      <div className="bubble-content">
        <div
          className="message-text typing-dots"
          style={{
            background: side === 'user' ? theme.myBubbleBg : theme.theirBubbleBg,
          }}
        >
          <span /><span /><span />
        </div>
      </div>
    </motion.div>
  );
}
