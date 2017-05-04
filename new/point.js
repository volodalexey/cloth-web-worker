class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.pinX = null;
    this.pinY = null;
    this.influenced = false;

    this.constraints = [];
  }

  update ({delta, canvas, pointer, cloth}) {
    if (this.pinX && this.pinY) return this;
    this.influenced = false;
    if (pointer.start) {
      let distances = pointer.pointers.map(p => {
        let
          dx = this.x - p.curX,
          dy = this.y - p.curY;
        return Math.sqrt(dx * dx + dy * dy);
      });
      let
        dist = Math.min.apply(null, distances),
        p = pointer.pointers[distances.indexOf(dist)];

      if (p.button === 0 && dist < cloth.influence) {
        this.influenced = true;
        this.px = this.x - p.diffPrevX;
        this.py = this.y - p.diffPrevY;
      } else if (dist < cloth.cut) {
        this.constraints = [];
      }
    }

    this.addForce(0, cloth.gravity);

    let nx = this.x + (this.x - this.px) * cloth.friction + this.vx * delta;
    let ny = this.y + (this.y - this.py) * cloth.friction + this.vy * delta;

    this.px = this.x;
    this.py = this.y;

    this.x = nx;
    this.y = ny;

    this.vy = this.vx = 0;

    if (this.x >= canvas.width) {
      this.px = canvas.width + (canvas.width - this.px) * cloth.bounce;
      this.x = canvas.width
    } else if (this.x <= 0) {
      this.px *= -1 * cloth.bounce;
      this.x = 0;
    }

    if (this.y >= canvas.height) {
      this.py = canvas.height + (canvas.height - this.py) * cloth.bounce;
      this.y = canvas.height
    } else if (this.y <= 0) {
      this.py *= -1 * cloth.bounce;
      this.y = 0
    }

    return this
  }

  resolve (canvas) {
    if (this.pinX && this.pinY) {
      this.x = this.pinX;
      this.y = this.pinY;
      return
    }

    this.constraints.forEach((constraint) => constraint.resolveConstraint(canvas))
  }

  attach (point, spacing) {
    this.constraints.push(new Constraint(this, point, spacing))
  }

  free (constraint) {
    this.constraints.splice(this.constraints.indexOf(constraint), 1)
  }

  addForce (x, y) {
    this.vx += x;
    this.vy += y;
  }

  pin (pinx, piny) {
    this.pinX = pinx;
    this.pinY = piny;
  }
}