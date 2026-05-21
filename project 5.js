let battery = 0.8;
let t = 0.3;

function setup() {
  createCanvas(600, 400);
  textFont('monospace');
}

function draw() {
  t = (t + 0.0002) % 1;

  let isDay = t > 0.25 && t < 0.75;
  let sun = isDay ? sin((t - 0.25) / 0.5 * PI) : 0;

  if (isDay) battery = min(1, battery + sun * 0.0005);
  else        battery = max(0, battery - 0.001);

  background(isDay ? lerpColor(color(30,30,60), color(120,180,220), sun) : color(10,10,25));

  let sx = map(t, 0.25, 0.75, 40, width - 40);
  let sy = map(sun, 0, 1, height * 0.55, height * 0.08);
  noStroke();
  fill(isDay ? color(255,220,60) : color(200,205,215));
  ellipse(isDay ? sx : width * 0.85, isDay ? sy : 40, 36, 36);

  fill(245, 240, 228);
  stroke(180); strokeWeight(0.5);
  rect(30, 30, width * 0.55, height * 0.75, 3);

  if (battery <= 0) {
    noStroke(); fill(160, 50, 50); textSize(11); textAlign(CENTER);
    text("secure connection failed", width * 0.305, height * 0.42);
    fill(120); textSize(9);
    text("battery depleted — check back after ~11am", width * 0.305, height * 0.42 + 22);
    textAlign(LEFT);
  } else {
    let lines = [
      "ourshiver.site   battery: " + floor(battery * 100) + "%",
      "",
      "this website runs on a small solar panel",
      "on the roof of a building in san francisco.",
      "at night, a light bulb slowly drains it.",
      "by morning it's usually gone.",
      "",
      "it comes back around 11am.",
      "that's just how it works."
    ];

    let a = map(battery, 0.15, 1, 40, 255);
    noStroke();
    for (let i = 0; i < lines.length; i++) {
      if (battery < 0.25 && random() < 0.15) continue;
      fill(i === 0 ? color(100) : color(40), a);
      textSize(i === 0 ? 8.5 : 9.5);
      text(lines[i], 48, 58 + i * 16);
    }
  }

  noStroke(); fill(60, 60, 80, 200); rect(width - 110, 20, 90, 50, 4);
  fill(150); textSize(8); text("battery", width - 100, 36);
  fill(50, 50, 65); rect(width - 100, 40, 70, 10, 2);
  fill(lerpColor(color(200,50,50), color(60,190,80), battery));
  rect(width - 100, 40, 70 * battery, 10, 2);
  let hr = floor(t * 24);
  let mn = floor((t * 24 - hr) * 60);
  fill(160); textSize(8);
  text(nf(hr,2) + ":" + nf(mn,2) + (isDay ? "  charging" : "  draining"), width - 100, 62);
}
