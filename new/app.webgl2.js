Promise.all([
  new Promise(resolve => {
    window.addEventListener('load', resolve, false);
  }),
  Load.getText('cloth.webgl.vert'),
  Load.getText('cloth.webgl.frag')
])
  .then(results => {
    let
      pointer = new Pointer(),
      canvas = new Canvas({
        selector: 'canvas', width: window.innerWidth, height: window.innerHeight, strContext: 'webgl2',
        onMouseDown: (e) => pointer.onMouseDown(e), onMouseMove: (e) => pointer.onMouseMove(e), onMouseUp: (e) => pointer.onMouseUp(e),
        onTouchStart: (e) => pointer.onTouchStart(e), onTouchMove: (e) => pointer.onTouchMove(e), onTouchEnd: (e) => pointer.onTouchEnd(e),
        onContextMenu: (e) => e.preventDefault()
      }),
      shaderProgram = WebGL.initWebGL(canvas.context, results[1], results[2]);

    WebGL.linkAndUseProgramm(canvas.context, shaderProgram);
    let cloth = new Cloth({
      canvasWidth: canvas.width,
      clothX: 54, clothY: 28, spacing: 8,
      scale: 1, startY: 20
    });

    let
      /**
       * each point has 2 constraints,
       * each constraint has 2 points
       * each constraints has 3 coordinates
       */
      springsData = new Float32Array(cloth.points.length * 2 * 2 * 3),
      vertexBuffer;

    (function update() {

      cloth.update({ delta: 0.016, canvas, pointer});

      let iterator = 0, halfWidth = canvas.width / 2, halfHeight = canvas.height / 2;
      for (let point of cloth.points) {
        for (let constraint of point.constraints) {
          springsData[iterator] = WebGL.translateCoord(constraint.p1.x, halfWidth);
          springsData[iterator + 1] = -1 * WebGL.translateCoord(constraint.p1.y, halfHeight);
          springsData[iterator + 2] = point.influenced ? 1 : 0;
          springsData[iterator + 3] = WebGL.translateCoord(constraint.p2.x, halfWidth);
          springsData[iterator + 4] = -1 * WebGL.translateCoord(constraint.p2.y, halfHeight);
          springsData[iterator + 5] = point.influenced ? 1 : 0;
          iterator += 6;
        }
      }

      let gl = canvas.context;
      if (!vertexBuffer) {
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, springsData, gl.STATIC_DRAW);

        let coordinates = gl.getAttribLocation(shaderProgram, 'coordinates');
        gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coordinates);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, springsData, gl.STATIC_DRAW);
      }
      gl.clearColor(1, 1, 1, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.LINES, 0, (iterator + 1) / 3);

      requestAnimationFrame(update)
    })();
  });