@echo off
echo ========================================
echo SmartID Backend - Quick Start
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing core dependencies (this may take a few minutes)...
pip install -q Django==5.0.1 djangorestframework==3.14.0 django-cors-headers==4.3.1
pip install -q djangorestframework-simplejwt==5.3.1 python-decouple==3.8
pip install -q drf-yasg==1.21.7 Pillow==10.2.0

echo.
echo Note: Face recognition libraries (opencv, face-recognition) are optional
echo They require additional setup. The system will work without them for now.
echo.

echo Running migrations...
python manage.py makemigrations accounts courses attendance authentication
python manage.py migrate

echo.
echo ========================================
echo Backend is starting...
echo ========================================
echo.
echo URLs:
echo   API: http://127.0.0.1:8000/api/
echo   Docs: http://127.0.0.1:8000/api/docs/
echo   Admin: http://127.0.0.1:8000/admin/
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

python manage.py runserver
