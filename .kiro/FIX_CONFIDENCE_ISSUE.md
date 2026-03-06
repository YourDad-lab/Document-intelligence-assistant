# Fix Confidence Level Issue - Quick Guide

## Problem
The analytics dashboard shows 0% confidence because the backend wasn't sending data to the analytics server. The `requests` library was missing from the Python dependencies.

## Solution Applied
1. ✅ Added `requests>=2.31.0` to `requirements.txt`
2. ✅ Enhanced logging in `analytics_middleware.py` to show tracking status
3. ✅ Added console logging in analytics server to show received queries

## Steps to Fix

### 1. Install Missing Dependency
```bash
cd .kiro/rag_backend
pip install requests
```

Or reinstall all dependencies:
```bash
pip install -r requirements.txt
```

### 2. Restart Backend Server
Stop the current backend (Ctrl+C) and restart:
```bash
cd .kiro/rag_backend
python app.py
```

### 3. Restart Analytics Server
Stop the current analytics server (Ctrl+C) and restart:
```bash
cd .kiro/analytics_dashboard
node server.js
```

### 4. Keep Frontend Running
The Next.js frontend on port 3000 doesn't need to restart.

## How to Test

1. Open RAG Q&A page: http://localhost:3000
2. Ask a question (e.g., "Which parties have agreements?")
3. Check backend terminal - you should see:
   ```
   Sending to analytics - Confidence: high, Question: Which parties...
   ✓ Query tracked successfully in analytics
   ```
4. Check analytics server terminal - you should see:
   ```
   📊 Received query - Confidence: high, Question: Which parties...
   ✓ Stats updated - Total: 1, High: 1, Medium: 0, Low: 0
   ```
5. Open analytics dashboard: http://localhost:5000
6. Login and check the Overview tab - confidence should now show the correct percentage!

## What Changed

### Backend (`analytics_middleware.py`)
- Better error handling for connection issues
- Detailed logging showing confidence level being sent
- Success/failure messages

### Analytics Server (`server.js`)
- Console logs when receiving queries
- Shows confidence stats after each update
- Helps debug tracking issues

### Dependencies (`requirements.txt`)
- Added `requests>=2.31.0` library

## Expected Behavior

After asking questions:
- High confidence answers → Confidence % increases
- Medium confidence answers → Shows in stats
- Low confidence answers → Shows in stats

The percentage is calculated as: `(high confidence queries / total queries) × 100`

## Troubleshooting

If still showing 0%:
1. Check if all 3 servers are running (ports 3000, 5000, 8000)
2. Look for error messages in backend terminal
3. Verify analytics server is receiving POST requests
4. Check browser console for any errors
5. Try asking multiple questions to accumulate data
