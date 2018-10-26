Promise.all([
  new Promise(resolve => {
    window.addEventListener('load', resolve, false);
  }),
  Load.getText('cloth.webgl.vert'),
  Load.getText('cloth.webgl.frag')
])
  .then(results => {
    const worker = new Worker('worker.js');

    const pointer = new Pointer();

    const canvas = new Canvas({
        selector: 'canvas', width: window.innerWidth, height: window.innerHeight, strContext: 'webgl',
        onMouseDown: (e) => pointer.onMouseDown(e), onMouseMove: (e) => pointer.onMouseMove(e), onMouseUp: (e) => pointer.onMouseUp(e),
        onTouchStart: (e) => pointer.onTouchStart(e), onTouchMove: (e) => pointer.onTouchMove(e), onTouchEnd: (e) => pointer.onTouchEnd(e),
      });

    const shaderProgram = WebGL.initWebGL(canvas.context, results[1], results[2]);

    WebGL.linkAndUseProgramm(canvas.context, shaderProgram);

    let stats = new Stats();
    stats.showPanel( 0 );
    document.body.appendChild( stats.dom );

    /**
     * each point has 2 constraints,
     * each constraint has 2 points
     * each constraints has 3 coordinates
     */
    // http://2ality.com/2017/01/shared-array-buffer.html
    let sharedBuffer;
    let springsFloatData;
    let vertexBuffer;
    let clothUpdated = false;
    let iterator = 0;
    let clothPointsLength = 0;
    let totalElements = 0;

    worker.onmessage = function({data}) {
      if (Array.isArray(data)) {
        const [type, ...args] = data;
        switch (type) {
          case 'cloth.points.length':
            [clothPointsLength] = args;
            totalElements = clothPointsLength * 2 * 2 * 3;
            sharedBuffer = new SharedArrayBuffer(totalElements * Float32Array.BYTES_PER_ELEMENT);
            springsFloatData = new Float32Array(sharedBuffer);
            worker.postMessage(['sharedBuffer', sharedBuffer]);
            worker.postMessage(['Cloth run']);
            break;
          case 'Cloth updated':
            clothUpdated = true;
            const [eventIterator] = args;
            iterator = eventIterator;
            break;
        }
      }
    };
    worker.postMessage(['new Pointer']);
    worker.postMessage(['new Cloth', canvas.width, canvas.height]);

    const elementsPanel = stats.addPanel( new Stats.Panel( '', '#ff8', '#221' ) );

    (function update() {
      stats.begin();
      worker.postMessage(['pointers', ...pointer.pointers]);

      if (clothUpdated) {
        let gl = canvas.context;
        if (!vertexBuffer) {
          vertexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, springsFloatData, gl.DYNAMIC_DRAW);

          let coordinates = gl.getAttribLocation(shaderProgram, 'coordinates');
          gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(coordinates);
        } else {
          gl.bufferData(gl.ARRAY_BUFFER, springsFloatData, gl.DYNAMIC_DRAW);
        }
        gl.clearColor(1, 1, 1, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.drawArrays(gl.LINES, 0, (iterator + 1) / 3);

        elementsPanel.update(iterator, totalElements);

        // clothUpdated = false;
      }

      requestAnimationFrame(update);
      stats.end();
    })();
  });