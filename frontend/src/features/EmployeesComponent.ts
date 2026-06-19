import { BaseComponent } from '../core/BaseComponent';
import { Employee, Contract } from '../types';
import { CustomInput } from '../shared/components/CustomInput';
import { CustomSelect } from '../shared/components/CustomSelect';
import { CustomCalendar } from '../shared/components/CustomCalendar';
import { Toast } from '../shared/components/Toast';
import { CustomCheckbox } from '../shared/components/CustomCheckbox';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';
import { PaginationHelper } from '../shared/components/PaginationHelper';

// SVG Icons
const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const ICON_CONTRACT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
const ICON_FINGERPRINT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-2.3.9-4.4 2.4-6"/><path d="M17.6 6A8 8 0 0 1 20 12c0 2.6-.5 5-1.5 7"/><path d="M12 8a4 4 0 0 1 4 4c0 1.7-.3 3.3-1 4.8"/><path d="M9 13a7 7 0 0 0 .5 2.5"/><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`;
const ICON_DELETE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

export class EmployeesComponent extends BaseComponent {
  private employees: Employee[] = [];
  private editingEmployeeId: number | null = null;
  
  // Paginación
  private currentPage = 1;
  private pageSize = 10;
  private totalRecords = 0;
  private totalPages = 0;
  private currentSearch = '';

  // Paginación de Contratos
  private contractsCurrentPage = 1;
  private contractsPageSize = 10;
  private contractsTotalRecords = 0;
  private contractsTotalPages = 0;
  private currentContractsEmpId: number | null = null;
  private currentContractsEmpName = '';

  // Formulario Registrar Empleado
  private firstNamesInput: CustomInput | null = null;
  private lastNamesInput: CustomInput | null = null;
  private documentNumberInput: CustomInput | null = null;
  private emailInput: CustomInput | null = null;
  private phoneInput: CustomInput | null = null;
  private pensionSystemSelect: CustomSelect | null = null;
  private hasChildrenCheckbox: CustomCheckbox | null = null;
  private fingerprintDataInput: CustomInput | null = null;

  // Formulario Nuevo Contrato
  private contractPositionInput: CustomInput | null = null;
  private contractMonthlySalaryInput: CustomInput | null = null;
  private contractStartDateCalendar: CustomCalendar | null = null;
  private contractEndDateCalendar: CustomCalendar | null = null;

