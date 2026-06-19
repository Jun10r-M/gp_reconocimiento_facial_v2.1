export class ConfirmDialog {
  private static instance: ConfirmDialog | null = null;
  private container: HTMLElement;

  private constructor() {
    this.container = document.createElement('div');
    this.container.id = 'custom-confirm-dialog-container';
    document.body.appendChild(this.container);
  }

  /**
   * Muestra un cuadro de confirmación personalizado.
   * @param message Mensaje descriptivo a mostrar.
   * @param title Título opcional de la cabecera.
   * @returns Promesa que resuelve a true si el usuario presiona "Confirmar" y false si presiona "Cancelar".
   */
  public static ask(message: string, title: string = 'Confirmar Acción'): Promise<boolean> {
    if (!this.instance) {
      this.instance = new ConfirmDialog();
    }
    return this.instance.show(message, title);
  }

  private show(message: string, title: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Inyectar el HTML con el estilo del sistema de modales
      this.container.innerHTML = `
        <div class="modal" style="z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);">
          <div class="modal-content" style="max-width: 450px; width: 100%; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); padding: 25px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h2 style="font-size: 1.25rem; font-weight: 600; color: #fff; margin: 0;">${title}</h2>
            </div>
            <div class="modal-body" style="margin-bottom: 24px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; text-align: left;">
              ${message}
            </div>
            <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
              <button id="confirm-cancel-btn" type="button" class="btn-primary" style="padding: 10px 20px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text); font-family: inherit; font-size: 0.9rem; cursor: pointer; transition: var(--transition); width: auto;">
                Cancelar
              </button>
              <button id="confirm-ok-btn" type="button" class="btn-primary" style="padding: 10px 20px; border-radius: 10px; border: none; background: var(--danger); color: white; font-family: inherit; font-size: 0.9rem; cursor: pointer; transition: var(--transition); width: auto;">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      `;

      const cancelBtn = this.container.querySelector('#confirm-cancel-btn') as HTMLButtonElement;
      const okBtn = this.container.querySelector('#confirm-ok-btn') as HTMLButtonElement;

      // Efectos hover por JS para evitar CSS inline redundante
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseenter', () => {
          cancelBtn.style.background = 'rgba(255, 255, 255, 0.05)';
          cancelBtn.style.borderColor = 'var(--border-hover)';
        });
        cancelBtn.addEventListener('mouseleave', () => {
          cancelBtn.style.background = 'transparent';
          cancelBtn.style.borderColor = 'var(--border)';
        });
      }

      if (okBtn) {
        okBtn.addEventListener('mouseenter', () => {
          okBtn.style.background = 'var(--danger-hover)';
        });
        okBtn.addEventListener('mouseleave', () => {
          okBtn.style.background = 'var(--danger)';
        });
      }

      const cleanUp = () => {
        this.container.innerHTML = '';
        document.removeEventListener('keydown', handleKeyDown);
      };

      cancelBtn?.addEventListener('click', () => {
        cleanUp();
        resolve(false);
      });

      okBtn?.addEventListener('click', () => {
        cleanUp();
        resolve(true);
      });

      // Atajo de teclado: Escape y Enter
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cleanUp();
          resolve(false);
        } else if (e.key === 'Enter') {
          cleanUp();
          resolve(true);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
    });
  }
}
