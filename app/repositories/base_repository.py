import os
import json
import asyncio
from typing import Union, Dict

class BaseRepository:
    # Diccionario estático de cerrojos para evitar colisiones de escritura en archivos
    _locks: Dict[str, asyncio.Lock] = {}
    _global_lock = asyncio.Lock()

    @classmethod
    async def _get_lock(cls, file_path: str) -> asyncio.Lock:
        async with cls._global_lock:
            if file_path not in cls._locks:
                cls._locks[file_path] = asyncio.Lock()
            return cls._locks[file_path]

    async def _read_json(self, file_path: str, default_factory=list) -> Union[list, dict]:
        lock = await self._get_lock(file_path)
        async with lock:
            if not os.path.exists(file_path):
                return default_factory()
            try:
                # Ejecutamos de forma síncrona pero protegida por el lock
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                # Registrar error y devolver valor por defecto seguro
                print(f"[REPOSITORIO ERROR] Error leyendo {file_path}: {e}")
                return default_factory()

    async def _write_json(self, file_path: str, data: Union[list, dict]) -> bool:
        lock = await self._get_lock(file_path)
        async with lock:
            try:
                # Asegurar que el directorio contenedor exista
                dir_name = os.path.dirname(file_path)
                if dir_name:
                    os.makedirs(dir_name, exist_ok=True)
                
                # Escribir en un archivo temporal primero, luego renombrar (operación atómica)
                temp_file = f"{file_path}.tmp"
                with open(temp_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=4, ensure_ascii=False)
                
                # Reemplazo seguro
                if os.path.exists(file_path):
                    os.replace(temp_file, file_path)
                else:
                    os.rename(temp_file, file_path)
                return True
            except IOError as e:
                print(f"[REPOSITORIO ERROR] Error escribiendo en {file_path}: {e}")
                if os.path.exists(temp_file):
                    try:
                        os.remove(temp_file)
                    except:
                        pass
                return False
