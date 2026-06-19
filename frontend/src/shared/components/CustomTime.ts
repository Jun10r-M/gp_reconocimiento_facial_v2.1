import { BaseComponent } from '../../core/BaseComponent';

export interface CustomTimeConfig {
  label?: string;
  name: string;
  required?: boolean;
  defaultValue?: string; // Formato HH:MM
  placeholder?: string;
  onChange?: (time: string) => void;
}

export class CustomTime extends BaseComponent {
  private config: CustomTimeConfig;
  private selectedTime: string = '08:00';
  private isOpen = false;

  constructor(container: HTMLElement, config: CustomTimeConfig) {
    super(container);
    this.config = config;
    this.selectedTime = config.defaultValue || '08:00';
  }

  render(): void {
    const { label = '', name, placeholder = 'Seleccionar hora' } = this.config;

    const labelHtml = label ? `<label>${label}</label>` : '';
    const groupStyle = label ? '' : 'margin-bottom: 0;';

    const [hours, minutes] = this.selectedTime.split(':');

    this.container.innerHTML = `
      <div class="custom-form-group time-container" style="${groupStyle}">
        ${labelHtml}
        <input type="hidden" name="${name}" value="${this.selectedTime}">

        <!-- Trigger del time picker -->
        <div class="custom-time-trigger custom-select-trigger" tabindex="0" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
          <span class="selected-time-label">${this.selectedTime || placeholder}</span>
        </div>

        <!-- Panel del time picker -->
        <div class="custom-time-panel hidden" style="position: absolute; top: 100%; left: 0; width: 180px; background: #0b0f19; border: 1px solid var(--border); border-radius: 10px; z-index: 1050; margin-top: 5px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 10px; user-select: none;">
          <div style="display: flex; gap: 10px; height: 160px;">
            <!-- Columna Horas -->
            <div class="hours-column" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;">
              <div style="font-size: 0.75rem; text-align: center; color: var(--text-muted); font-weight: bold; margin-bottom: 4px; position: sticky; top: 0; background: #0b0f19;">HH</div>
              ${Array.from({ length: 24 }, (_, i) => {
                const hh = String(i).padStart(2, '0');
                const isSel = hh === hours;
                return `<div class="time-opt hour-opt ${isSel ? 'selected' : ''}" data-hour="${hh}" style="padding: 6px; text-align: center; border-radius: 6px; cursor: pointer; color: ${isSel ? 'white' : 'var(--text-muted)'}; background: ${isSel ? 'var(--primary)' : 'transparent'}; font-size: 0.85rem;">${hh}</div>`;
              }).join('')}
            </div>
            <!-- Columna Minutos -->
            <div class="minutes-column" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;">
              <div style="font-size: 0.75rem; text-align: center; color: var(--text-muted); font-weight: bold; margin-bottom: 4px; position: sticky; top: 0; background: #0b0f19;">MM</div>
              ${Array.from({ length: 12 }, (_, i) => {
                const mm = String(i * 5).padStart(2, '0');
                const isSel = mm === minutes;
                return `<div class="time-opt minute-opt ${isSel ? 'selected' : ''}" data-minute="${mm}" style="padding: 6px; text-align: center; border-radius: 6px; cursor: pointer; color: ${isSel ? 'white' : 'var(--text-muted)'}; background: ${isSel ? 'var(--primary)' : 'transparent'}; font-size: 0.85rem;">${mm}</div>`;
              }).join('')}
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 8px; border-top: 1px solid var(--border); padding-top: 8px;">
            <button type="button" class="btn-time-ok" style="background: var(--primary); border: none; color: white; border-radius: 6px; padding: 4px 10px; font-size: 0.8rem; cursor: pointer; font-family: inherit; font-weight: 600;">Aceptar</button>
          </div>
        </div>
      </div>
    `;

    this.setupListeners();
    this.scrollToSelected();
  }

  private scrollToSelected(): void {
    const hoursCol = this.container.querySelector('.hours-column') as HTMLElement;
    const minsCol = this.container.querySelector('.minutes-column') as HTMLElement;
    if (hoursCol) {
      const selectedHour = hoursCol.querySelector('.hour-opt.selected') as HTMLElement;
      if (selectedHour) {
        hoursCol.scrollTop = selectedHour.offsetTop - hoursCol.offsetTop - 40;
      }
    }
    if (minsCol) {
      const selectedMin = minsCol.querySelector('.minute-opt.selected') as HTMLElement;
      if (selectedMin) {
        minsCol.scrollTop = selectedMin.offsetTop - minsCol.offsetTop - 40;
      }
    }
  }

