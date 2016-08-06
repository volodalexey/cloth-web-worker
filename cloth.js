var Cloth = function(canvas_width, canvas_height) {
  this.cloth_width = 100;
  this.cloth_height = 100;
  this.spacing = 4;
  this.tear_distance = 20;
  this.physics_accuracy = 2;
  this.gravity = 1;
  this.gravity_force_factor = 0.01;
  this.points = [];
  var
    points = this.points,
    spacing = this.spacing,
    cloth_width = this.cloth_width, cloth_height = this.cloth_height,
    start_x = canvas_width / 2 - cloth_width * spacing / 2,
    // start_y = canvas_height / 2 - cloth_height * spacing / 2;
    start_y = 10;

  for (var y = 0; y <= cloth_height; y++) {

    for (var x = 0; x <= cloth_width; x++) {

      var p = new Point(
        start_x + x * spacing,
        start_y + y * spacing,
        x === y ? 0.1 : null
        // (cloth_width - x + 1) / cloth_width
      );

      if (y === 0) {
        p.pin(p.x, p.y)
      } else {
        p.addConstrain(points[x + (y - 1) * (cloth_width + 1)])
      }
      if (x !== 0) {
        p.addConstrain(points[points.length - 1])
      }

      points.push(p);
    }
  }
};

Cloth.prototype.updateCloth = function(
  mouse_down, mouse_button, mouse_from_x, mouse_from_y,
  mouse_capture, mouse_to_x, mouse_to_y,
  mouse_influence, mouse_cut, mouse_force_factor, canvas_width, canvas_height) {
  var
    tear_distance = this.tear_distance,
    points = this.points,
    physics_accuracy = this.physics_accuracy,
    gravity = this.gravity,
    gravity_force_factor = this.gravity_force_factor,
    bounds_x = canvas_width - 1,
    bounds_y = canvas_height - 1;

  while (physics_accuracy--) {
    points.forEach(function(point) {
      point.resolveConstraints(bounds_x, bounds_y, tear_distance)
    });
  }

  points.forEach(function(point) {
    point.update(
      mouse_down, mouse_button, mouse_from_x, mouse_from_y,
      mouse_capture, mouse_to_x, mouse_to_y,
      mouse_influence, mouse_cut, mouse_force_factor,
      gravity, gravity_force_factor
    )
  });
};

Cloth.prototype.drawCloth = function(canvas_context) {
  this.points.forEach(function(point) {
    point.drawPoint(canvas_context)
  });
};