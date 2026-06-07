// ============================================================
// WATER CLOCK - v1.3
// changes: remembered to start to document, + adjusting project 6 addition
// ============================================================

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(40,30,20);
  
  let h = hour();
  let m = minute();
  let s = second();
  
  let totaltime = (h * 3600 ) + (m * 60) + s;
  
  let waterheight = map(totaltime, 0, 86400, height, 0);

  // idea make sky change color over day
  let t = (h + m / 60.0) / 24.0;
  let night = color(40, 30, 20);
  let dawn  = color(255, 120, 50);
  let day   = color(100, 180, 240);
  let dusk  = color(200, 80, 50);
  // lerp color is SO huge!!
  let sky;
  // night to dawn
  if      (t < 0.20) sky = lerpColor(night, dawn,  t / 0.20);
  // dawn to day
  else if (t < 0.35) sky = lerpColor(dawn,  day,  (t - 0.20) / 0.15);
  // day to dusk
  else if (t < 0.75) sky = lerpColor(day,   dusk, (t - 0.35) / 0.40);
  // dusk to night
  else               sky = lerpColor(dusk,  night,(t - 0.75) / 0.25);

  background(sky);
  
  // idea make water actually water like
  fill (0, 150, 150, 150); 
  beginShape();
  // create points every 10 pixels
  for (let x = 0; x <= width; x += 10) {
    // make wave w sin
    let wave = sin(frameCount * 0.05 + x * 0.01) * 5;
    vertex(x, (height - waterheight) + wave);
  }
  // end shape at bottom corners
  vertex(width, height);
  vertex(0,height);
  endShape(CLOSE);
  
  for(let i = 0; i < s; i++) {
    fill(255,255,255,50);
    
    let x = noise(i*10, frameCount *0.005) * width;
    let y = (height - waterheight) + noise(i * 20, frameCount *0.005) * waterheight;
    
    ellipse (x, y, 10);
  }
  
  fill(100);
  textSize(20);
  text(`debug current time: ${h}:${m}:${s}`, 20, 70);
  
}
