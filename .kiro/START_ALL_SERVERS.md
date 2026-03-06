# Start All Servers - Quick Guide

## You need 3 terminals open:

### Terminal 1: Backend Server (Port 8000)
```bash
cd .kiro/rag_backend
python app.py
```

### Terminal 2: Analytics Server (Port 5000)
```bash
cd .kiro/analytics_dashboard
node server.js
```
You should see:
```
📊 Initializing with sample data for testing...
✓ Sample data loaded: { totalQueries: 2, confidence: { high: 0, medium: 2, low: 0 }, ... }
🚀 Analytics Dashboard Server running on http://localhost:5000
```

### Terminal 3: Frontend (Port 3000)
```bash
cd .kiro/rag_frontend
npm run dev
```

## Then Open in Browser:

1. **RAG Q&A**: http://localhost:3000
2. **Analytics Dashboard**: http://localhost:5000 (login with any username/password)

## What You Should See:

After starting the analytics server, the dashboard should show:
- ✅ Total Queries: 2
- ✅ Overall Confidence: 60%
- ✅ Dataset Usage chart with data
- ✅ Query volume chart

## If You Still See Zeros:

1. Make sure you saved the server.js file
2. Stop the analytics server (Ctrl+C)
3. Start it again: `node server.js`
4. Hard refresh the dashboard: Ctrl+Shift+R (or Ctrl+F5)
5. Check browser console (F12) for any errors
