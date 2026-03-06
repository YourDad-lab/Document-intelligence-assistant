const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for analytics (in production, use a database)
let analytics = {
  queries: [],
  totalQueries: 0,
  confidenceStats: { high: 0, medium: 0, low: 0 },
  latencyStats: [],
  topQueries: {},
  datasetUsage: { 'CUAD Contracts': 0, 'Master Clauses': 0, 'Legal Documents': 0 },
  hourlyVolume: Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 })),
  dailyStats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    high: 0,
    medium: 0,
    low: 0,
    positive: 0,
    negative: 0,
    retrieval: 0,
    generation: 0
  }))
};

// Add sample data for testing (remove this in production)
function initializeSampleData() {
  console.log('📊 Initializing with sample data for testing...');
  
  // Simulate 2 medium confidence queries
  const sampleQueries = [
    {
      question: "Which parties have agreements?",
      answer: "Sample answer about parties...",
      confidence: "medium",
      sources: [{ document: "master_clauses.csv", snippet: "Parties: Company A, Company B" }],
      latency: { retrieval: 50, generation: 100, total: 150 }
    },
    {
      question: "What is the governing law?",
      answer: "Sample answer about governing law...",
      confidence: "medium",
      sources: [{ document: "contract_001.pdf", snippet: "Governed by laws of..." }],
      latency: { retrieval: 45, generation: 95, total: 140 }
    }
  ];
  
  sampleQueries.forEach(query => {
    const queryData = {
      ...query,
      timestamp: new Date().toISOString(),
      status: query.confidence === 'low' ? 'warn' : 'ok'
    };
    
    analytics.queries.unshift(queryData);
    analytics.totalQueries++;
    analytics.confidenceStats[query.confidence]++;
    analytics.topQueries[query.question] = { count: 1, confidence: query.confidence };
    
    const hour = new Date().getHours();
    analytics.hourlyVolume[hour].count++;
    
    // Update dataset usage
    query.sources.forEach(source => {
      const doc = (source.document || '').toLowerCase();
      if (doc.includes('master') || doc.includes('clause')) {
        analytics.datasetUsage['Master Clauses']++;
      } else if (doc.includes('contract')) {
        analytics.datasetUsage['CUAD Contracts']++;
      } else {
        analytics.datasetUsage['Legal Documents']++;
      }
    });
    
    analytics.latencyStats.push({
      timestamp: queryData.timestamp,
      retrieval: query.latency.retrieval,
      generation: query.latency.generation,
      total: query.latency.total
    });
  });
  
  console.log('✓ Sample data loaded:', {
    totalQueries: analytics.totalQueries,
    confidence: analytics.confidenceStats,
    datasets: analytics.datasetUsage
  });
}

// Initialize sample data on startup
initializeSampleData();

// Track a query
app.post('/api/track', (req, res) => {
  const { question, answer, confidence, sources, latency, timestamp } = req.body;
  
  console.log(`📊 Received query - Confidence: ${confidence}, Question: ${question.substring(0, 50)}...`);
  
  const queryData = {
    question,
    answer,
    confidence,
    sources,
    latency: latency || { retrieval: 0, generation: 0, total: 0 },
    timestamp: timestamp || new Date().toISOString(),
    status: confidence === 'low' ? 'warn' : 'ok'
  };
  
  // Store query
  analytics.queries.unshift(queryData);
  if (analytics.queries.length > 100) {
    analytics.queries = analytics.queries.slice(0, 100);
  }
  
  // Update total
  analytics.totalQueries++;
  
  // Update confidence stats
  analytics.confidenceStats[confidence]++;
  
  console.log(`✓ Stats updated - Total: ${analytics.totalQueries}, High: ${analytics.confidenceStats.high}, Medium: ${analytics.confidenceStats.medium}, Low: ${analytics.confidenceStats.low}`);
  
  // Update top queries
  if (analytics.topQueries[question]) {
    analytics.topQueries[question].count++;
  } else {
    analytics.topQueries[question] = { count: 1, confidence };
  }
  
  // Update hourly volume
  const hour = new Date().getHours();
  analytics.hourlyVolume[hour].count++;
  
  // Update dataset usage
  if (sources && sources.length > 0) {
    sources.forEach(source => {
      const doc = (source.document || '').toLowerCase();
      const snippet = (source.snippet || '').toLowerCase();
      
      // Categorize based on document name or content
      if (doc.includes('master') || doc.includes('clause')) {
        analytics.datasetUsage['Master Clauses']++;
      } else if (doc.includes('cuad') || doc.includes('contract') || 
                 snippet.includes('agreement') || snippet.includes('parties')) {
        analytics.datasetUsage['CUAD Contracts']++;
      } else {
        analytics.datasetUsage['Legal Documents']++;
      }
    });
  } else {
    // If no sources, count as general legal document query
    analytics.datasetUsage['Legal Documents']++;
  }
  
  // Update latency stats
  analytics.latencyStats.push({
    timestamp: queryData.timestamp,
    retrieval: queryData.latency.retrieval || 0,
    generation: queryData.latency.generation || 0,
    total: queryData.latency.total || 0
  });
  if (analytics.latencyStats.length > 1000) {
    analytics.latencyStats = analytics.latencyStats.slice(-1000);
  }
  
  res.json({ success: true, message: 'Query tracked successfully' });
});

