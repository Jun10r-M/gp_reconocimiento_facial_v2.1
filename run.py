import sys
import os

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].lower() == "dev":
        os.environ["DATABASE_URL"] = "sqlite:///data/db/attendance.db"
        print("\n" + "="*80)
        print("[ENTORNO] MODO DESARROLLO: Base de datos SQLite (attendance.db) seleccionada.")
        print("="*80 + "\n")
    else:
        print("\n" + "="*80)
        print("[ENTORNO] MODO PRODUCCIÓN: Base de datos PostgreSQL seleccionada por defecto.")
        print("="*80 + "\n")

    # Importación perezosa para evitar la inicialización prematura de la base de datos
    import uvicorn
    from app.config import settings

    print(f"Iniciando servidor en http://{settings.HOST}:{settings.PORT}")
    print(f"Panel Administrativo: http://{settings.HOST}:{settings.PORT}/admin")
    print(f"Escáner:             http://{settings.HOST}:{settings.PORT}/")
    
    uvicorn.run(
        "app.main:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=True
    )
