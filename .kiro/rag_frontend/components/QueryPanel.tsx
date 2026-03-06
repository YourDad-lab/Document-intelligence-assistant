import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/QueryPanel.module.css';

interface QueryPanelProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export const QueryPanel: React.FC<QueryPanelProps> = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <motion.input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your documents..."
          className={styles.input}
          maxLength={1000}
          disabled={isLoading}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.button
          type="submit"
          className={styles.button}
          disabled={isLoading || !question.trim()}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {isLoading ? 'Searching...' : 'Ask'}
        </motion.button>
      </form>
    </motion.div>
  );
};
