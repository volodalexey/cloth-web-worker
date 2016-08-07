Canvas.prototype.updateCanvas = function(closure, pointer) {
  var
    iterator,
    len = constrains_data.length,
    app = this,
    canvas_element = app.canvas_element,
    canvas_context = app.canvas_context;
  app.requests_count++;
  app.clearCanvas(canvas_element, canvas_context);
  pointer.drawPointer(canvas_context);
  pointer.capture = false;
  for (iterator = 0; iterator < len; iterator += 5) {
    if (constrains_data[iterator] === 2) {
      break; // end of drawing
    }
    canvas_context.beginPath();
    if (constrains_data[iterator]) {
      canvas_context.strokeStyle = 'rgb(0,0,255)';
    } else {
      canvas_context.strokeStyle = 'rgb(255,0,0)'
    }
    canvas_context.moveTo(constrains_data[iterator + 1], constrains_data[iterator + 2]);
    canvas_context.lineTo(constrains_data[iterator + 3], constrains_data[iterator + 4]);
    canvas_context.stroke();
  }
  var
    now = Date.now(),
    delta = (now - app.fps_last)/1000;
  app.fps_last = now;
  app.drawFPS(1/delta, canvas_context);
  worker.postMessage(['request sync Points']);
  requestAnimationFrame(closure);
};

var worker = new Worker('worker.js'),
  constrains_data = [];

worker.onmessage = function(e) {
  var
    data = e.data,
    type = data[0];
  switch (type) {
    case 'sync Points':
      constrains_data = data[1];
      break;
  }
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
      canvas.rps_element.value = (canvas.requests_count*1000/elapsed).toFixed(1);
      canvas.requests_count = 0;
      canvas.rps_last = now;
    };

  worker.postMessage(['new Cloth', canvas_width, canvas_height]);
  pointer.syncPointer();

  setInterval(countRPS, 1000);
  worker.postMessage(['startClothUpdate']);
  canvas.startCanvasUpdate(pointer);
};