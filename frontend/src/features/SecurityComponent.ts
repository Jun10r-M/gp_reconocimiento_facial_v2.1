import { BaseComponent } from '../core/BaseComponent';
import { CustomInput } from '../shared/components/CustomInput';
import { CustomSelect, SelectOption } from '../shared/components/CustomSelect';
import { Toast } from '../shared/components/Toast';

interface SystemMenu {
  id: number;
  key: string;
  label: string;
  icon: string;
  parent_id?: number | null;
}

interface SystemPermission {
  id: number;
  module: string;
  action: string;
  code: string;
}

interface SystemRole {
  id: number;
  name: string;
  description: string;
}

export class SecurityComponent extends BaseComponent {
  private activeTab: 'matrix' | 'menus' = 'matrix';
  
  // Datos maestros
  private roles: SystemRole[] = [];
  private allMenus: SystemMenu[] = [];
  private allPermissions: SystemPermission[] = [];
  
  // Estado actual del rol seleccionado
  private selectedRoleId: number | null = null;
  private roleMenuIds: number[] = [];
  private rolePermissionIds: number[] = [];
  
  // Selectores y modales de menú
  private rbacRoleSelect: CustomSelect | null = null;
  private editMenuLabelInput: CustomInput | null = null;
  private editMenuParentSelect: CustomSelect | null = null;
  private editingMenuId: number | null = null;
  private selectedIcon: string = 'folder';

  private menuIcons = [
    { name: 'folder', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>` },
    { name: 'users', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>` },
    { name: 'settings', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` },
    { name: 'rect', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>` },
    { name: 'calendar', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },
    { name: 'alert', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>` },
    { name: 'clock', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>` },
    { name: 'dollar', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>` },
    { name: 'brain', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path></svg>` },
    { name: 'cpu', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>` },
    { name: 'file-text', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>` },
    { name: 'user-check', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` },
    { name: 'lock', svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>` }
  ];

