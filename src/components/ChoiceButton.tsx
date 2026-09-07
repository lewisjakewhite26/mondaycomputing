import { motion } from 'framer-motion';
import type { Choice } from '../data/scenarios';
import '../styles/ChoiceButton.css';

interface ChoiceButtonProps {
  choice: Choice;
  onClick: () => void;
}

export default function ChoiceButton({ choice, onClick }: ChoiceButtonProps) {
  return (
    <motion.button
      className="choice-button"
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="choice-radio" />
      <div className="choice-text">{choice.text}</div>
      <div className="choice-arrow">→</div>
    </motion.button>
  );
}
