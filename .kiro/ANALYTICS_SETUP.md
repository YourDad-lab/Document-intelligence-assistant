# RAG System with Separate Analytics Dashboard

## System Architecture

```
Port 3000: Frontend (Next.js)     ← User Interface for Q&A
Port 8000: RAG Backend (FastAPI)  ← Document Q&A System
Port 5000: Analytics (Node.js)    ← Separate Analytics Dashboard
```

## What You Have Now

### 3 Separate Servers:

1. **RAG Q&A Frontend** (http://localhost:3000)
   - User-facing Q&A interface
   - Interactive globe background
   - Query input and results display

2. **RAG Backend** (http://localhost:8000)
   - Document retrieval and answer generation
   - 255 documents indexed
   - Automatically tracks queries to analytics server

3. **Analytics Dashboard** (http://localhost:5000) ⭐ NEW
   - Separate standalone server
   - Real-time query tracking
   - Performance metrics
   - Query logs and patterns

## How It Works

### Data Flow:
```
User → Frontend (3000) → Backend (8000) → Analytics (5000)
                              ↓
                         Answer + Track
```

1. User asks question on frontend
2. Frontend sends to RAG backend
3. Backend processes and generates answer
4. Backend automatically sends query data to analytics
5. Analytics stores and displays metrics
6. Dashboard auto-refreshes every 5 seconds

## Access URLs

- **Q&A Interface**: http://localhost:3000
- **Analytics Dashboard**: http://localhost:5000
- **Backend API**: http://localhost:8000/docs

## Features

### Analytics Dashboard Tracks:

✅ **Real-time Metrics**
- Total queries served
- Confidence distribution (high/medium/low)
- Average latency
- Query volume by hour

✅ **Query Analysis**
- Top queries by frequency
- Confidence levels
- Search patterns

✅ **Performance Monitoring**
- Retrieval time
- Generation time
- Latency trends

✅ **Live Logs**
- Recent 20 queries
- Timestamps
- Status indicators
- Response times

## Running All Servers

### Start Everything:

```bash
# Terminal 1: RAG Backend
cd .kiro/rag_backend
python app.py

# Terminal 2: Frontend
cd .kiro/rag_frontend
npm run dev

# Terminal 3: Analytics Dashboard
cd .kiro/analytics_dashboard
npm start
```

### Or Use Background Processes (Already Running):
- Backend: Process 8
- Frontend: Process 6
- Analytics: Process 7

## Testing the System

1. **Open Q&A Interface**: http://localhost:3000
2. **Ask a question**: "What is artificial intelligence?"
3. **Open Analytics Dashboard**: http://localhost:5000
4. **Watch metrics update** in real-time!

The analytics dashboard will automatically track:
- Your question
- The answer confidence
- Response time
- Dataset used

## Analytics API Endpoints

```bash
# Track a query (automatically called by backend)
POST http://localhost:5000/api/track

# Get overview metrics
GET http://localhost:5000/api/analytics/overview

# Get top queries
GET http://localhost:5000/api/analytics/queries

# Get performance data
GET http://localhost:5000/api/analytics/performance

# Get recent logs
GET http://localhost:5000/api/analytics/logs

# Check RAG backend health
GET http://localhost:5000/api/health
```

## Customization

### Change Analytics Port

Edit `.kiro/analytics_dashboard/server.js`:
```javascript
const PORT = 5000; // Change to your preferred port
```

Then update `.kiro/rag_backend/analytics_middleware.py`:
```python
ANALYTICS_SERVER = "http://localhost:5000"  # Update port
```

### Add More Metrics

1. Edit `server.js` - Add to analytics object
2. Create new API endpoint
3. Update `public/app.js` - Fetch and display data
4. Update `public/index.html` - Add UI elements

## Data Persistence

Currently uses **in-memory storage** (resets on restart).

For production, add a database:

### Option 1: MongoDB
```bash
npm install mongoose
```

### Option 2: PostgreSQL
```bash
npm install pg
```

### Option 3: SQLite
```bash
npm install sqlite3
```

## Troubleshooting

### Analytics not receiving data
```bash
# Check if analytics server is running
curl http://localhost:5000/api/health

# Check RAG backend logs
# Look for "Query tracked in analytics" messages
```

### Port conflicts
```bash
# Check what's using ports
netstat -ano | findstr :5000
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

### Backend can't reach analytics
- Ensure both servers are running
- Check firewall settings
- Verify ANALYTICS_SERVER URL in analytics_middleware.py

## Production Deployment

### 1. Add Environment Variables
```bash
# .env file
PORT=5000
RAG_BACKEND_URL=http://localhost:8000
NODE_ENV=production
```

### 2. Add Database
```javascript
// Use MongoDB, PostgreSQL, or your preferred DB
```

### 3. Add Authentication
```javascript
// Protect analytics dashboard with auth
```

### 4. Use Process Manager
```bash
pm2 start server.js --name analytics
pm2 start ecosystem.config.js
```

## Benefits of Separate Analytics Server

✅ **Independent Scaling** - Scale analytics separately from Q&A
✅ **No Performance Impact** - Analytics doesn't slow down Q&A
✅ **Dedicated Monitoring** - Focused analytics interface
✅ **Easy Integration** - Simple HTTP API
✅ **Flexible Deployment** - Can run on different machines
✅ **Data Isolation** - Analytics data separate from Q&A data

## Next Steps

1. ✅ All servers running
2. ✅ Analytics tracking enabled
3. ✅ Dashboard displaying metrics
4. 🔄 Test by asking questions
5. 📊 Watch analytics update in real-time
6. 🚀 Add database for persistence
7. 🔐 Add authentication
8. 📧 Add email alerts

---

**You now have a complete RAG system with separate analytics tracking!**

Visit http://localhost:5000 to see your analytics dashboard.
