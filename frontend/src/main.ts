import { Sidebar } from './features/Sidebar';
import { Router } from './router';

async function initApp() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    // 1. Obtener perfil dinámico de base de datos via backend
    const response = await fetch('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return;
    }

    const profile = await response.json();
    
    // Guardar detalles en localStorage para componentes
    localStorage.setItem('auth_username', profile.username);
    localStorage.setItem('auth_role', profile.role);
    localStorage.setItem('auth_menus', JSON.stringify(profile.menus));
    localStorage.setItem('auth_menu_details', JSON.stringify(profile.menu_details));
    localStorage.setItem('auth_scopes', JSON.stringify(profile.scopes));

    // 2. Mostrar nombre de admin activo
    const userBtn = document.getElementById('admin-user-btn');
    if (userBtn) {
      userBtn.innerText = profile.username.toUpperCase();
    }

    // 3. Inicializar enrutador
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;
    const router = new Router(contentArea);

    // 4. Inicializar barra lateral
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
      const defaultSection = profile.menus.length > 0 ? profile.menus[0] : 'resumen';
      const initialSection = router.getSectionFromUrl(defaultSection);

      const sidebar = new Sidebar(sidebarContainer, initialSection, (section) => {
        router.navigate(section);
      });
      sidebar.render();
      sidebar.onInit();
      
      // Ir a sección inicial (sin disparar pushState redundante al cargar)
      router.navigate(initialSection, false);

      // Escuchar navegación del historial del navegador (atrás/adelante)
      window.addEventListener('popstate', () => {
        const currentSec = router.getSectionFromUrl(defaultSection);
        sidebar.setActiveSection(currentSec);
        router.navigate(currentSec, false);
      });
    }

    // 5. Configurar dropdown del menú de usuario
    setupUserMenu();

    // 6. Configurar Chatbot del Panel
    setupAdminChatbot();

  } catch (err) {
    console.error("Error inicializando aplicación:", err);
    // Redirección si falla conexión
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
}

function setupUserMenu() {
  const btn = document.getElementById('admin-user-btn');
  const dropdown = document.getElementById('admin-dropdown');

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    dropdown?.classList.add('hidden');
  });

  // Regresar al Escáner
  document.getElementById('btn-scanner')?.addEventListener('click', () => {
    window.location.href = '/';
  });

  // Cerrar Sesión
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_menus');
    localStorage.removeItem('auth_scopes');
    window.location.href = '/login';
  });
}

function setupAdminChatbot() {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const chatWin = document.getElementById('chat-window');
  const sendBtn = document.getElementById('chat-send-btn');
  const inputEl = document.getElementById('chat-input') as HTMLInputElement | null;
  const messagesContainer = document.getElementById('chat-messages');

  if (!toggleBtn || !chatWin || !sendBtn || !inputEl || !messagesContainer) return;

  toggleBtn.addEventListener('click', () => {
    chatWin.classList.toggle('hidden');
    inputEl.focus();
  });

  const sendMessage = async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';

    const userBubble = document.createElement('div');
    userBubble.className = 'user-msg';
    userBubble.innerText = text;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const typingBubble = document.createElement('div');
    typingBubble.className = 'bot-msg';
    typingBubble.innerText = 'Pensando...';
    messagesContainer.appendChild(typingBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/knowledge/ask', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ question: text })
      });

      if (!res.ok) throw new Error();
      const responseData = await res.json();
      typingBubble.innerText = responseData.answer;
    } catch {
      typingBubble.innerText = 'Error al conectar con el asistente IA de administración.';
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  const suggestionContainer = document.getElementById('chat-suggestions');
  if (suggestionContainer) {
    suggestionContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('suggestion-pill')) {
        const text = target.innerText;
        inputEl.value = text;
        sendMessage();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initApp);
