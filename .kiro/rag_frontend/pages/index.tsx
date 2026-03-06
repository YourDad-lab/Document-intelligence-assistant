import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryPanel } from '../components/QueryPanel';
import { ResultCard } from '../components/ResultCard';
import { InteractiveGlobe } from '../components/ui/interactive-globe';
import { queryDocuments, QueryResponse } from '../services/api';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await queryDocuments(question);
      setResult(response);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Invalid question. Please check your input.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to connect to the server. Please ensure the backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      }}>
        <InteractiveGlobe 
          size={700}
          dotColor="rgba(100, 180, 255, ALPHA)"
          arcColor="rgba(100, 180, 255, 0.6)"
          markerColor="rgba(100, 220, 255, 1)"
          autoRotateSpeed={0.003}
        />
      </div>
      
      <main className={styles.main}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Document Intelligence Assistant</h1>
          <p className={styles.subtitle}>
            Ask questions and get accurate answers from your documents
          </p>
        </motion.div>

        <div className={styles.querySection}>
          <QueryPanel onSubmit={handleQuery} isLoading={isLoading} />
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              className={styles.loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.spinner}></div>
              <p>Searching documents...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              className={styles.error}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <p>{error}</p>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              className={styles.resultSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