// Get analytics overview
app.get('/api/analytics/overview', (req, res) => {
  const totalConfidence = analytics.confidenceStats.high + analytics.confidenceStats.medium + analytics.confidenceStats.low;
  
  // Calculate overall confidence percentage with weighted scoring
  // High = 100%, Medium = 60%, Low = 20%
  let overallConfidencePercent = 0;
  if (totalConfidence > 0) {
    const weightedScore = (analytics.confidenceStats.high * 100) + 
                          (analytics.confidenceStats.medium * 60) + 
                          (analytics.confidenceStats.low * 20);
    overallConfidencePercent = Math.round(weightedScore / totalConfidence);
  }
  
  const avgLatency = analytics.latencyStats.length > 0
    ? Math.round(analytics.latencyStats.reduce((sum, l) => sum + l.total, 0) / analytics.latencyStats.length)
    : 0;
  
  res.json({
    totalQueries: analytics.totalQueries,
    highConfidencePercent: overallConfidencePercent,
    avgLatency,
    documentsIndexed: 255,
    queryVolume: analytics.hourlyVolume.map(h => ({ time: `${h.hour}:00`, queries: h.count })),
    confidenceStats: analytics.confidenceStats,
    datasetUsage: Object.entries(analytics.datasetUsage).map(([name, value]) => ({
      name,
      value: Math.round((value / Math.max(1, analytics.totalQueries)) * 100)
    }))
  });
});

// Get top queries
app.get('/api/analytics/queries', (req, res) => {
  const topQueriesArray = Object.entries(analytics.topQueries)
    .map(([query, data]) => ({ query, count: data.count, confidence: data.confidence }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  res.json({
    topQueries: topQueriesArray,
    queryVolume: analytics.hourlyVolume.map(h => ({ time: `${h.hour}:00`, queries: h.count }))
  });
});

// Get performance metrics
app.get('/api/analytics/performance', (req, res) => {
  const recentLatency = analytics.latencyStats.slice(-100);
  const avgRetrieval = recentLatency.length > 0
    ? Math.round(recentLatency.reduce((sum, l) => sum + l.retrieval, 0) / recentLatency.length)
    : 0;
  const avgGeneration = recentLatency.length > 0
    ? Math.round(recentLatency.reduce((sum, l) => sum + l.generation, 0) / recentLatency.length)
    : 0;
  
  res.json({
    avgRetrieval,
    avgGeneration,
    latencyData: analytics.dailyStats,
    uptime: 99.9
  });
});

// Get recent logs
app.get('/api/analytics/logs', (req, res) => {
  const recentLogs = analytics.queries.slice(0, 20).map(q => ({
    time: new Date(q.timestamp).toLocaleTimeString(),
    query: q.question,
    confidence: q.confidence,
    ms: q.latency.total || 0,
    status: q.status
  }));
  
  res.json({ logs: recentLogs });
});

// Health check for RAG backend
app.get('/api/health', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8000/health');
    res.json({ status: 'healthy', backend: response.data });
  } catch (error) {
    res.json({ status: 'unhealthy', error: error.message });
  }
});

// Serve login page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve dashboard (protected by client-side check)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Analytics Dashboard Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/analytics/*`);
  console.log(`\nTracking RAG Q&A System on http://localhost:8000\n`);
});
