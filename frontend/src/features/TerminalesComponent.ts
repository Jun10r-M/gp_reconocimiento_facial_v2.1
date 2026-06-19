import { BaseComponent } from '../core/BaseComponent';
import { CustomInput } from '../shared/components/CustomInput';
import { CustomSelect } from '../shared/components/CustomSelect';
import { Toast } from '../shared/components/Toast';

interface Terminal {
  id: string;
  name: string;
  type: string;
  status: string;
  last_ping: string;
}

export class TerminalesComponent extends BaseComponent {
  private terminals: Terminal[] = [];
  private nameInput: CustomInput | null = null;
  private statusSelect: CustomSelect | null = null;
  private editingTerminalId: string | null = null;

  render(): void {
    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="stats-grid" id="terminals-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; width: 100%;">
          <p style="grid-column: 1/-1; text-align: center;">Cargando terminales...</p>
        </div>
      </section>

      <!-- Modal Editar Terminal -->
      <div id="modal-terminal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Configurar Dispositivo Biométrico</h2>
            <span class="close-modal" id="close-modal-terminal">&times;</span>
          </div>
          <form id="form-terminal" class="modal-form">
            <div id="terminal-name-container"></div>
            <div id="terminal-status-container"></div>
            <button type="submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Guardar Cambios</button>
          </form>
        </div>
      </div>
    `;
  }

  async onInit(): Promise<void> {
    this.initializeCustomFields();
    await this.loadData();
    this.setupEventListeners();
  }

  private initializeCustomFields(): void {
    const nameContainer = document.getElementById('terminal-name-container');
    if (nameContainer) {
      this.nameInput = new CustomInput(nameContainer, {
        label: 'Nombre del Dispositivo',
        name: 'name',
        required: true,
        placeholder: 'Ej. Cámara Facial Principal'
      });
      this.nameInput.render();
    }

    const statusContainer = document.getElementById('terminal-status-container');
    if (statusContainer) {
      this.statusSelect = new CustomSelect(statusContainer, {
        label: 'Estado de Conexión',
        name: 'status',
        options: [
          { value: 'online', label: 'En línea (Online)' },
          { value: 'offline', label: 'Desconectado (Offline)' }
        ],
        defaultValue: 'online'
      });
      this.statusSelect.render();
    }
  }

  private async loadData(): Promise<void> {
    try {
      const res = await fetch('/system/terminals', { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) {
        throw new Error();
      }
      this.terminals = await res.json();
      this.renderGrid();
    } catch {
      const grid = document.getElementById('terminals-grid');
      if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Error de conexión al cargar las terminales.</p>`;
    }
  }

  private renderGrid(): void {
    const grid = document.getElementById('terminals-grid');
    if (!grid) return;

    if (this.terminals.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No hay terminales registradas.</p>`;
      return;
    }

    const canWrite = this.canWrite('system');
    const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    grid.innerHTML = this.terminals.map(t => {
      const isOnline = t.status.toLowerCase() === 'online';
      const badgeColor = isOnline ? '#2dd4bf' : '#f87171'; // Teal / Red
      const statusLabel = isOnline ? 'EN LÍNEA' : 'DESCONECTADO';
      
      return `
        <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${badgeColor}; padding: 25px; position: relative;">
          ${canWrite ? `
            <button class="btn-edit-terminal" data-id="${t.id}" data-name="${t.name}" data-status="${t.status}" title="Configurar terminal"
              style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s; padding: 4px; border-radius: 6px;"
              onmouseover="this.style.color='white'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.color='var(--text-muted)'; this.style.background='transparent'">
              ${ICON_EDIT}
            </button>
          ` : ''}
          <div>
            <h4 style="margin: 0 0 10px 0; font-size: 1.1rem; color: var(--text-muted); width: 85%;">${t.name}</h4>
            <span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 5px 8px; border-radius: 5px; color: var(--text-muted); font-family: monospace;">Tipo: ${t.type.toUpperCase()}</span>
          </div>
          <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: ${badgeColor}; font-size: 0.9rem;">● ${statusLabel}</span>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${t.last_ping}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  private setupEventListeners(): void {
    const modal = document.getElementById('modal-terminal');
    const close = document.getElementById('close-modal-terminal');
    const form = document.getElementById('form-terminal') as HTMLFormElement | null;

    close?.addEventListener('click', () => {
      modal?.classList.add('hidden');
      this.editingTerminalId = null;
    });

    const grid = document.getElementById('terminals-grid');
    grid?.addEventListener('click', (e) => {
      const editBtn = (e.target as HTMLElement).closest('.btn-edit-terminal') as HTMLElement | null;
      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        const name = editBtn.getAttribute('data-name');
        const status = editBtn.getAttribute('data-status');

        if (id && name && status) {
          this.editingTerminalId = id;
          this.nameInput?.setValue(name);
          this.statusSelect?.setValue(status);
          modal?.classList.remove('hidden');
        }
      }
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!this.editingTerminalId) return;

      const payload = {
        name: this.nameInput?.getValue() || '',
        status: this.statusSelect?.getValue() || 'online'
      };

      try {
        const res = await fetch(`/system/terminals/${this.editingTerminalId}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
          Toast.success('Terminal configurada correctamente.');
          modal?.classList.add('hidden');
          this.editingTerminalId = null;
          await this.loadData();
        } else {
          Toast.error('Error al configurar terminal: ' + (data.detail || 'Desconocido'));
        }
      } catch {
        Toast.error('Error de conexión.');
      }
    });
  }
}
