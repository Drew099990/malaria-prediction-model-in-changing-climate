@echo off
echo.
echo ============================================
echo Malaria Prediction System - Startup
echo ============================================
echo.

REM Check if .venv exists
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install dependencies if needed
echo Checking Python dependencies...
pip install -q torch fastapi uvicorn pydantic 2>nul

REM Create model if it doesn't exist
if not exist "malaria_model.pth" (
    echo.
    echo Creating AI model...
    python malaria_model.py
    echo AI model created successfully!
)

echo.
echo ============================================
echo Starting FastAPI Backend...
echo ============================================
echo FastAPI will run on: http://localhost:8000
echo Press Ctrl+C to stop
echo.

uvicorn app.backend:app --reload --port 8000

pause
