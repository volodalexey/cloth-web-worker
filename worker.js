importScripts('constraint.js');
importScripts('point.js');
importScripts('cloth.js');

var
  canvas_width, canvas_height,
  cloth, mouse_down, mouse_button, mouse_from_x, mouse_from_y,
  mouse_capture, mouse_to_x, mouse_to_y,
  mouse_influence, mouse_cut, mouse_force_factor,
  result,
  serializePoints = function(points) {
    if (!result) {
      result = new Float64Array(points.length * 2 * 5)
    }
    var
      iterator = 0;
      points.forEach(function(point) {
        var len = point.constraints.length;
        if (len) {
          point.constraints.forEach(function(constrain) {
            result[iterator] =
              point.captured || constrain.point.captured ? 1 : 0; // if constrain is captured by mouse
            result[iterator + 1] = point.x;
            result[iterator + 2] = point.y;
            result[iterator + 3] = constrain.point.x;
            result[iterator + 4] = constrain.point.y;
            iterator += 5;
          });
        }
      });
    result[iterator] = 2; // end of drawing
    return result;
  },
  updater = function() {
    cloth.updateCloth(
      mouse_down, mouse_button, mouse_from_x, mouse_from_y,
      mouse_capture, mouse_to_x, mouse_to_y,
      mouse_influence, mouse_cut, mouse_force_factor, canvas_width, canvas_height
    );
  };
onmessage = function(e) {
  var
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
      setInterval(updater, 1000/120);
      break;
    case 'request sync Points':
      postMessage(['sync Points'].concat(serializePoints(cloth.points)));
      break;
  }
};