  render(): void {
    const canWrite = this.canWrite('employees');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="emp-search" placeholder="Buscar empleados DNI/nombre..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;">
            ${canWrite ? `<button id="btn-new-emp" class="btn-primary">+ Nuevo Empleado</button>` : ''}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Cargo / Puesto</th>
                <th>Sueldo Mensual</th>
                <th>Pensiones</th>
                <th>Hijos</th>
                <th style="text-align: center;">Acciones</th>
              </tr>
            </thead>
            <tbody id="employees-table-body">
              <tr><td colspan="7" style="text-align: center;">Cargando empleados...</td></tr>
            </tbody>
          </table>
          <div id="employees-pagination-container"></div>
        </div>
      </section>

      <!-- Modal Registrar / Editar Empleado -->
      <div id="modal-emp" class="modal hidden">
        <div class="modal-content" style="max-width: 700px;">
          <div class="modal-header">
            <h2 id="modal-emp-title">Registrar Nuevo Empleado</h2>
            <span class="close-modal" id="close-modal-emp">&times;</span>
          </div>
          <form id="form-emp" class="modal-form">
            <div class="form-grid">
              <div id="emp-first-names-container"></div>
              <div id="emp-last-names-container"></div>
              <div id="emp-document-number-container"></div>
              <div id="emp-email-container"></div>
              <div id="emp-phone-container"></div>
              <div id="emp-pension-system-container"></div>
              <div id="emp-has-children-container" style="grid-column: span 2;"></div>
              <div class="custom-form-group" style="grid-column: span 2;">
                <label id="foto-label">Foto de Rostro (Reconocimiento Facial)</label>
                <input type="file" name="foto" id="emp-foto-input" accept="image/*" required>
              </div>
            </div>
            <button type="submit" id="btn-emp-submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Registrar Empleado</button>
          </form>
        </div>
      </div>

      <!-- Modal Historial de Contratos / Promoción Unificado -->
      <div id="modal-contracts" class="modal hidden">
        <div class="modal-content" style="max-width: 1050px; width: 95%; display: flex; flex-direction: column; gap: 20px;">
          <div class="modal-header">
            <h2 id="contracts-title">Historial Laboral</h2>
            <span class="close-modal" id="close-modal-contracts">&times;</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Tabla Historial -->
            <div class="table-card" style="width: 100%; margin-top: 0; overflow-x: auto;">
              <table style="width: 100%;">
                <thead>
                  <tr>
                    <th>Cargo / Puesto</th>
                    <th>Sueldo Base</th>
                    <th>Pago por Hora</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th style="text-align: center;">Estado</th>
                  </tr>
                </thead>
                <tbody id="contracts-table-body"></tbody>
              </table>
              <div id="contracts-pagination-container"></div>
            </div>
            
            <!-- Formulario Nuevo Contrato / Ascenso -->
            ${canWrite ? `
              <div style="width: 100%; background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 20px; border-radius: 12px;">
                <h3 style="color: white; margin-bottom: 15px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 8px;">Asignar Contrato / Promoción</h3>
                <form id="form-new-contract" class="modal-form" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                  <input type="hidden" name="employee_id" id="contract-emp-id">
                  <div id="contract-position-container"></div>
                  <div id="contract-monthly-salary-container"></div>
                  <div id="contract-start-date-container"></div>
                  <div id="contract-end-date-container"></div>
                  <div style="grid-column: span 2; display: flex; justify-content: flex-end; margin-top: 10px;">
                    <button type="submit" class="btn-primary" style="width: 100%; max-width: 300px;">Asignar Contrato</button>
                  </div>
                </form>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Modal Enrolar Huella -->
      <div id="modal-fingerprint" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Enrolar Huella Dactilar</h2>
            <span class="close-modal" id="close-modal-fingerprint">&times;</span>
          </div>
          <form id="form-fingerprint" class="modal-form">
            <input type="hidden" name="employee_id">
            <div id="emp-fingerprint-data-container"></div>
            <button type="submit" class="btn-primary" style="margin-top: 20px; width: 100%;">Guardar Huella</button>
          </form>
        </div>
      </div>
    `;
  }

  async onInit(): Promise<void> {
    await this.loadEmployees();
    this.initializeCustomFields();
    this.setupEventListeners();
  }

  private initializeCustomFields(): void {
    // Formulario Registrar Empleado
    const firstNamesContainer = document.getElementById('emp-first-names-container');
    if (firstNamesContainer) {
      this.firstNamesInput = new CustomInput(firstNamesContainer, {
        label: 'Nombres',
        name: 'first_names',
        required: true,
        placeholder: 'Ej. Juan Manuel'
      });
      this.firstNamesInput.render();
    }

    const lastNamesContainer = document.getElementById('emp-last-names-container');
    if (lastNamesContainer) {
      this.lastNamesInput = new CustomInput(lastNamesContainer, {
        label: 'Apellidos',
        name: 'last_names',
        required: true,
        placeholder: 'Ej. Pérez Gómez'
      });
      this.lastNamesInput.render();
    }

    const docNumContainer = document.getElementById('emp-document-number-container');
    if (docNumContainer) {
      this.documentNumberInput = new CustomInput(docNumContainer, {
        label: 'DNI (8 dígitos)',
        name: 'document_number',
        required: true,
        minlength: 8,
        placeholder: 'Ej. 70123456'
      });
      this.documentNumberInput.render();
      const docInput = docNumContainer.querySelector('input');
      if (docInput) {
        docInput.setAttribute('maxlength', '8');
        docInput.addEventListener('input', () => {
          docInput.value = docInput.value.replace(/\D/g, '');
        });
      }
    }

    const emailContainer = document.getElementById('emp-email-container');
    if (emailContainer) {
      this.emailInput = new CustomInput(emailContainer, {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        placeholder: 'Ej. juan.perez@empresa.com'
      });
      this.emailInput.render();
    }

    const phoneContainer = document.getElementById('emp-phone-container');
    if (phoneContainer) {
      this.phoneInput = new CustomInput(phoneContainer, {
        label: 'Teléfono',
        name: 'phone',
        placeholder: 'Ej. 987654321'
      });
      this.phoneInput.render();
    }

    const pensionContainer = document.getElementById('emp-pension-system-container');
    if (pensionContainer) {
      this.pensionSystemSelect = new CustomSelect(pensionContainer, {
        label: 'Sistema Pensiones',
        name: 'pension_system',
        options: [
          { value: 'ONP', label: 'ONP (13.00%)' },
          { value: 'Integra', label: 'AFP Integra' },
          { value: 'Habitat', label: 'AFP Habitat' },
          { value: 'Prima', label: 'AFP Prima' },
          { value: 'Profuturo', label: 'AFP Profuturo' }
        ],
        defaultValue: 'ONP'
      });
      this.pensionSystemSelect.render();
    }

    // Formulario Nuevo Contrato
    const contractPositionContainer = document.getElementById('contract-position-container');
    if (contractPositionContainer) {
      this.contractPositionInput = new CustomInput(contractPositionContainer, {
        label: 'Nuevo Cargo / Puesto',
        name: 'position',
        required: true,
        placeholder: 'Ej. Supervisor de Operaciones'
      });
      this.contractPositionInput.render();
    }

    const contractSalaryContainer = document.getElementById('contract-monthly-salary-container');
    if (contractSalaryContainer) {
      this.contractMonthlySalaryInput = new CustomInput(contractSalaryContainer, {
        label: 'Nuevo Sueldo Base Mensual (S/.)',
        name: 'monthly_salary',
        type: 'number',
        required: true,
        placeholder: 'Ej. 3500'
      });
      this.contractMonthlySalaryInput.render();
      const contractSalaryInput = contractSalaryContainer.querySelector('input');
      if (contractSalaryInput) {
        contractSalaryInput.setAttribute('step', '0.01');
      }
    }

    const contractStartDateContainer = document.getElementById('contract-start-date-container');
    if (contractStartDateContainer) {
      this.contractStartDateCalendar = new CustomCalendar(contractStartDateContainer, {
        label: 'Fecha de Inicio',
        name: 'start_date',
        required: true
      });
      this.contractStartDateCalendar.render();
    }

    const contractEndDateContainer = document.getElementById('contract-end-date-container');
    if (contractEndDateContainer) {
      this.contractEndDateCalendar = new CustomCalendar(contractEndDateContainer, {
        label: 'Fecha de Fin (Opcional)',
        name: 'end_date',
        defaultValue: ''
      });
      this.contractEndDateCalendar.render();
    }

    // Tiene Hijos Checkbox
    const hasChildrenContainer = document.getElementById('emp-has-children-container');
    if (hasChildrenContainer) {
      this.hasChildrenCheckbox = new CustomCheckbox(hasChildrenContainer, {
        label: 'Tiene hijos menores (Asig. Familiar)',
        name: 'has_children'
      });
      this.hasChildrenCheckbox.render();
    }

    // Firma Biométrica Textarea
    const fingerprintContainer = document.getElementById('emp-fingerprint-data-container');
    if (fingerprintContainer) {
      this.fingerprintDataInput = new CustomInput(fingerprintContainer, {
        label: 'Firma Biométrica (Template Base64/Hex)',
        name: 'fingerprint_data',
        type: 'textarea',
        required: true,
        placeholder: 'Inserte los datos del sensor biométrico USB...'
      });
      this.fingerprintDataInput.render();
    }
  }

  private async loadEmployees(search: string = ''): Promise<void> {
    try {
      this.currentSearch = search;
      const response = await fetch(`/employees?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(search)}`, { headers: this.getAuthHeaders() });
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      
      this.employees = data.items || [];
      this.totalRecords = data.total || 0;
      this.totalPages = data.pages || 0;

      this.renderEmployeesTable();
      this.renderPagination();
    } catch (err) {
      console.error("Error al cargar empleados:", err);
      Toast.error('Error de conexión al cargar empleados.');
    }
  }

  private renderPagination(): void {
    const pagContainer = document.getElementById('employees-pagination-container');
    if (!pagContainer) return;

    const pag = new PaginationHelper(pagContainer, {
      page: this.currentPage,
      limit: this.pageSize,
      total: this.totalRecords,
      pages: this.totalPages,
      onChangePage: async (page) => {
        this.currentPage = page;
        await this.loadEmployees(this.currentSearch);
      },
      onChangeLimit: async (limit) => {
        this.pageSize = limit;
        this.currentPage = 1;
        await this.loadEmployees(this.currentSearch);
      }
    });
    pag.render();
  }

  private renderEmployeesTable(): void {
    const tbody = document.getElementById('employees-table-body');
    if (!tbody) return;

    if (this.employees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No se encontraron empleados.</td></tr>`;
      return;
    }

    const canWrite = this.canWrite('employees');

    tbody.innerHTML = this.employees.map((emp) => `
      <tr>
        <td><strong>${emp.document_number}</strong></td>
        <td>${emp.full_name}</td>
        <td><span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;">${emp.position}</span></td>
        <td>S/ ${parseFloat(emp.monthly_salary as any).toFixed(2)}</td>
        <td><span class="badge" style="border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;">${emp.pension_system}</span></td>
        <td>${emp.has_children ? 'Sí' : 'No'}</td>
        <td>
          <div style="display: flex; gap: 4px; justify-content: center; align-items: center;">
            <button class="action-icon-btn btn-edit-emp" data-id="${emp.id}" data-first-names="${emp.first_names}" data-last-names="${emp.last_names}" data-document-number="${emp.document_number}" data-email="${emp.email}" data-phone="${emp.phone || ''}" data-pension-system="${emp.pension_system}" data-has-children="${emp.has_children}" title="Editar ficha de empleado" style="background:transparent;border:none;cursor:pointer;color:var(--primary);padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(79,70,229,0.1)'" onmouseout="this.style.background='transparent'">
              ${ICON_EDIT}
            </button>
            <button class="action-icon-btn btn-contracts" data-id="${emp.id}" data-name="${emp.full_name}" title="Ver historial y contratos" style="background:transparent;border:none;cursor:pointer;color:#60a5fa;padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(96,165,250,0.1)'" onmouseout="this.style.background='transparent'">
              ${ICON_CONTRACT}
            </button>
            ${canWrite ? `
              <button class="action-icon-btn btn-fingerprint-trigger" data-id="${emp.id}" title="Enrolar huella dactilar" style="background:transparent;border:none;cursor:pointer;color:#fbbf24;padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(251,191,36,0.1)'" onmouseout="this.style.background='transparent'">
                ${ICON_FINGERPRINT}
              </button>
              <button class="action-icon-btn btn-delete-emp" data-id="${emp.id}" title="Eliminar empleado" style="background:transparent;border:none;cursor:pointer;color:#f87171;padding:6px;border-radius:8px;display:flex;align-items:center;transition:background 0.15s,color 0.15s;" onmouseover="this.style.background='rgba(248,113,113,0.1)'" onmouseout="this.style.background='transparent'">
                ${ICON_DELETE}
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  private setupEventListeners(): void {
    // Buscar
    const searchInput = document.getElementById('emp-search');
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.currentPage = 1;
      this.loadEmployees(val);
    });

    // Abrir modal registro empleado
    const btnNewEmp = document.getElementById('btn-new-emp');
    const modalEmp = document.getElementById('modal-emp');
    const closeNewEmp = document.getElementById('close-modal-emp');
    const modalTitle = document.getElementById('modal-emp-title');
    const submitBtn = document.getElementById('btn-emp-submit');
    const fotoInput = document.getElementById('emp-foto-input') as HTMLInputElement | null;
    const formEmp = document.getElementById('form-emp') as HTMLFormElement | null;
    
    btnNewEmp?.addEventListener('click', () => {
      this.editingEmployeeId = null;
      if (modalTitle) modalTitle.innerText = 'Registrar Nuevo Empleado';
      if (submitBtn) submitBtn.innerText = 'Registrar Empleado';
      if (fotoInput) fotoInput.setAttribute('required', 'true');
      formEmp?.reset();
      this.pensionSystemSelect?.setValue('ONP');
      modalEmp?.classList.remove('hidden');
    });
    
    const hideModalEmp = () => {
      modalEmp?.classList.add('hidden');
      this.editingEmployeeId = null;
      formEmp?.reset();
      if (fotoInput) fotoInput.setAttribute('required', 'true');
      this.pensionSystemSelect?.setValue('ONP');
    };

    closeNewEmp?.addEventListener('click', hideModalEmp);

    // Formulario registro o edición empleado
    formEmp?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(formEmp);
      
      const hasChildren = formEmp.querySelector('[name="has_children"]') as HTMLInputElement;
      formData.set('has_children', hasChildren.checked ? 'true' : 'false');

      // Si no es creación y no seleccionaron foto, quitar foto del FormData
      if (this.editingEmployeeId !== null) {
        if (fotoInput && fotoInput.files && fotoInput.files.length === 0) {
          formData.delete('foto');
        }
      }

      try {
        const token = localStorage.getItem('auth_token');
        const url = this.editingEmployeeId === null ? '/employees' : `/employees/${this.editingEmployeeId}`;
        const method = this.editingEmployeeId === null ? 'POST' : 'PUT';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          Toast.success(this.editingEmployeeId === null ? 
            'Empleado registrado exitosamente.' : 
            'Ficha de empleado actualizada correctamente.'
          );
          hideModalEmp();
          await this.loadEmployees();
        } else {
          Toast.error('Error: ' + (data.detail || 'Operación fallida.'));
        }
      } catch (err) {
        console.error(err);
        Toast.error('Error de conexión.');
      }
    });

    // Delegación de eventos en tabla
    const tbody = document.getElementById('employees-table-body');
    tbody?.addEventListener('click', async (e) => {
      const target = (e.target as HTMLElement).closest('button') as HTMLElement | null;
      if (!target) return;
      
      // Editar Ficha Empleado
      if (target.classList.contains('btn-edit-emp')) {
        const empId = target.getAttribute('data-id');
        const firstNames = target.getAttribute('data-first-names');
        const lastNames = target.getAttribute('data-last-names');
        const docNum = target.getAttribute('data-document-number');
        const email = target.getAttribute('data-email');
        const phone = target.getAttribute('data-phone');
        const pension = target.getAttribute('data-pension-system');
        const hasChildren = target.getAttribute('data-has-children') === 'true';

        if (empId && firstNames && lastNames && docNum && email) {
          this.editingEmployeeId = parseInt(empId);
          if (modalTitle) modalTitle.innerText = 'Editar Ficha de Empleado';
          if (submitBtn) submitBtn.innerText = 'Guardar Cambios';
          
          this.firstNamesInput?.setValue(firstNames);
          this.lastNamesInput?.setValue(lastNames);
          this.documentNumberInput?.setValue(docNum);
          this.emailInput?.setValue(email);
          this.phoneInput?.setValue(phone || '');
          this.pensionSystemSelect?.setValue(pension || 'ONP');
          
          const checkEl = formEmp?.querySelector('[name="has_children"]') as HTMLInputElement | null;
          if (checkEl) checkEl.checked = hasChildren;

          if (fotoInput) {
            fotoInput.removeAttribute('required');
            fotoInput.value = '';
          }

          modalEmp?.classList.remove('hidden');
        }
      }

      // Ver historial contratos y panel de promoción
      if (target.classList.contains('btn-contracts')) {
        const empId = target.getAttribute('data-id');
        const empName = target.getAttribute('data-name');
        if (empId) {
          const empIdNum = parseInt(empId);
          const empIdInput = document.getElementById('contract-emp-id') as HTMLInputElement | null;
          if (empIdInput) empIdInput.value = empId;
          
          await this.showContractsHistory(empIdNum, empName || '');
        }
      }

      // Abrir enrolar huella
      if (target.classList.contains('btn-fingerprint-trigger')) {
        const empId = target.getAttribute('data-id');
        if (empId) this.openFingerprintModal(parseInt(empId));
      }

      // Eliminar
      if (target.classList.contains('btn-delete-emp')) {
        const empId = target.getAttribute('data-id');
        if (empId && await ConfirmDialog.ask('¿Está seguro de eliminar lógicamente este empleado y todos sus contratos?')) {
          await this.deleteEmployee(parseInt(empId));
        }
      }
    });

    // Modales de contratos
    document.getElementById('close-modal-contracts')?.addEventListener('click', () => {
      document.getElementById('modal-contracts')?.classList.add('hidden');
    });

    document.getElementById('close-modal-fingerprint')?.addEventListener('click', () => {
      document.getElementById('modal-fingerprint')?.classList.add('hidden');
    });

    // Formulario Nuevo Contrato / Promoción (dentro del modal de historial)
    const formNewContract = document.getElementById('form-new-contract') as HTMLFormElement | null;
    formNewContract?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(formNewContract);
      const empIdStr = fd.get('employee_id') as string;
      const empId = parseInt(empIdStr);
      
      const payload = {
        employee_id: empId,
        position: fd.get('position') as string,
        monthly_salary: parseFloat(fd.get('monthly_salary') as string),
        start_date: fd.get('start_date') as string,
        end_date: fd.get('end_date') as string || null
      };

      try {
        const res = await fetch('/contracts', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          Toast.success('Contrato / Ascenso registrado correctamente.');
          formNewContract.reset();
          
          // Re-poner el id del empleado para futuros registros
          const empIdInput = document.getElementById('contract-emp-id') as HTMLInputElement | null;
          if (empIdInput) empIdInput.value = empIdStr;
          
          this.contractStartDateCalendar?.setValue(new Date().toISOString().split('T')[0]);
          this.contractEndDateCalendar?.setValue('');
          
          // Recargar tabla de contratos en el modal y tabla de empleados principal
          const empName = this.employees.find(x => x.id === empId)?.full_name || '';
          await this.showContractsHistory(empId, empName);
          await this.loadEmployees();
        } else {
          Toast.error('Error al registrar contrato: ' + (data.detail || 'Desconocido'));
        }
      } catch {
        Toast.error('Error de conexión.');
      }
    });

    // Formulario Enrolar Huella
    const formFingerprint = document.getElementById('form-fingerprint') as HTMLFormElement | null;
    formFingerprint?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(formFingerprint);
      const empId = fd.get('employee_id') as string;
      const dataStr = fd.get('fingerprint_data') as string;

      try {
        const res = await fetch(`/employees/${empId}/fingerprint`, {
          method: 'POST',
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ fingerprint_data: dataStr })
        });
        const data = await res.json();
        if (res.ok) {
          Toast.success('Huella dactilar registrada exitosamente.');
          formFingerprint.reset();
          document.getElementById('modal-fingerprint')?.classList.add('hidden');
        } else {
          Toast.error('Error al registrar huella: ' + (data.detail || 'Desconocido'));
        }
      } catch {
        Toast.error('Error de conexión.');
      }
    });
  }

  private async showContractsHistory(empId: number, name: string): Promise<void> {
    this.currentContractsEmpId = empId;
    this.currentContractsEmpName = name;
    this.contractsCurrentPage = 1;
    await this.loadContractsHistory();
  }

  private async loadContractsHistory(): Promise<void> {
    const empId = this.currentContractsEmpId;
    if (empId === null) return;

    const title = document.getElementById('contracts-title');
    if (title) title.innerText = `Historial Laboral - ${this.currentContractsEmpName}`;

    const tbody = document.getElementById('contracts-table-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Cargando historial...</td></tr>`;

    document.getElementById('modal-contracts')?.classList.remove('hidden');

    try {
      const res = await fetch(`/contracts/employee/${empId}?page=${this.contractsCurrentPage}&limit=${this.contractsPageSize}`, { headers: this.getAuthHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const contracts: Contract[] = data.items || [];
      this.contractsTotalRecords = data.total || 0;
      this.contractsTotalPages = data.pages || 0;

      tbody.innerHTML = contracts.map(c => `
        <tr>
          <td><strong>${c.position}</strong></td>
          <td>S/ ${parseFloat(c.monthly_salary as any).toFixed(2)}</td>
          <td>S/ ${parseFloat(c.hourly_wage as any).toFixed(2)}</td>
          <td>${c.start_date}</td>
          <td>${c.end_date || 'Indefinido'}</td>
          <td style="text-align: center;"><span class="badge" style="background: ${c.is_active ? 'rgba(20, 184, 166, 0.1); color: #2dd4bf;' : 'rgba(239, 68, 68, 0.1); color: #f87171;'}">${c.is_active ? 'Activo' : 'Vencido'}</span></td>
        </tr>
      `).join('');

      this.renderContractsPagination();
    } catch {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger);">Error al cargar contratos.</td></tr>`;
      const pagContainer = document.getElementById('contracts-pagination-container');
      if (pagContainer) pagContainer.innerHTML = '';
    }
  }

  private renderContractsPagination(): void {
    const pagContainer = document.getElementById('contracts-pagination-container');
    if (!pagContainer) return;

    const pag = new PaginationHelper(pagContainer, {
      page: this.contractsCurrentPage,
      limit: this.contractsPageSize,
      total: this.contractsTotalRecords,
      pages: this.contractsTotalPages,
      onChangePage: async (page) => {
        this.contractsCurrentPage = page;
        await this.loadContractsHistory();
      },
      onChangeLimit: async (limit) => {
        this.contractsPageSize = limit;
        this.contractsCurrentPage = 1;
        await this.loadContractsHistory();
      }
    });
    pag.render();
  }

  private openFingerprintModal(empId: number): void {
    const form = document.getElementById('form-fingerprint') as HTMLFormElement | null;
    if (form) {
      form.reset();
      const input = form.querySelector('[name="employee_id"]') as HTMLInputElement;
      if (input) input.value = empId.toString();
    }
    document.getElementById('modal-fingerprint')?.classList.remove('hidden');
  }

  private async deleteEmployee(empId: number): Promise<void> {
    try {
      const res = await fetch(`/employees/${empId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        Toast.success('Empleado eliminado exitosamente.');
        await this.loadEmployees();
      } else {
        Toast.error('Error al eliminar empleado: ' + (data.detail || 'Desconocido'));
      }
    } catch {
      Toast.error('Error de conexión.');
    }
  }
}
