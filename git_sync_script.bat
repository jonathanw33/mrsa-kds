@echo off
echo ================================
echo MRSA-KDS Git Sync Script
echo ================================
echo.

echo Current directory: %cd%
echo.

echo 1. Checking Git status...
git status
echo.

echo 2. Creating backup of current changes...
git stash push -m "Fixed resistance analysis confidence scores and gene detection - %date% %time%"
echo.

echo 3. Pulling latest changes from GitHub...
git pull origin main
echo.

echo 4. Restoring your changes...
git stash pop
echo.

echo ================================
echo Sync complete!
echo ================================
echo.
echo Next steps:
echo 1. Check if there are any merge conflicts
echo 2. Test your application
echo 3. If everything works, run: git add . && git commit -m "Fix resistance analysis" && git push
echo.
pause
