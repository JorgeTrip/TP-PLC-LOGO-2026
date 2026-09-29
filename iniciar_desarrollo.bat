@echo off
chcp 65001 > nul
title TP PLC Siemens LOGO! 2026 - Entorno Local
echo ========================================================
echo   Iniciando Plataforma Interactiva TP PLC LOGO! 2026
echo ========================================================
echo.
cd /d "%~dp0"
echo Compilando la versión más reciente...
call npm run build
if %errorlevel% neq 0 (
  echo [ERROR] Falló la compilación de la plataforma.
  pause
  exit /b %errorlevel%
)
echo.
echo Abriendo en el navegador predeterminado...
start "" "%~dp0dist\index.html"
echo.
echo [OK] Plataforma abierta exitosamente en el navegador.
