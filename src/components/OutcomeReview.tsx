import { useState } from 'react';
import { motion } from 'framer-motion';
import { NOT_YOUR_FAULT, type ScenarioData } from '../data/scenarios';
import '../styles/OutcomeReview.css';

interface OutcomeReviewProps {
  scenario: ScenarioData;
  choiceHistory: Record<string, string>;
  onReset: () => void;
  onBack: () => void;
}

export default function OutcomeReview({ scenario, choiceHistory, onReset, onBack }: OutcomeReviewProps) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const allExpanded = collapsed.size === 0;

  const toggle = (i: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const toggleAll = () =>
    setCollapsed(allExpanded ? new Set(scenario.stages.map((_, i) => i)) : new Set());

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="outcome-review-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="review-header">
        <button className="hub-button" onClick={onBack}>← Hub</button>
        <h2>What we learned: {scenario.title}</h2>
        <button className="expand-all" onClick={toggleAll}>
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <motion.div className="review-content" variants={containerVariants}>
        <motion.div className="not-your-fault" variants={itemVariants}>
          <span className="nyf-badge">Remember</span>
          <p>{NOT_YOUR_FAULT}</p>
        </motion.div>

        {scenario.stages.map((stage, stageIndex) => {
          const isOpen = !collapsed.has(stageIndex);
          const takenId = choiceHistory[stage.id];
          return (
            <motion.div key={stage.id} className="stage-review" variants={itemVariants}>
              <button className="stage-header" onClick={() => toggle(stageIndex)}>
                <span className="stage-title">{stage.title}</span>
                <span className="expand-icon">{isOpen ? '▼' : '▶'}</span>
              </button>

              {isOpen && (
                <motion.div
                  className="stage-outcomes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {stage.choices.map((choice, choiceIndex) => {
                    const wasTaken = choice.id === takenId;
                    return (
                      <div key={choice.id} className={`outcome ${wasTaken ? 'outcome-taken' : ''}`}>
                        <div className="outcome-letter">{String.fromCharCode(65 + choiceIndex)}.</div>
                        <div>
                          <p className="outcome-choice">
                            {wasTaken && <span className="you-chose">You chose this</span>}
                            <strong>Choice:</strong> {choice.text}
                          </p>
                          <p className="outcome-consequence">
                            <strong>What happens:</strong> {choice.consequence}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        <motion.div className="discussion-section" variants={itemVariants}>
          <h3>Talk about it</h3>
          <div className="discussion-list">
            {scenario.discussionPrompts.map((prompt, index) => (
              <motion.div key={index} className="discussion-prompt" variants={itemVariants}>
                <span className="prompt-number">{index + 1}</span>
                <p>{prompt}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="review-actions">
          <motion.button
            className="reset-btn"
            onClick={onReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ↻ Try again
          </motion.button>
          <motion.button
            className="back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to hub
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
