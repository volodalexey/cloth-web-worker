class Cloth {
  constructor () {
    this.init.apply(this, arguments);
  }

  init({canvasWidth, clothX, clothY, spacing, startX, startY}) {
    this.influence = 26;
    this.cut = 8;
    this.accuracy = 5;
    this.gravity = 400;
    this.tearDist = 60;
    this.friction = 0.99;
    this.bounce = 0.5;

    this.points = [];

    this.startX = startX || canvasWidth / 2 - clothX * spacing / 2;
    this.startY = startY || 0;

    for (let y = 0; y <= clothY; y++) {
      for (let x = 0; x <= clothX; x++) {
        let point = new Point(this.startX + x * spacing, this.startY + y * spacing);
        y === 0 && point.pin(point.x, point.y);
        x !== 0 && point.attach(this.points[this.points.length - 1], spacing);
        y !== 0 && point.attach(this.points[x + (y - 1) * (clothX + 1)], spacing);

        this.points.push(point);
      }
    }
  }

  get startX() {
    return this._startX;
  }

  set startX(startX){
    this._startX = startX;
  }

  get startY() {
    return this._startY;
  }

  set startY(startY){
    this._startY = startY;
  }

  update({delta, canvas, pointer}) {
    let ctx = canvas.context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let i = this.accuracy;

    while (i--) {
      this.points.forEach((point) => {
        point.resolve({ cloth: this });
      })
    }

    this.points.forEach((point) => {
      point.update({ delta: delta * delta, canvas, cloth: this, pointer });
    });
  }

  draw2d({ canvas }) {
    for (let point of this.points) {
      for (let constraint of point.constraints) {
        let ctx = canvas.context;
        ctx.beginPath();
        if (point.influenced) {
          ctx.strokeStyle = 'rgb(255, 0, 0)';
        } else {
          ctx.strokeStyle = 'rgb(85, 85, 85)';
        }
        ctx.moveTo(constraint.p1.x, constraint.p1.y);
        ctx.lineTo(constraint.p2.x, constraint.p2.y);
        ctx.stroke();
      }
    }
  }
}