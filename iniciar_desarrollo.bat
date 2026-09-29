@echo off
cd /d "%~dp0"
echo Compilando la plataforma...
call npm run build
if %ERRORLEVEL% equ 0 (
    echo Abriendo en el navegador...
    start "" "%~dp0dist\index.html"
) else (
    echo [ERROR] Fallo la compilacion.
    pause
)
