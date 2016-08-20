var Cloth = function(canvas_width, canvas_height) {
  this.cloth_width = 100;
  this.cloth_height = 50;
  this.spacing = 10;
  this.tear_distance = 50;
  this.physics_accuracy = 1;
  this.gravity = 9.8;
  this.gravity_force_factor = 0.00005;
  this.points = [];
  this.springs = [];
  var
    points = this.points, springs = this.springs,
    spacing = this.spacing,
    cloth_width = this.cloth_width, cloth_height = this.cloth_height,
    start_x = canvas_width / 2 - cloth_width * spacing / 2,
    // start_y = canvas_height / 2 - cloth_height * spacing;
    start_y = 0;

  start_y = start_y < 0 ? 0 : start_y;

  for (var y = 0; y <= cloth_height; y++) {

    for (var x = 0; x <= cloth_width; x++) {

      var p = new Point(
        start_x + x * spacing,
        start_y + y * spacing,
        x === y ? 0.5 : 1
      );

      if (y === 0) {
        p.invmass = 0;
      } else { // if it is not upper add to up
        springs.push(new Spring(p, points[x + (y - 1) * (cloth_width + 1)]));
      }
      if (x !== 0) { // if it is not the left add to left
        springs.push(new Spring(p, points[points.length - 1]));
      }

      points.push(p);
    }
  }
};

Cloth.prototype.updateCloth = function(
  delta,
  mouse_down, mouse_button, mouse_from_x, mouse_from_y,
  mouse_capture, mouse_to_x, mouse_to_y,
  mouse_influence, mouse_cut, mouse_force_factor, canvas_width, canvas_height) {
  var
    tear_distance = this.tear_distance,
    points = this.points, springs = this.springs, spacing = this.spacing,
    physics_accuracy = this.physics_accuracy,
    gravity = this.gravity,
    gravity_force_factor = this.gravity_force_factor,
    bounds_x = canvas_width - 1,
    bounds_y = canvas_height - 1;

  points.forEach(function(point) {
    point.update(
      16, 0.001,
      mouse_down, mouse_button, mouse_from_x, mouse_from_y,
      mouse_capture, mouse_to_x, mouse_to_y,
      mouse_influence, mouse_cut, mouse_force_factor,
      gravity, gravity_force_factor
    )
  });

  points.forEach(function(point) {
    point.resolveConstraints(bounds_x, bounds_y)
  });

  while (physics_accuracy--) {
    this.springs = springs.filter(function(spring) {
      return resolveSpring(spring.point_a, spring.point_b, spacing, tear_distance)
    });
  }

  this.points = points.filter(function(point) {
    return point.references
  })
};

Cloth.prototype.drawCloth = function(canvas, canvas_context) {
  this.springs.forEach(function(spring) {
    canvas.drawSpring(
      canvas_context,
      spring.point_a.x, spring.point_a.y, spring.point_a.captured,
      spring.point_b.x, spring.point_b.y, spring.point_b.captured)
  });
};