  render(): void {
    const canWrite = this.canWrite('security');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in" style="width: 100%;">
        
        <!-- Pestañas -->
        <div class="login-tabs" style="margin-bottom: 30px;">
          <div class="login-tab ${this.activeTab === 'matrix' ? 'active' : ''}" id="tab-matrix">Matriz de Roles y Privilegios</div>
          <div class="login-tab ${this.activeTab === 'menus' ? 'active' : ''}" id="tab-menus">Configuración de Menús</div>
        </div>

        <!-- Contenedor Pestaña 1: Matriz de Roles -->
        <div id="pane-matrix" class="${this.activeTab !== 'matrix' ? 'hidden' : ''}">
          <div class="stat-card" style="padding: 30px; margin-bottom: 30px; overflow: visible;">
            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.25rem;">Seleccionar Rol para Asignar</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
              Los cambios aplicados aquí determinarán qué apartados del panel puede visualizar el rol seleccionado y qué operaciones CRUD está autorizado a realizar.
            </p>
            <div id="rbac-role-select-container" style="max-width: 300px;"></div>
            <div id="role-description" style="margin-top: 15px; font-size: 0.85rem; color: var(--primary); font-weight: 500;"></div>
          </div>

          <!-- Matriz de Checkboxes -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;" id="matrix-checkboxes-container" class="hidden">
            
            <!-- Acceso a Menús -->
            <div class="stat-card" style="padding: 25px;">
              <h4 style="margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: white;">
                Acceso a Secciones (Menú)
              </h4>
              <div id="menu-checks-list" style="display: flex; flex-direction: column; gap: 14px;">
                <!-- Cargado dinámicamente -->
              </div>
            </div>

            <!-- Acceso a Permisos (CRUD Módulos) -->
            <div class="stat-card" style="padding: 25px;">
              <h4 style="margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 10px; color: white;">
                Permisos de Operaciones CRUD
              </h4>
              <div id="permission-checks-list" style="display: flex; flex-direction: column; gap: 20px; max-height: 500px; overflow-y: auto; padding-right: 10px;">
                <!-- Cargado dinámicamente -->
              </div>
            </div>
          </div>

          <!-- Botón Guardar -->
          <div id="matrix-actions-container" class="hidden" style="text-align: right; margin-bottom: 40px;">
            <button id="btn-save-matrix" class="btn-primary" style="padding: 14px 40px;" ${!canWrite ? 'disabled' : ''}>
              Guardar Matriz de Seguridad
            </button>
          </div>
        </div>

        <!-- Contenedor Pestaña 2: Gestión de Menús (Sin Formulario de Creación Libre) -->
        <div id="pane-menus" class="${this.activeTab !== 'menus' ? 'hidden' : ''}">
          <div style="width: 100%;">
            <!-- Listado de Menús Existentes -->
            <div class="table-card" style="margin-top: 0; width: 100%;">
              <div style="padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="margin: 0; font-size: 1.1rem; color: white;">Menús Activos del Sistema</h3>
                  <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">Solo se permite modificar etiquetas, grupos e iconos de los menús mapeados para preservar la consistencia.</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Clave</th>
                    <th>Etiqueta</th>
                    <th>Grupo / Menú Padre</th>
                    <th>Icono SVG</th>
                    ${canWrite ? '<th style="text-align: center;">Acciones</th>' : ''}
                  </tr>
                </thead>
                <tbody id="menus-table-body">
                  <tr><td colspan="6" style="text-align: center;">Cargando menús...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Editar Menú -->
        <div id="modal-edit-menu" class="modal hidden">
          <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
              <h2>Editar Configuración de Menú</h2>
              <span class="close-modal" id="close-modal-edit-menu">&times;</span>
            </div>
            <form id="form-edit-menu" class="modal-form">
              <div id="edit-menu-label-container"></div>
              <div id="edit-menu-parent-container"></div>
              
              <!-- Grid de Iconos Personalizado -->
              <div class="custom-form-group">
                <label style="margin-bottom: 8px; display: block;">Seleccionar Icono del Menú</label>
                <div id="menu-icons-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 8px;">
                  <!-- Poblado dinámicamente -->
                </div>
              </div>
              
              <button type="submit" class="btn-primary" style="margin-top: 25px; width: 100%;">Guardar Configuración</button>
            </form>
          </div>
        </div>

      </section>
    `;
  }

  async onInit(): Promise<void> {
    this.setupTabs();
    
    // Cargar datos del servidor
    await this.loadMasterData();
    
    // Configurar listeners
    this.setupEventListeners();
  }

  private setupTabs(): void {
    const tabMatrix = document.getElementById('tab-matrix');
    const tabMenus = document.getElementById('tab-menus');
    const paneMatrix = document.getElementById('pane-matrix');
    const paneMenus = document.getElementById('pane-menus');

    tabMatrix?.addEventListener('click', () => {
      this.activeTab = 'matrix';
      tabMatrix.classList.add('active');
      tabMenus?.classList.remove('active');
      paneMatrix?.classList.remove('hidden');
      paneMenus?.classList.add('hidden');
    });

    tabMenus?.addEventListener('click', () => {
      this.activeTab = 'menus';
      tabMenus.classList.add('active');
      tabMatrix?.classList.remove('active');
      paneMenus?.classList.remove('hidden');
      paneMatrix?.classList.add('hidden');
    });
  }

  private initializeCustomFields(): void {
    // Inicializar campos de edición de menú
    const labelContainer = document.getElementById('edit-menu-label-container');
    if (labelContainer) {
      this.editMenuLabelInput = new CustomInput(labelContainer, {
        label: 'Etiqueta Visual (label)',
        name: 'label',
        required: true,
        placeholder: 'Ej. Asistencia, Planilla de Costos'
      });
      this.editMenuLabelInput.render();
    }
  }

  private initializeParentSelect(): void {
    const parentContainer = document.getElementById('edit-menu-parent-container');
    if (parentContainer) {
      // Filtrar posibles menús que pueden ser padres (sólo menús de nivel raíz, es decir, parent_id es null o vacio)
      // Para evitar auto-referencias, excluimos también el menú que estamos editando.
      const parentOptions: SelectOption[] = this.allMenus
        .filter(m => (m.parent_id === null || m.parent_id === undefined) && m.id !== this.editingMenuId)
        .map(m => ({
          value: m.id,
          label: m.label
        }));

      // Añadir la opción de "Ninguno"
      parentOptions.unshift({ value: '', label: 'Ninguno (Elemento Raíz o Grupo)' });

      this.editMenuParentSelect = new CustomSelect(parentContainer, {
        label: 'Menú / Grupo Padre',
        name: 'parent_id',
        options: parentOptions,
        placeholder: '-- Seleccionar Grupo Padre --'
      });
      this.editMenuParentSelect.render();
    }
  }

  private renderIconsGrid(): void {
    const grid = document.getElementById('menu-icons-grid');
    if (!grid) return;

    grid.innerHTML = this.menuIcons.map(icon => {
      const isSelected = icon.name === this.selectedIcon;
      const borderStyle = isSelected ? 'border: 2px solid var(--primary); background: rgba(79,70,229,0.15);' : 'border: 1px solid var(--border);';
      
      return `
        <button type="button" class="btn-icon-option" data-name="${icon.name}"
          style="display: flex; align-items: center; justify-content: center; padding: 12px; border-radius: 8px; cursor: pointer; color: white; transition: var(--transition); background: transparent; ${borderStyle}"
          onmouseover="this.style.borderColor='var(--primary)'" 
          onmouseout="if('${icon.name}' !== '${this.selectedIcon}') this.style.borderColor='var(--border)'">
          ${icon.svg}
        </button>
      `;
    }).join('');

    // Listener para clics
    grid.querySelectorAll('.btn-icon-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        if (name) {
          this.selectedIcon = name;
          this.renderIconsGrid(); // re-pintar para actualizar bordes
        }
      });
    });
  }

  private async loadMasterData(): Promise<void> {
    try {
      // 1. Cargar Menús
      const resMenus = await fetch('/security/menus', { headers: this.getAuthHeaders() });
      if (!resMenus.ok) throw new Error();
      this.allMenus = await resMenus.json();
      this.renderMenusTable();

      // 2. Cargar Permisos
      const resPerms = await fetch('/security/permissions', { headers: this.getAuthHeaders() });
      if (!resPerms.ok) throw new Error();
      this.allPermissions = await resPerms.json();

      // 3. Cargar Roles
      const resRoles = await fetch('/security/roles', { headers: this.getAuthHeaders() });
      if (!resRoles.ok) throw new Error();
      this.roles = await resRoles.json();
      this.renderRolesSelect();
      
    } catch {
      Toast.error('Error de comunicación al cargar la configuración de seguridad.');
    }
  }

  private renderRolesSelect(): void {
    const selectContainer = document.getElementById('rbac-role-select-container');
    if (!selectContainer) return;

    const options = this.roles.map(r => ({
      value: r.id,
      label: r.name.toUpperCase()
    }));

    this.rbacRoleSelect = new CustomSelect(selectContainer, {
      label: 'Rol del Sistema',
      name: 'role_id',
      options: options,
      placeholder: '-- Seleccionar Rol --',
      onChange: async (val) => {
        const descDiv = document.getElementById('role-description');
        const container = document.getElementById('matrix-checkboxes-container');
        const actions = document.getElementById('matrix-actions-container');

        if (!val) {
          this.selectedRoleId = null;
          if (descDiv) descDiv.innerText = '';
          container?.classList.add('hidden');
          actions?.classList.add('hidden');
          return;
        }

        this.selectedRoleId = parseInt(val.toString());
        const roleObj = this.roles.find(r => r.id === this.selectedRoleId);
        if (descDiv && roleObj) {
          descDiv.innerText = `Descripción: ${roleObj.description}`;
        }

        // Cargar asignaciones del rol
        await this.loadRoleAssignments(this.selectedRoleId);
        
        // Renderizar matriz de checks
        this.renderMatrixCheckboxes();
        
        container?.classList.remove('hidden');
        actions?.classList.remove('hidden');
      }
    });
    this.rbacRoleSelect.render();
  }

  private renderMenusTable(): void {
    const tbody = document.getElementById('menus-table-body');
    if (!tbody) return;

    if (this.allMenus.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay menús registrados.</td></tr>`;
      return;
    }

