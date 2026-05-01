// https://editor.p5js.org/cramslam/sketches/JGl1ER0jC

let particles = [];

function setup() {
  createCanvas(600, 400);
  noStroke();
  for (let i = 0; i < 80; i++) {
    particles.push(makeParticle());
  }
}

function makeParticle() {
  return {
    x: random(width),
    y: random(height),
    r: random(20, 90),
    speed: random(0.2, 0.8),
    opacity: random(10, 50),
    drift: random(-0.3, 0.3)
  };
}

function draw() {
  background(20, 20, 30);

  for (let p of particles) {
    fill(255, 255, 255, p.opacity);
    ellipse(p.x, p.y, p.r * 2, p.r);

    p.y += p.speed;
    p.x += p.drift;

    if (p.y - p.r > height) {
      p.y = -p.r;
      p.x = random(width);
    }
  }
}
