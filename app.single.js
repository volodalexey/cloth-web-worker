Canvas.prototype.updateCanvas = function(closure, mouse, cloth) {
  var
    app = this,
    canvas_element = app.canvas_element,
    canvas_context = app.canvas_context;
  app.requests_count++;
  app.clearCanvas(canvas_element, canvas_context);
  mouse.drawMouse(canvas_context);
  cloth.updateCloth(
    mouse.down, mouse.button, mouse.from_x, mouse.from_y,
    mouse.capture, mouse.to_x, mouse.to_y,
    mouse.mouse_influence, mouse.mouse_cut, mouse.mouse_force_factor,
    app.canvas_width, app.canvas_height
  );
  mouse.capture = false;
  cloth.drawCloth(canvas_context);
  var
    now = Date.now(),
    delta = (now - app.fps_last)/1000;
  app.fps_last = now;
  app.drawFPS(1/delta, canvas_context);
  requestAnimationFrame(closure);
};

window.onload = function() {
  var
    canvas = new Canvas(),
    mouse = new Mouse(),
    canvas_width = canvas.canvas_width,
    canvas_height = canvas.canvas_height;

  canvas.initializeCanvas('#c', canvas_width, canvas_height);
  canvas.addCanvasListeners(canvas.canvas_element, mouse);

  canvas.fps_last = Date.now();
  canvas.rps_last = canvas.fps_last;
  canvas.requests_count = 0;

  canvas.initializeRPS('#rps');
  var countRPS = function() {
      var
        now = Date.now(),
        elapsed = now - canvas.rps_last;
      canvas.rps_element.value = (canvas.requests_count*1000/elapsed).toFixed(1);
      canvas.requests_count = 0;
      canvas.rps_last = now;
    };

  var cloth = new Cloth(canvas_width, canvas_height);

  setInterval(countRPS, 1000);
  canvas.startCanvasUpdate(mouse, cloth);
};