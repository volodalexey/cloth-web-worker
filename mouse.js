var Mouse = function() {
  this.down = false;
  this.capture = false;
  this.mouse_influence = 25;
  this.mouse_cut = 6;
  this.mouse_force_factor = 0.1;
  this.from_x = 0; this.from_y = 0;
  this.to_x = 0; this.to_x = 0;
  this.start_x = 0; this.start_y = 0;
  this.binded_onMouseDown = this.onMouseDown.bind(this);
  this.binded_onMouseMove = this.onMouseMove.bind(this);
  this.binded_onMouseUp = this.onMouseUp.bind(this);
};

Mouse.prototype.onMouseDown = function(e) {
  var mouse = this;
  mouse.button = e.button;
  if (e.button === 0) {
    mouse.from_x = mouse.to_x = mouse.start_x = e.clientX;
    mouse.from_y = mouse.to_y = mouse.start_y = e.clientY;
  }
  if (e.button === 0 || e.button === 1) {
    mouse.down = true
  }
  mouse.capture = true;
  mouse.syncMouse();
};

Mouse.prototype.onMouseMove = function(e) {
  var mouse = this;
  if (mouse.down) {
    mouse.to_x = e.clientX;
    mouse.to_y = e.clientY;
    mouse.syncMouse();
  }
};

Mouse.prototype.onMouseUp = function(e) {
  var mouse = this;
  if (e.button === 0 || e.button === 1) {
    mouse.down = false
  }
  mouse.syncMouse();
};

Mouse.prototype.drawMouse = function(canvas_context) {
  var mouse = this;
  if (mouse.down && mouse.button === 0) {
    canvas_context.strokeStyle = 'rgb(0,255,0)';
    canvas_context.beginPath();
    var x = mouse.start_x, x_ = mouse.to_x,
      y = mouse.start_y, y_ = mouse.to_y,
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

Mouse.prototype.syncMouse = function() {
  if (window.worker) {
    var mouse = this;
    worker.postMessage(['sync Mouse',
      mouse.down, mouse.button, mouse.from_x, mouse.from_y,
      mouse.capture, mouse.to_x, mouse.to_y,
      mouse.mouse_influence, mouse.mouse_cut, mouse.mouse_force_factor]);
  }
};