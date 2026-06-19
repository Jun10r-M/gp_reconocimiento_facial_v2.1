import { Toast } from './shared/components/Toast';

function switchTab(tab: 'login' | 'recover') {
  // Desactivar todos los tabs y formularios
  document.querySelectorAll('.login-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.login-form').forEach(el => el.classList.add('hidden'));

  // Activar actual
  const activeTab = document.getElementById('tab-' + tab);
  const activeForm = document.getElementById('form-' + tab);
  if (activeTab) activeTab.classList.add('active');
  if (activeForm) activeForm.classList.remove('hidden');
}

// Asignar listeners a las pestañas
document.getElementById('tab-login')?.addEventListener('click', () => switchTab('login'));
document.getElementById('tab-recover')?.addEventListener('click', () => switchTab('recover'));

// 1. Enviar Formulario de Inicio de Sesión
document.getElementById('form-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const usernameInput = form.elements.namedItem('username') as HTMLInputElement | null;
  const passwordInput = form.elements.namedItem('password') as HTMLInputElement | null;
  if (!usernameInput || !passwordInput) return;

  const payload = {
    username: usernameInput.value.trim(),
    password: passwordInput.value
  };

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_username', payload.username);

      // Cargar el perfil inmediatamente para guardar sus permisos de menú y scopes (RBAC) en localStorage
      try {
        const profileRes = await fetch('/auth/profile', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          localStorage.setItem('auth_scopes', JSON.stringify(profileData.scopes || []));
        }
      } catch (errProfile) {
        console.error("Error al sincronizar permisos locales de scopes:", errProfile);
      }

      window.location.href = '/admin';
    } else {
      Toast.error('Error: ' + (data.detail || 'Credenciales de acceso incorrectas.'));
    }
  } catch (err) {
    console.error("Error de login:", err);
    Toast.error('Error al conectar con el servidor.');
  }
});

// 2. Enviar Formulario de Recuperación de Credenciales
document.getElementById('form-recover')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
  if (!emailInput) return;

  const email = emailInput.value.trim();

  try {
    const res = await fetch('/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    const data = await res.json();
    if (res.ok) {
      // Mostrar contraseña temporal en toast persistente (10 segundos) y también en un alert para que quede visible
      const tmpPass = data.temporary_password;
      Toast.success(`Recuperación exitosa. Contraseña temporal: ${tmpPass}`, 12000);
      // También mostramos en alerta para que el usuario pueda copiarla
      alert(`¡Recuperación exitosa!\n\nPor seguridad del demo, su nueva contraseña temporal es:\n${tmpPass}\n\nÚsela para iniciar sesión y cámbiela a la brevedad.`);
      form.reset();
      switchTab('login');
    } else {
      Toast.error('Error: ' + (data.detail || 'El correo ingresado no coincide con ninguna cuenta activa.'));
    }
  } catch (err) {
    console.error("Error de recuperación:", err);
    Toast.error('Error de conexión con el servidor.');
  }
});
