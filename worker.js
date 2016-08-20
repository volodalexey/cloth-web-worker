importScripts('spring.js');
importScripts('point.js');
importScripts('cloth.js');

var
  canvas_width, canvas_height,
  cloth, mouse_down, mouse_button, mouse_from_x, mouse_from_y,
  mouse_capture, mouse_to_x, mouse_to_y,
  mouse_influence, mouse_cut, mouse_force_factor,
  result, delta = 16,
  translateCoord = function(coord, half) {
    return (coord - half) / half
  },
  serializeSprings = function(springs, webgl) {
    if (!result) {
      result = new Float32Array(springs.length * 2 * 6)
    }
    var
      iterator = 0;
      springs.forEach(function(spring) {
        result[iterator] = webgl ? translateCoord(spring.point_a.x, canvas_width/2) : spring.point_a.x;
        result[iterator + 1] = webgl ? -1 * translateCoord(spring.point_a.y, canvas_height/2) : spring.point_a.y;
        result[iterator + 2] = webgl ? 0 : spring.point_a.captured;
        result[iterator + 3] = webgl ? translateCoord(spring.point_b.x, canvas_width/2) : spring.point_b.x;
        result[iterator + 4] = webgl ? -1 * translateCoord(spring.point_b.y, canvas_height/2) : spring.point_b.y;
        result[iterator + 5] = webgl ? 0 : spring.point_b.captured;
        iterator += 6;
      });
    return [result, iterator + 1];
  },
  updater = function() {
    cloth.updateCloth(
      delta,
      mouse_down, mouse_button, mouse_from_x, mouse_from_y,
      mouse_capture, mouse_to_x, mouse_to_y,
      mouse_influence, mouse_cut, mouse_force_factor, canvas_width, canvas_height
    );
  };
onmessage = function(e) {
  var
    ret,
    data = e.data,
    type = data[0],
    args = data.slice(1);
  switch (type) {
    case 'new Cloth':
      // cloth = new (Function.prototype.bind.apply(Cloth, args));
      canvas_width = args[0]; canvas_height = args[1];
      cloth = new Cloth(canvas_width, canvas_height);
      break;
    case 'sync Pointer':
      mouse_down = args[0]; mouse_button = args[1]; mouse_from_x = args[2]; mouse_from_y = args[3];
      mouse_capture = args[4]; mouse_to_x = args[5]; mouse_to_y = args[6]; mouse_influence = args[7];
      mouse_cut = args[8]; mouse_force_factor = args[9];
      break;
    case 'startClothUpdate':
      setInterval(updater, 1000/60);
      break;
    case 'request sync Springs':
      ret = serializeSprings(cloth.springs);
      postMessage(['sync Springs', ret[0], ret[1]]);
      break;
    case 'request sync Springs webgl':
      ret = serializeSprings(cloth.springs, true);
      postMessage(['sync Springs', ret[0], ret[1]]);
      break;
  }
};