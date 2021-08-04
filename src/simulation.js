export default class DopplerSimulation {
  constructor() {
    this.circles = [];
    this.time = 0;
    this.lastID = 0;
  }

  next(dt) {
    this.time += dt;
    let needsFiltering = false;
    for(let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];
      circle.x += circle.vx*dt;
      circle.y += circle.vy*dt;
      circle.r += circle.vr*dt;
      circle.time += dt;
      if(circle.time > 2) {
        needsFiltering = true;
      }
    }
    if(needsFiltering) {
      this.circles = this.circles.filter((circle) => circle.time <= 2);
    }
  }

  addCircle(x, y, r, vx, vy, vr) {
    const id = this.lastID+1;
    this.circles.push({ x, y, r, vx, vy, vr, id, time: 0 });

    this.lastID = id;
  }

  getCircles() {
    return [ ...this.circles ];
  }
};
