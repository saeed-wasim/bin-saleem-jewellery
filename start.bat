@echo off
REM Start Bin Saleem Jewellery - Complete Stack

echo.
echo ====================================
echo Bin Saleem Jewellery - Startup
echo ====================================
echo.
echo Checking configuration...

REM Check if GOOGLE_CLIENT_ID is set
findstr /M "REPLACE_ME" .env > nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ❌ GOOGLE_CLIENT_ID not configured!
    echo.
    echo Please follow: GET-GOOGLE-CLIENT-ID.md
    echo.
    pause
    exit /b 1
)

echo ✅ Configuration looks good
echo.
echo Starting backend...
start cmd /k "npm run server"

timeout /t 2

echo.
echo Starting frontend...
start cmd /k "set PORT=3000 && npm run dev"

timeout /t 3

echo.
echo ====================================
echo ✅ App is starting!
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Waiting for servers to start...
timeout /t 5

start http://localhost:3000
