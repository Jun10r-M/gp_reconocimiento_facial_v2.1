import { BaseComponent } from '../../core/BaseComponent';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface CustomSelectConfig {
  label?: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  onChange?: (value: string | number) => void;
}

export class CustomSelect extends BaseComponent {
  private config: CustomSelectConfig;
  private selectedValue: string | number = '';
  private isOpen = false;
  private isDisabled = false;
  private searchTerm = '';
  private dropdownEl: HTMLElement | null = null;
  private triggerEl: HTMLElement | null = null;
  private _scrollHandler: (() => void) | null = null;
  private _closeHandler: ((e: MouseEvent) => void) | null = null;
  private _resizeHandler: (() => void) | null = null;

  constructor(container: HTMLElement, config: CustomSelectConfig) {
    super(container);
    this.config = config;
    this.selectedValue = config.defaultValue !== undefined ? config.defaultValue : '';
  }

  render(): void {
    const { label = '', name, placeholder = '-- Seleccionar Opción --' } = this.config;
    const selectedOption = this.config.options.find(opt => opt.value == this.selectedValue);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    const labelHtml = label ? `<label>${label}</label>` : '';
    const groupStyle = label ? '' : 'margin-bottom: 0;';

    // Destruir dropdown previo si existe (re-renderizado)
    this._destroyDropdown();

    const disabledClass = this.isDisabled ? 'disabled' : '';
    const tabIndex = this.isDisabled ? '-1' : '0';

    this.container.innerHTML = `
      <div class="custom-form-group select-container" style="${groupStyle}">
        ${labelHtml}
        <input type="hidden" name="${name}" value="${this.selectedValue}">
        <div class="custom-select-wrapper">
          <div class="custom-select-trigger ${disabledClass}" tabindex="${tabIndex}">
            <span class="selected-label">${displayLabel}</span>
          </div>
        </div>
      </div>
    `;

    // Crear dropdown fuera del contenedor, adjunto al body
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select-options custom-select-fixed';
    dropdown.style.cssText = 'position: fixed; display: none; z-index: 99999; min-width: 80px;';
    
    // Mostrar buscador solo si hay más de 5 opciones
    const showSearch = this.config.options.length > 5;
    const searchHtml = showSearch ? `
      <div style="padding: 10px; border-bottom: 1px solid var(--border); margin-bottom: 5px; flex-shrink: 0;">
        <input type="text" class="custom-select-search" placeholder="Filtrar opciones..." style="width: 100%; padding: 8px 12px; background: #06080d; border: 1px solid var(--border); border-radius: 8px; color: white; font-family: inherit; font-size: 0.85rem; outline: none; box-sizing: border-box;">
      </div>
    ` : '';

    dropdown.innerHTML = `
      ${searchHtml}
      <div class="options-list-container" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
      </div>
    `;
    document.body.appendChild(dropdown);
    this.dropdownEl = dropdown;
    this.triggerEl = this.container.querySelector('.custom-select-trigger');

    this.renderOptions();
    this.setupListeners();
  }

  private renderOptions(): void {
    const listContainer = (this.dropdownEl || this.container).querySelector('.options-list-container');
    if (!listContainer) return;

    const filtered = this.config.options.filter(opt => 
      opt.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="padding: 10px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Sin resultados</div>`;
      return;
    }

    listContainer.innerHTML = filtered.map(opt => {
      const isSelected = opt.value == this.selectedValue;
      const selectedClass = isSelected ? 'selected' : '';
      return `
        <div class="custom-select-option ${selectedClass}" data-value="${opt.value}">
          ${opt.label}
        </div>
      `;
    }).join('');

    // Registrar los click listeners de las opciones
    listContainer.querySelectorAll('.custom-select-option').forEach(el => {
      el.addEventListener('click', (e) => {
        const val = (e.currentTarget as HTMLElement).getAttribute('data-value') || '';
        this.selectValue(val);
      });
    });
  }

  private _positionDropdown(): void {
    if (!this.triggerEl || !this.dropdownEl) return;
    const rect = this.triggerEl.getBoundingClientRect();
    
    // Obtener el alto real del dropdown (que está display: flex) para un cálculo preciso
    let dropHeight = this.dropdownEl.offsetHeight || this.dropdownEl.scrollHeight || 180;
    if (dropHeight < 100) {
      dropHeight = 180; // Garantizar un alto estimado mínimo realista
    }
    
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Abrir hacia arriba si hay menos espacio abajo que el alto del dropdown,
    // y hay más espacio arriba que abajo.
    const openUpward = spaceBelow < dropHeight && spaceAbove > spaceBelow;

    this.dropdownEl.style.left = `${rect.left}px`;
    this.dropdownEl.style.width = `${rect.width}px`;

    if (openUpward) {
      this.dropdownEl.style.top = 'auto';
      this.dropdownEl.style.bottom = `${window.innerHeight - rect.top + 6}px`;
    } else {
      this.dropdownEl.style.bottom = 'auto';
      this.dropdownEl.style.top = `${rect.bottom + 6}px`;
    }
  }

