class Constraint {
  constructor (p1, p2, spacing) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = spacing;
  }

  resolve ({cloth}) {
    let dx = this.p1.x - this.p2.x;
    let dy = this.p1.y - this.p2.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.length) return;

    let diff = (this.length - dist) / dist;

    if (dist > cloth.tearDist) this.p1.free(this);

    let mul = diff * 0.5 * (1 - this.length / dist);

    let px = dx * mul;
    let py = dy * mul;

    !this.p1.pinX && (this.p1.x += px);
    !this.p1.pinY && (this.p1.y += py);
    !this.p2.pinX && (this.p2.x -= px);
    !this.p2.pinY && (this.p2.y -= py);

    return this;
  }

  draw ({ctx, point}) {
    ctx.beginPath();
    if (point.influenced) {
      ctx.strokeStyle = '#ff0000';
    } else {
      ctx.strokeStyle = '#555';
    }
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
}