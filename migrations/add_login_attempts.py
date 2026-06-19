"""
Migración: Añade columnas de control de intentos fallidos de login a la tabla administrators.
Ejecutar una sola vez: python migrations/add_login_attempts.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.repositories.database import db

def run():
    print("[Migración] Verificando columnas de control de login en tabla 'administrators'...")

    db_url = os.environ.get("DATABASE_URL", "")
    is_sqlite = "sqlite" in db_url.lower() or not db_url

    if is_sqlite:
        # SQLite: usar PRAGMA table_info
        cols_info = db.execute_query("PRAGMA table_info(administrators)")
        existing_cols = [row["name"] for row in cols_info]
    else:
        # PostgreSQL: usar information_schema
        check_query = """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'administrators' 
            AND column_name IN ('failed_login_attempts', 'locked_at')
        """
        existing = db.execute_query(check_query)
        existing_cols = [row["column_name"] for row in existing]

    if "failed_login_attempts" not in existing_cols:
        db.execute_write(
            "ALTER TABLE administrators ADD COLUMN failed_login_attempts INT DEFAULT 0"
        )
        print("  [OK] Columna 'failed_login_attempts' añadida.")
    else:
        print("  [--] Columna 'failed_login_attempts' ya existe, omitida.")

    if "locked_at" not in existing_cols:
        db.execute_write(
            "ALTER TABLE administrators ADD COLUMN locked_at TIMESTAMP DEFAULT NULL"
        )
        print("  [OK] Columna 'locked_at' añadida.")
    else:
        print("  [--] Columna 'locked_at' ya existe, omitida.")

    print("[Migración] Completada exitosamente.")

if __name__ == "__main__":
    run()
