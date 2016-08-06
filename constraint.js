var Constraint = function(root_point, point) {
  this.point = point;
  this.length = this.calcDist(root_point, this.point);
};

Constraint.prototype.calcDist = function(p1, p2) {
  var
    diff_x = p1.x - p2.x,
    diff_y = p1.y - p2.y;
  return Math.sqrt(diff_x * diff_x + diff_y * diff_y)
};

Constraint.prototype.resolve = function(root_point, tear_distance) {
  var
    diff_x = root_point.x - this.point.x,
    diff_y = root_point.y - this.point.y,
    dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
    diff = (this.length - dist) / dist;

  if (dist > tear_distance) {
    root_point.removeConstraint(this)
  }

  var
    px = diff_x * diff,
    py = diff_y * diff,
    is_point_free = this.point.pin_x === null && this.point.pin_y === null;
  if (is_point_free) {
    var sum = root_point.rigidity + this.point.rigidity,
      root_point_rigidity = (root_point.rigidity / sum).toFixed(2),
      point_rigidity = 1 - root_point_rigidity;
    root_point.x += px * root_point_rigidity;
    root_point.y += py * root_point_rigidity;
    this.point.x -= px * point_rigidity;
    this.point.y -= py * point_rigidity;
  } else {
    root_point.x += px;
    root_point.y += py;
  }
};

Constraint.prototype.drawConstrain = function(root_point, canvas_context) {
  canvas_context.beginPath();
  if (root_point.captured || this.point.captured) {
    canvas_context.strokeStyle = 'rgb(0,0,255)';
  } else {
    canvas_context.strokeStyle = 'rgb(255,0,0)'
  }
  canvas_context.moveTo(root_point.x, root_point.y);
  canvas_context.lineTo(this.point.x, this.point.y);
  canvas_context.stroke();
};