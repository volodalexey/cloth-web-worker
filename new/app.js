window.addEventListener('load', () => {
  let
    pointer = new Pointer(),
    canvas = new Canvas({
      selector: 'canvas', width: window.innerWidth, height: window.innerHeight, strContext: '2d',
      onMouseDown: (e) => pointer.onMouseDown(e), onMouseMove: (e) => pointer.onMouseMove(e), onMouseUp: (e) => pointer.onMouseUp(e),
      onTouchStart: (e) => pointer.onTouchStart(e), onTouchMove: (e) => pointer.onTouchMove(e), onTouchEnd: (e) => pointer.onTouchEnd(e)
    });

  let cloth = new Cloth({
    canvasWidth: canvas.width,
    clothX: 54, clothY: 28, spacing: 8,
    scale: 1, startY: 20
  });

  (function update() {

    cloth.update({ delta: 0.016, canvas, pointer});

    requestAnimationFrame(update)
  })();
}, false);