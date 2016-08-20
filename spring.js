var Spring = function(point_a, point_b) {
  this.point_a = point_a;
  point_a.references++;
  this.point_b = point_b;
  point_b.references++;
};

function resolveSpring(point_a, point_b, rest_distance, tear_distance) {
  if (!point_a.references || !point_b.references) {
    return false
  }

  var
    diff_x = point_a.x - point_b.x,
    diff_y = point_a.y - point_b.y,
    distance = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

  if (point_a.invmass !== 0 || point_b.invmass !== 0 ) {
    var
      sum = point_a.invmass + point_b.invmass,
      diff = (rest_distance - distance) / distance,
      diff_a = point_a.invmass / sum * diff,
      diff_b = point_b.invmass / sum * diff;
    point_a.x += diff_x * diff_a;
    point_a.y += diff_y * diff_a;
    point_b.x -= diff_x * diff_b;
    point_b.y -= diff_y * diff_b;
  }

  return distance <= tear_distance;
}

// function drawSpring(point_a, point_b, canvas_context) {
//   canvas_context.beginPath();
//   canvas_context.lineWidth = 5;
//   var grad;
//   if (point_a.captured && point_b.captured) {
//     canvas_context.strokeStyle = 'rgb(0,0,255)';
//   } else if (point_a.captured) {
//     grad = canvas_context.createLinearGradient(point_a.x, point_a.y, point_b.x, point_b.y);
//     grad.addColorStop(0, 'rgb(0,0,255)');
//     grad.addColorStop(1, 'rgb(255,0,0)');
//     canvas_context.strokeStyle = grad;
//   } else if (point_b.captured) {
//     grad = canvas_context.createLinearGradient(point_b.x, point_b.y, point_a.x, point_a.y);
//     grad.addColorStop(0, 'rgb(0,0,255)');
//     grad.addColorStop(1, 'rgb(255,0,0)');
//     canvas_context.strokeStyle = grad;
//   } else {
//     canvas_context.strokeStyle = 'rgb(255,0,0)'
//   }
//   canvas_context.moveTo(point_a.x, point_a.y);
//   canvas_context.lineTo(point_b.x, point_b.y);
//   canvas_context.stroke();
// }