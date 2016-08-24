Canvas.prototype.updateCanvas = function(closure, pointer) {
  var
    app = this,
    canvas_element = app.canvas_element,
    gl = app.canvas_context;
  app.requests_count++;
  // app.clearCanvas(canvas_element, canvas_context);
  // pointer.drawPointer(canvas_context);
  pointer.capture = false;
  if (new_frame) {
    drawFrame(gl, app, length);
    new_frame = false;
  }
  var
    now = Date.now(),
    delta = (now - app.fps_last)/1000;
  app.fps_last = now;
  // app.drawFPS(1/delta, canvas_context);
  worker.postMessage(['request sync Springs webgl']);
  requestAnimationFrame(closure);
};

var worker = new Worker('worker.js'), shaderProgram,
  springs_data = new Float32Array(0), new_frame = false,
  vertex_buffer, length;

worker.onmessage = function(e) {
  var
    data = e.data,
    type = data[0];
  switch (type) {
    case 'sync Springs':
      springs_data = data[1];
      length = data[2];
      new_frame = true;
      break;
  }
};

Promise.all([
  new Promise(resolve => {
    window.addEventListener('load', resolve, false);
  }),
  send('GET', 'cloth.vert'),
  send('GET', 'cloth.frag')
])
  .then(results => {
    var
      canvas = new Canvas(window.innerWidth, window.innerHeight),
      pointer = new Pointer(),
      canvas_width = canvas.canvas_width,
      canvas_height = canvas.canvas_height;

    canvas.initializeCanvas('#c', canvas_width, canvas_height, 'webgl');
    shaderProgram = initWebGL(canvas.canvas_context, results[1], results[2]);
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
  })
  .catch(e => console.error(e));