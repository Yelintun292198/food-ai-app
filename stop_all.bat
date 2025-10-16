@echo off
title 🛑 Stop All Food-AI Services
echo Stopping all Food-AI processes...

:: Kill FastAPI (uvicorn)
taskkill /f /im python.exe >nul 2>&1

:: Kill ngrok
taskkill /f /im ngrok.exe >nul 2>&1

:: Kill Expo / Node.js process
taskkill /f /im node.exe >nul 2>&1

:: Optional: close all cmd windows started for this project
for /f "tokens=2 delims=," %%a in ('tasklist /v /fo csv ^| findstr /i "backend ngrok expo"') do taskkill /f /pid %%a >nul 2>&1

echo ✅ All Food-AI services stopped successfully!
pause
