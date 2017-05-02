Promise.all([
  new Promise(resolve => {
    window.addEventListener('load', resolve, false);
  }),
  Load.getText('cloth.vert'),
  Load.getText('cloth.frag')
])
  .then(results => {
    let
      pointer = new Pointer(),
      canvas = new Canvas({
        selector: 'canvas', width: window.innerWidth, height: window.innerHeight, strContext: 'webgl',
        onMouseDown: (e) => pointer.onMouseDown(e), onMouseMove: (e) => pointer.onMouseMove(e), onMouseUp: (e) => pointer.onMouseUp(e),
        onTouchStart: (e) => pointer.onTouchStart(e), onTouchMove: (e) => pointer.onTouchMove(e), onTouchEnd: (e) => pointer.onTouchEnd(e),
        onContextMenu: (e) => e.preventDefault()
      }),
      shader_program = WebGL.initWebGL(canvas.context, results[1], results[2]);

    let cloth = new Cloth({
      canvasWidth: canvas.width,
      clothX: 54, clothY: 28, spacing: 8,
      scale: 1, startY: 20
    });

    let springsData = new Float32Array(cloth.points.length * 2 * 3);

    (function update() {

      cloth.update({ delta: 0.016, canvas, pointer});

      requestAnimationFrame(update)
    })();
  });