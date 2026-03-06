import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/ResultCard.module.css';
import { QueryResponse } from '../services/api';
import ReactMarkdown from 'react-markdown';

interface ResultCardProps {
  result: QueryResponse;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [showSources, setShowSources] = useState(false);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#4A90E2';
      case 'medium': return '#a8c0ff';
      case 'low': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getAnswerTypeIcon = (answerType: string) => {
    switch (answerType) {
      case 'parties_list': return '👥';
      case 'governing_laws': return '⚖️';
      case 'dates': return '📅';
      case 'termination': return '🔚';
      case 'financial': return '💰';
      case 'comparison': return '📊';
      case 'count': return '🔢';
      default: return '📄';
    }
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      <motion.div
        className={styles.confidenceBadge}
        style={{ backgroundColor: getConfidenceColor(result.confidence) }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        {result.confidence.toUpperCase()}
      </motion.div>

      <motion.div
        className={styles.answer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>
          <span className={styles.answerIcon}>
            {getAnswerTypeIcon((result as any).answer_type || 'summary')}
          </span>
          Answer
        </h3>
        <div className={styles.markdownContent}>
          <ReactMarkdown>{result.answer}</ReactMarkdown>
        </div>
      </motion.div>

      {result.sources.length > 0 && (
        <div className={styles.sourcesSection}>
          <motion.button
            className={styles.sourcesToggle}
            onClick={() => setShowSources(!showSources)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showSources ? '▼ Hide' : '▶ Show'} Sources ({result.sources.length})
          </motion.button>

          <AnimatePresence>
            {showSources && (
              <motion.div
                className={styles.sources}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {result.sources.map((source, index) => (
                  <motion.div
                    key={index}
                    className={styles.source}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.sourceHeader}>
                      <span className={styles.document}>📄 {source.document}</span>
                      <span className={styles.score}>
                        {(source.score * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <p className={styles.snippet}>{source.snippet}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
