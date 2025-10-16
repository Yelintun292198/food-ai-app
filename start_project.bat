@echo off
REM =========================================
REM 🚀 START PROJECT: BACKEND + NGROK + EXPO
REM =========================================

REM Step1️⃣ - Start FastAPI backend
start cmd /k "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait for backend to boot up
timeout /t 5 >nul

REM Step 2️⃣ - Start ngrok tunnel for port 8000
start cmd /k "ngrok http 8000"

REM Wait a few seconds for ngrok to generate public URL
timeout /t 8 >nul

REM Step 3️⃣ - Get ngrok public URL (using API)
for /f "tokens=2 delims=:," %%A in ('curl -s http://127.0.0.1:4040/api/tunnels ^| findstr "https://"') do (
    set NGROK_URL=%%~A
    goto :found
)

:found
set NGROK_URL=https:%NGROK_URL:~2%
echo 🌐 NGROK PUBLIC URL: %NGROK_URL%

REM Step 4️⃣ - Update .env file in /mobile folder
(
    echo EXPO_PUBLIC_API_URL=%NGROK_URL%
) > mobile\.env

echo ✅ .env updated with NGROK URL:
type mobile\.env

REM Step 5️⃣ - Start Expo frontend
timeout /t 5 >nul
start cmd /k "cd mobile && npx expo start --tunnel"

echo 🎉 All services started successfully!
pause
