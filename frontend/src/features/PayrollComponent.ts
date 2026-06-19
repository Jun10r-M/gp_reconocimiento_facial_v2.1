import { BaseComponent } from '../core/BaseComponent';
import { Payroll } from '../types';
import { Toast } from '../shared/components/Toast';
import { CustomCalendar } from '../shared/components/CustomCalendar';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';

export class PayrollComponent extends BaseComponent {
  private payrolls: Payroll[] = [];
  private periodCalendar: CustomCalendar | null = null;
  private afps: any[] = [];
  private editingAfpId: number | null = null;

  render(): void {
    const canWrite = this.canWrite('payrolls');

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div style="display: flex; align-items: center; gap: 15px; flex-grow: 1;">
              <label style="font-weight: 600; font-size: 0.9rem; color: var(--text-muted);">Periodo:</label>
              <div id="payroll-period-container"></div>
              <button id="btn-search-payroll" class="btn-primary" style="background: var(--border); color: white;">Consultar</button>
              ${canWrite ? `
                <button id="btn-calc-payroll" class="btn-primary">Calcular Planilla</button>
                <button id="btn-export-payroll" class="btn-primary" style="background: var(--success);">Exportar Lote</button>
                <button id="btn-config-afp" class="btn-primary" style="background: #4f46e5;">Configurar Tasas AFP</button>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Colaborador</th>
                <th>Periodo</th>
                <th>Días Trab.</th>
                <th>Tardanzas / S. Tempranas</th>
                <th>Horas Extra</th>
                <th>Descuentos</th>
                <th>Sueldo Bruto</th>
                <th>Pensiones</th>
                <th>Sueldo Neto</th>
                <th>Boleta</th>
              </tr>
            </thead>
            <tbody id="payroll-table-body">
              <tr><td colspan="11" style="text-align: center;">Seleccione un periodo y presione consultar...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Boleta de Pago -->
      <div id="modal-slip" class="modal hidden">
        <div class="modal-content" style="max-width: 650px; background: #0f172a; border: 1px solid var(--border); padding: 30px; border-radius: 20px;">
          <div class="modal-header" style="border-bottom: 2px solid var(--border); padding-bottom: 15px; margin-bottom: 20px;">
            <div style="text-align: left;">
              <h2 style="margin: 0; color: white;">Boleta de Pago</h2>
              <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.9rem;">Régimen Laboral General (D.L. 728)</p>
            </div>
            <span class="close-modal" id="close-modal-slip" style="font-size: 1.8rem;">&times;</span>
          </div>
          
          <div id="slip-detail-content" style="color: white; font-size: 0.95rem;">
            <!-- Dynamic Payslip structure here -->
          </div>
          
          <div class="print-actions" style="text-align: center; margin-top: 30px; border-top: 1px dashed var(--border); padding-top: 20px;">
            <button class="btn-primary" onclick="window.print()" style="background: var(--border); color: white; width: auto; padding: 10px 20px;">Imprimir Boleta</button>
          </div>
        </div>
      </div>

      <!-- Modal Configurar Tasas AFP -->
      <div id="modal-afp-config" class="modal hidden">
        <div class="modal-content" style="max-width: 850px; background: #0f172a; border: 1px solid var(--border); padding: 30px; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <div class="modal-header" style="border-bottom: 2px solid var(--border); padding-bottom: 15px; margin-bottom: 20px;">
            <div style="text-align: left; display: flex; align-items: center; gap: 10px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings" style="color: #2dd4bf;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <h2 style="margin: 0; color: white;">Configuración de Tasas AFP</h2>
            </div>
            <span class="close-modal" id="close-modal-afp-config" style="font-size: 1.8rem; cursor: pointer;">&times;</span>
          </div>

          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: -10px; margin-bottom: 25px;">
            Modifique los valores porcentuales (0.00% - 100.00%) para cada administradora de fondos de pensiones.
          </p>
          
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border);">
                  <th style="text-align: left; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Administradora</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Aporte Obligatorio (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Prima de Seguro (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Comisión Flujo (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Total Retención (%)</th>
                  <th style="text-align: center; padding: 12px; color: var(--text-muted); font-size: 0.9rem;">Acciones</th>
                </tr>
              </thead>
              <tbody id="afp-config-table-body">
                <tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-muted);">Cargando tasas de AFP...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  async onInit(): Promise<void> {
    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];
    const periodStr = todayDateStr.substring(0, 7); // YYYY-MM

    const periodContainer = document.getElementById('payroll-period-container');
    if (periodContainer) {
      this.periodCalendar = new CustomCalendar(periodContainer, {
        name: 'payroll_period',
        defaultValue: todayDateStr,
        placeholder: 'Seleccionar periodo'
      });
      this.periodCalendar.render();
    }

    const currentPeriod = this.periodCalendar ? this.periodCalendar.getValue().substring(0, 7) : periodStr;
    if (currentPeriod) {
      await this.loadPayroll(currentPeriod);
    }
    await this.loadAfps();
    this.setupEventListeners();
  }

  private async loadPayroll(period: string): Promise<void> {
    const tbody = document.getElementById('payroll-table-body');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="11" style="text-align: center;">Buscando registros...</td></tr>`;

    try {
      const res = await fetch(`/payroll/period/${period}`, { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      this.payrolls = await res.json();
      this.renderTable();
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--danger);">Error de conexión al cargar la planilla.</td></tr>`;
    }
  }

  private renderTable(): void {
    const tbody = document.getElementById('payroll-table-body');
    if (!tbody) return;

    if (this.payrolls.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" style="text-align: center;">No hay planillas calculadas para este periodo.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.payrolls.map(p => {
      const totalDeductions = parseFloat(p.lateness_deduction as any) + parseFloat(p.absence_deduction as any);
      return `
        <tr>
          <td><strong>${p.document_number}</strong></td>
          <td>${p.full_name}</td>
          <td>${p.period}</td>
          <td>${p.days_worked} días</td>
          <td>${p.lateness_minutes} min</td>
          <td>S/ ${parseFloat(p.overtime_pay as any).toFixed(2)}</td>
          <td>S/ ${totalDeductions.toFixed(2)}</td>
          <td>S/ ${parseFloat(p.gross_salary as any).toFixed(2)}</td>
          <td>S/ ${parseFloat(p.pension_deduction as any).toFixed(2)}</td>
          <td><strong style="color: #2dd4bf;">S/ ${parseFloat(p.net_salary as any).toFixed(2)}</strong></td>
          <td>
            <button class="btn-primary btn-view-slip" data-emp-id="${p.employee_id}" data-period="${p.period}" style="padding: 5px 10px; font-size: 0.8rem; background: var(--border); color: white;">Ver Boleta</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  private async loadAfps(): Promise<void> {
    try {
      const res = await fetch('/payroll/afp', { headers: this.getAuthHeaders() });
      if (res.ok) {
        this.afps = await res.json();
        this.renderAfpTable();
      }
    } catch (err) {
      console.error("Error al cargar AFPs:", err);
    }
  }

  private renderAfpTable(): void {
    const tbody = document.getElementById('afp-config-table-body');
    if (!tbody) return;

    const canWrite = this.canWrite('payrolls');

    if (this.afps.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${canWrite ? 6 : 5}" style="text-align: center; padding: 20px; color: var(--text-muted);">No se encontraron configuraciones.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.afps.map(afp => {
      const total = (parseFloat(afp.mandatory_contribution) + parseFloat(afp.insurance_premium) + parseFloat(afp.flow_commission)) * 100;
      const isEditing = this.editingAfpId === afp.id;

      if (isEditing) {
        return `
          <tr style="border-bottom: 1px solid var(--border); background: rgba(255, 255, 255, 0.02);">
            <td style="padding: 12px; font-weight: bold; color: white;">${afp.name}</td>
            <td style="padding: 12px; text-align: center;">
              <input type="number" id="edit-aporte-${afp.id}" class="search-generic-input" style="width: 80px; text-align: center; padding: 5px; background: #0f172a; border: 1px solid var(--border); color: white; border-radius: 6px; font-family: inherit; font-size: 0.9rem;" value="${(afp.mandatory_contribution * 100).toFixed(2)}" step="0.01" min="0" max="100">
            </td>
            <td style="padding: 12px; text-align: center;">
              <input type="number" id="edit-prima-${afp.id}" class="search-generic-input" style="width: 80px; text-align: center; padding: 5px; background: #0f172a; border: 1px solid var(--border); color: white; border-radius: 6px; font-family: inherit; font-size: 0.9rem;" value="${(afp.insurance_premium * 100).toFixed(2)}" step="0.01" min="0" max="100">
            </td>
            <td style="padding: 12px; text-align: center;">
              <input type="number" id="edit-comision-${afp.id}" class="search-generic-input" style="width: 80px; text-align: center; padding: 5px; background: #0f172a; border: 1px solid var(--border); color: white; border-radius: 6px; font-family: inherit; font-size: 0.9rem;" value="${(afp.flow_commission * 100).toFixed(2)}" step="0.01" min="0" max="100">
            </td>
            <td style="padding: 12px; text-align: center; font-weight: bold; color: var(--text-muted);">-</td>
            <td style="padding: 12px; text-align: center;">
              <button class="btn-primary btn-save-afp" data-id="${afp.id}" style="padding: 4px 10px; font-size: 0.8rem; background: var(--success); color: white; border-radius: 6px; margin-right: 5px; cursor: pointer;">Guardar</button>
              <button class="btn-primary btn-cancel-afp" style="padding: 4px 10px; font-size: 0.8rem; background: var(--border); color: white; border-radius: 6px; cursor: pointer;">Cancelar</button>
            </td>
          </tr>
        `;
      }

      return `
        <tr style="border-bottom: 1px solid var(--border); transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.01)'" onmouseout="this.style.background='transparent'">
          <td style="padding: 12px; font-weight: bold; color: white;">${afp.name}</td>
          <td style="padding: 12px; text-align: center;">${(afp.mandatory_contribution * 100).toFixed(2)}%</td>
          <td style="padding: 12px; text-align: center;">${(afp.insurance_premium * 100).toFixed(2)}%</td>
          <td style="padding: 12px; text-align: center;">${(afp.flow_commission * 100).toFixed(2)}%</td>
          <td style="padding: 12px; text-align: center; font-weight: bold; color: #2dd4bf;">${total.toFixed(2)}%</td>
          ${canWrite ? `
            <td style="padding: 12px; text-align: center;">
              <button class="btn-primary btn-edit-afp" data-id="${afp.id}" style="padding: 4px 10px; font-size: 0.8rem; background: var(--border); color: white; border-radius: 6px; cursor: pointer;">Editar</button>
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');
  }

  private setupEventListeners(): void {
    // Consultar
    document.getElementById('btn-search-payroll')?.addEventListener('click', async () => {
      const dateVal = this.periodCalendar?.getValue();
      const period = dateVal ? dateVal.substring(0, 7) : '';
      if (period) {
        await this.loadPayroll(period);
      }
    });

    // Calcular
    document.getElementById('btn-calc-payroll')?.addEventListener('click', async () => {
      const dateVal = this.periodCalendar?.getValue();
      const period = dateVal ? dateVal.substring(0, 7) : '';
      if (!period) {
        Toast.warning('Por favor seleccione un periodo YYYY-MM.');
        return;
      }
      if (!await ConfirmDialog.ask(`¿Está seguro de recalcular la planilla completa para el periodo ${period}?`)) {
        return;
      }

      try {
        const res = await fetch('/payroll/calculate', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ period })
        });
        const data = await res.json();
        if (res.ok) {
          Toast.success('Planilla del periodo calculada con éxito.');
          await this.loadPayroll(period);
        } else {
          Toast.error('Error al calcular planilla: ' + (data.detail || 'Desconocido'));
        }
      } catch {
        Toast.error('Error de conexión con el motor de planilla.');
      }
    });

    // Exportar CSV
    document.getElementById('btn-export-payroll')?.addEventListener('click', async () => {
      const dateVal = this.periodCalendar?.getValue();
      const period = dateVal ? dateVal.substring(0, 7) : '';
      if (!period) {
        Toast.warning('Por favor seleccione un periodo válido.');
        return;
      }
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/payroll/export/${period}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `lote_pago_planilla_${period}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          Toast.success('Lote de pago exportado correctamente.');
        } else {
          const err = await response.json();
          Toast.error('Error: ' + (err.detail || 'No se pudo exportar.'));
        }
      } catch (err: any) {
        Toast.error(err.message || 'Error de red al exportar.');
      }
    });

    // Abrir Modal AFP Config
    document.getElementById('btn-config-afp')?.addEventListener('click', () => {
      document.getElementById('modal-afp-config')?.classList.remove('hidden');
    });

    // Cerrar Modal AFP Config
    document.getElementById('close-modal-afp-config')?.addEventListener('click', () => {
      document.getElementById('modal-afp-config')?.classList.add('hidden');
      this.editingAfpId = null;
      this.renderAfpTable();
    });

    // Ver Boleta Delegación
    const tbody = document.getElementById('payroll-table-body');
    tbody?.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-view-slip')) {
        const empId = target.getAttribute('data-emp-id');
        const period = target.getAttribute('data-period');
        if (empId && period) {
          await this.showPayslip(parseInt(empId), period);
        }
      }
    });

    // Cerrar Modal Boleta
    document.getElementById('close-modal-slip')?.addEventListener('click', () => {
      document.getElementById('modal-slip')?.classList.add('hidden');
    });

    // Eventos Tabla AFP
    const afpTbody = document.getElementById('afp-config-table-body');
    afpTbody?.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('btn-edit-afp')) {
        const id = target.getAttribute('data-id');
        if (id) {
          this.editingAfpId = parseInt(id);
          this.renderAfpTable();
        }
      }
      
      if (target.classList.contains('btn-cancel-afp')) {
        this.editingAfpId = null;
        this.renderAfpTable();
      }

      if (target.classList.contains('btn-save-afp')) {
        const idStr = target.getAttribute('data-id');
        if (!idStr) return;
        const id = parseInt(idStr);

        const aporteInput = document.getElementById(`edit-aporte-${id}`) as HTMLInputElement | null;
        const primaInput = document.getElementById(`edit-prima-${id}`) as HTMLInputElement | null;
        const comisionInput = document.getElementById(`edit-comision-${id}`) as HTMLInputElement | null;

        if (aporteInput && primaInput && comisionInput) {
          const aporte = parseFloat(aporteInput.value) / 100;
          const prima = parseFloat(primaInput.value) / 100;
          const comision = parseFloat(comisionInput.value) / 100;

          if (isNaN(aporte) || aporte < 0 || aporte > 1 ||
              isNaN(prima) || prima < 0 || prima > 1 ||
              isNaN(comision) || comision < 0 || comision > 1) {
            Toast.warning('Por favor ingrese valores numéricos válidos entre 0% y 100%.');
            return;
          }

          try {
            const res = await fetch(`/payroll/afp/${id}`, {
              method: 'PUT',
              headers: {
                ...this.getAuthHeaders(),
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                mandatory_contribution: aporte,
                insurance_premium: prima,
                flow_commission: comision
              })
            });

            if (res.ok) {
              Toast.success('Tasas de AFP actualizadas correctamente.');
              this.editingAfpId = null;
              await this.loadAfps();
              
              // Recargar planilla si hay periodo activo para recalcular con las nuevas tasas
              const dateVal = this.periodCalendar?.getValue();
              const period = dateVal ? dateVal.substring(0, 7) : '';
              if (period) {
                await this.loadPayroll(period);
              }
            } else {
              const err = await res.json();
              Toast.error('Error al guardar: ' + (err.detail || 'Desconocido'));
            }
          } catch {
            Toast.error('Error de conexión.');
          }
        }
      }
    });
  }

  private async showPayslip(empId: number, period: string): Promise<void> {
    const modal = document.getElementById('modal-slip');
    const content = document.getElementById('slip-detail-content');
    if (!content) return;

    content.innerHTML = `<p style="text-align: center;">Cargando boleta...</p>`;
    modal?.classList.remove('hidden');

    try {
      const res = await fetch(`/payroll/slip/employee/${empId}/period/${period}`, { headers: this.getAuthHeaders() });
      if (!res.ok) throw new Error();
      const p: Payroll = await res.json();

      const totalIngresos = p.base_salary + p.family_allowance + p.overtime_pay;
      const totalDescuentos = p.lateness_deduction + p.absence_deduction + p.pension_deduction;

      content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
          <div>
            <strong>Colaborador:</strong> ${p.full_name}<br>
            <strong>DNI:</strong> ${p.document_number}<br>
            <strong>Periodo:</strong> ${p.period}
          </div>
          <div style="text-align: right;">
            <strong>Días Trabajados:</strong> ${p.days_worked} días<br>
            <strong>Tardanzas / S. Tempranas:</strong> ${p.lateness_minutes} min<br>
            <strong>Aporte Patronal EsSalud (9%):</strong> S/ ${parseFloat(p.essalud_contribution as any).toFixed(2)}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Ingresos (Remuneraciones) -->
          <div style="border-right: 1px solid var(--border); padding-right: 15px;">
            <h4 style="border-bottom: 1px solid var(--border); padding-bottom: 5px; color: #2dd4bf; margin-top: 0;">Remuneraciones / Ingresos</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Sueldo Base:</span>
              <span>S/ ${parseFloat(p.base_salary as any).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Asignación Familiar:</span>
              <span>S/ ${parseFloat(p.family_allowance as any).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Horas Extras:</span>
              <span>S/ ${parseFloat(p.overtime_pay as any).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border); padding-top: 8px; font-weight: 600;">
              <span>Total Ingresos:</span>
              <span>S/ ${totalIngresos.toFixed(2)}</span>
            </div>
          </div>

          <!-- Descuentos y Aportes del trabajador -->
          <div>
            <h4 style="border-bottom: 1px solid var(--border); padding-bottom: 5px; color: #f87171; margin-top: 0;">Descuentos / Retenciones</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tardanzas y S. Tempranas:</span>
              <span>S/ ${parseFloat(p.lateness_deduction as any).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Inasistencias:</span>
              <span>S/ ${parseFloat(p.absence_deduction as any).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Retención Pensión:</span>
              <span>S/ ${parseFloat(p.pension_deduction as any).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border); padding-top: 8px; font-weight: 600;">
              <span>Total Descuentos:</span>
              <span>S/ ${totalDescuentos.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border); border-radius: 12px; margin-top: 25px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1.1rem; font-weight: 600;">NETO A PAGAR:</span>
          <span style="font-size: 1.4rem; font-weight: 600; color: #2dd4bf;">S/ ${parseFloat(p.net_salary as any).toFixed(2)}</span>
        </div>

        <!-- Firma digital/física formal -->
        <div class="print-signatures" style="display: none;">
          <div style="text-align: center; width: 40%; border-top: 1px solid var(--text-muted); padding-top: 8px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Firma del Trabajador</span>
          </div>
          <div style="text-align: center; width: 40%; border-top: 1px solid var(--text-muted); padding-top: 8px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Firma del Empleador</span>
          </div>
        </div>
      `;
    } catch {
      content.innerHTML = `<p style="text-align: center; color: var(--danger);">Error al recuperar boleta de pago.</p>`;
    }
  }
}
