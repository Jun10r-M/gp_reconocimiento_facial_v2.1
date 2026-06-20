import { BaseComponent } from '../core/BaseComponent';
import { AttendanceLog } from '../types';

declare const Chart: any;

export class ResumenComponent extends BaseComponent {
  private chartInstance: any = null;
  private allProcessed: any[] = [];

  render(): void {
    this.container.innerHTML = `
      <section id="section-resumen" class="dashboard-section animate-fade-in">
        <div class="filter-date-bar" style="display:flex;gap:16px;align-items:center;margin-bottom:24px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="color:#9ca3af;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Desde</label>
            <input type="date" id="filter-date-from" style="background:#1c2333;border:1px solid #2d3748;color:#f0f6fc;padding:10px 14px;border-radius:10px;font-family:Outfit,sans-serif;outline:none;">
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="color:#9ca3af;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;">Hasta</label>
            <input type="date" id="filter-date-to" style="background:#1c2333;border:1px solid #2d3748;color:#f0f6fc;padding:10px 14px;border-radius:10px;font-family:Outfit,sans-serif;outline:none;">
          </div>
          <button id="filter-date-btn" style="background:#e74c3c;color:white;border:none;padding:10px 24px;border-radius:10px;font-weight:600;cursor:pointer;font-family:Outfit,sans-serif;">Filtrar</button>
          <button id="filter-date-clear" style="background:#2d3748;color:#9ca3af;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-family:Outfit,sans-serif;">Limpiar</button>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <h3 id="stat-att-label">Asistencias de Hoy</h3>
            <p id="stat-total-att">Cargando...</p>
          </div>
          <div class="stat-card">
            <h3 id="stat-pay-label">Planilla Total</h3>
            <p id="stat-total-pay">Cargando...</p>
          </div>
        </div>
        <div class="chart-container" style="position: relative; height: 350px; width: 100%;">
          <canvas id="mainChart"></canvas>
        </div>
      </section>
    `;
  }

  async onInit(): Promise<void> {
    try {
      const response = await fetch('/data', { headers: this.getAuthHeaders() });
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      const attendance: AttendanceLog[] = data.attendance || [];
      const employees = data.employees || [];

      this.allProcessed = this.processAttendance(attendance, employees);
      this.applyFilter();

      const btnFilter = document.getElementById('filter-date-btn');
      const btnClear = document.getElementById('filter-date-clear');

      if (btnFilter) btnFilter.addEventListener('click', () => this.applyFilter());
      if (btnClear) btnClear.addEventListener('click', () => {
        const f = document.getElementById('filter-date-from') as HTMLInputElement;
        const t = document.getElementById('filter-date-to') as HTMLInputElement;
        if (f) f.value = '';
        if (t) t.value = '';
        this.applyFilter();
      });
    } catch (err) {
      console.error("Error al cargar resumen:", err);
    }
  }

  private applyFilter(): void {
    const fromEl = document.getElementById('filter-date-from') as HTMLInputElement;
    const toEl = document.getElementById('filter-date-to') as HTMLInputElement;
    const fromVal = fromEl ? fromEl.value : '';
    const toVal = toEl ? toEl.value : '';
    const today = new Date().toISOString().split('T')[0];

    let filtered = this.allProcessed;
    const attLabel = document.getElementById('stat-att-label');
    const payLabel = document.getElementById('stat-pay-label');

    if (fromVal || toVal) {
      filtered = this.allProcessed.filter(p => {
        if (fromVal && p.fecha < fromVal) return false;
        if (toVal && p.fecha > toVal) return false;
        return true;
      });
      if (attLabel) attLabel.innerText = (fromVal === toVal && fromVal)
        ? 'Asistencias del ' + fromVal
        : 'Asistencias (Filtrado)';
      if (payLabel) payLabel.innerText = 'Planilla (Filtrado)';
    } else {
      filtered = this.allProcessed;
      if (attLabel) attLabel.innerText = 'Asistencias de Hoy';
      if (payLabel) payLabel.innerText = 'Planilla Total';
    }

    const statAtt = document.getElementById('stat-total-att');
    const statPay = document.getElementById('stat-total-pay');

    if (!fromVal && !toVal) {
      if (statAtt) statAtt.innerText = this.allProcessed.filter(x => x.fecha === today).length.toString();
    } else {
      if (statAtt) statAtt.innerText = filtered.length.toString();
    }

    const totalPay = filtered.reduce((sum, item) => sum + (item.pago || 0), 0);
    if (statPay) statPay.innerText = `S/ ${totalPay.toFixed(2)}`;

    this.renderChart(filtered);
  }

  onDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private processAttendance(attendance: AttendanceLog[], employees: any[]): any[] {
    const grouped: { [key: string]: any } = {};

    attendance.forEach(att => {
      const ts = att.timestamp;
      if (!ts) return;

      const dObj = new Date(ts.replace(' ', 'T'));
      if (isNaN(dObj.getTime())) return;

      const dateStr = dObj.toISOString().split('T')[0];
      const key = `${att.employee_id}_${dateStr}`;

      if (!grouped[key]) {
        const emp = employees.find(e => e.id === att.employee_id) || {};
        grouped[key] = {
          id: att.employee_id,
          nombre: emp.full_name || att.nombre || "Desconocido",
          fecha: dateStr,
          pago: (emp.monthly_salary || 1500) / 30,
          timestamps: []
        };
      }
      grouped[key].timestamps.push(dObj);
    });

    return Object.values(grouped);
  }

  private renderChart(processed: any[]): void {
    const canvas = document.getElementById('mainChart') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataByDate: { [key: string]: { count: number; names: string[] } } = {};
    processed.forEach(att => {
      if (!dataByDate[att.fecha]) {
        dataByDate[att.fecha] = { count: 0, names: [] };
      }
      dataByDate[att.fecha].count++;
      dataByDate[att.fecha].names.push(att.nombre);
    });

    const labels = Object.keys(dataByDate).sort();
    const counts = labels.map(l => dataByDate[l].count);
    const names = labels.map(l => dataByDate[l].names);

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Asistencias',
          data: counts,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#ef4444',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#fff',
            bodyColor: '#9ca3af',
            borderColor: '#ef4444',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context: any) {
                const dayNames = names[context.dataIndex];
                return [
                  `Total: ${context.raw} empleados`,
                  `Asistieron: ${dayNames.join(', ')}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#374151' },
            ticks: { color: '#9ca3af', stepSize: 1 }
          },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        }
      }
    });
  }
}
