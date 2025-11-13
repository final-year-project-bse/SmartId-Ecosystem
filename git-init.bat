@echo off
echo ========================================
echo SmartID Frontend - Git Initialization
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Initialize git repository
echo [1/6] Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize Git repository
    pause
    exit /b 1
)
echo Done!
echo.

REM Add all files
echo [2/6] Adding all files to staging...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo Done!
echo.

REM Create first commit
echo [3/6] Creating first commit...
git commit -m "Initial commit: SmartID Frontend - Facial Recognition Attendance System"
if errorlevel 1 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)
echo Done!
echo.

REM Prompt for GitHub username
echo [4/6] Setting up remote repository...
echo.
set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo ERROR: GitHub username cannot be empty
    pause
    exit /b 1
)

REM Add remote
echo Adding remote repository...
git remote add origin https://github.com/%GITHUB_USERNAME%/smartid-frontend.git
if errorlevel 1 (
    echo WARNING: Remote might already exist. Removing and re-adding...
    git remote remove origin
    git remote add origin https://github.com/%GITHUB_USERNAME%/smartid-frontend.git
)
echo Done!
echo.

REM Rename branch to main
echo [5/6] Renaming branch to main...
git branch -M main
echo Done!
echo.

REM Instructions for pushing
echo [6/6] Ready to push to GitHub!
echo.
echo ========================================
echo IMPORTANT: Before pushing, make sure:
echo ========================================
echo 1. You have created the repository on GitHub
echo    URL: https://github.com/new
echo    Name: smartid-frontend
echo.
echo 2. You have a Personal Access Token
echo    Generate at: https://github.com/settings/tokens
echo    Scopes needed: repo (full control)
echo.
echo 3. When prompted for password, use your token (not account password)
echo.
echo ========================================
echo.
set /p PUSH_NOW="Do you want to push now? (y/n): "
if /i "%PUSH_NOW%"=="y" (
    echo.
    echo Pushing to GitHub...
    echo You will be prompted for your GitHub credentials.
    echo Username: %GITHUB_USERNAME%
    echo Password: Use your Personal Access Token
    echo.
    git push -u origin main
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to push to GitHub
        echo.
        echo Possible reasons:
        echo - Repository doesn't exist on GitHub
        echo - Invalid credentials
        echo - No internet connection
        echo.
        echo Please check and try again with: git push -u origin main
    ) else (
        echo.
        echo ========================================
        echo SUCCESS! Project uploaded to GitHub!
        echo ========================================
        echo.
        echo View your repository at:
        echo https://github.com/%GITHUB_USERNAME%/smartid-frontend
        echo.
    )
) else (
    echo.
    echo Skipping push. You can push later with:
    echo git push -u origin main
    echo.
)

echo.
echo ========================================
echo Git initialization complete!
echo ========================================
echo.
pause