    const canWrite = this.canWrite('security');
    const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    tbody.innerHTML = this.allMenus.map(m => {
      // Nombre de grupo padre
      let parentLabel = 'Raíz / Grupo';
      if (m.parent_id) {
        const parentObj = this.allMenus.find(p => p.id === m.parent_id);
        if (parentObj) {
          parentLabel = `<span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;">${parentObj.label}</span>`;
        }
      }

      return `
        <tr>
          <td>${m.id}</td>
          <td><strong style="color: var(--primary);">${m.key}</strong></td>
          <td>${m.label}</td>
          <td>${parentLabel}</td>
          <td><span style="font-family: monospace; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 6px;">${m.icon}</span></td>
          ${canWrite ? `
            <td style="text-align: center;">
              <button class="action-icon-btn btn-edit-menu" data-id="${m.id}" data-label="${m.label}" data-icon="${m.icon}" data-parent-id="${m.parent_id || ''}" title="Editar menú"
                style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
                ${ICON_EDIT}
              </button>
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');
  }

  private setupEventListeners(): void {
    // Guardar Matriz
    const btnSave = document.getElementById('btn-save-matrix');
    btnSave?.addEventListener('click', async () => {
      if (!this.selectedRoleId) return;
      await this.saveMatrixAssignments();
    });

    // Modal Editar Menú
    const modal = document.getElementById('modal-edit-menu');
    const close = document.getElementById('close-modal-edit-menu');
    const form = document.getElementById('form-edit-menu') as HTMLFormElement | null;

    close?.addEventListener('click', () => {
      modal?.classList.add('hidden');
      this.editingMenuId = null;
    });

    // Delegación para botón Editar
    const tbody = document.getElementById('menus-table-body');
    tbody?.addEventListener('click', (e) => {
      const editBtn = (e.target as HTMLElement).closest('.btn-edit-menu') as HTMLElement | null;
      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const label = editBtn.getAttribute('data-label');
        const icon = editBtn.getAttribute('data-icon');
        const parentId = editBtn.getAttribute('data-parent-id');

        if (id && label && icon) {
          this.editingMenuId = parseInt(id);
          this.selectedIcon = icon;
          
          this.initializeCustomFields();
          this.editMenuLabelInput?.setValue(label);
          
          this.initializeParentSelect();
          if (parentId) {
            this.editMenuParentSelect?.setValue(parentId);
          } else {
            this.editMenuParentSelect?.setValue('');
          }
          
          this.renderIconsGrid();
          modal?.classList.remove('hidden');
        }
      }
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!this.editingMenuId) return;

      const pIdVal = this.editMenuParentSelect?.getValue();
      const parent_id = pIdVal ? parseInt(pIdVal.toString()) : null;

      const payload = {
        label: this.editMenuLabelInput?.getValue() || '',
        icon: this.selectedIcon,
        parent_id: parent_id
      };

      try {
        const res = await fetch(`/security/menus/${this.editingMenuId}`, {
          method: 'PUT',
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          Toast.success(`Menú '${payload.label}' actualizado con éxito.`);
          modal?.classList.add('hidden');
          this.editingMenuId = null;
          
          // Recargar menús
          await this.loadMasterData();

          // Advertencia de recarga para aplicar al Sidebar
          Toast.warning('Recarga el panel para que los cambios se reflejen en la barra lateral.');
        } else {
          Toast.error('Error: ' + (data.detail || 'No se pudo actualizar el menú.'));
        }
      } catch {
        Toast.error('Error de conexión.');
      }
    });
  }

