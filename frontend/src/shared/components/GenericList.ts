import { BaseComponent } from '../../core/BaseComponent';

export interface ColumnConfig<T> {
  header: string;
  render: (row: T) => string;
}

export interface ActionConfig<T> {
  icon: string; // Vector/SVG icon content
  tooltip: string;
  class?: string;
  visible?: (row: T) => boolean;
  onClick: (row: T) => void | Promise<void>;
}

export interface GenericListConfig<T> {
  moduleName?: string; // used for checking canWrite permissions
  searchPlaceholder?: string;
  searchFields: (row: T) => string; // function to return search string from row
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  onAddClick?: () => void;
  addButtonLabel?: string;
  addButtonPermission?: string; // module name for checking write permission
  loadData: () => Promise<T[]>;
}

export class GenericListComponent<T> extends BaseComponent {
  private config: GenericListConfig<T>;
  private data: T[] = [];
  private filteredData: T[] = [];

  constructor(container: HTMLElement, config: GenericListConfig<T>) {
    super(container);
    this.config = config;
  }

  render(): void {
    const {
      searchPlaceholder = 'Buscar...',
      addButtonLabel = '+ Nuevo Registro',
      addButtonPermission
    } = this.config;

    const canWrite = addButtonPermission ? this.canWrite(addButtonPermission) : true;

    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input 
              type="text" 
              class="search-generic-input" 
              placeholder="${searchPlaceholder}" 
              style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none; margin-right: 15px;"
            >
            ${(this.config.onAddClick && canWrite) ? `<button class="btn-primary btn-add-generic">${addButtonLabel}</button>` : ''}
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr class="generic-table-headers">
                <!-- Colunas dinâmicas -->
              </tr>
            </thead>
            <tbody class="generic-table-body">
              <tr><td colspan="100" style="text-align: center;">Cargando datos...</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    `;

    this.renderHeaders();
  }

  private renderHeaders(): void {
    const headerRow = this.container.querySelector('.generic-table-headers');
    if (!headerRow) return;

    let headersHtml = this.config.columns.map(c => `<th>${c.header}</th>`).join('');
    if (this.config.actions && this.config.actions.length > 0) {
      headersHtml += `<th style="text-align: center; width: 120px;">Acciones</th>`;
    }
    headerRow.innerHTML = headersHtml;
  }

  public async reload(): Promise<void> {
    const tbody = this.container.querySelector('.generic-table-body');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="100" style="text-align: center;">Cargando datos...</td></tr>`;
    }

    try {
      this.data = await this.config.loadData();
      const searchInput = this.container.querySelector('.search-generic-input') as HTMLInputElement | null;
      const searchTerm = searchInput ? searchInput.value.trim() : '';
      this.filterData(searchTerm);
    } catch (err) {
      console.error("Error al recargar listado genérico:", err);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="100" style="text-align: center; color: var(--danger);">Error de conexión al cargar datos.</td></tr>`;
      }
    }
  }

  private filterData(term: string): void {
    const query = term.toLowerCase().trim();
    if (!query) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(row => {
        const text = this.config.searchFields(row).toLowerCase();
        return text.includes(query);
      });
    }

    this.renderRows();
  }

  private renderRows(): void {
    const tbody = this.container.querySelector('.generic-table-body');
    if (!tbody) return;

    if (this.filteredData.length === 0) {
      const colCount = this.config.columns.length + (this.config.actions ? 1 : 0);
      tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align: center; color: var(--text-muted);">No se encontraron registros.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.filteredData.map((row, rowIndex) => {
      const cellsHtml = this.config.columns.map(col => `<td>${col.render(row)}</td>`).join('');
      
      let actionsHtml = '';
      if (this.config.actions && this.config.actions.length > 0) {
        const activeActions = this.config.actions.map((act, actIndex) => {
          const isVisible = act.visible ? act.visible(row) : true;
          if (!isVisible) return '';

          const btnClass = act.class || 'action-btn-item';
          return `
            <button 
              type="button" 
              class="${btnClass}" 
              data-row-index="${rowIndex}" 
              data-act-index="${actIndex}" 
              title="${act.tooltip}"
              style="
                background: transparent;
                border: none;
                cursor: pointer;
                color: var(--text-muted);
                padding: 6px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.15s, color 0.15s;
              "
              onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.color='white';"
              onmouseout="this.style.background='transparent'; this.style.color='var(--text-muted)';"
            >
              ${act.icon}
            </button>
          `;
        }).join('');
        
        actionsHtml = `
          <td>
            <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
              ${activeActions}
            </div>
          </td>
        `;
      }

      return `<tr>${cellsHtml}${actionsHtml}</tr>`;
    }).join('');

    this.setupRowListeners();
  }

  private setupRowListeners(): void {
    const tbody = this.container.querySelector('.generic-table-body');
    if (!tbody) return;

    // Remove any existing event listeners by cloning if necessary, but event delegation makes it simple:
    tbody.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentBtn = e.currentTarget as HTMLElement;
        const rowIndex = parseInt(currentBtn.getAttribute('data-row-index') || '0');
        const actIndex = parseInt(currentBtn.getAttribute('data-act-index') || '0');
        
        const row = this.filteredData[rowIndex];
        const action = this.config.actions?.[actIndex];
        
        if (row && action) {
          action.onClick(row);
        }
      });
    });
  }

  public setupListeners(): void {
    // Add generic button listener
    const addBtn = this.container.querySelector('.btn-add-generic');
    addBtn?.addEventListener('click', () => {
      if (this.config.onAddClick) {
        this.config.onAddClick();
      }
    });

    // Search input listener
    const searchInput = this.container.querySelector('.search-generic-input') as HTMLInputElement | null;
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.filterData(val);
    });
  }
}
