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