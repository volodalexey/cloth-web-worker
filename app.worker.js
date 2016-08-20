Canvas.prototype.updateCanvas = function(closure, pointer) {
  var
    iterator,
    len = springs_data.length,
    app = this,
    canvas_element = app.canvas_element,
    canvas_context = app.canvas_context;
  app.requests_count++;
  app.clearCanvas(canvas_element, canvas_context);
  pointer.drawPointer(canvas_context);
  pointer.capture = false;
  if (new_frame) {
    for (iterator = 0; iterator < len; iterator += 6) {
      if (springs_data[iterator] === 2) {
        break; // end of drawing
      }
      this.drawSpring(
        canvas_context,
        springs_data[iterator], springs_data[iterator + 1], springs_data[iterator + 2],
        springs_data[iterator + 3], springs_data[iterator + 4], springs_data[iterator + 5]
      );
    }
    new_frame = false;
  }
  var
    now = Date.now(),
    delta = (now - app.fps_last)/1000;
  app.fps_last = now;
  app.drawFPS(1/delta, canvas_context);
  worker.postMessage(['request sync Springs']);
  requestAnimationFrame(closure);
};

var worker = new Worker('worker.js'),
  springs_data = [], new_frame = false;

worker.onmessage = function(e) {
  var
    data = e.data,
    type = data[0];
  switch (type) {
    case 'sync Springs':
      springs_data = data[1];
      new_frame = true;
      break;
  }
};

window.onload = function() {
  var
    canvas = new Canvas(window.innerWidth, window.innerHeight),
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

  worker.postMessage(['new Cloth', canvas_width, canvas_height]);
  pointer.syncPointer();

  setInterval(countRPS, 1000);
  worker.postMessage(['startClothUpdate']);
  canvas.startCanvasUpdate(pointer);
};