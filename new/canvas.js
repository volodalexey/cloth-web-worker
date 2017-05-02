class Canvas {
  constructor() {
    this.init.apply(this, arguments);
  }

  init({selector, element, width, height, strContext,
    onMouseDown, onMouseUp, onMouseMove, onTouchStart, onTouchMove, onTouchEnd, onContextMenu}) {
    let __element;
    if (selector) {
      __element = document.querySelector(selector);
    }
    this.element = element || __element || null;
    this.context = this.initContext(strContext);
    this.width = width || 0;
    this.height = height || 0;
    this.addListeners({onMouseDown, onMouseUp, onMouseMove, onTouchStart, onTouchMove, onTouchEnd, onContextMenu});
  }

  initContext(strContext = '2d') {
    if (this._element) {
      return this._element.getContext(strContext);
    }
  }

  get width() {
    return this._width;
  }

  set width(width){
    this._width = width;
    if (this._element) {
      this._element.width = this._width;
    }
  }

  get height() {
    return this._height;
  }

  set height(height){
    this._height = height;
    if (this._element) {
      this._element.height = this._height;
    }
  }

  get element() {
    return this._element;
  }

  set element(element){
    this._element = element;
  }

  get context() {
    return this._context;
  }

  set context(context){
    this._context = context;
  }

  addListeners({onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, onContextMenu}) {
    onMouseDown && this.addListener('mousedown', onMouseDown);
    onMouseMove && this.addListener('mousemove', onMouseMove);
    onMouseUp && this.addListener('mouseup', onMouseUp);

    onTouchStart && this.addListener('touchstart', onTouchStart);
    onTouchMove && this.addListener('touchmove', onTouchMove);
    onTouchEnd && this.addListener('touchend', onTouchEnd);

    onTouchEnd && this.addListener('contextmenu', onContextMenu);
  }

  removeListeners({onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, onContextMenu}) {
    onMouseDown && this.removeListener('mousedown', onMouseDown);
    onMouseMove && this.removeListener('mousemove', onMouseMove);
    onMouseUp && this.removeListener('mouseup', onMouseUp);

    onTouchStart && this.removeListener('touchstart', onTouchStart);
    onTouchMove && this.removeListener('touchmove', onTouchMove);
    onTouchEnd && this.removeListener('touchend', onTouchEnd);

    onTouchEnd && this.removeListener('contextmenu', onContextMenu);
  }

  addListener(name, handler, capture = false) {
    if (this._element) {
      this._element.addEventListener(name, handler, capture);
    }
  }

  removeListener(name, handler, capture = false) {
    if (this._element) {
      this._element.removeEventListener(name, handler, capture);
    }
  }
}