  private async loadRoleAssignments(roleId: number): Promise<void> {
    try {
      const res = await fetch(`/security/roles/${roleId}/assignments`, { headers: this.getAuthHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      this.roleMenuIds = data.menu_ids;
      this.rolePermissionIds = data.permission_ids;
    } catch {
      Toast.error('Error al obtener privilegios del rol.');
    }
  }

  private renderMatrixCheckboxes(): void {
    // 1. Renderizar checks de menús
    const menuList = document.getElementById('menu-checks-list');
    if (menuList) {
      menuList.innerHTML = this.allMenus.map(m => {
        const checked = this.roleMenuIds.includes(m.id) ? 'checked' : '';
        return `
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; font-size: 0.95rem;">
            <input type="checkbox" class="menu-checkbox" value="${m.id}" ${checked} style="width: 18px; height: 18px; accent-color: var(--primary);">
            <span>${m.label} <small style="color: var(--text-muted);">(${m.key})</small></span>
          </label>
        `;
      }).join('');
    }

    // 2. Renderizar checks de permisos agrupados por módulo
    const permList = document.getElementById('permission-checks-list');
    if (permList) {
      // Agrupar permisos por módulo
      const groups: { [module: string]: SystemPermission[] } = {};
      this.allPermissions.forEach(p => {
        if (!groups[p.module]) {
          groups[p.module] = [];
        }
        groups[p.module].push(p);
      });

      let html = '';
      for (const [module, perms] of Object.entries(groups)) {
        html += `
          <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border); padding: 16px; border-radius: 12px;">
            <h5 style="margin-top: 0; margin-bottom: 12px; font-size: 0.9rem; text-transform: uppercase; color: var(--primary); letter-spacing: 0.5px;">
              Módulo: ${module.toUpperCase()}
            </h5>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        `;
        
        perms.forEach(p => {
          const checked = this.rolePermissionIds.includes(p.id) ? 'checked' : '';
          let actionLabel = p.action;
          if (p.action === 'create') actionLabel = 'Crear';
          else if (p.action === 'read') actionLabel = 'Leer';
          else if (p.action === 'update') actionLabel = 'Editar';
          else if (p.action === 'delete') actionLabel = 'Eliminar';

          html += `
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; font-size: 0.85rem;">
              <input type="checkbox" class="perm-checkbox" value="${p.id}" ${checked} style="width: 16px; height: 16px; accent-color: var(--success);">
              <span>${actionLabel} <small style="color: var(--text-muted);">(${p.code})</small></span>
            </label>
          `;
        });

        html += `
            </div>
          </div>
        `;
      }
      permList.innerHTML = html;
    }
  }

  private async saveMatrixAssignments(): Promise<void> {
    if (!this.selectedRoleId) return;

    // Obtener IDs seleccionados de menús
    const menuChecks = document.querySelectorAll('.menu-checkbox:checked') as NodeListOf<HTMLInputElement>;
    const selectedMenuIds: number[] = Array.from(menuChecks).map(el => parseInt(el.value));

    // Obtener IDs seleccionados de permisos
    const permChecks = document.querySelectorAll('.perm-checkbox:checked') as NodeListOf<HTMLInputElement>;
    const selectedPermIds: number[] = Array.from(permChecks).map(el => parseInt(el.value));

    try {
      const res = await fetch(`/security/roles/${this.selectedRoleId}/assignments`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          menu_ids: selectedMenuIds,
          permission_ids: selectedPermIds
        })
      });

      if (!res.ok) throw new Error();
      
      // Actualizar el estado local
      this.roleMenuIds = selectedMenuIds;
      this.rolePermissionIds = selectedPermIds;

      Toast.success('¡Matriz de seguridad guardada con éxito!');
      
      // Si el rol modificado es el del propio usuario, sugerir recargar para aplicar cambios del menú
      const myRole = localStorage.getItem('auth_role');
      const selectedRoleObj = this.roles.find(r => r.id === this.selectedRoleId);
      if (selectedRoleObj && selectedRoleObj.name === myRole) {
        Toast.warning('Has modificado tus propios permisos. Recarga la página para aplicar los cambios en el menú.');
      }

    } catch {
      Toast.error('Error al guardar la matriz de seguridad.');
    }
  }
}