  private setupListeners(): void {
    const trigger = this.container.querySelector('.custom-time-trigger');
    const panel = this.container.querySelector('.custom-time-panel');
    const okBtn = this.container.querySelector('.btn-time-ok');

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        trigger.classList.add('active');
        panel?.classList.remove('hidden');
        this.scrollToSelected();
      } else {
        trigger.classList.remove('active');
        panel?.classList.add('hidden');
      }
    });

    const hoursCol = this.container.querySelector('.hours-column') as HTMLElement;
    hoursCol?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('hour-opt')) {
        hoursCol.querySelectorAll('.hour-opt').forEach(el => {
          el.classList.remove('selected');
          (el as HTMLElement).style.background = 'transparent';
          (el as HTMLElement).style.color = 'var(--text-muted)';
        });
        target.classList.add('selected');
        target.style.background = 'var(--primary)';
        target.style.color = 'white';
        this.updateTimeFromSelections();
      }
    });

    const minsCol = this.container.querySelector('.minutes-column') as HTMLElement;
    minsCol?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('minute-opt')) {
        minsCol.querySelectorAll('.minute-opt').forEach(el => {
          el.classList.remove('selected');
          (el as HTMLElement).style.background = 'transparent';
          (el as HTMLElement).style.color = 'var(--text-muted)';
        });
        target.classList.add('selected');
        target.style.background = 'var(--primary)';
        target.style.color = 'white';
        this.updateTimeFromSelections();
      }
    });

    okBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closePanel();
    });

    // Cerrar click afuera
    document.addEventListener('click', () => {
      if (this.isOpen) {
        this.closePanel();
      }
    });

    panel?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  private updateTimeFromSelections(): void {
    const selectedHourEl = this.container.querySelector('.hour-opt.selected') as HTMLElement;
    const selectedMinEl = this.container.querySelector('.minute-opt.selected') as HTMLElement;
    const hour = selectedHourEl ? selectedHourEl.getAttribute('data-hour') : '08';
    const minute = selectedMinEl ? selectedMinEl.getAttribute('data-minute') : '00';
    
    this.selectedTime = `${hour}:${minute}`;

    const hiddenInput = this.container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput) hiddenInput.value = this.selectedTime;

    const labelEl = this.container.querySelector('.selected-time-label');
    if (labelEl) labelEl.textContent = this.selectedTime;

    if (this.config.onChange) {
      this.config.onChange(this.selectedTime);
    }
  }

  private closePanel(): void {
    this.isOpen = false;
    const trigger = this.container.querySelector('.custom-time-trigger');
    const panel = this.container.querySelector('.custom-time-panel');
    trigger?.classList.remove('active');
    panel?.classList.add('hidden');
  }

  public getValue(): string {
    return this.selectedTime;
  }

  public setValue(timeVal: string): void {
    this.selectedTime = timeVal;
    const hiddenInput = this.container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput) hiddenInput.value = timeVal;

    const labelEl = this.container.querySelector('.selected-time-label');
    if (labelEl) labelEl.textContent = timeVal;

    const [hours, minutes] = timeVal.split(':');
    
    const hoursCol = this.container.querySelector('.hours-column') as HTMLElement;
    if (hoursCol) {
      hoursCol.querySelectorAll('.hour-opt').forEach(el => {
        const isSel = el.getAttribute('data-hour') === hours;
        el.classList.toggle('selected', isSel);
        (el as HTMLElement).style.background = isSel ? 'var(--primary)' : 'transparent';
        (el as HTMLElement).style.color = isSel ? 'white' : 'var(--text-muted)';
      });
    }

    const minsCol = this.container.querySelector('.minutes-column') as HTMLElement;
    if (minsCol) {
      minsCol.querySelectorAll('.minute-opt').forEach(el => {
        const isSel = el.getAttribute('data-minute') === minutes;
        el.classList.toggle('selected', isSel);
        (el as HTMLElement).style.background = isSel ? 'var(--primary)' : 'transparent';
        (el as HTMLElement).style.color = isSel ? 'white' : 'var(--text-muted)';
      });
    }

    this.scrollToSelected();
  }
}
