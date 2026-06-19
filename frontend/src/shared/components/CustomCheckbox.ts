import { BaseComponent } from '../../core/BaseComponent';

export interface CustomCheckboxConfig {
  label: string;
  name: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export class CustomCheckbox extends BaseComponent {
  private config: CustomCheckboxConfig;
  private isChecked: boolean = false;

  constructor(container: HTMLElement, config: CustomCheckboxConfig) {
    super(container);
    this.config = config;
    this.isChecked = !!config.checked;
  }

  render(): void {
    const { label, name, required = false } = this.config;
    const uniqueId = `chk_${name}_${Math.random().toString(36).substring(2, 9)}`;

    // Diseño premium de checkbox personalizado
    this.container.innerHTML = `
      <div class="custom-form-group checkbox-container" style="display: flex; align-items: center; gap: 10px; margin-bottom: 22px;">
        <div class="custom-checkbox-wrapper" style="position: relative; display: inline-flex; align-items: center; cursor: pointer;">
          <input 
            type="checkbox" 
            id="${uniqueId}" 
            name="${name}" 
            ${required ? 'required' : ''} 
            ${this.isChecked ? 'checked' : ''}
            style="position: absolute; opacity: 0; width: 0; height: 0;"
          >
          <div class="custom-checkbox-box" style="
            width: 20px; 
            height: 20px; 
            border: 1px solid var(--border); 
            border-radius: 6px; 
            background: #0f172a; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.2s ease-in-out;
          ">
            <svg class="custom-checkbox-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="
              color: white; 
              display: ${this.isChecked ? 'block' : 'none'};
            ">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <label for="${uniqueId}" style="margin-left: 10px; cursor: pointer; user-select: none; font-size: 0.9rem; color: var(--text); margin-bottom: 0; text-transform: none; letter-spacing: normal;">
            ${label}
          </label>
        </div>
      </div>
    `;

    this.setupListeners(uniqueId);
  }

  private setupListeners(id: string): void {
    const input = this.container.querySelector(`#${id}`) as HTMLInputElement | null;
    const box = this.container.querySelector('.custom-checkbox-box') as HTMLElement | null;
    const icon = this.container.querySelector('.custom-checkbox-icon') as HTMLElement | null;

    if (!input || !box || !icon) return;

    input.addEventListener('change', () => {
      this.isChecked = input.checked;
      this.updateVisualState(box, icon);

      if (this.config.onChange) {
        this.config.onChange(this.isChecked);
      }
    });

    // Escuchar el evento reset del formulario para sincronizar el estado visual
    const form = input.form;
    if (form) {
      form.addEventListener('reset', () => {
        setTimeout(() => {
          this.isChecked = input.checked;
          this.updateVisualState(box, icon);
        }, 0);
      });
    }

    // Estado visual inicial
    this.updateVisualState(box, icon);
  }

  private updateVisualState(box: HTMLElement, icon: HTMLElement): void {
    if (this.isChecked) {
      box.style.background = 'var(--primary)';
      box.style.borderColor = 'var(--primary)';
      box.style.boxShadow = '0 0 8px var(--primary-glow)';
      icon.style.display = 'block';
    } else {
      box.style.background = '#0f172a';
      box.style.borderColor = 'var(--border)';
      box.style.boxShadow = 'none';
      icon.style.display = 'none';
    }
  }

  public getValue(): boolean {
    return this.isChecked;
  }

  public setValue(val: boolean): void {
    this.isChecked = val;
    const input = this.container.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    const box = this.container.querySelector('.custom-checkbox-box') as HTMLElement | null;
    const icon = this.container.querySelector('.custom-checkbox-icon') as HTMLElement | null;

    if (input) {
      input.checked = val;
    }
    if (box && icon) {
      this.updateVisualState(box, icon);
    }
  }
}
