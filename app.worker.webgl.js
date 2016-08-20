function initWebGL(gl) {
  var vertexCode =
    'attribute vec3 coordinates;' +
    'void main(void) {' +
    ' gl_Position = vec4(coordinates, 1.0);' +
    '}';

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexCode);
  gl.compileShader(vertexShader);

  var fragmentCode =
    'void main(void) {' +
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);' +
    '}';

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentCode);
  gl.compileShader(fragmentShader);

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
  return shaderProgram
}

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
    if (springs_data && !vertex_buffer) {
      vertex_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, springs_data, gl.STATIC_DRAW);

      var coordinates = gl.getAttribLocation(shaderProgram, 'coordinates');
      gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(coordinates);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, springs_data, gl.STATIC_DRAW);
    }
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, app.canvas_width, app.canvas_height);
    gl.drawArrays(gl.LINES, 0, length / 3);
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

window.onload = function() {
  var
    canvas = new Canvas(window.innerWidth, window.innerHeight),
    pointer = new Pointer(),
    canvas_width = canvas.canvas_width,
    canvas_height = canvas.canvas_height;

  canvas.initializeCanvas('#c', canvas_width, canvas_height, 'webgl');
  shaderProgram = initWebGL(canvas.canvas_context);
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