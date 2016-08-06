var Canvas = function() {
  this.canvas_width = 600;
  this.canvas_height = 600;
  this.requests_count = 0;
  this.rps_last = 0;
  this.fps_last = 0;
};

Canvas.prototype.initializeCanvas = function(canvas_selector, canvas_width, canvas_height) {
  var
    canvas_element = document.querySelector(canvas_selector),
    canvas_context = canvas_element.getContext('2d');

  canvas_element.width = canvas_width;
  canvas_element.height = canvas_height;

  this.canvas_element = canvas_element;
  this.canvas_context = canvas_context;
};

Canvas.prototype.addCanvasListeners = function(canvas_element, mouse) {
  canvas_element.addEventListener('mousedown', mouse.binded_onMouseDown, false);
  canvas_element.addEventListener('mousemove', mouse.binded_onMouseMove, false);
  canvas_element.addEventListener('mouseup', mouse.binded_onMouseUp, false);
};

Canvas.prototype.initializeRPS = function(rps_selector) {
  this.rps_element = document.querySelector(rps_selector);
};

Canvas.prototype.drawFPS = function(fps, canvas_context) {
  canvas_context.font = "30px Arial";
  canvas_context.fillText('fps: ' + fps.toFixed(1), 10, 50);
};

Canvas.prototype.clearCanvas = function(canvas_element, canvas_context) {
  canvas_context.clearRect(0, 0, canvas_element.width, canvas_element.height);
};

Canvas.prototype.startCanvasUpdate = function(mouse, cloth) {
  var
    self = this,
    closure = function() {
      self.updateCanvas(closure, mouse, cloth)
    };
  closure();
};