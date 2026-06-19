import { BaseComponent } from '../core/BaseComponent';
import { CustomInput } from '../shared/components/CustomInput';
import { Toast } from '../shared/components/Toast';

interface ForecastData {
  last_period: string;
  next_period: string;
  current_emp_count: number;
  
  payroll_forecast: number;
  payroll_mae: number;
  payroll_rmse: number;
  payroll_r2: number;
  
  overtime_forecast: number;
  overtime_mae: number;
  overtime_rmse: number;
  overtime_r2: number;
  
  absenteeism_forecast: number;
  absenteeism_mae: number;
  absenteeism_rmse: number;
  absenteeism_r2: number;
}

export class PredictionComponent extends BaseComponent {
  private newEmpInput: CustomInput | null = null;
  private overtimeInput: CustomInput | null = null;

  render(): void {
    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in" style="width: 100%;">
        
        <!-- Alerta Informativa Académica -->
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 15px 20px; margin-bottom: 30px; display: flex; gap: 15px; align-items: center;">
          <div style="display: flex; align-items: center; justify-content: center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v14"/></svg>
          </div>
          <div style="font-size: 0.9rem; color: #93c5fd; line-height: 1.5;">
            <strong>Módulo de Inteligencia Artificial (Sistemas Inteligentes)</strong><br>
            Los modelos predictivos han sido entrenados mediante <strong>Regresión de Cresta (Ridge Regression - OLS)</strong> en NumPy. 
            El sistema pobla automáticamente series temporales de 12 meses para aprender tendencias, volumen de horas extras y estacionalidad de gratificaciones (Jul/Dic) y ausentismo.
          </div>
        </div>
 
        <!-- Fila de Pronósticos Principales (Próximo Mes) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;" id="forecasts-cards-container">
          <p style="grid-column: 1/-1; text-align: center;">Entrenando modelos y calculando pronósticos...</p>
        </div>
 
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;" id="details-grid">
          <!-- Panel de Simulación Presupuestaria -->
          <div class="stat-card" style="padding: 30px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 1.25rem; display: flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders" style="margin-right: 8px;"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
                Simulador Presupuestario IA
              </h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 25px;">Proyecta el impacto de decisiones de contratación y metas de producción en el costo total de la planilla del mes siguiente.</p>
              
              <form id="simulation-form" style="display: flex; flex-direction: column; gap: 20px;">
                <div id="sim-new-employees-container"></div>
                <div id="sim-overtime-hours-container"></div>
                <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; margin-top: 10px;">Calcular Impacto Proyectado</button>
              </form>
            </div>
 
            <!-- Resultado de Simulación -->
            <div id="simulation-result" class="hidden" style="margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border); border-radius: 12px;">
              <h4 style="margin-top: 0; margin-bottom: 15px; font-size: 0.95rem; color: var(--text-muted);">RESULTADO DE SIMULACIÓN</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Empleados Totales:</span>
                  <span id="sim-result-emps" style="font-weight: 600;">0</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Costo por Horas Extras:</span>
                  <span id="sim-result-ot-pay" style="font-weight: 600;">S/. 0.00</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Aporte EsSalud Extra:</span>
                  <span id="sim-result-essalud" style="font-weight: 600;">S/. 0.00</span>
                </div>
                <hr style="border: 0; border-top: 1px solid var(--border); margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: white;">Planilla Simulada Total:</span>
                  <span id="sim-result-total" style="font-weight: 600; color: var(--primary); font-size: 1.15rem;">S/. 0.00</span>
                </div>
                <div style="text-align: right; font-size: 0.8rem; color: #10b981; font-weight: 600; margin-top: 5px;" id="sim-result-variation">
                  +0.0% respecto al pronóstico base
                </div>
              </div>
            </div>
          </div>
 
          <!-- Métricas de Evaluación Cuantitativa (Sistemas Inteligentes) -->
          <div class="stat-card" style="padding: 30px;">
            <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 1.25rem; display: flex; align-items: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-3" style="margin-right: 8px;"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              Evaluación Cuantitativa de Modelos
            </h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 25px;">Métricas obtenidas mediante validación cruzada con partición de prueba (20% del historial de planillas).</p>
            
            <div style="display: flex; flex-direction: column; gap: 20px;" id="metrics-details-container">
              <p>Cargando métricas de error...</p>
            </div>
          </div>
        </div>
 
      </section>
    `;
  }

  async onInit(): Promise<void> {
    // Inicializar inputs vacíos
    const simEmpContainer = document.getElementById('sim-new-employees-container');
    const simOtContainer = document.getElementById('sim-overtime-hours-container');

    if (simEmpContainer) {
      this.newEmpInput = new CustomInput(simEmpContainer, {
        label: 'Contratación de Empleados (Nuevos)',
        type: 'number',
        name: 'new_employees',
        required: true,
        placeholder: 'Ej. 2'
      });
      this.newEmpInput.render();
      this.newEmpInput.setValue('0');
    }

    if (simOtContainer) {
      this.overtimeInput = new CustomInput(simOtContainer, {
        label: 'Meta de Horas Extras Totales (Mensual)',
        type: 'number',
        name: 'target_overtime_hours',
        required: true,
        placeholder: 'Ej. 50'
      });
      this.overtimeInput.render();
      this.overtimeInput.setValue('0');
    }

    // Configurar listener del formulario de simulación
    const form = document.getElementById('simulation-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.runSimulation();
    });

    // Cargar estadísticas y predicciones iniciales
    await this.loadForecastData();
  }

  private async loadForecastData(): Promise<void> {
    try {
      const res = await fetch('/prediction/dashboard', { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error();
      const data: ForecastData = await res.json();
      this.renderForecastCards(data);
      this.renderMetricsDetails(data);
    } catch (err) {
      console.error(err);
      const container = document.getElementById('forecasts-cards-container');
      if (container) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Error de conexión al entrenar los modelos IA y obtener los pronósticos.</p>`;
      }
    }
  }

  private renderForecastCards(data: ForecastData): void {
    const container = document.getElementById('forecasts-cards-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Pronóstico Costo Planilla -->
      <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid var(--primary); padding: 25px;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Gasto de Planilla Proyectado</h4>
          <span style="font-size: 1.6rem; font-weight: 600; color: white;">S/. ${data.payroll_forecast.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Mes: ${data.next_period}</span>
          <span style="color: #10b981; font-weight: 600;">Regresión Ridge IA</span>
        </div>
      </div>

      <!-- Pronóstico Horas Extras -->
      <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid #eab308; padding: 25px;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Volumen Horas Extras Estimado</h4>
          <span style="font-size: 1.6rem; font-weight: 600; color: white;">${data.overtime_forecast.toLocaleString('es-PE')} horas</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Planilla Activa: ${data.current_emp_count} emp.</span>
          <span style="color: #eab308; font-weight: 600;">Tendencia Mensual</span>
        </div>
      </div>

      <!-- Pronóstico Ausentismo -->
      <div class="stat-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid #f87171; padding: 25px;">
        <div>
          <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Días de Ausencia Previstos</h4>
          <span style="font-size: 1.6rem; font-weight: 600; color: white;">${data.absenteeism_forecast.toLocaleString('es-PE')} días</span>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Ausentismo acumulado</span>
          <span style="color: #f87171; font-weight: 600;">Impacto Estacional</span>
        </div>
      </div>
    `;
  }

  private renderMetricsDetails(data: ForecastData): void {
    const container = document.getElementById('metrics-details-container');
    if (!container) return;

    container.innerHTML = `
      <!-- Métrica Planilla -->
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 15px; border-radius: 12px;">
        <h5 style="margin: 0 0 10px 0; font-size: 0.9rem; color: var(--primary);">Modelo Presupuesto de Planilla</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">MAE</div>
            <div style="font-weight: 600; color: white;">S/. ${data.payroll_mae}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">RMSE</div>
            <div style="font-weight: 600; color: white;">S/. ${data.payroll_rmse}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">R²</div>
            <div style="font-weight: 600; color: #10b981;">${data.payroll_r2}</div>
          </div>
        </div>
      </div>

      <!-- Métrica Horas Extra -->
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 15px; border-radius: 12px;">
        <h5 style="margin: 0 0 10px 0; font-size: 0.9rem; color: #eab308;">Modelo Volumen de Horas Extras</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">MAE</div>
            <div style="font-weight: 600; color: white;">${data.overtime_mae} hrs</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">RMSE</div>
            <div style="font-weight: 600; color: white;">${data.overtime_rmse} hrs</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">R²</div>
            <div style="font-weight: 600; color: #10b981;">${data.overtime_r2}</div>
          </div>
        </div>
      </div>

      <!-- Métrica Ausencias -->
      <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 15px; border-radius: 12px;">
        <h5 style="margin: 0 0 10px 0; font-size: 0.9rem; color: #f87171;">Modelo Tendencia de Ausentismo</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">MAE</div>
            <div style="font-weight: 600; color: white;">${data.absenteeism_mae} días</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">RMSE</div>
            <div style="font-weight: 600; color: white;">${data.absenteeism_rmse} días</div>
          </div>
          <div>
            <div style="color: var(--text-muted); margin-bottom: 3px;">R²</div>
            <div style="font-weight: 600; color: #10b981;">${data.absenteeism_r2}</div>
          </div>
        </div>
      </div>
    `;
  }

  private async runSimulation(): Promise<void> {
    const valEmps = parseInt(this.newEmpInput?.getValue() || '0');
    const valOt = parseFloat(this.overtimeInput?.getValue() || '0.0');

    if (isNaN(valEmps) || valEmps < 0) {
      Toast.error('El número de nuevos empleados debe ser mayor o igual a 0.');
      return;
    }

    if (isNaN(valOt) || valOt < 0) {
      Toast.error('La meta de horas extras debe ser mayor o igual a 0.');
      return;
    }

    try {
      const res = await fetch('/prediction/simulate', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          new_employees: valEmps,
          target_overtime_hours: valOt
        })
      });

      if (!res.ok) throw new Error();
      const simData = await res.json();
      this.showSimulationResult(simData);
    } catch {
      Toast.error('Error al procesar la simulación de presupuesto.');
    }
  }

  private showSimulationResult(data: any): void {
    const resultBox = document.getElementById('simulation-result');
    if (!resultBox) return;

    resultBox.classList.remove('hidden');

    const elEmps = document.getElementById('sim-result-emps');
    const elOtPay = document.getElementById('sim-result-ot-pay');
    const elEssalud = document.getElementById('sim-result-essalud');
    const elTotal = document.getElementById('sim-result-total');
    const elVariation = document.getElementById('sim-result-variation');

    if (elEmps) elEmps.innerText = `${data.simulated_employees} empleados`;
    if (elOtPay) elOtPay.innerText = `S/. ${data.overtime_cost_impact.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    if (elEssalud) elEssalud.innerText = `S/. ${data.essalud_impact.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    if (elTotal) elTotal.innerText = `S/. ${data.simulated_payroll_cost.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    
    if (elVariation) {
      const variation = data.variation_pct;
      const isIncrease = variation > 0;
      elVariation.style.color = isIncrease ? '#f87171' : '#10b981'; // Red for increase, Green for decrease/same
      elVariation.innerText = `${isIncrease ? '+' : ''}${variation}% respecto al pronóstico base`;
    }
  }
}
