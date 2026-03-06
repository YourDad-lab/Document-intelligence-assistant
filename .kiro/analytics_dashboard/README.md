# RAG Analytics Dashboard - Separate Server

## Overview

A standalone analytics server running on **port 5000** that tracks and analyzes all queries from your RAG Q&A system (port 8000) and displays real-time metrics.

## Architecture

```
┌─────────────────────┐
│   Frontend (3000)   │ ← User Interface
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  RAG Backend (8000) │ ← Q&A System
└──────────┬──────────┘
           │
           ↓ (tracks queries)
┌─────────────────────┐
│ Analytics (5000)    │ ← This Server
└─────────────────────┘
```

## Features

### Real-time Tracking
- Automatically tracks every query from RAG system
- Stores query history, confidence levels, latency
- Updates dashboard in real-time (5-second refresh)

### Analytics Tabs

1. **Overview**
   - Total queries tracked
   - High confidence percentage
   - Average latency
   - Query volume by hour
   - Dataset usage distribution

2. **Queries**
   - Top queries by frequency
   - Confidence level badges
   - Query patterns

3. **Performance**
   - Average retrieval time
   - Average generation time
   - Latency breakdown

4. **Logs**
   - Recent query logs (last 20)
   - Timestamp, query, confidence, latency, status
   - Color-coded status indicators

## Installation

```bash
cd .kiro/analytics_dashboard
npm install
```

## Running the Server

```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

The server will start on **http://localhost:5000**

## Access

- **Dashboard**: http://localhost:5000
- **API Endpoints**:
  - `POST /api/track` - Track a query
  - `GET /api/analytics/overview` - Get overview metrics
  - `GET /api/analytics/queries` - Get top queries
  - `GET /api/analytics/performance` - Get performance metrics
  - `GET /api/analytics/logs` - Get recent logs
  - `GET /api/health` - Check RAG backend health

## How It Works

### 1. RAG Backend Integration

The RAG backend (`rag_backend/app.py`) automatically sends query data to the analytics server after each query:

```python
# In app.py
from analytics_middleware import track_query

# After generating answer
track_query(
    question=request.question,
    answer=result["answer"],
    confidence=result["confidence"],
    sources=result["sources"],
    start_time=start_time
)
```

### 2. Analytics Server Storage

The analytics server stores data in memory (for demo):
- Query history (last 100 queries)
- Confidence statistics
- Latency metrics
- Top queries frequency
- Dataset usage

### 3. Dashboard Display

The dashboard fetches data from the API and displays:
- Real-time charts using Chart.js
- Auto-refreshing every 5 seconds
- Interactive tabs for different views

## API Examples

### Track a Query
```bash
curl -X POST http://localhost:5000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is AI?",
    "answer": "Artificial Intelligence...",
    "confidence": "high",
    "sources": [...],
    "latency": {"retrieval": 150, "generation": 900, "total": 1050}
  }'
```

### Get Overview
```bash
curl http://localhost:5000/api/analytics/overview
```

## Data Storage

Currently uses **in-memory storage** (resets on server restart).

For production, integrate with:
- **PostgreSQL** - Relational data
- **MongoDB** - Document storage
- **Redis** - Fast caching
- **InfluxDB** - Time-series data

## Customization

### Change Port

Edit `server.js`:
```javascript
const PORT = 5000; // Change to your preferred port
```

### Add More Metrics

1. Add to analytics object in `server.js`
2. Create API endpoint
3. Update dashboard HTML/JS

### Styling

Edit `public/styles.css` for custom themes

## Production Deployment

### 1. Add Database
```javascript
// Example with MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rag_analytics');
```

### 2. Add Authentication
```javascript
const jwt = require('jsonwebtoken');
// Add auth middleware
```

### 3. Environment Variables
```bash
PORT=5000
RAG_BACKEND_URL=http://localhost:8000
DATABASE_URL=mongodb://localhost/rag_analytics
```

### 4. Process Manager
```bash
npm install -g pm2
pm2 start server.js --name rag-analytics
```

## Troubleshooting

### Analytics not receiving data
1. Check if analytics server is running on port 5000
2. Check if RAG backend can reach http://localhost:5000
3. Check console logs in RAG backend for tracking errors

### Dashboard not updating
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check CORS settings

### Port already in use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F
```

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript + Chart.js
- **Styling**: Custom CSS (dark theme)
- **Charts**: Chart.js 4.4.0

## Future Enhancements

- [ ] Database integration
- [ ] User authentication
- [ ] Export to CSV/PDF
- [ ] Email alerts
- [ ] Custom date range filters
- [ ] Real-time WebSocket updates
- [ ] Query performance insights
- [ ] A/B testing support
- [ ] Cost tracking
- [ ] Multi-tenant support

---

**Separate Analytics Server for RAG Q&A System**
Running independently on port 5000
