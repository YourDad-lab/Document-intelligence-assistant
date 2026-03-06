@echo off
echo ========================================
echo  RAG Q&A System - Server Restart
echo ========================================
echo.

echo Step 1: Installing missing Python dependency...
cd rag_backend
pip install requests
echo.

echo ========================================
echo All dependencies installed!
echo.
echo Now start the servers in separate terminals:
echo.
echo Terminal 1 - Backend:
echo   cd .kiro/rag_backend
echo   python app.py
echo.
echo Terminal 2 - Analytics:
echo   cd .kiro/analytics_dashboard
echo   node server.js
echo.
echo Terminal 3 - Frontend:
echo   cd .kiro/rag_frontend
echo   npm run dev
echo.
echo ========================================
pause
