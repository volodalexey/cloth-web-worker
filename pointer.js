var Pointer = function() {
  this.down = false;
  this.capture = false;
  this.mouse_influence = 50;
  this.mouse_cut = 6;
  this.mouse_force_factor = 0.01;
  this.from_x = 0; this.from_y = 0;
  this.to_x = 0; this.to_x = 0;
  this.start_x = 0; this.start_y = 0;
  this.binded_onMouseDown = this.onMouseDown.bind(this);
  this.binded_onTouchStart = this.onTouchStart.bind(this);

  this.binded_onMouseMove = this.onMouseMove.bind(this);
  this.binded_onTouchMove = this.onTouchMove.bind(this);

  this.binded_onMouseUp = this.onMouseUp.bind(this);
  this.binded_onTouchEnd = this.onTouchEnd.bind(this);
};

Pointer.prototype.onTouchStart = function(e) {
  var
    pointer = this,
    touch = e.changedTouches[0];
  pointer.onPointerDown(0, touch.clientX, touch.clientY);
};

Pointer.prototype.onMouseDown = function(e) {
  // prevent fallback/compatibility events for touch inputs
  if (!(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) {
    var
      pointer = this;
    pointer.onPointerDown(e.button, e.clientX, e.clientY);
  }
};

Pointer.prototype.onPointerDown = function(button, clientX, clientY) {
  var pointer = this;
  pointer.button = button;
  if (button === 0) {
    pointer.from_x = pointer.to_x = pointer.start_x = clientX;
    pointer.from_y = pointer.to_y = pointer.start_y = clientY;
  }
  if (button === 0 || button === 1) {
    pointer.down = true
  }
  pointer.capture = true;
  pointer.syncPointer();
};

Pointer.prototype.onTouchMove = function(e) {
  var
    pointer = this,
    touch = e.changedTouches[0];
  pointer.onPointerMove(touch.clientX, touch.clientY);
};

Pointer.prototype.onMouseMove = function(e) {
  if (!(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) {
    var
      pointer = this;
    pointer.onPointerMove(e.clientX, e.clientY);
  }
};

Pointer.prototype.onPointerMove = function(clientX, clientY) {
  var pointer = this;
  if (pointer.down) {
    pointer.to_x = clientX;
    pointer.to_y = clientY;
    pointer.syncPointer();
  }
};

Pointer.prototype.onTouchEnd = function(e) {
  var
    pointer = this,
    touch = e.changedTouches[0];
  pointer.onPointerUp(0);
};

Pointer.prototype.onMouseUp = function(e) {
  if (!(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) {
    var
      pointer = this;
    pointer.onPointerUp(e.button);
  }
};

Pointer.prototype.onPointerUp = function(button) {
  var pointer = this;
  if (button === 0 || button === 1) {
    pointer.down = false
  }
  pointer.syncPointer();
};

Pointer.prototype.drawPointer = function(canvas_context) {
  var pointer = this;
  if (pointer.down && pointer.button === 0) {
    canvas_context.strokeStyle = 'rgb(0,255,0)';
    canvas_context.beginPath();
    var x = pointer.start_x, x_ = pointer.to_x,
      y = pointer.start_y, y_ = pointer.to_y,
      width = Math.abs(x-x_), height = Math.abs(y-y_);
    canvas_context.rect(Math.min(x, x_), Math.min(y, y_), width, height);
    canvas_context.moveTo(x, y);
    canvas_context.lineTo(x_, y_);
    canvas_context.fillText('x: ' + x, 10, 100);
    canvas_context.fillText('y: ' + y, 10, 125);
    canvas_context.fillText('width: ' + width, 10, 150);
    canvas_context.fillText('height: ' + height, 10, 175);
    canvas_context.stroke();
  }
};

Pointer.prototype.syncPointer = function() {
  if (window.worker) {
    var pointer = this;
    worker.postMessage(['sync Pointer',
      pointer.down, pointer.button, pointer.from_x, pointer.from_y,
      pointer.capture, pointer.to_x, pointer.to_y,
      pointer.mouse_influence, pointer.mouse_cut, pointer.mouse_force_factor]);
  }
};