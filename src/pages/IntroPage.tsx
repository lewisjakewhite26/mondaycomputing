import { motion } from 'framer-motion';
import '../styles/IntroPage.css';

interface IntroPageProps {
  onComplete: () => void;
}

export default function IntroPage({ onComplete }: IntroPageProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.3, duration: 0.6 }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      transition: { delay: 0.8, duration: 0.4 }
    },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 }
  };

  return (
    <motion.div 
      className="intro-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div className="intro-content" variants={contentVariants}>
        <h2 className="intro-lesson">Computing</h2>
        
        <div className="intro-objective">
          <h3>Learning Objective:</h3>
          <p>Make safe choices online</p>
        </div>

        <div className="intro-description">
          <p>
            In this lesson, you'll explore different platforms and learn to spot red flags, 
            understand peer pressure, and know when and how to get help.
          </p>
        </div>

        <motion.button
          className="intro-button"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onComplete}
        >
          Start Scenarios
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
