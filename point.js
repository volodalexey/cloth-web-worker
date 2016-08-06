var Point = function(x, y, rigidity) {
  this.x = x;
  this.y = y;
  this.prev_x = x;
  this.prev_y = y;
  this.pin_x = null;
  this.pin_y = null;
  this.rigidity = rigidity || 0.5;
  this.constraints = [];
};

Point.prototype.update = function(
  mouse_down, mouse_button, mouse_from_x, mouse_from_y,
  mouse_capture, mouse_to_x, mouse_to_y,
  mouse_influence, mouse_cut, mouse_force_factor, gravity, gravity_force_factor) {
  var
    mouse_add_x = 0, mouse_add_y = 0;
  if (mouse_down) {
    var diff_x, diff_y, dist;

    if (mouse_button === 0) {
      diff_x = this.x - mouse_from_x;
      diff_y = this.y - mouse_from_y;
      dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      if (mouse_capture && dist < mouse_influence || this.captured) {
        mouse_add_x = (mouse_to_x - mouse_from_x) * mouse_force_factor;
        mouse_add_y = (mouse_to_y - mouse_from_y) * mouse_force_factor;
        this.prev_x = this.x - mouse_add_x;
        this.prev_y = this.y - mouse_add_y;
        this.captured = true;
      } else {
        this.captured = false;
      }
    } else if (mouse_button == 1) {
      diff_x = this.x - mouse_to_x;
      diff_y = this.y - mouse_to_y;
      dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      if (dist < mouse_cut) {
        this.constraints = []
      }
    }
  } else {
    this.captured = false;
  }

  var
    inertia_add_x = this.x - this.prev_x,
    inertia_add_y = this.y - this.prev_y,
    force_add_x = 0,
    force_add_y = gravity,
    new_x = this.x + inertia_add_x + mouse_add_x + (force_add_x * gravity_force_factor),
    new_y = this.y + inertia_add_y + mouse_add_y + (force_add_y * gravity_force_factor);

  this.prev_x = this.x;
  this.prev_y = this.y;

  this.x = new_x;
  this.y = new_y;
};

Point.prototype.drawPoint = function(canvas_context) {
  if (this.constraints.length <= 0) {
    return
  }
  var self = this;
  this.constraints.forEach(function(constrain) {
    constrain.drawConstrain(self, canvas_context)
  });
};

Point.prototype.resolveConstraints = function(bounds_x, bounds_y, tear_distance) {

  if (this.pin_x != null && this.pin_y != null) {
    this.x = this.pin_x;
    this.y = this.pin_y;
    return;
  }

  var self = this;
  this.constraints.forEach(function(constrain) {
    constrain.resolve(self, tear_distance)
  });

  if (this.x > bounds_x) {
    this.x = 2 * bounds_x - this.x
  } else if (1 > this.x) {
    this.x = 2 - this.x
  }
  if (this.y < 1) {
    this.y = 2 - this.y
  } else if (this.y > bounds_y) {
    this.y = 2 * bounds_y - this.y
  }
};

Point.prototype.addConstrain = function(point) {
  this.constraints.push(
    new Constraint(this, point)
  );
};

Point.prototype.removeConstraint = function(constrain) {
  var patched_constrains = [];
  this.constraints.forEach(function(_constrain) {
    if (_constrain !== constrain) {
      patched_constrains.push(_constrain)
    }
  });
  this.constraints = patched_constrains;
};

Point.prototype.pin = function(pinx, piny) {
  this.pin_x = pinx;
  this.pin_y = piny;
};