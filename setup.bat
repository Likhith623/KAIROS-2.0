@echo off
REM KAIROS 2.0 Setup Script for Windows
REM This script sets up the development environment for KAIROS 2.0

echo ================================
echo KAIROS 2.0 Setup Script
echo ================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo ✓ Node.js found
echo.

REM Check Python
echo Checking Python...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python not found. Please install Python 3.11+ from https://python.org/
    pause
    exit /b 1
)
python --version
echo ✓ Python found
echo.

REM Install Frontend Dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

REM Setup Backend
echo Setting up Python backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

cd ..
echo.

REM Create .env.local if it doesn't exist
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local...
    copy frontend\.env.example frontend\.env.local
    echo ✓ frontend\.env.local created
) else (
    echo frontend\.env.local already exists, skipping...
)
echo.

REM Summary
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo To start KAIROS 2.0:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn main:app --reload
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Happy Learning! 🎓
echo.
pause
