export type ToastType = 'success' | 'error' | 'warning' | 'info';

export class Toast {
  private static container: HTMLDivElement | null = null;

  private static getContainer(): HTMLDivElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'custom-toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  public static show(message: string, type: ToastType = 'info', duration: number = 3500): void {
    const container = this.getContainer();
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    let icon = '';
    let iconColor = '';
    let bgColor = '';
    let borderColor = '';
    
    switch (type) {
      case 'success':
        icon = '✓';
        iconColor = '#10b981';
        bgColor = 'rgba(16, 185, 129, 0.08)';
        borderColor = 'rgba(16, 185, 129, 0.2)';
        break;
      case 'error':
        icon = '✕';
        iconColor = '#ef4444';
        bgColor = 'rgba(239, 68, 68, 0.08)';
        borderColor = 'rgba(239, 68, 68, 0.2)';
        break;
      case 'warning':
        icon = '⚠';
        iconColor = '#fbbf24';
        bgColor = 'rgba(251, 191, 36, 0.08)';
        borderColor = 'rgba(251, 191, 36, 0.2)';
        break;
      case 'info':
      default:
        icon = 'ℹ';
        iconColor = '#3b82f6';
        bgColor = 'rgba(59, 130, 246, 0.08)';
        borderColor = 'rgba(59, 130, 246, 0.2)';
        break;
    }

    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      background: ${bgColor};
      border: 1px solid ${borderColor};
      border-left: 4px solid ${iconColor};
      color: white;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      pointer-events: auto;
      min-width: 300px;
      max-width: 420px;
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
    `;

    toast.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        color: ${iconColor};
        font-weight: bold;
        font-size: 0.85rem;
        flex-shrink: 0;
      ">${icon}</div>
      <div style="flex-grow: 1; line-height: 1.4;">${message}</div>
      <button type="button" class="toast-close-btn" style="
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 300;
        padding: 0 5px;
        line-height: 1;
        transition: color 0.15s;
      ">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger sliding animation
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    const removeToast = () => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 400);
    };

    // Close button event listener
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn?.addEventListener('click', () => {
      removeToast();
    });

    // Auto-remove timeout
    const timeoutId = setTimeout(removeToast, duration);

    // Pause on hover
    toast.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
    });
  }

  public static success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  public static error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  public static warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  public static info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}
