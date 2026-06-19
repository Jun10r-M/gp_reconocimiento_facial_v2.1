import { BaseComponent } from '../core/BaseComponent';
import { AttendanceLog, Employee } from '../types';
import { Toast } from '../shared/components/Toast';
import { CustomSelect } from '../shared/components/CustomSelect';
import { CustomCalendar } from '../shared/components/CustomCalendar';
import { CustomTime } from '../shared/components/CustomTime';
import { PaginationHelper } from '../shared/components/PaginationHelper';

export class AttendanceComponent extends BaseComponent {
  private logs: AttendanceLog[] = [];
  private employees: Employee[] = [];
  private exportModalEmployeeSelect: CustomSelect | null = null;

  // Paginación
  private currentPage = 1;
  private pageSize = 10;
  private totalRecords = 0;
  private totalPages = 0;
  private currentSearch = '';

  render(): void {
    const canWrite = this.canWrite('attendance_logs');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 15px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 15px; flex-grow: 1;">
              <input type="text" id="att-search" placeholder="Buscar por colaborador..." class="search-generic-input" style="width: 300px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none;">
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <button id="btn-open-export-modal" class="btn-primary" style="background: var(--success); display: flex; align-items: center; gap: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                Exportar
              </button>
              ${canWrite ? `<button id="btn-bulk-punch-trigger" class="btn-primary">+ Marcación Masiva</button>` : ''}
            </div>
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Colaborador</th>
                <th>Método de Marcación</th>
              </tr>
            </thead>
            <tbody id="attendance-table-body">
              <tr><td colspan="3" style="text-align: center;">Cargando bitácora de asistencia...</td></tr>
            </tbody>
          </table>
          <div id="attendance-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Exportar Asistencia -->
      <div id="modal-export-attendance" class="modal hidden">
        <div class="modal-content" style="max-width: 480px;">
          <div class="modal-header">
            <h2>Exportar Asistencia</h2>
            <span class="close-modal" id="close-modal-export">&times;</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">
            Seleccione el colaborador y el formato de exportación deseado.
          </p>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Colaborador</label>
            <div id="export-modal-employee-select-container"></div>
          </div>

          <div style="margin-bottom: 28px;">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Formato de exportación</label>
            <div style="display: flex; gap: 12px;">
              <label id="format-excel-label" style="flex: 1; display: flex; align-items: center; gap: 10px; padding: 14px 18px; border: 2px solid var(--success); border-radius: 12px; cursor: pointer; background: rgba(20,184,166,0.08); transition: all 0.2s;">
                <input type="radio" name="export-format" value="excel" checked style="accent-color: var(--success); width: 16px; height: 16px;">
                <span style="display: flex; flex-direction: column;">
                  <strong style="font-size: 0.95rem;">Excel</strong>
                  <small style="color: var(--text-muted); font-size: 0.78rem;">.xlsx — hoja de cálculo</small>
                </span>
              </label>
              <label id="format-pdf-label" style="flex: 1; display: flex; align-items: center; gap: 10px; padding: 14px 18px; border: 2px solid var(--border); border-radius: 12px; cursor: pointer; background: rgba(255,255,255,0.02); transition: all 0.2s;">
                <input type="radio" name="export-format" value="pdf" style="accent-color: #ef4444; width: 16px; height: 16px;">
                <span style="display: flex; flex-direction: column;">
                  <strong style="font-size: 0.95rem;">PDF</strong>
                  <small style="color: var(--text-muted); font-size: 0.78rem;">.pdf — documento listo</small>
                </span>
              </label>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="btn-cancel-export" class="btn-secondary" style="width: auto; padding: 10px 24px;">Cancelar</button>
            <button id="btn-confirm-export" class="btn-primary" style="width: auto; padding: 10px 24px; background: var(--success); display: flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
              Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Marcación Manual Masiva -->
      <div id="modal-bulk-punch" class="modal hidden">
        <div class="modal-content" style="max-width: 800px;">
          <div class="modal-header">
            <h2>Registrar Marcaciones Manuales Masivas (Contingencia)</h2>
            <span class="close-modal" id="close-modal-bulk">&times;</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
            Utilice este panel para registrar de forma simultánea múltiples ingresos/salidas que no pudieron marcarse biométricamente.
          </p>
          <form id="form-bulk-punch" class="modal-form">
            <div id="bulk-punch-rows" style="display: flex; flex-direction: column; gap: 15px; overflow: visible; margin-bottom: 20px;">
              <!-- Dynamic rows added here -->
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
              <button type="button" id="btn-add-punch-row" class="btn-primary" style="background: var(--border); color: white; width: auto;">+ Añadir Fila</button>
              <button type="submit" class="btn-primary" style="width: auto;">Guardar Marcaciones</button>
            </div>
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
        const response = await fetch('/employees', { headers: this.getAuthHeaders() });
        this.employees = await response.json();
      }
      await this.loadLogs(this.currentSearch);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      Toast.error('Error de conexión.');
    }
  }

  private initExportModalEmployeeSelect(): void {
    const selectContainer = document.getElementById('export-modal-employee-select-container');
    if (!selectContainer) return;
    selectContainer.innerHTML = '';
    this.exportModalEmployeeSelect = null;
    const selectOptions = this.employees.map(e => ({
      value: e.id,
      label: `${e.document_number} - ${e.full_name}`
    }));
    this.exportModalEmployeeSelect = new CustomSelect(selectContainer, {
      name: 'export_modal_employee_id',
      options: selectOptions,
      placeholder: '-- Seleccionar colaborador --'
    });
    this.exportModalEmployeeSelect.render();
  }

  private async loadLogs(search: string = ''): Promise<void> {
    try {
      this.currentSearch = search;
      const response = await fetch(`/attendance/logs?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(search)}`, { headers: this.getAuthHeaders() });
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      this.logs = data.items || [];
      this.totalRecords = data.total || 0;
      this.totalPages = data.pages || 0;

      this.renderTable();
      this.renderPagination();
    } catch (err) {
      console.error("Error al cargar asistencias:", err);
      Toast.error('Error al cargar la bitácora de asistencia.');
    }
  }

  private renderPagination(): void {
    const pagContainer = document.getElementById('attendance-pagination-container');
    if (!pagContainer) return;

    const pag = new PaginationHelper(pagContainer, {
      page: this.currentPage,
      limit: this.pageSize,
      total: this.totalRecords,
      pages: this.totalPages,
      onChangePage: async (page) => {
        this.currentPage = page;
        await this.loadLogs(this.currentSearch);
      },
      onChangeLimit: async (limit) => {
        this.pageSize = limit;
        this.currentPage = 1;
        await this.loadLogs(this.currentSearch);
      }
    });
    pag.render();
  }

  private renderTable(search: string = ''): void {
    const tbody = document.getElementById('attendance-table-body');
    if (!tbody) return;

    const filtered = this.logs.filter(log => {
      const emp = this.employees.find(e => e.id === log.employee_id);
      const name = emp ? emp.full_name : (log.nombre || "Desconocido");
      
      if (!search) return true;
      return name.toLowerCase().includes(search.toLowerCase());
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No hay registros de marcación.</td></tr>`;
      return;
    }

    // Ordenar de más reciente a más antiguo
    filtered.sort((a, b) => new Date(b.timestamp.replace(' ', 'T')).getTime() - new Date(a.timestamp.replace(' ', 'T')).getTime());

    tbody.innerHTML = filtered.map(log => {
      const emp = this.employees.find(e => e.id === log.employee_id);
      const name = emp ? emp.full_name : (log.nombre || "Desconocido");
      
      let badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;'; // face
      let label = 'Reconocimiento Facial';
      if (log.method === 'fingerprint') {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: #fbbf24;';
        label = 'Huella Digital';
      } else if (log.method === 'manual') {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(99, 102, 241, 0.1); color: #818cf8;';
        label = 'Marcación Manual';
      }

      return `
        <tr>
          <td><strong>${log.timestamp}</strong></td>
          <td>${name}</td>
          <td><span class="badge" style="${badgeStyle}">${label}</span></td>
        </tr>
      `;
    }).join('');
  }

  private setupEventListeners(): void {
    // Buscar
    const searchInput = document.getElementById('att-search');
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.currentPage = 1;
      this.loadLogs(val);
    });

    // Abrir modal de exportación
    const exportModal = document.getElementById('modal-export-attendance');
    document.getElementById('btn-open-export-modal')?.addEventListener('click', () => {
      this.initExportModalEmployeeSelect();
      this.setupFormatRadioHighlight();
      exportModal?.classList.remove('hidden');
    });

    document.getElementById('close-modal-export')?.addEventListener('click', () => {
      exportModal?.classList.add('hidden');
    });

    document.getElementById('btn-cancel-export')?.addEventListener('click', () => {
      exportModal?.classList.add('hidden');
    });

    // Confirmar exportación
    document.getElementById('btn-confirm-export')?.addEventListener('click', async () => {
      if (!this.exportModalEmployeeSelect) return;
      const employeeId = this.exportModalEmployeeSelect.getValue();
      if (!employeeId) {
        Toast.warning('Por favor seleccione un colaborador.');
        return;
      }
      const formatInput = document.querySelector('input[name="export-format"]:checked') as HTMLInputElement | null;
      const format = formatInput?.value ?? 'excel';

      const confirmBtn = document.getElementById('btn-confirm-export') as HTMLButtonElement;
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = 'Generando...';

      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/attendance/export/employee/${employeeId}?format=${format}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const emp = this.employees.find(e => e.id === parseInt(employeeId.toString()));
          const cleanName = emp ? emp.full_name.replace(/\s+/g, '_').toLowerCase() : 'colaborador';
          const ext = format === 'pdf' ? 'pdf' : 'xlsx';
          a.download = `asistencia_${cleanName}_${emp?.document_number ?? ''}.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          exportModal?.classList.add('hidden');
          Toast.success('Reporte exportado correctamente.');
        } else {
          const err = await response.json();
          Toast.error('Error: ' + (err.detail || 'No se pudo exportar.'));
        }
      } catch (err: any) {
        Toast.error(err.message || 'Error de red al exportar.');
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg> Descargar`;
      }
    });

    // Abrir modal marcación masiva
    const trigger = document.getElementById('btn-bulk-punch-trigger');
    const modal = document.getElementById('modal-bulk-punch');
    const close = document.getElementById('close-modal-bulk');

    trigger?.addEventListener('click', () => {
      this.resetBulkForm();
      modal?.classList.remove('hidden');
    });

    close?.addEventListener('click', () => {
      modal?.classList.add('hidden');
    });

    // Añadir fila de marcación masiva
    document.getElementById('btn-add-punch-row')?.addEventListener('click', () => {
      this.addPunchRow();
    });

    // Delegación para borrar fila en modal
    const rowsContainer = document.getElementById('bulk-punch-rows');
    rowsContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-remove-row') || target.closest('.btn-remove-row')) {
        const row = target.closest('.bulk-row');
        row?.remove();
      }
    });

    // Enviar marcación masiva
    const form = document.getElementById('form-bulk-punch') as HTMLFormElement | null;
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rows = rowsContainer?.querySelectorAll('.bulk-row');
      if (!rows || rows.length === 0) {
        Toast.warning("Por favor agregue al menos una marcación válida.");
        return;
      }

      const punches: { employee_id: number; timestamp: string }[] = [];
      let valid = true;

      rows.forEach(row => {
        const empInput = row.querySelector('[name="employee_id"]') as HTMLInputElement;
        const dateInput = row.querySelector('[name="date"]') as HTMLInputElement;
        const timeInput = row.querySelector('[name="time"]') as HTMLInputElement;

        if (!empInput || !dateInput || !timeInput || !empInput.value || !dateInput.value || !timeInput.value) {
          valid = false;
          return;
        }

        punches.push({
          employee_id: parseInt(empInput.value),
          timestamp: `${dateInput.value} ${timeInput.value}:00`
        });
      });

      if (!valid) {
        Toast.warning("Por favor rellene todos los campos de las filas añadidas.");
        return;
      }

      try {
        const res = await fetch('/attendance/punch-manual/bulk', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ punches })
        });
        const data = await res.json();
        if (res.ok) {
          Toast.success(data.message || 'Marcaciones registradas correctamente.');
          modal?.classList.add('hidden');
          await this.loadData();
        } else {
          Toast.error('Error: ' + (data.detail || 'No se pudieron registrar las marcaciones.'));
        }
      } catch {
        Toast.error('Error de conexión.');
      }
    });
  }

  private resetBulkForm(): void {
    const rowsContainer = document.getElementById('bulk-punch-rows');
    if (rowsContainer) {
      rowsContainer.innerHTML = '';
      this.addPunchRow(); // Añadir la primera fila vacía por comodidad
    }
  }

  private addPunchRow(): void {
    const container = document.getElementById('bulk-punch-rows');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'bulk-row';
    row.style.display = 'flex';
    row.style.gap = '15px';
    row.style.alignItems = 'center';
    row.style.marginBottom = '12px';

    const empContainer = document.createElement('div');
    empContainer.style.flex = '2';
    const dateContainer = document.createElement('div');
    dateContainer.style.flex = '1';
    const timeContainer = document.createElement('div');
    timeContainer.style.flex = '1';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-danger btn-remove-row';
    removeBtn.style.padding = '10px';
    removeBtn.style.width = '42px';
    removeBtn.style.height = '42px';
    removeBtn.style.display = 'flex';
    removeBtn.style.alignItems = 'center';
    removeBtn.style.justifyContent = 'center';
    removeBtn.style.background = 'rgba(239, 68, 68, 0.1)';
    removeBtn.style.color = '#f87171';
    removeBtn.style.border = '1px solid rgba(239, 68, 68, 0.2)';
    removeBtn.style.borderRadius = '10px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.fontSize = '1.25rem';
    removeBtn.title = 'Quitar Fila';
    removeBtn.innerHTML = '&times;';

    removeBtn.addEventListener('click', () => {
      row.remove();
    });

    row.appendChild(empContainer);
    row.appendChild(dateContainer);
    row.appendChild(timeContainer);
    row.appendChild(removeBtn);

    container.appendChild(row);

    // Inicializar select personalizado para colaboradores (sin etiqueta label)
    const selectOptions = this.employees.map(e => ({
      value: e.id,
      label: `${e.document_number} - ${e.full_name}`
    }));

    const empSelect = new CustomSelect(empContainer, {
      name: 'employee_id',
      options: selectOptions,
      placeholder: '-- Seleccionar Colaborador --'
    });
    empSelect.render();

    // Inicializar calendario personalizado para fecha (sin etiqueta label)
    const todayStr = new Date().toISOString().split('T')[0];
    const dateInput = new CustomCalendar(dateContainer, {
      name: 'date',
      defaultValue: todayStr,
      placeholder: 'Seleccionar fecha',
      required: true
    });
    dateInput.render();

    // Inicializar selector de hora personalizado (sin etiqueta label)
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const roundedMinutes = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
    const timeStr = `${currentHours}:${roundedMinutes}`;

    const timeInput = new CustomTime(timeContainer, {
      name: 'time',
      defaultValue: timeStr,
      placeholder: 'Seleccionar hora',
      required: true
    });
    timeInput.render();
  }

  private setupFormatRadioHighlight(): void {
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="export-format"]');
    const excelLabel = document.getElementById('format-excel-label');
    const pdfLabel   = document.getElementById('format-pdf-label');

    const updateHighlight = (val: string) => {
      if (excelLabel) {
        excelLabel.style.border      = val === 'excel' ? '2px solid var(--success)' : '2px solid var(--border)';
        excelLabel.style.background  = val === 'excel' ? 'rgba(20,184,166,0.08)'   : 'rgba(255,255,255,0.02)';
      }
      if (pdfLabel) {
        pdfLabel.style.border     = val === 'pdf' ? '2px solid #ef4444'          : '2px solid var(--border)';
        pdfLabel.style.background = val === 'pdf' ? 'rgba(239,68,68,0.08)'       : 'rgba(255,255,255,0.02)';
      }
    };

    radios.forEach(radio => {
      radio.addEventListener('change', () => updateHighlight(radio.value));
    });

    // Set initial state
    const checked = document.querySelector<HTMLInputElement>('input[name="export-format"]:checked');
    if (checked) updateHighlight(checked.value);
  }
}

