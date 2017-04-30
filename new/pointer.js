class Pointer extends Trigger {
  constructor() {
    super();
    this.initPointer.apply(this, arguments);
  }

  initPointer() {
    this.start = null;
    this.button = null;
    this.startX = this.startY = 0;
    this.curX = this.curY = 0;
    this.prevX = this.prevY = 0;
    this.diffStartX = this.diffStartY = 0;
    this.diffPrevX = this.diffPrevY = 0;
  }

  static isMouseTouchEvent(e) {
    return e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents;
  }

  static getFirstTouch(e) {
    return e.changedTouches[0];
  }

  onTouchStart(e) {
    let touch = Pointer.getFirstTouch(e);
    this.onPointerStart(0, touch.clientX, touch.clientY);
  }

  onMouseDown(e) {
    if (!Pointer.isMouseTouchEvent(e)) {
      this.onPointerStart(e.button, e.clientX, e.clientY);
    }
  }

  onPointerStart(button, clientX, clientY) {
    this.button = button;
    if (button === 0 || button === 1) {
      this.start = true;
      this.startX = this.curX = this.prevX = clientX;
      this.startY = this.curY = this.prevY = clientY;
      this.diffStartX = this.diffPrevX = 0;
      this.diffStartY = this.diffPrevY = 0;
    }
    this.trigger(Pointer.START, this);
  }

  onTouchMove(e) {
    let touch = Pointer.getFirstTouch(e);
    this.onPointerMove(touch.clientX, touch.clientY);
  }

  onMouseMove(e) {
    if (!Pointer.isMouseTouchEvent(e)) {
      this.onPointerMove(e.clientX, e.clientY);
    }
  }

  onPointerMove(clientX, clientY) {
    if (this.start) {
      this.prevX = this.curX;
      this.prevY = this.curY;
      this.curX = clientX;
      this.curY = clientY;
      this.diffStartX = this.startX - clientX;
      this.diffStartY = this.startY - clientY;
      this.diffPrevX = clientX - this.prevX;
      this.diffPrevY = clientY - this.prevY;
    }
    this.trigger(Pointer.MOVE, this);
  }

  onTouchEnd(e) {
    let touch = Pointer.getFirstTouch(e);
    this.onPointerEnd(0, touch.clientX, touch.clientY);
  }

  onMouseUp(e) {
    if (!Pointer.isMouseTouchEvent(e)) {
      this.onPointerEnd(e.button, e.clientX, e.clientY);
    }
  }

  onPointerEnd(button, clientX, clientY) {
    if (button === 0 || button === 1) {
      this.start = false;
      this.button = button;
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