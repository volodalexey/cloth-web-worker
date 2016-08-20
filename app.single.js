Canvas.prototype.updateCanvas = function(closure, pointer, cloth) {
  var
    app = this,
    canvas_element = app.canvas_element,
    canvas_context = app.canvas_context,
    now = Date.now(),
    delta = now - app.fps_last;
  app.requests_count++;
  app.clearCanvas(canvas_element, canvas_context);
  pointer.drawPointer(canvas_context);
  cloth.updateCloth(
    delta,
    pointer.down, pointer.button, pointer.from_x, pointer.from_y,
    pointer.capture, pointer.to_x, pointer.to_y,
    pointer.mouse_influence, pointer.mouse_cut, pointer.mouse_force_factor,
    app.canvas_width, app.canvas_height
  );
  pointer.capture = false;
  cloth.drawCloth(canvas_context);
  now = Date.now();
  var delta_per_second = (now - app.fps_last)/1000;
  app.fps_last = now;
  app.drawFPS(1/delta_per_second, canvas_context);
  requestAnimationFrame(closure);
};

window.onload = function() {
  var
    canvas = new Canvas(),
    pointer = new Pointer(),
    canvas_width = canvas.canvas_width,
    canvas_height = canvas.canvas_height;

  canvas.initializeCanvas('#c', canvas_width, canvas_height);
  canvas.addCanvasListeners(canvas.canvas_element, pointer);

  canvas.fps_last = Date.now();
  canvas.rps_last = canvas.fps_last;
  canvas.requests_count = 0;

  canvas.initializeRPS('#rps');
  var countRPS = function() {
      var
        now = Date.now(),
        elapsed = now - canvas.rps_last;
      canvas.rps_element.value = 'rps: ' + (canvas.requests_count*1000/elapsed).toFixed(1);
      canvas.requests_count = 0;
      canvas.rps_last = now;
    };

  var cloth = new Cloth(canvas_width, canvas_height);

  setInterval(countRPS, 1000);
  canvas.startCanvasUpdate(pointer, cloth);
};