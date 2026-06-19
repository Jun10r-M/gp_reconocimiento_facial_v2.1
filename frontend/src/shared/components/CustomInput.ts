import { BaseComponent } from '../../core/BaseComponent';

export interface CustomInputConfig {
  label?: string;
  name: string;
  type?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  minlength?: number;
  autocomplete?: string;
}

export class CustomInput extends BaseComponent {
  private config: CustomInputConfig;

  constructor(container: HTMLElement, config: CustomInputConfig) {
    super(container);
    this.config = config;
  }

  render(): void {
    const { 
      label = '', 
      name, 
      type = 'text', 
      required = false, 
      value = '', 
      placeholder = '', 
      minlength, 
      autocomplete = '' 
    } = this.config;
    
    const labelHtml = label ? `<label>${label}</label>` : '';
    const groupStyle = label ? '' : 'margin-bottom: 0;';

    let inputHtml = '';
    if (type === 'textarea') {
      inputHtml = `
        <textarea 
          name="${name}" 
          ${required ? 'required' : ''} 
          placeholder="${placeholder}"
          ${minlength ? `minlength="${minlength}"` : ''}
          style="width: 100%; min-height: 100px;"
          class="custom-input-field"
        >${value}</textarea>
      `;
    } else {
      inputHtml = `
        <input 
          type="${type}" 
          name="${name}" 
          ${required ? 'required' : ''} 
          value="${value}" 
          placeholder="${placeholder}"
          ${minlength ? `minlength="${minlength}"` : ''}
          ${autocomplete ? `autocomplete="${autocomplete}"` : ''}
          style="width: 100%;"
          class="custom-input-field"
        >
      `;
    }

    this.container.innerHTML = `
      <div class="custom-form-group" style="${groupStyle}">
        ${labelHtml}
        ${inputHtml}
      </div>
    `;
  }

  public getValue(): string {
    const el = this.container.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
    return el ? el.value.trim() : '';
  }

  public setValue(val: string): void {
    const el = this.container.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) el.value = val;
  }

  public setDisabled(disabled: boolean): void {
    const el = this.container.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) {
      if (disabled) {
        el.setAttribute('disabled', 'true');
      } else {
        el.removeAttribute('disabled');
      }
    }
  }

  public setRequired(required: boolean): void {
    const el = this.container.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) {
      if (required) {
        el.setAttribute('required', 'true');
      } else {
        el.removeAttribute('required');
      }
    }
  }
}

