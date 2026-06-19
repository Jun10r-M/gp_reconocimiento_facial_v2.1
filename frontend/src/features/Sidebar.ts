import { BaseComponent } from '../core/BaseComponent';

export class Sidebar extends BaseComponent {
  private activeSection: string;
  private onNavigate: (section: string) => void;

  private icons: { [key: string]: string } = {
    folder: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    users: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    settings: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    rect: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
    resumen: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
    asistencia: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    calendar: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    planilla: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    dollar: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    empleados: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    justificaciones: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    alert: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    turnos: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    clock: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    terminales: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    cpu: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    auditoria: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    "file-text": `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    administradores: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    "user-check": `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    prediccion: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    brain: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"></path></svg>`,
    seguridad: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    lock: `<svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
  };

  private labels: { [key: string]: string } = {
    resumen: "Resumen",
    asistencia: "Asistencia",
    planilla: "Planilla",
    empleados: "Empleados",
    justificaciones: "Justificaciones",
    turnos: "Turnos",
    terminales: "Terminales",
    auditoria: "Auditoría",
    administradores: "Administradores",
    prediccion: "Predicción IA",
    seguridad: "Seguridad y RBAC"
  };

  constructor(container: HTMLElement, activeSection: string, onNavigate: (section: string) => void) {
    super(container);
    this.activeSection = activeSection;
    this.onNavigate = onNavigate;
  }

  render(): void {
    const detailsStr = localStorage.getItem('auth_menu_details');
    let menuDetails: any[] = [];
    try {
      if (detailsStr) {
        menuDetails = JSON.parse(detailsStr);
      }
    } catch (e) {
      console.error("Error parsing menu details", e);
    }

    let linksHtml = '';

    // Si no hay detalles jerárquicos (por ejemplo, perfil plano heredado), renderizamos tradicional plano
    if (menuDetails.length === 0) {
      const menusStr = localStorage.getItem('auth_menus') || '[]';
      let allowedMenus: string[] = [];
      try {
        allowedMenus = JSON.parse(menusStr);
      } catch {
        allowedMenus = [];
      }
      allowedMenus.forEach(key => {
        const icon = this.icons[key] || this.icons['folder'];
        const label = this.labels[key] || key;
        const isActive = this.activeSection === key ? 'class="active"' : '';
        linksHtml += `
          <li ${isActive} data-section="${key}">
            ${icon}
            <span class="nav-text">${label}</span>
          </li>
        `;
      });

      this.container.innerHTML = `
        <div class="sidebar-header">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
           <h5 class="sidebar-title">Kioga Computer Store</h5>
            <button id="sidebar-collapse-btn" class="sidebar-toggle-btn" title="Contraer/Expandir Menú">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          </div>
          <p class="sidebar-subtitle">RRHH v2.3</p>
        </div>
        <ul class="nav-links">
          ${linksHtml}
        </ul>
      `;
      return;
    }

    // Estructura Jerárquica Real
    const roots = menuDetails.filter(m => m.parent_id === null || m.parent_id === undefined);
    
    roots.forEach(root => {
      // Filtrar submenús que pertenecen a este nodo raíz
      const children = menuDetails.filter(m => m.parent_id === root.id);
      if (children.length === 0) return; // Omitir categorías sin submenús asignados al rol actual

      const hasActiveChild = children.some(child => child.key === this.activeSection);
      const collapsedClass = hasActiveChild ? '' : 'collapsed';

      linksHtml += `
        <div class="sidebar-group ${collapsedClass}" data-group-id="${root.id}">
          <div class="sidebar-group-header">
            <span class="sidebar-group-title">${root.label}</span>
            <span class="sidebar-group-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
          <div class="sidebar-group-content">
      `;

      children.forEach(child => {
        const iconSvg = this.icons[child.icon] || this.icons[child.key] || this.icons['rect'];
        const isActive = this.activeSection === child.key ? 'class="active"' : '';
        linksHtml += `
          <li ${isActive} data-section="${child.key}">
            ${iconSvg}
            <span class="nav-text">${child.label}</span>
          </li>
        `;
      });

      linksHtml += `
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="sidebar-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <h5 class="sidebar-title">Kioga Computer Store</h5>
          <button id="sidebar-collapse-btn" class="sidebar-toggle-btn" title="Contraer/Expandir Menú">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        </div>
        <p class="sidebar-subtitle">RRHH v2.3</p>
      </div>
      <ul class="nav-links" style="list-style: none; flex-grow: 1;">
        ${linksHtml}
      </ul>
    `;
  }

  onInit(): void {
    const bindNavClick = () => {
      const navItems = this.container.querySelectorAll('.nav-links li');
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          const section = item.getAttribute('data-section');
          if (section) {
            navItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            this.activeSection = section;
            this.onNavigate(section);
          }
        });
      });
    };

    bindNavClick();

    // Toggle groups on header click
    const groupHeaders = this.container.querySelectorAll('.sidebar-group-header');
    groupHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.sidebar-group');
        if (group) {
          group.classList.toggle('collapsed');
        }
      });
    });

    // Menú colapsable
    const collapseBtn = this.container.querySelector('#sidebar-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        this.container.classList.toggle('collapsed');
      });
    }
  }

  public setActiveSection(section: string): void {
    this.activeSection = section;
    const navItems = this.container.querySelectorAll('.nav-links li');
    navItems.forEach(el => {
      const isMatch = el.getAttribute('data-section') === section;
      el.classList.toggle('active', isMatch);
      if (isMatch) {
        // Expand the group that contains this active item
        const group = el.closest('.sidebar-group');
        if (group) {
          group.classList.remove('collapsed');
        }
      }
    });
  }
}
