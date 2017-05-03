Promise.all([
  new Promise(resolve => {
    window.addEventListener('load', resolve, false);
  }),
  Load.getText('cloth.webgl2.vert'),
  Load.getText('cloth.webgl2.frag')
])
  .then(results => {
    let
      pointer = new Pointer(),
      canvas = new Canvas({
        selector: 'canvas', width: window.innerWidth, height: window.innerHeight, strContext: 'webgl2',
        onMouseDown: (e) => pointer.onMouseDown(e), onMouseMove: (e) => pointer.onMouseMove(e), onMouseUp: (e) => pointer.onMouseUp(e),
        onTouchStart: (e) => pointer.onTouchStart(e), onTouchMove: (e) => pointer.onTouchMove(e), onTouchEnd: (e) => pointer.onTouchEnd(e),
      }),
      gl = canvas.context,
      shaderProgram = WebGL.initWebGL(gl, results[1], results[2]);

    gl.transformFeedbackVaryings(shaderProgram, ['gl_Position'], gl.SEPARATE_ATTRIBS);

    WebGL.linkAndUseProgramm(gl, shaderProgram);
    let cloth = new Cloth({
      canvasWidth: canvas.width,
      clothX: 54, clothY: 28, spacing: 8,
      scale: 1, startY: 20
    });
    // VBO - Vertex Buffer Object

    let
      /**
       * each point has 2 constraints,
       * each constraint has 2 points
       * each constraints has 3 coordinates
       */
      springsData = new Float32Array(cloth.points.length * 2 * 2 * 3),
      vertexBuffer, backVertexBuffer;

      let frames = 0;
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
      let isTime = () => frames > 100;

      if (!vertexBuffer) {
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, springsData, gl.DYNAMIC_COPY);

        let coordinates = gl.getAttribLocation(shaderProgram, 'coordinates');
        gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coordinates);
      } else {
        if (isTime()) {

        } else {
          gl.bufferData(gl.ARRAY_BUFFER, springsData, gl.DYNAMIC_COPY);
        }
      }
      gl.clearColor(1, 1, 1, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);

      if (isTime()) {
        let transformFeedback = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

        backVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, backVertexBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, springsData.length * 10, gl.DYNAMIC_COPY);
        // gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(0);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, backVertexBuffer);
        gl.beginTransformFeedback(gl.LINES);
      }
      gl.drawArrays(gl.LINES, 0, (iterator + 1) / 3);
      if (isTime()) {
        gl.endTransformFeedback();
      }
      frames++;
      if (frames < 102) {
        requestAnimationFrame(update)
      }
    })();
  });