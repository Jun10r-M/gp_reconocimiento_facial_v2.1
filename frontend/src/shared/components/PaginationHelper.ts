import { BaseComponent } from '../../core/BaseComponent';
import { CustomSelect } from './CustomSelect';

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  pages: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}

export class PaginationHelper extends BaseComponent {
  private config: PaginationConfig;
  private limitSelect: CustomSelect | null = null;

  constructor(container: HTMLElement, config: PaginationConfig) {
    super(container);
    this.config = config;
  }

  render(): void {
    // Destruir el selector customizado previo para evitar fugas en el body
    if (this.limitSelect) {
      this.limitSelect.destroy();
      this.limitSelect = null;
    }

    const { page, limit, total, pages } = this.config;
    
    // Si no hay registros o solo hay 1 página, de todos modos renderizamos para dar control de límite
    const displayPages = pages > 0 ? pages : 1;

    // Calcular estilos en una sola cadena limpia para evitar el bug de múltiples atributos style
    const getButtonStyle = (isDisabled: boolean) => `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${isDisabled ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.04)'};
      border: 1px solid ${isDisabled ? 'rgba(255, 255, 255, 0.03)' : 'var(--border)'};
      color: ${isDisabled ? 'rgba(255, 255, 255, 0.15)' : 'white'};
      cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
      pointer-events: ${isDisabled ? 'none' : 'auto'};
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
      padding: 0;
    `.replace(/\s+/g, ' ').trim();

    const stylePrev = getButtonStyle(page <= 1);
    const styleNext = getButtonStyle(page >= displayPages);

    // Iconos vectoriales SVG modernos
    const SVG_FIRST = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>`;
    const SVG_PREV = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const SVG_NEXT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    const SVG_LAST = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`;

    this.container.innerHTML = `
      <div class="pagination-container" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; background: rgba(15, 23, 42, 0.4); border-top: 1px solid var(--border); border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; flex-wrap: wrap; gap: 15px; width: 100%; box-sizing: border-box;">
        
        <!-- Límite de página -->
        <div class="pagination-limit-group" style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-muted);">
          <span>Mostrar</span>
          <div class="pagination-limit-select-container" style="width: 80px; position: relative;"></div>
          <span>por página</span>
        </div>

        <!-- Botones de Navegación -->
        <div class="pagination-buttons" style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn-page btn-page-first" ${page <= 1 ? 'disabled' : ''} style="${stylePrev}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${SVG_FIRST}
          </button>
          <button type="button" class="btn-page btn-page-prev" ${page <= 1 ? 'disabled' : ''} style="${stylePrev}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${SVG_PREV}
          </button>
          
          <span style="font-size: 0.85rem; color: var(--text-muted); margin: 0 8px; font-family: inherit; user-select: none;">
            Página <strong style="color: white; font-weight: 600;">${page}</strong> de <strong style="color: white; font-weight: 600;">${displayPages}</strong>
          </span>

          <button type="button" class="btn-page btn-page-next" ${page >= displayPages ? 'disabled' : ''} style="${styleNext}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${SVG_NEXT}
          </button>
          <button type="button" class="btn-page btn-page-last" ${page >= displayPages ? 'disabled' : ''} style="${styleNext}"
            onmouseover="if(!this.disabled) { this.style.borderColor='var(--primary)'; this.style.background='rgba(96, 165, 250, 0.1)'; this.style.color='var(--primary)'; this.style.transform='scale(1.05)'; }" 
            onmouseout="if(!this.disabled) { this.style.borderColor='var(--border)'; this.style.background='rgba(255, 255, 255, 0.04)'; this.style.color='white'; this.style.transform='none'; }">
            ${SVG_LAST}
          </button>
        </div>

        <!-- Indicador de total -->
        <div class="pagination-info" style="font-size: 0.85rem; color: var(--text-muted); font-family: inherit; user-select: none;">
          Total: <strong style="color: white; font-weight: 600;">${total}</strong> registros
        </div>

      </div>
    `;

    // Renderizar CustomSelect para el límite de página
    const limitContainer = this.container.querySelector('.pagination-limit-select-container') as HTMLElement | null;
    if (limitContainer) {
      this.limitSelect = new CustomSelect(limitContainer, {
        name: 'pagination_limit',
        options: [
          { value: 10, label: '10' },
          { value: 25, label: '25' },
          { value: 50, label: '50' }
        ],
        defaultValue: limit,
        placeholder: `${limit}`,
        onChange: (value) => {
          this.config.onChangeLimit(Number(value));
        }
      });
      this.limitSelect.render();
    }

    this.setupListeners();
  }

  private setupListeners(): void {
    const btnFirst = this.container.querySelector('.btn-page-first') as HTMLButtonElement | null;
    btnFirst?.addEventListener('click', () => {
      if (this.config.page > 1) {
        this.config.onChangePage(1);
      }
    });

    const btnPrev = this.container.querySelector('.btn-page-prev') as HTMLButtonElement | null;
    btnPrev?.addEventListener('click', () => {
      if (this.config.page > 1) {
        this.config.onChangePage(this.config.page - 1);
      }
    });

    const btnNext = this.container.querySelector('.btn-page-next') as HTMLButtonElement | null;
    btnNext?.addEventListener('click', () => {
      if (this.config.page < this.config.pages) {
        this.config.onChangePage(this.config.page + 1);
      }
    });

    const btnLast = this.container.querySelector('.btn-page-last') as HTMLButtonElement | null;
    btnLast?.addEventListener('click', () => {
      const displayPages = this.config.pages > 0 ? this.config.pages : 1;
      if (this.config.page < displayPages) {
        this.config.onChangePage(displayPages);
      }
    });
  }
}
