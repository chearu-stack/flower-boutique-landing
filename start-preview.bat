@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не найден. Установите актуальную LTS-версию Node.js и повторите запуск.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Подготавливаем зависимости проекта...
  call npm install
  if errorlevel 1 (
    echo Не удалось установить зависимости. Проверьте подключение к интернету и повторите запуск.
    pause
    exit /b 1
  )
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-preview.ps1"
if errorlevel 1 pause
endlocal
