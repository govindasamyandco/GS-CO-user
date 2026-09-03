// Modern Toast & Notification Manager for GS-CO-user

class ToastManager {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(toast) {
    this.listeners.forEach((fn) => fn(toast));
  }

  success(message, title = 'Success') {
    this.notify({ id: Date.now() + Math.random(), type: 'success', title, message, duration: 4000 });
  }

  error(message, title = 'Attention') {
    this.notify({ id: Date.now() + Math.random(), type: 'error', title, message, duration: 5000 });
  }

  warning(message, title = 'Notice') {
    this.notify({ id: Date.now() + Math.random(), type: 'warning', title, message, duration: 4500 });
  }

  info(message, title = 'Information') {
    this.notify({ id: Date.now() + Math.random(), type: 'info', title, message, duration: 4000 });
  }
}

export const toast = new ToastManager();
