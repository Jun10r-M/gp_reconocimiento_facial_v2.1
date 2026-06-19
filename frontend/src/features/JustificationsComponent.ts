import { BaseComponent } from '../core/BaseComponent';
import { Justification, Employee } from '../types';
import { CustomSelect } from '../shared/components/CustomSelect';
import { CustomCalendar } from '../shared/components/CustomCalendar';
import { Toast } from '../shared/components/Toast';
import { CustomInput } from '../shared/components/CustomInput';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';
import { PaginationHelper } from '../shared/components/PaginationHelper';

const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

export class JustificationsComponent extends BaseComponent {
  private justifications: Justification[] = [];
  private employees: Employee[] = [];
  private empSelect: CustomSelect | null = null;
  private dateCalendar: CustomCalendar | null = null;
  private typeSelect: CustomSelect | null = null;
  private descriptionInput: CustomInput | null = null;
  private editingJustificationId: number | null = null;

  // Paginación
  private currentPage = 1;
  private pageSize = 10;
  private totalRecords = 0;
  private totalPages = 0;
  private currentSearch = '';

  render(): void {
    const canWrite = this.canWrite('justifications');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="just-search" placeholder="Buscar por colaborador..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${canWrite ? `<button id="btn-new-just" class="btn-primary">+ Registrar Justificación</button>` : ''}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Fecha Justificada</th>
                <th>Tipo</th>
                <th>Descripción / Motivo</th>
                ${canWrite ? '<th style="text-align: center;">Acciones</th>' : ''}
              </tr>
            </thead>
            <tbody id="justifications-table-body">
              <tr><td colspan="5" style="text-align: center;">Cargando justificaciones...</td></tr>
            </tbody>
          </table>
          <div id="justifications-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Registrar/Editar Justificación -->
      <div id="modal-just" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-just-title">Registrar Justificación / Licencia</h2>
            <span class="close-modal" id="close-modal-just">&times;</span>
          </div>
          <form id="form-just" class="modal-form">
            <div id="select-employee-just-container"></div>
            <div id="calendar-date-just-container"></div>
            <div id="select-type-just-container"></div>
            <div id="just-description-container"></div>
            <button type="submit" id="btn-just-submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Guardar Justificación</button>
          </form>
        </div>
      </div>
    `;
  }

  async onInit(): Promise<void> {
    await this.loadData();
    this.setupEventListeners();
  }

  private async loadData(): Promise<void> {
    try {
      if (this.employees.length === 0) {
        const empRes = await fetch('/employees', { headers: this.getAuthHeaders() });
        if (empRes.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return;
        }
        this.employees = await empRes.json();
      }

      await this.loadJustifications(this.currentSearch);
      this.initializeCustomFields();
    } catch (err) {
      console.error("Error al cargar datos:", err);
      Toast.error('Error de conexión.');
    }
  }

  private async loadJustifications(search: string = ''): Promise<void> {
    try {
      this.currentSearch = search;
      const res = await fetch(`/justifications?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(search)}`, { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      this.justifications = data.items || [];
      this.totalRecords = data.total || 0;
      this.totalPages = data.pages || 0;

      this.renderTable();
      this.renderPagination();
    } catch (err) {
      console.error("Error al cargar justificaciones:", err);
      Toast.error('Error al cargar justificaciones.');
    }
  }

  private renderPagination(): void {
    const pagContainer = document.getElementById('justifications-pagination-container');
    if (!pagContainer) return;

    const pag = new PaginationHelper(pagContainer, {
      page: this.currentPage,
      limit: this.pageSize,
      total: this.totalRecords,
      pages: this.totalPages,
      onChangePage: async (page) => {
        this.currentPage = page;
        await this.loadJustifications(this.currentSearch);
      },
      onChangeLimit: async (limit) => {
        this.pageSize = limit;
        this.currentPage = 1;
        await this.loadJustifications(this.currentSearch);
      }
    });
    pag.render();
  }

  private renderTable(): void {
    const tbody = document.getElementById('justifications-table-body');
    if (!tbody) return;

    if (this.justifications.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No se encontraron justificaciones registradas.</td></tr>`;
      return;
    }

    const canWrite = this.canWrite('justifications');
    const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    tbody.innerHTML = this.justifications.map(j => {
      const name = (j as any).full_name || "Desconocido";
      
      let badgeStyle = '';
      let typeLabel = '';
      if (j.justification_type === 'medical') {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(239, 68, 68, 0.1); color: #f87171;';
        typeLabel = 'Médico';
      } else if (j.justification_type === 'license') {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;';
        typeLabel = 'Licencia';
      } else {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(99, 102, 241, 0.1); color: #818cf8;';
        typeLabel = 'Permiso';
      }

      return `
        <tr>
          <td><strong>${name}</strong></td>
          <td>${j.date}</td>
          <td><span class="badge" style="${badgeStyle}">${typeLabel}</span></td>
          <td>${j.description || '-'}</td>
          ${canWrite ? `
            <td style="text-align: center; display: flex; gap: 8px; justify-content: center; align-items: center; border-bottom: none;">
              <button class="action-icon-btn btn-edit-just" data-id="${j.id}" data-emp-id="${j.employee_id}" data-date="${j.date}" data-type="${j.justification_type}" data-desc="${j.description || ''}" title="Editar justificación"
                style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
                ${ICON_EDIT}
              </button>
              <button class="action-icon-btn btn-delete-just" data-emp-id="${j.employee_id}" data-date="${j.date}" title="Eliminar justificación"
                style="background:transparent;border:none;cursor:pointer;color:#f87171;padding:6px;border-radius:8px;display:inline-flex;align-items:center;transition:background 0.15s,color 0.15s;"
                onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                ${ICON_DELETE}
              </button>
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');
  }

  private initializeCustomFields(): void {
    // 1. Colaborador Selector (Buscador avanzado)
    const empContainer = document.getElementById('select-employee-just-container');
    if (empContainer) {
      const options = this.employees.map(e => ({
        value: e.id,
        label: `${e.document_number} - ${e.full_name}`
      }));
      this.empSelect = new CustomSelect(empContainer, {
        label: 'Colaborador',
        name: 'employee_id',
        options: options,
        placeholder: '-- Seleccionar Colaborador --'
      });
      this.empSelect.render();
    }

    // 2. Calendario Personalizado
    const dateContainer = document.getElementById('calendar-date-just-container');
    if (dateContainer) {
      this.dateCalendar = new CustomCalendar(dateContainer, {
        label: 'Fecha del Permiso / Licencia',
        name: 'date',
        placeholder: 'Seleccionar fecha'
      });
      this.dateCalendar.render();
    }

    // 3. Tipo de Justificación
    const typeContainer = document.getElementById('select-type-just-container');
    if (typeContainer) {
      const options = [
        { value: 'medical', label: 'Descanso Médico' },
        { value: 'license', label: 'Licencia Legal con Goce' },
        { value: 'permit', label: 'Permiso Personal Autorizado' }
      ];
      this.typeSelect = new CustomSelect(typeContainer, {
        label: 'Tipo de Justificación',
        name: 'justification_type',
        options: options,
        defaultValue: 'medical'
      });
      this.typeSelect.render();
    }

    // 4. Descripción / Motivo (Textarea)
    const descContainer = document.getElementById('just-description-container');
    if (descContainer) {
      this.descriptionInput = new CustomInput(descContainer, {
        label: 'Descripción / Motivo',
        name: 'description',
        type: 'textarea',
        required: true,
        placeholder: 'Inserte detalles del descanso médico, diagnóstico o memorándum...'
      });
      this.descriptionInput.render();
    }
  }

  private setupEventListeners(): void {
    const searchInput = document.getElementById('just-search');
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.currentPage = 1;
      this.loadJustifications(val);
    });

    // Modales
    const trigger = document.getElementById('btn-new-just');
    const modal = document.getElementById('modal-just');
    const close = document.getElementById('close-modal-just');
    const modalTitle = document.getElementById('modal-just-title');
    const submitBtn = document.getElementById('btn-just-submit');
    const form = document.getElementById('form-just') as HTMLFormElement | null;

    trigger?.addEventListener('click', () => {
      this.editingJustificationId = null;
      if (modalTitle) modalTitle.innerText = 'Registrar Justificación / Licencia';
      if (submitBtn) submitBtn.innerText = 'Guardar Justificación';
      form?.reset();
      
      this.empSelect?.setDisabled(false);
      const dateDom = document.querySelector('#calendar-date-just-container input') as HTMLInputElement | null;
      if (dateDom) dateDom.disabled = false;

      modal?.classList.remove('hidden');
    });

    const hideModal = () => {
      modal?.classList.add('hidden');
      this.editingJustificationId = null;
      form?.reset();
      
      this.empSelect?.setDisabled(false);
      const dateDom = document.querySelector('#calendar-date-just-container input') as HTMLInputElement | null;
      if (dateDom) dateDom.disabled = false;
    };

    close?.addEventListener('click', hideModal);

    // Formulario Registrar/Editar
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload: any = {
        justification_type: this.typeSelect?.getValue() || 'medical',
        description: this.descriptionInput?.getValue() || ''
      };

      if (this.editingJustificationId === null) {
        // Registro nuevo
        payload.employee_id = parseInt((this.empSelect?.getValue() || '0').toString());
        payload.date = this.dateCalendar?.getValue() || '';

        try {
          const res = await fetch('/justifications', {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok) {
            Toast.success('Justificación registrada correctamente.');
            hideModal();
            await this.loadData();
          } else {
            Toast.error('Error al registrar justificación: ' + (data.detail || 'Desconocido'));
          }
        } catch {
          Toast.error('Error de conexión.');
        }
      } else {
        // Edición
        try {
          const res = await fetch(`/justifications/${this.editingJustificationId}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok) {
            Toast.success('Justificación actualizada correctamente.');
            hideModal();
            await this.loadData();
          } else {
            Toast.error('Error al actualizar justificación: ' + (data.detail || 'Desconocido'));
          }
        } catch {
          Toast.error('Error de conexión.');
        }
      }
    });

    // Delegación de eventos en tabla
    const tbody = document.getElementById('justifications-table-body');
    tbody?.addEventListener('click', async (e) => {
      const target = (e.target as HTMLElement).closest('button') as HTMLElement | null;
      if (!target) return;
      
      if (target.classList.contains('btn-delete-just')) {
        const empId = target.getAttribute('data-emp-id');
        const dateStr = target.getAttribute('data-date');
        if (empId && dateStr && await ConfirmDialog.ask('¿Desea eliminar esta justificación?')) {
          await this.deleteJustification(parseInt(empId), dateStr);
        }
      } else if (target.classList.contains('btn-edit-just')) {
        const id = target.getAttribute('data-id');
        const empId = target.getAttribute('data-emp-id');
        const dateStr = target.getAttribute('data-date');
        const typeStr = target.getAttribute('data-type');
        const descStr = target.getAttribute('data-desc');

        if (id && empId && dateStr && typeStr) {
          this.editingJustificationId = parseInt(id);
          if (modalTitle) modalTitle.innerText = 'Editar Justificación';
          if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
          
          this.empSelect?.setValue(empId);
          this.empSelect?.setDisabled(true);

          this.dateCalendar?.setValue(dateStr);
          const dateDom = document.querySelector('#calendar-date-just-container input') as HTMLInputElement | null;
          if (dateDom) dateDom.disabled = true;

          this.typeSelect?.setValue(typeStr);
          this.descriptionInput?.setValue(descStr || '');

          modal?.classList.remove('hidden');
        }
      }
    });
  }

  private async deleteJustification(empId: number, dateStr: string): Promise<void> {
    try {
      const res = await fetch(`/justifications/employee/${empId}/date/${dateStr}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        Toast.success('Justificación eliminada exitosamente.');
        await this.loadData();
      } else {
        Toast.error('Error: ' + (data.detail || 'No se pudo eliminar'));
      }
    } catch {
      Toast.error('Error de conexión.');
    }
  }
}
