export abstract class BaseComponent {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Genera el HTML y lo inserta en el contenedor principal.
   */
  abstract render(): void;

  /**
   * Ciclo de vida: Se ejecuta inmediatamente después de renderizar el HTML.
   * Ideal para adjuntar event listeners o disparar peticiones iniciales.
   */
  onInit(): void {}

  /**
   * Ciclo de vida: Se ejecuta antes de desmontar el componente.
   * Útil para liberar memoria, timers o destruir gráficos de Chart.js.
   */
  onDestroy(): void {}

  /**
   * Helper para obtener las cabeceras de autorización JWT estándar.
   */
  protected getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Helper para comprobar si se tiene un permiso de escritura específico.
   */
  protected hasScope(scope: string): boolean {
    const scopesStr = localStorage.getItem('auth_scopes') || '[]';
    try {
      const scopes: string[] = JSON.parse(scopesStr);
      return scopes.includes(scope);
    } catch {
      return false;
    }
  }

  protected canWrite(module: string): boolean {
    return this.hasScope(`${module}:create`) || this.hasScope(`${module}:update`) || this.hasScope(`${module}:delete`);
  }
}
