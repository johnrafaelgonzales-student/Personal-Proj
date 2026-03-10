import type { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

type Listener<T extends keyof Events> = Events[T];

class ErrorEventEmitter {
  private listeners: { [K in keyof Events]?: Listener<K>[] } = {};

  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>): boolean {
    const eventListeners = this.listeners[event];
    if (!eventListeners) {
      return false;
    }
    eventListeners.forEach(listener => {
      // @ts-ignore
      listener(...args);
    });
    return true;
  }

  on<T extends keyof Events>(event: T, listener: Events[T]): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return this;
  }

  off<T extends keyof Events>(event: T, listener: Events[T]): this {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter(l => l !== listener);
    }
    return this;
  }
}

export const errorEmitter = new ErrorEventEmitter();