  private _openDropdown(): void {
    if (this.isDisabled) return;
    if (!this.dropdownEl || !this.triggerEl) return;
    this.isOpen = true;
    this.dropdownEl.style.display = 'flex'; // Habilitar display primero para calcular su altura
    this._positionDropdown();
    this.dropdownEl.classList.add('open');
    this.triggerEl.classList.add('active');
    const search = this.dropdownEl.querySelector('.custom-select-search') as HTMLInputElement | null;
    search?.focus();
  }

  private _closeDropdown(): void {
    if (!this.dropdownEl || !this.triggerEl) return;
    this.isOpen = false;
    this.dropdownEl.style.display = 'none';
    this.dropdownEl.classList.remove('open');
    this.triggerEl.classList.remove('active');
  }

  private _destroyDropdown(): void {
    if (this.dropdownEl && this.dropdownEl.parentNode) {
      this.dropdownEl.parentNode.removeChild(this.dropdownEl);
    }
    this.dropdownEl = null;
    if (this._closeHandler) {
      document.removeEventListener('click', this._closeHandler);
      this._closeHandler = null;
    }
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler, true);
      this._scrollHandler = null;
    }
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
  }

  private setupListeners(): void {
    const trigger = this.triggerEl;
    const dropdown = this.dropdownEl;
    const search = dropdown?.querySelector('.custom-select-search') as HTMLInputElement | null;

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isDisabled) return;
      if (this.isOpen) {
        this._closeDropdown();
      } else {
        this._openDropdown();
      }
    });

    search?.addEventListener('input', (e) => {
      this.searchTerm = (e.target as HTMLInputElement).value;
      this.renderOptions();
    });

    // Cerrar al dar clic fuera
    this._closeHandler = (e: MouseEvent) => {
      if (this.isOpen && dropdown && !dropdown.contains(e.target as Node) && !trigger?.contains(e.target as Node)) {
        this._closeDropdown();
      }
    };
    document.addEventListener('click', this._closeHandler);

    // Reposicionar al hacer scroll
    this._scrollHandler = () => {
      if (this.isOpen) this._positionDropdown();
    };
    window.addEventListener('scroll', this._scrollHandler, true);

    // Reposicionar al redimensionar
    this._resizeHandler = () => {
      if (this.isOpen) this._positionDropdown();
    };
    window.addEventListener('resize', this._resizeHandler);

    dropdown?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  private selectValue(value: string | number): void {
    this.selectedValue = value;
    
    // Sincronizar input oculto para envío de formularios estándar
    const hiddenInput = this.container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput) hiddenInput.value = `${value}`;

    // Actualizar etiqueta del trigger
    const labelEl = this.container.querySelector('.selected-label');
    const selectedOption = this.config.options.find(opt => opt.value == value);
    if (labelEl && selectedOption) {
      labelEl.textContent = selectedOption.label;
    } else if (labelEl) {
      labelEl.textContent = this.config.placeholder || '-- Seleccionar Opción --';
    }

    // Cerrar panel
    this._closeDropdown();

    // Dispara evento change en el input hidden para que funcionen los listeners externos
    const hiddenInput2 = this.container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    if (hiddenInput2) {
      const ev = new Event('change', { bubbles: true });
      hiddenInput2.dispatchEvent(ev);
    }

    // Invocar callback de cambio
    if (this.config.onChange) {
      this.config.onChange(value);
    }
  }

  public getValue(): string | number {
    return this.selectedValue;
  }

  public setValue(value: string | number): void {
    this.selectValue(value);
  }

  public setOptions(options: SelectOption[]): void {
    this.config.options = options;
    this.renderOptions();
  }

  public setDisabled(disabled: boolean): void {
    this.isDisabled = disabled;
    if (this.triggerEl) {
      if (disabled) {
        this.triggerEl.classList.add('disabled');
        this.triggerEl.setAttribute('tabindex', '-1');
      } else {
        this.triggerEl.classList.remove('disabled');
        this.triggerEl.setAttribute('tabindex', '0');
      }
    }
  }

  public destroy(): void {
    this._destroyDropdown();
  }
}
