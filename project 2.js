// wander & wonder
// move mouse: words drift by click: pin a word down.

let words = [
  "wander", "wonder", "belonging", "connection", "trust",
  "openness", "vulnerability", "place", "memory", "curiosity",
  "drift", "presence", "care", "slowness", "roots",
  "listen", "gather", "unlearn", "body", "threshold"
];

let floaters = []; // { x, y, word, vx, vy, age, maxAge }
let pinned = [];   // { x, y, word }

function setup() {
  createCanvas(600, 400);
  textSize(13);
  textFont('Georgia');
}

function draw() {
  background(240, 235, 220);

  // lines between nearby pinned words
  stroke(100, 80, 140, 70);
  strokeWeight(0.8);
  for (let i = 0; i < pinned.length; i++)
    for (let j = i + 1; j < pinned.length; j++)
      if (dist(pinned[i].x, pinned[i].y, pinned[j].x, pinned[j].y) < 150)
        line(pinned[i].x, pinned[i].y, pinned[j].x, pinned[j].y);

  // spawn a word near the cursor every 25 frames
  if (frameCount % 25 == 0 && mouseX > 0 && mouseX < width)
    floaters.push({
      x: mouseX + random(-60, 60),
      y: mouseY + random(-40, 40),
      word: pickWord(),
      vx: random(-0.3, 0.3),
      vy: random(-0.7, -0.3),
      age: 0,
      maxAge: int(random(90, 160))
    });

  // move, fade, and draw each floater
  for (let f of floaters) {
    f.x += f.vx;
    f.y += f.vy;
    f.age++;
    // fade in and out
    let a = f.age < 20 ? map(f.age, 0, 20, 0, 160)
          : f.age > f.maxAge - 20 ? map(f.age, f.maxAge - 20, f.maxAge, 160, 0)
          : 160;
    noStroke();
    fill(80, 60, 120, a);
    text(f.word, f.x, f.y);
  }
  floaters = floaters.filter(f => f.age < f.maxAge);

  // draw each pinned word: small circle + label
  for (let p of pinned) {
    noFill();
    stroke(100, 80, 140);
    strokeWeight(1);
    ellipse(p.x, p.y, 8, 8);
    noStroke();
    fill(60, 40, 90);
    text(p.word, p.x + 10, p.y + 5);
  }
}

// on click, pin the closest floater (or a random word if none nearby)
function mousePressed() {
  let closest = floaters.reduce((best, f) => {
    let d = dist(mouseX, mouseY, f.x, f.y);
    return d < best.d ? { f, d } : best;
  }, { f: null, d: 999 }).f;
  pinned.push({ x: mouseX, y: mouseY, word: closest ? closest.word : pickWord() });
}

// cycle through words so nothing repeats too soon
let used = [];
function pickWord() {
  if (used.length >= words.length) used = [];
  let pool = words.filter(w => !used.includes(w));
  let w = random(pool);
  used.push(w);
  return w;
}
