@echo off
TITLE Sistema de Asistencia IA - Inicializador
color 0A

echo ======================================================
echo    SISTEMA DE ASISTENCIA POR RECONOCIMIENTO FACIAL
echo ======================================================
echo.

:: Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Python no esta instalado en este sistema.
    echo Por favor, instala Python y asegurate de marcar "Add Python to PATH".
    pause
    exit /b
)

:: Crear entorno virtual si no existe
if not exist .venv (
    echo [INFO] Creando entorno virtual para el proyecto...
    python -m venv .venv
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] No se pudo crear el entorno virtual.
        pause
        exit /b
    )
)

:: Activar entorno virtual e instalar dependencias
echo [INFO] Verificando e instalando librerias necesarias...
call .venv\Scripts\activate
python -m pip install --upgrade pip >nul
pip install -r requirements.txt -r requirements-dev.txt

if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Hubo un problema instalando las librerias.
    pause
    exit /b
)

echo.
echo ======================================================
echo    EJECUTANDO PRUEBAS UNITARIAS Y DE INTEGRACIÓN (QA)
echo ======================================================
echo.

pytest --tb=short
if %errorlevel% neq 0 (
    color 0E
    echo [ADVERTENCIA] Algunas pruebas fallaron. Revisa el reporte de QA.
    echo Presiona cualquier tecla si de todas formas deseas iniciar el servidor...
    pause >nul
) else (
    echo [QA OK] Todas las pruebas automatizadas pasaron con exito.
    echo.
)

echo.
echo [OK] Todo listo. Iniciando el servidor con PostgreSQL...
echo.
echo ------------------------------------------------------
echo    ACCESO DASHBOARD: http://127.0.0.1:8080/admin
echo    ACCESO ESCANER:   http://127.0.0.1:8080/
echo ------------------------------------------------------
echo.

set DATABASE_URL=postgresql://postgres:1007@localhost:5433/asistencia_db
python run.py

pause
