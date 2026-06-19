import { BaseComponent } from '../core/BaseComponent';
import { AdminUser } from '../types';
import { CustomInput } from '../shared/components/CustomInput';
import { CustomSelect } from '../shared/components/CustomSelect';
import { Toast } from '../shared/components/Toast';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';

const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
const ICON_UNLOCK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`;

export class AdministratorsComponent extends BaseComponent {
  private users: AdminUser[] = [];
  private usernameInput: CustomInput | null = null;
  private emailInput: CustomInput | null = null;
  private passwordInput: CustomInput | null = null;
  private roleSelect: CustomSelect | null = null;
  private editingUserId: number | null = null;

  render(): void {
    const canWrite = this.canWrite('administrators');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="admin-search" placeholder="Buscar por usuario o correo..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${canWrite ? `<button id="btn-new-admin" class="btn-primary">+ Nuevo Administrador</button>` : ''}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol / Privilegios</th>
                <th>Estado</th>
                ${canWrite ? '<th style="text-align: center;">Acciones</th>' : ''}
              </tr>
            </thead>
            <tbody id="admins-table-body">
              <tr><td colspan="6" style="text-align: center;">Cargando administradores...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Nuevo Administrador / Editar -->
      <div id="modal-admin" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-admin-title">Registrar Nueva Cuenta Administrativa</h2>
            <span class="close-modal" id="close-modal-admin">&times;</span>
          </div>
          <form id="form-admin" class="modal-form">
            <div id="admin-username-container"></div>
            <div id="admin-email-container"></div>
            <div id="admin-password-container"></div>
            <div id="admin-role-container"></div>
            <button type="submit" id="btn-admin-submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Crear Cuenta</button>
          </form>
        </div>
      </div>
    `;
  }

  async onInit(): Promise<void> {
    await this.loadData();
    this.initializeCustomFields();
    this.setupEventListeners();
  }

  private initializeCustomFields(): void {
    const userContainer = document.getElementById('admin-username-container');
    if (userContainer) {
      this.usernameInput = new CustomInput(userContainer, {
        label: 'Nombre de Usuario',
        name: 'username',
        required: true,
        placeholder: 'Ej. admin_user'
      });
      this.usernameInput.render();
    }

    const emailContainer = document.getElementById('admin-email-container');
    if (emailContainer) {
      this.emailInput = new CustomInput(emailContainer, {
        label: 'Correo Electrónico',
        name: 'email',
        type: 'email',
        required: true,
        placeholder: 'Ej. admin@empresa.com'
      });
      this.emailInput.render();
    }

    const passContainer = document.getElementById('admin-password-container');
    if (passContainer) {
      this.passwordInput = new CustomInput(passContainer, {
        label: 'Contraseña de Acceso',
        name: 'password',
        type: 'password',
        required: true,
        minlength: 6,
        placeholder: 'Mínimo 6 caracteres'
      });
      this.passwordInput.render();
    }

    const roleContainer = document.getElementById('admin-role-container');
    if (roleContainer) {
      this.roleSelect = new CustomSelect(roleContainer, {
        label: 'Rol asignado',
        name: 'role',
        options: [
          { value: 'admin', label: 'Administrador (RRHH)' },
          { value: 'super_admin', label: 'Super Administrador (TI/Soporte)' },
          { value: 'operator', label: 'Operador (Consulta/Lectura)' }
        ],
        defaultValue: 'admin'
      });
      this.roleSelect.render();
    }
  }

  private async loadData(): Promise<void> {
    try {
      const res = await fetch('/auth/users', { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error();
      this.users = await res.json();
      this.renderTable();
    } catch {
      const tbody = document.getElementById('admins-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger);">Error al cargar administradores.</td></tr>`;
    }
  }

  private renderTable(search: string = ''): void {
    const tbody = document.getElementById('admins-table-body');
    if (!tbody) return;

    const filtered = this.users.filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No se encontraron cuentas.</td></tr>`;
      return;
    }

    const canWrite = this.canWrite('administrators');
    const currentUsername = localStorage.getItem('auth_username') || '';
    const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    tbody.innerHTML = filtered.map(u => {
      let badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;';
      let roleLabel = 'Administrador';
      
      if (u.role === 'super_admin') {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;';
        roleLabel = 'Super Admin';
      } else if (u.role === 'operator') {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(148, 163, 184, 0.1); color: #94a3b8;';
        roleLabel = 'Operador';
      }

      const isSelf = u.username === currentUsername;
      const isLocked = !!(u as any).locked_at;
      const attempts = (u as any).failed_login_attempts ?? 0;

      const statusBadge = isLocked
        ? `<span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.3);" title="Bloqueado tras ${attempts} intento(s) fallido(s)">
             ${ICON_UNLOCK}&nbsp;Bloqueado
           </span>`
        : `<span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;">Activo</span>`;

      return `
        <tr ${isLocked ? 'style="opacity: 0.85;"' : ''}>
          <td><strong>#${u.id}</strong></td>
          <td>${u.username} ${isSelf ? '<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">(tú)</span>' : ''}</td>
          <td>${u.email}</td>
          <td><span class="badge" style="${badgeStyle}">${roleLabel}</span></td>
          <td>${statusBadge}</td>
          ${canWrite ? `
            <td style="text-align: center; display: flex; gap: 8px; justify-content: center; align-items: center; border-bottom: none;">
              <button class="action-icon-btn btn-edit-admin" data-id="${u.id}" data-username="${u.username}" data-email="${u.email}" data-role="${u.role}" title="Editar administrador"
                style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
                ${ICON_EDIT}
              </button>
              ${isLocked && !isSelf ? `
                <button class="action-icon-btn btn-unlock-admin" data-id="${u.id}" data-name="${u.username}" title="Desbloquear cuenta"
                  style="background:transparent;border:none;cursor:pointer;color:#fb923c;padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                  onmouseover="this.style.background='rgba(251,146,60,0.1)'" onmouseout="this.style.background='transparent'">
                  ${ICON_UNLOCK}
                </button>
              ` : ''}
              ${!isSelf ? `
                <button class="action-icon-btn btn-delete-admin" data-id="${u.id}" data-name="${u.username}" title="Eliminar administrador"
                  style="background:transparent;border:none;cursor:pointer;color:#f87171;padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                  onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                  ${ICON_DELETE}
                </button>
              ` : ''}
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');
  }

  private setupEventListeners(): void {
    const searchInput = document.getElementById('admin-search');
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.renderTable(val);
    });

    const trigger = document.getElementById('btn-new-admin');
    const modal = document.getElementById('modal-admin');
    const close = document.getElementById('close-modal-admin');
    const modalTitle = document.getElementById('modal-admin-title');
    const submitBtn = document.getElementById('btn-admin-submit');
    const form = document.getElementById('form-admin') as HTMLFormElement | null;

    trigger?.addEventListener('click', () => {
      this.editingUserId = null;
      if (modalTitle) modalTitle.innerText = 'Registrar Nueva Cuenta Administrativa';
      if (submitBtn) submitBtn.innerText = 'Crear Cuenta';
      form?.reset();
      this.usernameInput?.setDisabled(false);
      this.passwordInput?.setRequired(true);
      this.roleSelect?.setValue('admin');
      modal?.classList.remove('hidden');
    });

    const hideModal = () => {
      modal?.classList.add('hidden');
      this.editingUserId = null;
      form?.reset();
      this.usernameInput?.setDisabled(false);
      this.passwordInput?.setRequired(true);
      this.roleSelect?.setValue('admin');
    };

    close?.addEventListener('click', hideModal);

    // Registrar o editar administrador
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload: any = {
        email: this.emailInput?.getValue() || '',
        role: this.roleSelect?.getValue() || 'admin'
      };

      const passwordVal = this.passwordInput?.getValue();
      if (passwordVal) {
        payload.password = passwordVal;
      }

      if (this.editingUserId === null) {
        // Modo creación: también requiere username y password obligatorio
        payload.username = this.usernameInput?.getValue() || '';
        payload.password = passwordVal || '';
        
        try {
          const res = await fetch('/auth/register', {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok) {
            Toast.success(`Cuenta administrativa "${payload.username}" creada exitosamente.`);
            hideModal();
            await this.loadData();
          } else {
            Toast.error('Error: ' + (data.detail || 'No se pudo crear la cuenta.'));
          }
        } catch {
          Toast.error('Error de conexión.');
        }
      } else {
        // Modo edición
        try {
          const res = await fetch(`/auth/users/${this.editingUserId}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok) {
            Toast.success('Cuenta administrativa actualizada con éxito.');
            hideModal();
            await this.loadData();
          } else {
            Toast.error('Error: ' + (data.detail || 'No se pudo actualizar la cuenta.'));
          }
        } catch {
          Toast.error('Error de conexión.');
        }
      }
    });

    // Eliminar o Editar Administrador (delegación de eventos)
    const tbody = document.getElementById('admins-table-body');
    tbody?.addEventListener('click', async (e) => {
      const target = (e.target as HTMLElement).closest('button') as HTMLElement | null;
      if (!target) return;
      
      if (target.classList.contains('btn-delete-admin')) {
        const id = target.getAttribute('data-id');
        const name = target.getAttribute('data-name');
        if (id && name && await ConfirmDialog.ask(`¿Está seguro de eliminar lógicamente al administrador "${name}"?`)) {
          await this.deleteAdmin(parseInt(id), name);
        }
      } else if (target.classList.contains('btn-unlock-admin')) {
        const id = target.getAttribute('data-id');
        const name = target.getAttribute('data-name');
        if (id && name && await ConfirmDialog.ask(`¿Desbloquear la cuenta de "${name}"? Se reiniciará su contador de intentos fallidos.`)) {
          await this.unlockAdmin(parseInt(id), name);
        }
      } else if (target.classList.contains('btn-edit-admin')) {
        const id = target.getAttribute('data-id');
        const username = target.getAttribute('data-username');
        const email = target.getAttribute('data-email');
        const role = target.getAttribute('data-role');

        if (id && username && email && role) {
          this.editingUserId = parseInt(id);
          if (modalTitle) modalTitle.innerText = 'Editar Cuenta Administrativa';
          if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
          
          this.usernameInput?.setValue(username);
          this.usernameInput?.setDisabled(true);
          this.emailInput?.setValue(email);
          this.roleSelect?.setValue(role);
          
          // Contraseña opcional para edición
          this.passwordInput?.setValue('');
          this.passwordInput?.setRequired(false);
          
          modal?.classList.remove('hidden');
        }
      }
    });
  }

  private async deleteAdmin(id: number, username: string): Promise<void> {
    try {
      const res = await fetch(`/auth/users/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        Toast.success(`El administrador ${username} ha sido eliminado.`);
        await this.loadData();
      } else {
        Toast.error('Error al eliminar administrador: ' + (data.detail || 'Desconocido'));
      }
    } catch {
      Toast.error('Error de conexión.');
    }
  }

  private async unlockAdmin(id: number, username: string): Promise<void> {
    try {
      const res = await fetch(`/auth/users/${id}/unlock`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        Toast.success(`Cuenta de "${username}" desbloqueada correctamente.`);
        await this.loadData();
      } else {
        Toast.error('Error al desbloquear: ' + (data.detail || 'Desconocido'));
      }
    } catch {
      Toast.error('Error de conexión.');
    }
  }
}
