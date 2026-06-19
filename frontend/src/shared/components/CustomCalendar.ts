import { BaseComponent } from '../../core/BaseComponent';

export interface CustomCalendarConfig {
  label?: string;
  name: string;
  required?: boolean;
  defaultValue?: string; // Formato YYYY-MM-DD
  placeholder?: string;
  onChange?: (date: string) => void;
}

export class CustomCalendar extends BaseComponent {
  private config: CustomCalendarConfig;
  private selectedDate: string = '';
  private currentYear: number;
  private currentMonth: number; // 0-indexado
  private isOpen = false;

  constructor(container: HTMLElement, config: CustomCalendarConfig) {
    super(container);
    this.config = config;

    const initialDate = config.defaultValue !== undefined ? config.defaultValue : new Date().toISOString().split('T')[0];
    this.selectedDate = initialDate;

    const referenceDate = initialDate || new Date().toISOString().split('T')[0];
    const dateParts = referenceDate.split('-');
    this.currentYear = parseInt(dateParts[0]);
    this.currentMonth = parseInt(dateParts[1]) - 1;
  }

  render(): void {
    const { label = '', name, placeholder = 'Seleccionar fecha' } = this.config;

    const labelHtml = label ? `<label>${label}</label>` : '';
    const groupStyle = label ? '' : 'margin-bottom: 0;';

    this.container.innerHTML = `
      <div class="custom-form-group calendar-container" style="${groupStyle}">
        ${labelHtml}
        <input type="hidden" name="${name}" value="${this.selectedDate}">

        <!-- Trigger del calendario -->
        <div class="custom-calendar-trigger custom-select-trigger" tabindex="0">
          <span class="selected-date-label">${this.selectedDate ? this.formatDateLabel(this.selectedDate) : placeholder}</span>
        </div>

        <!-- Panel flotante del calendario -->
        <div class="custom-calendar-panel hidden" style="position: absolute; top: 100%; left: 0; width: 280px; background: #0b0f19; border: 1px solid var(--border); border-radius: 10px; z-index: 1000; margin-top: 5px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 15px; user-select: none;">
          <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <button type="button" class="btn-prev-month" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 1rem; padding: 5px;">◀</button>
            <span class="month-year-label" style="font-weight: 600; font-size: 0.9rem; color: white;">Mes Año</span>
            <button type="button" class="btn-next-month" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 1rem; padding: 5px;">▶</button>
          </div>
          <div class="calendar-days-header" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 5px;">
            <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
          </div>
          <div class="calendar-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center; font-size: 0.8rem;">
            <!-- Cargar celdas de días -->
          </div>
          <div class="calendar-footer" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end;">
            <button type="button" class="btn-clear-date" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.75rem; font-weight: 600; padding: 2px 5px;">Limpiar</button>
          </div>
        </div>
      </div>
    `;

    this.renderMonthDays();
    this.setupListeners();
  }

  private renderMonthDays(): void {
    const grid = this.container.querySelector('.calendar-days-grid');
    const headerLabel = this.container.querySelector('.month-year-label');
    if (!grid || !headerLabel) return;

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    headerLabel.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

    // Primer día del mes
    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    // Ajustar a Lunes como día index 0
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Total de días del mes
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    let daysHtml = '';

    // Espaciadores de días del mes anterior
    for (let i = 0; i < adjustedFirstDay; i++) {
      daysHtml += `<span style="color: transparent;">-</span>`;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Cargar días del mes actual
    for (let day = 1; day <= totalDays; day++) {
      const currentFullDate = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = currentFullDate === this.selectedDate;
      const isToday = currentFullDate === todayStr;

      let style = 'padding: 6px 0; border-radius: 6px; cursor: pointer; transition: all 0.15s; display: block;';
      if (isSelected) {
        style += ' background: var(--primary); color: white; font-weight: bold;';
      } else if (isToday) {
        style += ' border: 1px solid var(--primary); color: var(--primary);';
      } else {
        style += ' color: white;';
      }

      daysHtml += `
        <span class="calendar-day-item" data-date="${currentFullDate}" style="${style}" onmouseover="if(!${isSelected}) this.style.background='rgba(255,255,255,0.05)'" onmouseout="if(!${isSelected}) this.style.background='transparent'">
          ${day}
        </span>
      `;
    }

    grid.innerHTML = daysHtml;

    // Event listeners para cada día
    grid.querySelectorAll('.calendar-day-item').forEach(el => {
      el.addEventListener('click', (e) => {
        const dateVal = (e.currentTarget as HTMLElement).getAttribute('data-date') || '';
        this.selectDate(dateVal);
      });
    });
  }

  private setupListeners(): void {
    const trigger = this.container.querySelector('.custom-calendar-trigger');
    const panel = this.container.querySelector('.custom-calendar-panel');
    const prevBtn = this.container.querySelector('.btn-prev-month');
    const nextBtn = this.container.querySelector('.btn-next-month');

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        trigger.classList.add('active');
        panel?.classList.remove('hidden');
      } else {
        trigger.classList.remove('active');
        panel?.classList.add('hidden');
      }
    });

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderMonthDays();
    });

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderMonthDays();
    });

    // Cerrar al hacer click afuera
    document.addEventListener('click', () => {
      if (this.isOpen) {
        this.isOpen = false;
        trigger?.classList.remove('active');
        panel?.classList.add('hidden');
      }
    });

    const clearBtn = this.container.querySelector('.btn-clear-date');
    clearBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectDate('');
    });

    panel?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  private selectDate(dateVal: string): void {
    this.selectedDate = dateVal;

    // Sincronizar input oculto
    const hiddenInput = this.container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput) hiddenInput.value = dateVal;

    // Sincronizar trigger label
    const labelEl = this.container.querySelector('.selected-date-label');
    if (labelEl) {
      labelEl.textContent = dateVal ? this.formatDateLabel(dateVal) : (this.config.placeholder || 'Seleccionar fecha');
    }

    // Cerrar panel
    this.isOpen = false;
    const trigger = this.container.querySelector('.custom-calendar-trigger');
    const panel = this.container.querySelector('.custom-calendar-panel');
    trigger?.classList.remove('active');
    panel?.classList.add('hidden');

    // Trigger de callback
    if (this.config.onChange) {
      this.config.onChange(dateVal);
    }
  }

  private formatDateLabel(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  public getValue(): string {
    return this.selectedDate;
  }

  public setValue(dateVal: string): void {
    this.selectDate(dateVal);
    const dateParts = dateVal.split('-');
    if (dateParts.length === 3) {
      this.currentYear = parseInt(dateParts[0]);
      this.currentMonth = parseInt(dateParts[1]) - 1;
      this.renderMonthDays();
    }
  }
}
