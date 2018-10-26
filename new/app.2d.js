window.addEventListener('load', () => {
  let
    pointer = new Pointer(),
    canvas = new Canvas({
      selector: 'canvas', width: window.innerWidth, height: window.innerHeight, strContext: '2d',
      onMouseDown: (e) => pointer.onMouseDown(e), onMouseMove: (e) => pointer.onMouseMove(e), onMouseUp: (e) => pointer.onMouseUp(e),
      onTouchStart: (e) => pointer.onTouchStart(e), onTouchMove: (e) => pointer.onTouchMove(e), onTouchEnd: (e) => pointer.onTouchEnd(e),
    });

  let cloth = new Cloth({
    canvasWidth: canvas.width,
    clothX: 150, clothY: 100, spacing: 3,
    scale: 1, startY: 20
  });

  const totalElements = cloth.points.length * 2 * 2 * 3;

  let stats = new Stats();
  stats.showPanel( 0 );
  const elementsPanel = stats.addPanel( new Stats.Panel( '', '#ff8', '#221' ) );
  document.body.appendChild( stats.dom );

  (function update() {
    stats.begin();

    let iterator = 0;
    for (let point of cloth.points) {
      for (let constraint of point.constraints) {
        iterator += 6;
      }
    }

    cloth.update({ delta: 0.016, canvas, pointer});

    cloth.draw2d({ canvas });

    elementsPanel.update(iterator, totalElements);

    stats.end();

    requestAnimationFrame(update)
  })();
}, false);