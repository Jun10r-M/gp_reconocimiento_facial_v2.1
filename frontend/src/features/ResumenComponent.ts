import { BaseComponent } from '../core/BaseComponent';
import { AttendanceLog } from '../types';

declare const Chart: any;

export class ResumenComponent extends BaseComponent {
  private chartInstance: any = null;

  render(): void {
    this.container.innerHTML = `
      <section id="section-resumen" class="dashboard-section animate-fade-in">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Asistencias de Hoy</h3>
            <p id="stat-total-att">Cargando...</p>
          </div>
          <div class="stat-card">
            <h3>Planilla Total</h3>
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

      // Procesar asistencias
      const processed = this.processAttendance(attendance, employees);
      
      const statAtt = document.getElementById('stat-total-att');
      const statPay = document.getElementById('stat-total-pay');
      
      if (statAtt) statAtt.innerText = processed.length.toString();
      
      const totalPay = processed.reduce((sum, item) => sum + (item.pago || 0), 0);
      if (statPay) statPay.innerText = `S/ ${totalPay.toFixed(2)}`;

      this.renderChart(processed);
    } catch (err) {
      console.error("Error al cargar resumen:", err);
    }
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
          pago: (emp.monthly_salary || 1500) / 30, // Pago proporcional diario aproximado
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

    // Agrupar asistencias procesadas por fecha
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
