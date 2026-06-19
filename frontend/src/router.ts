import { BaseComponent } from './core/BaseComponent';
import { ResumenComponent } from './features/ResumenComponent';
import { EmployeesComponent } from './features/EmployeesComponent';
import { AttendanceComponent } from './features/AttendanceComponent';
import { PayrollComponent } from './features/PayrollComponent';
import { JustificationsComponent } from './features/JustificationsComponent';
import { ShiftsComponent } from './features/ShiftsComponent';
import { TerminalesComponent } from './features/TerminalesComponent';
import { AuditoriaComponent } from './features/AuditoriaComponent';
import { AdministratorsComponent } from './features/AdministratorsComponent';
import { PredictionComponent } from './features/PredictionComponent';
import { SecurityComponent } from './features/SecurityComponent';

export class Router {
  private container: HTMLElement;
  private currentComponent: BaseComponent | null = null;
  private routes: { [key: string]: new (container: HTMLElement) => BaseComponent } = {
    resumen: ResumenComponent,
    empleados: EmployeesComponent,
    asistencia: AttendanceComponent,
    planilla: PayrollComponent,
    justificaciones: JustificationsComponent,
    turnos: ShiftsComponent,
    terminales: TerminalesComponent,
    auditoria: AuditoriaComponent,
    administradores: AdministratorsComponent,
    prediccion: PredictionComponent,
    seguridad: SecurityComponent
  };

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public navigate(section: string, triggerPushState: boolean = true): void {
    const menusStr = localStorage.getItem('auth_menus') || '[]';
    let allowedMenus: string[] = [];
    try {
      allowedMenus = JSON.parse(menusStr);
    } catch {
      allowedMenus = [];
    }

    // Redirección si la sección no está permitida
    if (!allowedMenus.includes(section)) {
      section = allowedMenus.length > 0 ? allowedMenus[0] : 'resumen';
    }

    // Actualizar historial del navegador con Clean URL
    const targetPath = `/admin/${section}`;
    if (window.location.pathname !== targetPath) {
      if (triggerPushState) {
        history.pushState(null, '', targetPath);
      } else {
        // En carga inicial, normalizar URL usando replaceState para no romper el botón "Atrás"
        history.replaceState(null, '', targetPath);
      }
    }

    // Ejecutar ciclo de vida onDestroy
    if (this.currentComponent) {
      this.currentComponent.onDestroy();
    }

    this.container.innerHTML = '';

    // Cambiar título de sección
    const titleEl = document.getElementById('section-title');
    if (titleEl) {
      titleEl.innerText = this.getSectionLabel(section);
    }

    const ComponentClass = this.routes[section];
    if (ComponentClass) {
      this.currentComponent = new ComponentClass(this.container);
      this.currentComponent.render();
      this.currentComponent.onInit();
    }
  }

  /**
   * Lee la sección desde la URL actual de la barra de direcciones.
   * @param defaultSection Sección por defecto en caso de no encontrarse una válida en la ruta.
   */
  public getSectionFromUrl(defaultSection: string): string {
    const pathname = window.location.pathname;
    const parts = pathname.split('/').filter(p => p.length > 0);
    // parts = ['admin', 'empleados']
    if (parts.length >= 2 && parts[0] === 'admin') {
      const section = parts[1];
      if (this.routes[section]) {
        return section;
      }
    }
    return defaultSection;
  }

  private getSectionLabel(key: string): string {
    const labels: { [key: string]: string } = {
      resumen: "Resumen de Estadísticas",
      asistencia: "Asistencia General",
      planilla: "Motor de Planillas",
      empleados: "Fichas de Personal",
      justificaciones: "Licencias y Justificaciones",
      turnos: "Asignación de Turnos",
      terminales: "Monitoreo de Terminales",
      auditoria: "Bitácora de Auditoría",
      administradores: "Administradores del Sistema",
      prediccion: "Planificación Presupuestaria IA",
      seguridad: "Seguridad y Control de Acceso (RBAC)"
    };
    return labels[key] || "Panel General";
  }
}
