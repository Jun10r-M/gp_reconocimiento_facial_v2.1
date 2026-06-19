import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import shutil
import pytest
from app.config import settings

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment(tmp_path_factory):
    """
    Fixture de sesión que redirige todos los directorios de datos de la aplicación
    a un directorio temporal exclusivo para pruebas.
    """
    test_dir = tmp_path_factory.mktemp("test_data")
    
    # Reconfigurar settings para apuntar al directorio temporal
    settings.BASE_DIR = str(test_dir)
    
    os.makedirs(settings.DATA_DIR, exist_ok=True)
    os.makedirs(settings.DB_DIR, exist_ok=True)
    os.makedirs(settings.KNOWN_FACES_DIR, exist_ok=True)

    # Re-inicializar el singleton de la base de datos con los nuevos directorios de pruebas
    from app.repositories.database import db
    db._initialized = False
    db.__init__()

    yield test_dir

    try:
        shutil.rmtree(str(test_dir), ignore_errors=True)
    except:
        pass

@pytest.fixture(autouse=True)
def reset_database():
    """
    Fixture a nivel de función que limpia las tablas SQL y el directorio de firmas faciales
    antes de cada prueba para garantizar el aislamiento completo de los tests.
    """
    from app.repositories.database import db
    try:
        with db.get_connection() as conn:
            cursor = conn.cursor()
            if db.is_sqlite:
                cursor.execute("PRAGMA foreign_keys = OFF")
                for table in [
                    "role_permissions", "role_menus", "roles", "permissions", "menus",
                    "payrolls", "justifications", "attendance_logs", "shifts", 
                    "biometrics", "contracts", "employees", "administrators", "knowledge"
                ]:
                    cursor.execute(f"DELETE FROM {table}")
                cursor.execute("PRAGMA foreign_keys = ON")
            else:
                for table in [
                    "role_permissions", "role_menus", "roles", "permissions", "menus",
                    "payrolls", "justifications", "attendance_logs", "shifts", 
                    "biometrics", "contracts", "employees", "administrators", "knowledge"
                ]:
                    cursor.execute(f"TRUNCATE TABLE {table} CASCADE")
            conn.commit()
    except Exception as e:
        print(f"[TEST RESET ERROR] Fallo al limpiar tablas SQL: {e}")
        
    # Re-sincronizar roles y permisos en la base de datos de pruebas vaciada
    import asyncio
    from app.services.rbac_sync_service import RbacSyncService
    try:
        asyncio.run(RbacSyncService().sync_database_rbac())
    except Exception as e:
        print(f"[TEST RESET ERROR] Fallo al sincronizar RBAC: {e}")
    
    # Limpiar fotos creadas en el directorio temporal
    if os.path.exists(settings.KNOWN_FACES_DIR):
        for item in os.listdir(settings.KNOWN_FACES_DIR):
            item_path = os.path.join(settings.KNOWN_FACES_DIR, item)
            try:
                if os.path.isdir(item_path):
                    shutil.rmtree(item_path)
                else:
                    os.remove(item_path)
            except:
                pass
    yield

