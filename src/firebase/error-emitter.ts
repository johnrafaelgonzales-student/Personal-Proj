/**
 * @fileoverview This file defines a simple, global event emitter for handling custom application errors.
 * It's specifically used to broadcast `FirestorePermissionError` events, allowing a centralized
 * component (like `FirebaseErrorListener`) to catch and display them.
 */
import type { FirestorePermissionError } from './errors';

// Defines the types of events and the data they carry.
type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

type Listener<T extends keyof Events> = Events[T];

/**
 * A simple event emitter class.
 */
class ErrorEventEmitter {
  private listeners: { [K in keyof Events]?: Listener<K>[] } = {};

  /**
   * Emits an event to all registered listeners.
   */
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

  /**
   * Registers a listener for a specific event.
   */
  on<T extends keyof Events>(event: T, listener: Events[T]): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
    return this;
  }

  /**
   * Unregisters a listener for a specific event.
   */
  off<T extends keyof Events>(event: T, listener: Events[T]): this {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter(l => l !== listener);
    }
    return this;
  }
}

// A singleton instance of the event emitter, exported for global use.
export const errorEmitter = new ErrorEventEmitter();
