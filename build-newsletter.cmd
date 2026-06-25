@echo off
setlocal

set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
  set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)

if not exist "%NODE_EXE%" (
  echo Node.js was not found.
  echo Install Node.js, or ask Codex to generate the newsletter after newsletter-data.json is updated.
  pause
  exit /b 1
)

"%NODE_EXE%" "%~dp0generate.js"
if errorlevel 1 (
  echo.
  echo The newsletter could not be generated. Check newsletter-data.json for a missing comma or quote.
  pause
  exit /b 1
)

echo.
echo Done. Open dist\newsletter.html to review the finished email.
pause
