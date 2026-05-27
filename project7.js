let boxes = [];

function setup() {
  createCanvas(460, 430);

  let targets = shuffle([0,1,2,3,4,5,6,7,8]).slice(0, 3);
  let startX = (width - 3*72 - 2*16) / 2;

  for (let i = 0; i < 9; i++) {
    let x = startX + (i % 3) * 88;
    let y = 85 + floor(i / 3) * 88;
    boxes[i] = { x, y, tx: x, ty: y, circle: targets.includes(i), selected: false };
  }
}

function draw() {
  background(242);

  // header
  fill(255); stroke(210); rect(20, 12, width-40, 58, 4);
  noStroke(); fill(20); textSize(16); textAlign(LEFT, CENTER);
  text("Select all images with circles", 35, 41);

  for (let b of boxes) {
    // flee from mouse
    let d = dist(mouseX, mouseY, b.x+36, b.y+36);
    if (d < 85) {
      let a = atan2(b.y+36 - mouseY, b.x+36 - mouseX);
      b.tx = constrain(b.x+36 + cos(a)*150 - 36, 5, width-77);
      b.ty = constrain(b.y+36 + sin(a)*150 - 36, 78, height-78);
    }
    // slide toward target
    b.x += (b.tx - b.x) * 0.12;
    b.y += (b.ty - b.y) * 0.12;

    // draw box
    stroke(b.selected ? color(26,115,232) : 200);
    fill(b.selected ? color(225,235,255) : 255);
    rect(b.x, b.y, 72, 72);
    noStroke();
    fill(b.selected ? color(26,115,232) : 75);
    if (b.circle) { circle(b.x+36, b.y+36, 36); }
    else { triangle(b.x+36, b.y+14, b.x+13, b.y+59, b.x+59, b.y+59); }

    // checkmark overlay
    if (b.selected) {
      fill(26,115,232,130); rect(b.x, b.y, 72, 72);
      fill(255); textSize(22); textAlign(CENTER,CENTER);
      text("✓", b.x+36, b.y+37);
    }
  }

  // footer + verify button
  fill(255); stroke(210); rect(20, height-62, width-40, 50, 4);
  fill(26,115,232); noStroke(); rect(width-125, height-55, 95, 36, 4);
  fill(255); textSize(12); textAlign(CENTER,CENTER);
  text("VERIFY", width-78, height-37);
  fill(150); textSize(11); textAlign(LEFT,CENTER);
  text("Skip", 36, height-37);
}

function mousePressed() {
  // toggle box selection
  for (let b of boxes) {
    if (mouseX > b.x && mouseX < b.x+72 && mouseY > b.y && mouseY < b.y+72) {
      b.selected = !b.selected;
      return;
    }
  }

  // verify always fails, scatter boxes
  if (mouseX > width-125 && mouseX < width-30 && mouseY > height-55 && mouseY < height-19) {
    for (let b of boxes) {
      b.selected = false;
      b.tx = random(5, width-77);
      b.ty = random(80, height-78);
    }
  }
}
