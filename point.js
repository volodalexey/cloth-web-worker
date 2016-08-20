var Point = function(x, y, invmass) {
  this._x = x;
  this._y = y;
  this.x = x;
  this.y = y;
  this.prev_x = x;
  this.prev_y = y;
  this.invmass = invmass || 1;
  this.references = 0; // each spring has reference to point
};

Point.prototype.update = function(delta, delta_factor,
                                  pointer_down, mouse_button, pointer_from_x, pointer_from_y,
                                  mouse_capture, pointer_to_x, pointer_to_y,
                                  mouse_influence, mouse_cut, mouse_force_factor, gravity, gravity_force_factor) {
  var
    mouse_add_x = 0, mouse_add_y = 0;
  if (pointer_down) {
    var diff_x, diff_y, dist;

    if (mouse_button === 0) {
      diff_x = this.x - pointer_from_x;
      diff_y = this.y - pointer_from_y;
      dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      if (mouse_capture && dist < mouse_influence || this.captured) {
        mouse_add_x = (pointer_to_x - pointer_from_x) * mouse_force_factor;
        mouse_add_y = (pointer_to_y - pointer_from_y) * mouse_force_factor;
        this.captured = true;
      } else {
        this.captured = false;
      }
    } else if (mouse_button == 1) {
      diff_x = this.x - pointer_to_x;
      diff_y = this.y - pointer_to_y;
      dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      if (dist < mouse_cut) {
        this.references = 0;
      }
    }
  } else {
    this.captured = false;
  }
  var
    inertia_add_x = this.x - this.prev_x,
    inertia_add_y = this.y - this.prev_y,
    force_add_x = 0 * gravity_force_factor + mouse_add_x,
    force_add_y = gravity * gravity_force_factor + mouse_add_y,
    next_x = this.x + inertia_add_x + force_add_x * delta * delta * delta_factor,
    next_y = this.y + inertia_add_y + force_add_y * delta * delta * delta_factor;

  this.prev_x = this.x;
  this.prev_y = this.y;

  if (this.invmass !== 0) {
    this.x = next_x;
    this.y = next_y;
  }
};

Point.prototype.resolveConstraints = function(bounds_x, bounds_y) {
  var x = this.x, y = this.y;
  if (x < 1) {
    x = 2 - x
  } else if (x > bounds_x) {
    x = 2 * bounds_x - x
  }
  this.x = x;
  if (y < 1) {
    y = 2 - y
  } else if (y > bounds_y) {
    y = 2 * bounds_y - y
  }
  this.y = y
};