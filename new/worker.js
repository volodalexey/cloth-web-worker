importScripts('webgl.js');
importScripts('trigger.js');
importScripts('pointer.js');
importScripts('canvas.js');
importScripts('constraint.js');
importScripts('point.js');
importScripts('cloth.js');

let pointer;
let canvas;
let cloth;
let springsFloatData;
let halfWidth, halfHeight;

function update () {
  if (cloth) {
    cloth.update({ delta: 0.016, canvas, pointer});

    if (springsFloatData) {
      let iterator = 0;
      for (let point of cloth.points) {
        for (let constraint of point.constraints) {
          const X1 = constraint.p1.x;
          const Y1 = constraint.p1.y;
          const Z1 = point.influenced ? 1 : 0;
          const X2 = constraint.p2.x;
          const Y2 = constraint.p2.y;
          const Z2 = point.influenced ? 1 : 0;

          springsFloatData[iterator] = WebGL.translateCoord(X1, halfWidth);
          springsFloatData[iterator + 1] = -1 * WebGL.translateCoord(Y1, halfHeight);
          springsFloatData[iterator + 2] = Z1;
          springsFloatData[iterator + 3] = WebGL.translateCoord(X2, halfWidth);
          springsFloatData[iterator + 4] = -1 * WebGL.translateCoord(Y2, halfHeight);
          springsFloatData[iterator + 5] = Z2;

          iterator += 6;
        }
      }

      postMessage(['Cloth updated', iterator]);
    }
  }
}

onmessage = function({data}) {
  if (Array.isArray(data)) {
    const [type, ...args] = data;
    switch (type) {
      case 'new Pointer':
        pointer = new Pointer();
        break;
      case 'new Cloth':
        const [width, height] = args;
        canvas = { width, height };

        cloth = new Cloth({
          canvasWidth: canvas.width,
          clothX: 300, clothY: 200, spacing: 3,
          scale: 1, startY: 20
        });
        halfWidth = canvas.width / 2;
        halfHeight = canvas.height / 2;

        postMessage(['cloth.points.length', cloth.points.length]);
        break;
      case 'pointers':
        pointer.pointers = args;
        break;
      case 'Cloth run':
        setInterval(update, 1000/60);
        break;
      case 'sharedBuffer':
        const [eventSharedBuffer] = args;
        if (eventSharedBuffer instanceof SharedArrayBuffer) {
          springsFloatData = new Float32Array(eventSharedBuffer)
        }
        break;
    }
  }
};