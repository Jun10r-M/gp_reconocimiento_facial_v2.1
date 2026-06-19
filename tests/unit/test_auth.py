import pytest
from app.services.auth_service import AuthService
from app.repositories.admin_repository import AdminRepository, MAX_FAILED_ATTEMPTS

@pytest.mark.asyncio
async def test_admin_registration_and_login():
    service = AuthService()
    
    # 1. Registrar administrador
    admin_id = await service.register_admin(
        username="admin_test",
        email="test@compania.com",
        password="SecretPassword123!"
    )
    assert admin_id is not None
    assert isinstance(admin_id, int)

    # Registrar duplicado (debe devolver None)
    duplicado = await service.register_admin(
        username="admin_test",
        email="test2@compania.com",
        password="SecretPassword123!"
    )
    assert duplicado is None

    # 2. Autenticar con credenciales correctas
    admin = await service.authenticate_admin("admin_test", "SecretPassword123!")
    assert admin is not None
    assert admin["username"] == "admin_test"
    assert admin["role"] == "admin"

    # Autenticar con credenciales incorrectas (devuelve _failed con intentos restantes)
    fallido = await service.authenticate_admin("admin_test", "WrongPassword")
    assert fallido is not None
    assert fallido.get("_failed") is True
    assert "remaining_attempts" in fallido

    # 3. Generar token de sesión
    token = await service.create_access_token("admin_test", "admin")
    assert token is not None
    
    # Verificar token
    session = await service.verify_token(token)
    assert session is not None
    assert session["username"] == "admin_test"
    assert session["role"] == "admin"

@pytest.mark.asyncio
async def test_password_recovery():
    service = AuthService()
    
    # Registrar cuenta
    await service.register_admin("recovery_user", "recovery@test.com", "PasswordOriginal")
    
    # Intentar recuperar para correo inexistente
    exito_fail, msg_fail = await service.recover_credentials("non_existent@test.com")
    assert exito_fail is False
    
    # Recuperar para correo existente
    exito_ok, temp_pass = await service.recover_credentials("recovery@test.com")
    assert exito_ok is True
    assert temp_pass.upper().startswith("TEMP")
    
    # Verificar que el login funciona con la contraseña temporal
    admin = await service.authenticate_admin("recovery_user", temp_pass)
    assert admin is not None

@pytest.mark.asyncio
async def test_brute_force_lockout():
    """Verifica que la cuenta se bloquea tras MAX_FAILED_ATTEMPTS intentos consecutivos."""
    service = AuthService()

    # Registrar cuenta de prueba
    await service.register_admin(
        username="lockout_user",
        email="lockout@test.com",
        password="CorrectPass123!"
    )

    # Realizar MAX_FAILED_ATTEMPTS - 1 intentos fallidos
    for i in range(MAX_FAILED_ATTEMPTS - 1):
        result = await service.authenticate_admin("lockout_user", "WrongPass")
        assert result is not None
        assert result.get("_failed") is True, f"Intento {i+1}: debería ser _failed"
        remaining = result.get("remaining_attempts", 0)
        assert remaining == MAX_FAILED_ATTEMPTS - (i + 1)

    # El último intento debe bloquear la cuenta
    last_result = await service.authenticate_admin("lockout_user", "WrongPass")
    assert last_result is not None
    assert last_result.get("_locked") is True, "En el último intento, la cuenta debe quedar bloqueada"

    # Intentos adicionales deben seguir devolviendo bloqueado (incluso con contraseña correcta)
    locked_result = await service.authenticate_admin("lockout_user", "CorrectPass123!")
    assert locked_result is not None
    assert locked_result.get("_locked") is True, "Cuenta bloqueada no puede autenticarse aunque la contraseña sea correcta"

@pytest.mark.asyncio
async def test_unlock_resets_counter():
    """Verifica que desbloquear la cuenta reinicia el contador y permite el login."""
    service = AuthService()
    repo = AdminRepository()

    # Registrar cuenta
    await service.register_admin(
        username="unlock_user",
        email="unlock@test.com",
        password="SecurePass456!"
    )

    # Bloquear agotando todos los intentos
    for _ in range(MAX_FAILED_ATTEMPTS):
        await service.authenticate_admin("unlock_user", "WrongPass")

    # Verificar que está bloqueada
    blocked = await service.authenticate_admin("unlock_user", "SecurePass456!")
    assert blocked is not None and blocked.get("_locked") is True

    # Desbloquear la cuenta
    admin_data = await repo.get_by_username("unlock_user")
    assert admin_data is not None
    unlocked = await repo.unlock_account(admin_data["id"], unlocked_by="test_runner")
    assert unlocked is True

    # Verificar que ahora puede autenticarse correctamente
    ok = await service.authenticate_admin("unlock_user", "SecurePass456!")
    assert ok is not None
    assert ok.get("_locked") is None
    assert ok["username"] == "unlock_user"

