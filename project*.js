// ============================================================
// WATER CLOCK - v2.0
// changes: stars fixed, and project in a decent state!
// ============================================================

// [DEBUG] set to false to use real clock
let usedebugtime = true;
let debugslider;

let showstars = true;

function setup() {
  createCanvas(400, 400);
  noStroke();

  // [DEBUG] time slider
  debugslider = createSlider(0, 0.9999, 0.5, 0.001);
  debugslider.position(10, 415);
  debugslider.size(380);
}

function draw() {
  background(40,30,20);
  
  let h = hour();
  let m = minute();
  let s = second();
  
  let totaltime = (h * 3600 ) + (m * 60) + s;
  
  let waterheight = map(totaltime, 0, 86400, height, 0);
  
// < 1.0 ---
  
  // idea make sky change color over day
  let t = (h + m / 60.0) / 24.0;

  // [DEBUG] override all time values with slider and replace w new t
  if (usedebugtime) {
    t           = debugslider.value();
    totaltime   = t * 86400;
    waterheight = map(totaltime, 0, 86400, height, 0);
    h = floor(t * 24);
    m = floor((t * 24 - h) * 60);
    s = floor(((t * 24 - h) * 60 - m) * 60);
  }

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

// 1.3 ---
  
  // idea: sun arcs left to right during day
  // sin curve makes it peak at noon
  if (t >= 0.20 && t <= 0.75) {
    let sunProgress = map(t, 0.20, 0.75, 0, PI);
    let sunX = map(t, 0.20, 0.75, 30, width - 30);
    let sunY = map(sin(sunProgress), 0, 1, height * 0.70, height * 0.10);
    fill(255, 235, 80, 230);
    ellipse(sunX, sunY, 38, 38);
  }

// 1.6 ---
  
// idea: add moon 
// night runs t=0.75 -> 1.0 -> 0.0 -> 0.20, total = 0.45
  // nightT normalizes that whole stretch to 0->1, same trick as sky lerp zones
  if (t < 0.20 || t > 0.75) {
    let nightT;
    if (t > 0.75) nightT = (t - 0.75) / 0.45;
    else          nightT = (t + 0.25) / 0.45; // +0.25 offsets the evening portion
    let moonX = map(nightT, 0, 1, 30, width - 30);
    let moonY = map(sin(nightT * PI), 0, 1, height * 0.70, height * 0.10);
    fill(220, 220, 200, 210);
    ellipse(moonX, moonY, 28, 28);
  }
  
// 2.0 ---
  
  // idea: add stars at night that go transparent during day
  // randomSeed() locks random() to same sequence every frame
  // without it positions recalculate 60x a second = flickering
  if (showstars) {
    let starAlpha = 0;
    // fade in after dusk, fade out before dawn
    if (t > 0.75)       starAlpha = map(t, 0.75, 0.85, 0, 180, true);
    else if (t < 0.20)  starAlpha = map(t, 0.10, 0.20, 180, 0, true);
    // true in map() clamps it so alpha cant go negative or over 180
    if (starAlpha > 0) {
      randomSeed(611); // any number works, just has to be the same number every frame
      for (let i = 0; i < 30; i++) {
        let sx = random(width);
        let sy = random(height * 0.60);
        fill(255, 245, 200, starAlpha);
        ellipse(sx, sy, random(1.5, 3.5), random(1.5, 3.5));
      }
    }
  }
  
// < 1.0 ---
  
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

// 1.3 ---
  
  // [DEBUG] show time
  if (usedebugtime) {
    fill(255, 85);
    textSize(11);
    // changed to use nf so it's visually consistent & string
    text(`time: ${nf(h,2)}:${nf(m,2)}:${nf(s,2)}`, 10, 394);
  }
}
