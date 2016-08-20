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

function translateCoord(coord, half) {
  return (coord - half) / half
}

var shaderProgram, springs_data, vertex_buffer;
Canvas.prototype.updateCanvas = function(closure, pointer, cloth) {
  var
    app = this,
    canvas_element = app.canvas_element,
    gl = app.canvas_context,
    now = Date.now(),
    delta = now - app.fps_last;
  app.requests_count++;
  // app.clearCanvas(canvas_element, canvas_context);
  // pointer.drawPointer(canvas_context);
  cloth.updateCloth(
    delta,
    pointer.down, pointer.button, pointer.from_x, pointer.from_y,
    pointer.capture, pointer.to_x, pointer.to_y,
    pointer.mouse_influence, pointer.mouse_cut, pointer.mouse_force_factor,
    app.canvas_width, app.canvas_height
  );
  pointer.capture = false;
  // cloth.drawCloth(this, canvas_context);
  var iterator = 0;
  cloth.springs.forEach(function(spring) {
    springs_data[iterator] = translateCoord(spring.point_a.x, app.canvas_width/2);
    springs_data[iterator + 1] = -1 * translateCoord(spring.point_a.y, app.canvas_height/2);
    springs_data[iterator + 2] = 0;
    springs_data[iterator + 3] = translateCoord(spring.point_b.x, app.canvas_width/2);
    springs_data[iterator + 4] = -1 * translateCoord(spring.point_b.y, app.canvas_height/2);
    springs_data[iterator + 5] = 0;
    iterator += 6;
  });
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
  gl.drawArrays(gl.LINES, 0, (iterator + 1) / 3);

  now = Date.now();
  var delta_per_second = (now - app.fps_last)/1000;
  app.fps_last = now;
  // app.drawFPS(1/delta_per_second, canvas_context);
  requestAnimationFrame(closure);
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

  var cloth = new Cloth(canvas_width, canvas_height);
  if (!springs_data) {
    springs_data = new Float32Array(cloth.springs.length * 2 * 6)
  }

  setInterval(countRPS, 1000);
  canvas.startCanvasUpdate(pointer, cloth);
};