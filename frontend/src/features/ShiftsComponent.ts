import { BaseComponent } from '../core/BaseComponent';
import { Employee, Shift } from '../types';
import { CustomSelect } from '../shared/components/CustomSelect';
import { CustomTime } from '../shared/components/CustomTime';
import { CustomInput } from '../shared/components/CustomInput';
import { Toast } from '../shared/components/Toast';
import { PaginationHelper } from '../shared/components/PaginationHelper';

export class ShiftsComponent extends BaseComponent {
  private employees: Employee[] = [];
  private allEmployees: Employee[] = [];
  private shifts: { [empId: number]: Shift[] } = {};
  private empSelect: CustomSelect | null = null;
  private daySelect: CustomSelect | null = null;
  private startTimeInput: CustomTime | null = null;
  private endTimeInput: CustomTime | null = null;
  private toleranceInput: CustomInput | null = null;
  private editingShiftId: number | null = null;

  // Paginación
  private currentPage = 1;
  private pageSize = 10;
  private totalRecords = 0;
  private totalPages = 0;
  private currentSearch = '';

  render(): void {
    const canWrite = this.canWrite('shifts');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="shift-search" placeholder="Buscar por colaborador..." style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${canWrite ? `<button id="btn-new-shift" class="btn-primary">+ Asignar Horario</button>` : ''}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
                <th>Domingo</th>
              </tr>
            </thead>
            <tbody id="shifts-table-body">
              <tr><td colspan="8" style="text-align: center;">Cargando turnos...</td></tr>
            </tbody>
          </table>
          <div id="shifts-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Asignar Horario Semanal -->
      <div id="modal-shift" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-shift-title">Asignar Horario Semanal</h2>
            <span class="close-modal" id="close-modal-shift">&times;</span>
          </div>
          <form id="form-shift" class="modal-form">
            <div id="select-employee-container"></div>
            <div id="select-day-of-week-container"></div>
            <div id="shift-start-time-container"></div>
            <div id="shift-end-time-container"></div>
            <div id="shift-tolerance-container"></div>
            <button type="submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Asignar Horario</button>
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
      if (this.allEmployees.length === 0) {
        const empAllRes = await fetch('/employees', { headers: this.getAuthHeaders() });
        if (empAllRes.ok) {
          this.allEmployees = await empAllRes.json();
        }
      }

      const res = await fetch(`/attendance/shifts?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(this.currentSearch)}`, { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();

      this.employees = data.items.map((item: any) => item.employee);
      this.shifts = {};
      for (const item of data.items) {
        this.shifts[item.employee.id] = item.shifts;
      }
      this.totalRecords = data.total || 0;
      this.totalPages = data.pages || 0;

      this.renderTable();
      this.renderPagination();
      this.populateEmployeeSelect();
    } catch (err) {
      console.error("Error al cargar turnos:", err);
    }
  }

  private renderPagination(): void {
    const pagContainer = document.getElementById('shifts-pagination-container');
    if (!pagContainer) return;

    const pag = new PaginationHelper(pagContainer, {
      page: this.currentPage,
      limit: this.pageSize,
      total: this.totalRecords,
      pages: this.totalPages,
      onChangePage: async (page) => {
        this.currentPage = page;
        await this.loadData();
      },
      onChangeLimit: async (limit) => {
        this.pageSize = limit;
        this.currentPage = 1;
        await this.loadData();
      }
    });
    pag.render();
  }

  private renderTable(): void {
    const tbody = document.getElementById('shifts-table-body');
    if (!tbody) return;

    if (this.employees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No se encontraron colaboradores.</td></tr>`;
      const pagContainer = document.getElementById('shifts-pagination-container');
      if (pagContainer) pagContainer.innerHTML = '';
      return;
    }

    const canWrite = this.canWrite('shifts');
    const ICON_EDIT_MINI = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;

    tbody.innerHTML = this.employees.map(emp => {
      const empShifts = this.shifts[emp.id] || [];

      // Mapear cada día (Lunes=1, Martes=2, ..., Domingo=0)
      const daysOrder = [1, 2, 3, 4, 5, 6, 0];
      const cellsHtml = daysOrder.map(dayNum => {
        const sh = empShifts.find(s => s.day_of_week === dayNum);
        if (sh) {
          const start = sh.start_time.substring(0, 5);
          const end = sh.end_time.substring(0, 5);
          return `
            <td>
              <span class="badge" style="padding: 4px 8px; font-size: 0.8rem; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 8px; width: 100%; box-sizing: border-box;">
                <span>${start} - ${end}</span>
                ${canWrite ? `
                  <button class="btn-edit-shift" data-id="${sh.id}" data-emp-id="${emp.id}" data-day="${sh.day_of_week}" data-start="${start}" data-end="${end}" data-tolerance="${sh.tolerance ?? 10}" title="Editar este turno" style="background:none;border:none;cursor:pointer;color:#818cf8;padding:2px;display:flex;align-items:center;transition:color 0.15s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#818cf8'">
                    ${ICON_EDIT_MINI}
                  </button>
                ` : ''}
              </span>
            </td>
          `;
        }
        return `<td><span style="color: var(--text-muted); font-size: 0.8rem; display: block; text-align: center;">-</span></td>`;
      }).join('');

      return `
        <tr class="shift-row-clickable" data-id="${emp.id}">
          <td>
            <strong>${emp.full_name}</strong><br>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${emp.position}</span>
          </td>
          ${cellsHtml}
        </tr>
      `;
    }).join('');
  }

  private populateEmployeeSelect(): void {
    const selectContainer = document.getElementById('select-employee-container');
    if (selectContainer) {
      const options = this.allEmployees.map(e => ({
        value: e.id,
        label: `${e.document_number} - ${e.full_name}`
      }));

      this.empSelect = new CustomSelect(selectContainer, {
        label: 'Colaborador',
        name: 'employee_id',
        options: options,
        placeholder: '-- Seleccionar Colaborador --'
      });
      this.empSelect.render();
    }

    const dayContainer = document.getElementById('select-day-of-week-container');
    if (dayContainer) {
      this.daySelect = new CustomSelect(dayContainer, {
        label: 'Día de la Semana',
        name: 'day_of_week',
        options: [
          { value: '1', label: 'Lunes' },
          { value: '2', label: 'Martes' },
          { value: '3', label: 'Miércoles' },
          { value: '4', label: 'Jueves' },
          { value: '5', label: 'Viernes' },
          { value: '6', label: 'Sábado' },
          { value: '0', label: 'Domingo' }
        ],
        defaultValue: '1'
      });
      this.daySelect.render();
    }

    // 3. Hora de Entrada
    const startTimeContainer = document.getElementById('shift-start-time-container');
    if (startTimeContainer) {
      this.startTimeInput = new CustomTime(startTimeContainer, {
        label: 'Hora de Entrada (HH:MM)',
        name: 'start_time',
        defaultValue: '08:00',
        placeholder: 'Seleccionar hora de entrada',
        required: true
      });
      this.startTimeInput.render();
    }

    // 4. Hora de Salida
    const endTimeContainer = document.getElementById('shift-end-time-container');
    if (endTimeContainer) {
      this.endTimeInput = new CustomTime(endTimeContainer, {
        label: 'Hora de Salida (HH:MM)',
        name: 'end_time',
        defaultValue: '17:00',
        placeholder: 'Seleccionar hora de salida',
        required: true
      });
      this.endTimeInput.render();
    }

    // 5. Tolerancia de Entrada
    const toleranceContainer = document.getElementById('shift-tolerance-container');
    if (toleranceContainer) {
      this.toleranceInput = new CustomInput(toleranceContainer, {
        label: 'Tolerancia de Entrada (minutos)',
        name: 'tolerance',
        type: 'number',
        value: '10',
        placeholder: 'Ej. 10',
        required: true
      });
      this.toleranceInput.render();
      const tolInput = toleranceContainer.querySelector('input');
      if (tolInput) {
        tolInput.setAttribute('min', '0');
      }
    }
  }

  private setupEventListeners(): void {
    const searchInput = document.getElementById('shift-search');
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.currentSearch = val;
      this.currentPage = 1;
      this.loadData();
    });

    const trigger = document.getElementById('btn-new-shift');
    const modal = document.getElementById('modal-shift');
    const close = document.getElementById('close-modal-shift');
    const modalTitle = document.getElementById('modal-shift-title');
    const submitBtn = document.getElementById('form-shift')?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const form = document.getElementById('form-shift') as HTMLFormElement | null;

    trigger?.addEventListener('click', () => {
      this.editingShiftId = null;
      if (modalTitle) modalTitle.innerText = 'Asignar Horario Semanal';
      if (submitBtn) submitBtn.innerText = 'Asignar Horario';
      form?.reset();
      
      this.empSelect?.setDisabled(false);
      this.daySelect?.setDisabled(false);

      this.empSelect?.setValue('');
      this.daySelect?.setValue('1');
      this.startTimeInput?.setValue('08:00');
      this.endTimeInput?.setValue('17:00');
      this.toleranceInput?.setValue('10');
      modal?.classList.remove('hidden');
    });

    const hideModal = () => {
      modal?.classList.add('hidden');
      this.editingShiftId = null;
      form?.reset();
      
      this.empSelect?.setDisabled(false);
      this.daySelect?.setDisabled(false);
    };

    close?.addEventListener('click', hideModal);

    // Delegación de clics en tabla para clics en filas (asignación rápida) y en botones de edición
    const tbody = document.getElementById('shifts-table-body');
    tbody?.addEventListener('click', (e) => {
      const editBtn = (e.target as HTMLElement).closest('.btn-edit-shift') as HTMLElement | null;
      if (editBtn && this.canWrite('shifts')) {
        e.stopPropagation(); // Prevenir clic en fila
        const id = editBtn.getAttribute('data-id');
        const empId = editBtn.getAttribute('data-emp-id');
        const day = editBtn.getAttribute('data-day');
        const start = editBtn.getAttribute('data-start');
        const end = editBtn.getAttribute('data-end');
        const tolerance = editBtn.getAttribute('data-tolerance') || '10';
 
        if (id && empId && day && start && end) {
          this.editingShiftId = parseInt(id);
          if (modalTitle) modalTitle.innerText = 'Editar Horario Semanal';
          if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
 
          this.empSelect?.setValue(empId);
          this.empSelect?.setDisabled(true);
 
          this.daySelect?.setValue(day);
          this.daySelect?.setDisabled(true);
 
          this.startTimeInput?.setValue(start);
          this.endTimeInput?.setValue(end);
          this.toleranceInput?.setValue(tolerance);
           
          modal?.classList.remove('hidden');
        }
        return;
      }

      const row = (e.target as HTMLElement).closest('.shift-row-clickable');
      if (row && this.canWrite('shifts')) {
        const empId = row.getAttribute('data-id');
        if (this.empSelect && empId) {
          this.editingShiftId = null;
          if (modalTitle) modalTitle.innerText = 'Asignar Horario Semanal';
          if (submitBtn) submitBtn.innerText = 'Asignar Horario';

          this.empSelect.setValue(parseInt(empId));
          this.empSelect.setDisabled(false);
          this.daySelect?.setDisabled(false);

          modal?.classList.remove('hidden');
        }
      }
    });

    // Guardar o Editar Horario
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload: any = {
        start_time: `${this.startTimeInput?.getValue() || '08:00'}:00`,
        end_time: `${this.endTimeInput?.getValue() || '17:00'}:00`,
        tolerance: parseInt((this.toleranceInput?.getValue() || '10').toString())
      };

      try {
        let res;
        if (this.editingShiftId === null) {
          payload.employee_id = parseInt((this.empSelect?.getValue() || '0').toString());
          payload.day_of_week = parseInt((this.daySelect?.getValue() || '1').toString());
          
          res = await fetch('/attendance/shifts', {
            method: 'POST',
            headers: {
              ...this.getAuthHeaders(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`/attendance/shifts/${this.editingShiftId}`, {
            method: 'PUT',
            headers: {
              ...this.getAuthHeaders(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        }

        const data = await res.json();
        if (res.ok) {
          Toast.success(this.editingShiftId === null ? 'Horario asignado exitosamente.' : 'Horario actualizado exitosamente.');
          modal?.classList.add('hidden');
          this.editingShiftId = null;
          await this.loadData();
        } else {
          Toast.error('Error: ' + (data.detail || 'No se pudo guardar el horario.'));
        }
      } catch {
        Toast.error('Error de conexión.');
      }
    });
  }
}
