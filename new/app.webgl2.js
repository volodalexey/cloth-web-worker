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

    let
      /**
       * each point has 2 constraints,
       * each constraint has 2 points
       * each constraints has 3 coordinates
       */
      springsData = new Float32Array(cloth.points.length * 2 * 2 * 4),
      coordinatesVertexAttribute,
      sourceVertexBuffer, targetVertexBuffer, tempVertexBuffer;

      let frames = 0;
    (function update() {
      if (!sourceVertexBuffer) {
        cloth.update({ delta: 0.016, canvas, pointer});

        let iterator = 0, halfWidth = canvas.width / 2, halfHeight = canvas.height / 2;
        for (let point of cloth.points) {
          for (let constraint of point.constraints) {
            springsData[iterator] = WebGL.translateCoord(constraint.p1.x, halfWidth);
            springsData[iterator + 1] = -1 * WebGL.translateCoord(constraint.p1.y, halfHeight);
            springsData[iterator + 2] = point.influenced ? 1 : 0;
            springsData[iterator + 3] = 1.0; // vec4(.., .., .., 1.0)
            springsData[iterator + 4] = WebGL.translateCoord(constraint.p2.x, halfWidth);
            springsData[iterator + 5] = -1 * WebGL.translateCoord(constraint.p2.y, halfHeight);
            springsData[iterator + 6] = point.influenced ? 1 : 0;
            springsData[iterator + 7] = 1.0; // vec4(.., .., .., 1.0)
            iterator += 8;
          }
        }

        sourceVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sourceVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, springsData, gl.DYNAMIC_DRAW);

        coordinatesVertexAttribute = gl.getAttribLocation(shaderProgram, 'coordinates');
        gl.vertexAttribPointer(coordinatesVertexAttribute, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coordinatesVertexAttribute);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, sourceVertexBuffer);
        gl.vertexAttribPointer(coordinatesVertexAttribute, 4, gl.FLOAT, false, 0, 0);
      }
      gl.clearColor(1, 1, 1, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);

      if (!targetVertexBuffer) {
        let transformFeedback = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

        targetVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, targetVertexBuffer);
        gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, springsData.length * 4, gl.DYNAMIC_COPY);
      } else {
        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, targetVertexBuffer);
      }

      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, targetVertexBuffer);
      gl.beginTransformFeedback(gl.LINES);

      gl.drawArrays(gl.LINES, 0, springsData.length / 4);

      gl.endTransformFeedback();

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

      // let outPosition = new Float32Array(springsData.length);
      // gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, outPosition);
      // console.log(outPosition);

      frames++;
      tempVertexBuffer = sourceVertexBuffer;
      sourceVertexBuffer = targetVertexBuffer;
      targetVertexBuffer = tempVertexBuffer;
      if (frames < 10) {
        requestAnimationFrame(update);
      }
    })();
  });