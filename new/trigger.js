class Trigger {
  constructor() {
    this.initTrigger.apply(this, arguments);
  }

  initTrigger() {
    this.listeners = {}
  }

  on(event, handler, context) {
    if (!Array.isArray(this.listeners[event])) {
      this.listeners[event] = [];
    }
    if (this.listeners[event].indexOf(handler) === -1) {
      this.listeners[event].push({
        handler: handler,
        context: context || this
      });
    }
    return this;
  }

  off(event, handler) {
    if (!event && !handler) {
      this.init();
      return this;
    }
    let eventListeners = this.listeners[event];
    if (!eventListeners) {
      return this;
    }

    if (!handler) {
      delete this.listeners[event];
    } else if (Array.isArray(eventListeners)) {
      let idx = eventListeners.findIndex(listener => listener.handler === handler);
      if (idx !== -1) {
        this.listeners[event].splice(idx, 1);
      }
    }
    return this;
  }

  trigger() {
    let [name, ...args] = arguments;
    let listeners = this.listeners[name];
    if (Array.isArray(listeners)) {
      for (let listener of listeners) {
        listener.handler.apply(listener.context, args);
      }
    }
    return this;
  }
}