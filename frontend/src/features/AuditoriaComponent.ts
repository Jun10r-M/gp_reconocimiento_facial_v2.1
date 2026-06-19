import { BaseComponent } from '../core/BaseComponent';
import { AuditLog } from '../types';
import { PaginationHelper } from '../shared/components/PaginationHelper';

export class AuditoriaComponent extends BaseComponent {
  private logs: AuditLog[] = [];

  // Paginación
  private currentPage = 1;
  private pageSize = 10;
  private totalRecords = 0;
  private totalPages = 0;
  private currentSearch = '';

  render(): void {
    this.container.innerHTML = `
      <section class="dashboard-section animate-fade-in">
        <div class="filter-bar">
          <div class="filter-group" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <input type="text" id="audit-search" placeholder="Buscar logs por acción, usuario o detalles..." class="search-generic-input" style="flex-grow: 1; max-width: 400px; background: #0f172a; border: 1px solid var(--border); color: white; padding: 10px; border-radius: 10px; font-family: inherit; font-size: 0.9rem; outline: none;">
          </div>
        </div>

        <div class="table-card" style="overflow-x: auto; margin-top: 20px;">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Administrador</th>
                <th>Operación / Acción</th>
                <th>Detalles del Evento</th>
                <th>Fecha / Hora</th>
              </tr>
            </thead>
            <tbody id="audit-table-body">
              <tr><td colspan="5" style="text-align: center;">Cargando bitácora de auditoría...</td></tr>
            </tbody>
          </table>
          <div id="audit-pagination-container"></div>
        </div>
      </section>
    `;
  }

  async onInit(): Promise<void> {
    await this.loadLogs(this.currentSearch);
    this.setupEventListeners();
  }

  private async loadLogs(search: string = ''): Promise<void> {
    try {
      this.currentSearch = search;
      const res = await fetch(`/system/audit-logs?page=${this.currentPage}&limit=${this.pageSize}&search=${encodeURIComponent(search)}`, { headers: this.getAuthHeaders() });
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      this.logs = data.items || [];
      this.totalRecords = data.total || 0;
      this.totalPages = data.pages || 0;

      this.renderTable();
      this.renderPagination();
    } catch (err) {
      console.error("Error al cargar logs de auditoría:", err);
      const tbody = document.getElementById('audit-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger);">Error al cargar logs de auditoría.</td></tr>`;
    }
  }

  private renderPagination(): void {
    const pagContainer = document.getElementById('audit-pagination-container');
    if (!pagContainer) return;

    const pag = new PaginationHelper(pagContainer, {
      page: this.currentPage,
      limit: this.pageSize,
      total: this.totalRecords,
      pages: this.totalPages,
      onChangePage: async (page) => {
        this.currentPage = page;
        await this.loadLogs(this.currentSearch);
      },
      onChangeLimit: async (limit) => {
        this.pageSize = limit;
        this.currentPage = 1;
        await this.loadLogs(this.currentSearch);
      }
    });
    pag.render();
  }

  private renderTable(): void {
    const tbody = document.getElementById('audit-table-body');
    if (!tbody) return;

    if (this.logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No se encontraron logs de auditoría.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.logs.map(log => {
      let badgeStyle = 'background: rgba(255, 255, 255, 0.05); color: #fff;';
      const action = log.action.toUpperCase();

      if (action.includes('ELIMINAR')) {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(239, 68, 68, 0.1); color: #f87171;';
      } else if (action.includes('REGISTRAR') || action.includes('CREAR') || action.includes('ENROLAR')) {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf;';
      } else if (action.includes('CALCULAR') || action.includes('EXPORTAR')) {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(79, 70, 229, 0.1); color: #818cf8;';
      } else if (action.includes('PROVISIÓN') || action.includes('RECUPERAR')) {
        badgeStyle = 'border-radius: 12px; padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: #fbbf24;';
      }

      return `
        <tr>
          <td><strong>#${log.id}</strong></td>
          <td>${log.username}</td>
          <td><span class="badge" style="${badgeStyle}">${log.action}</span></td>
          <td style="max-width: 400px; white-space: normal; line-height: 1.4;">${log.description || '-'}</td>
          <td>${log.timestamp || log.created_at || '-'}</td>
        </tr>
      `;
    }).join('');
  }

  private setupEventListeners(): void {
    const searchInput = document.getElementById('audit-search');
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.currentPage = 1;
      this.loadLogs(val);
    });
  }
}
