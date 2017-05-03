class Pointer extends Trigger {
  constructor() {
    super();
    this.initPointer.apply(this, arguments);
  }

  initPointer() {
    this.touchButton = 0;
    this.mouseSymbolKey = 'mouse';
    this.pointers = [];
    this.prevent = true;
  }

  get start() {
    return this.pointers.length;
  }

  getPointer(id) {
    return this.pointers.find(pointer => pointer.id === id)
  }

  removePointer(id, pointer) {
    let index;
    if (id) {
      pointer = this.getPointer(id);
    }
    if (pointer) {
      index = this.pointers.indexOf(pointer);
    }
    if (index > -1) {
      this.pointers.splice(index, 1);
    }
    return pointer;
  }



  static isMouseTouchEvent(e) {
    return e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents;
  }

  onTouchStart(e) {
    this.onPointerStart(
      Array.from(e.changedTouches)
      .map(touch => ({ id: touch.identifier, button: this.touchButton, clientX: touch.clientX, clientY: touch.clientY }))
    );
    if (this.prevent) {
      e.preventDefault();
    }
  }

  onMouseDown(e) {
    if (!Pointer.isMouseTouchEvent(e)) {
      this.onPointerStart([{ id: this.mouseSymbolKey, button: e.button, clientX: e.clientX, clientY: e.clientY}]);
    }
  }

  onPointerStart(activePointers) {
    for (let activePointer of activePointers) {
      this.removePointer(activePointer.id);
      if (activePointer.button === 0 || activePointer.button === 1) {
        let pointer = { id: activePointer.id, button: activePointer.button };
        pointer.startX = pointer.curX = pointer.prevX = activePointer.clientX;
        pointer.startY = pointer.curY = pointer.prevY = activePointer.clientY;
        pointer.diffStartX = pointer.diffPrevX = 0;
        pointer.diffStartY = pointer.diffPrevY = 0;
        this.pointers.push(pointer);
      }
    }
    this.trigger(Pointer.START, this);
  }

  onTouchMove(e) {
    this.onPointerMove(
      Array.from(e.changedTouches)
        .map(touch => ({ id: touch.identifier, clientX: touch.clientX, clientY: touch.clientY }))
    );
    if (this.prevent) {
      e.preventDefault();
    }
  }

  onMouseMove(e) {
    if (!Pointer.isMouseTouchEvent(e)) {
      this.onPointerMove([{ id: this.mouseSymbolKey, clientX: e.clientX, clientY: e.clientY }]);
    }
  }

  onPointerMove(activePointers) {
    if (this.start) {
      for (let activePointer of activePointers) {
        let pointer = this.getPointer(activePointer.id);
        if (pointer) {
          pointer.prevX = pointer.curX;
          pointer.prevY = pointer.curY;
          pointer.curX = activePointer.clientX;
          pointer.curY = activePointer.clientY;
          pointer.diffStartX = pointer.startX - activePointer.clientX;
          pointer.diffStartY = pointer.startY - activePointer.clientY;
          pointer.diffPrevX = activePointer.clientX - pointer.prevX;
          pointer.diffPrevY = activePointer.clientY - pointer.prevY;
        }
      }
    }
    this.trigger(Pointer.MOVE, this);
  }

  onTouchEnd(e) {
    this.onPointerEnd(
      Array.from(e.changedTouches)
        .map(touch => ({ id: touch.identifier, button: this.touchButton, clientX: touch.clientX, clientY: touch.clientY }))
    );
    if (this.prevent) {
      e.preventDefault();
    }
  }

  onMouseUp(e) {
    if (!Pointer.isMouseTouchEvent(e)) {
      this.onPointerEnd([{ id: this.mouseSymbolKey, button: e.button, clientX: e.clientX, clientY: e.clientY }]);
    }
  }

  onPointerEnd(activePointers) {
    for (let activePointer of activePointers) {
      let pointer = this.getPointer(activePointer.id);
      if (pointer) {
        if (pointer.button === activePointer.button) {
          this.removePointer(null, pointer);
        } else {
          console.error('Not the same button for pointer', pointer);
        }
      }
    }
    this.trigger(Pointer.END, this);
  }

  static get START() {
    return 'START'
  }
  static get MOVE() {
    return 'MOVE'
  }
  static get END() {
    return 'END'
  }

  onStart(handler) {
    this.on(Pointer.START, handler);
  }

  offStart(handler) {
    this.off(Pointer.START, handler);
  }

  onMove(handler) {
    this.on(Pointer.MOVE, handler);
  }

  offMove(handler) {
    this.off(Pointer.MOVE, handler);
  }

  onEnd(handler) {
    this.on(Pointer.END, handler);
  }

  offEnd(handler) {
    this.off(Pointer.END, handler);
  }
}