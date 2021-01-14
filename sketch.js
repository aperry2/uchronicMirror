let planeWidth = 380;
let planeHeight = 255;

let easing = 0.05;

let cx, cy;

let secondX, secondY;

let cap;

let img;
let checkers;
let column;
let automatonImage;
let maskImage;

let automatonRadius;
let autoY;
let autoEasing = 0.2;

let planeAGraphics, planeCGraphics, planeDGraphics;

let bkgX;

function preload() {
  img = loadImage('clouds.png');
  checkers = loadImage('checkers.png');
  column = loadModel('Gothic_Column.obj');
  automatonImage = loadImage('clouds.jpg');
  maskImage = loadImage('figure.png');
}

function setup() {
  createCanvas(800, 600, WEBGL); // windowWidth, WindowHeight or 800, 600
  rectMode(CENTER);
  lights();
  noStroke();
  cap = createCapture(VIDEO);
  cap.size(380, 255);
  cap.hide();
  background(0, 136, 255);
  cx = 0;
  cy = 0;

  automatonRadius = 100;
  autoY = 190;
  automatonImage.mask(maskImage);

  // let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI; // old line of code - "regular clocks"
  let s = map(second(), 0, 60, 0, radians(110)) - radians(145);

  secondX = cx + cos(s) * 350;
  secondY = cy + sin(s) * 350;

  bkgX = cx + cos(s) * 250;

  planeAGraphics = createGraphics(planeWidth, planeHeight);
  planeCGraphics = createGraphics(planeWidth, planeHeight);
  planeDGraphics = createGraphics(planeWidth, planeHeight);
}


function draw() {
  if (millis() < 2000) {
    planeAGraphics.image(cap, 0, 0);
    planeCGraphics.image(cap, 0, 0);
    planeDGraphics.image(cap, 0, 0);
  }

  // ~10 seconds per frame
  if (second() <= 10) {
    planeAGraphics.image(cap, 0, 0);
  } else if (second() > 21 && second() <= 30) {
    planeCGraphics.image(cap, 0, 0);
  } else if (second() > 41 && second() <= 50) {
    planeDGraphics.image(cap, 0, 0);
  }

  let s = map(second(), 0, 60, 0, radians(110)) - radians(145);
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, radians(110)) - radians(145);
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, radians(110)) - radians(145);

  // lighting
  if (hour() < 6 || hour() > 18) {
    ambientLight(40);
  } else {
    ambientLight(190); //40 = night time, 230 = day time
  }
  let lightY = map(second(), 0, 60, -180, 180);

  // second hand easing
  let targetX = cx + cos(s) * 350;
  let targetY = cy + sin(s) * 350;

  let dx = targetX - secondX;
  secondX += dx * easing;

  let dy = targetY - secondY;
  secondY += dy * easing;

  pointLight(255, 255, 255, secondX, secondY, -85);


  // second hand indicator
  push();
  translate(secondX, secondY, -120);
  fill(170, 255, 238);
  emissiveMaterial(0, 230, 230);
  sphere(20);
  pop();

  // minute hand indicator
  push();
  translate(cx + cos(m) * 300, cy + sin(m) * 300, -120);
  fill(238, 238, 119);
  sphere(15);
  pop();

  // hour hand indicator
  push();
  translate(cx + cos(h) * 230, cy + sin(h) * 230, -120);
  fill(221, 136, 85);
  // emissiveMaterial(230, 230, 0);
  sphere(20);
  pop();

  let bkgTarget = cx + cos(s) * 250;

  let bkgDx = bkgTarget - bkgX;
  bkgX += bkgDx * easing;

  // background
  push();
  translate(-bkgX, -80, -125);
  texture(img);
  plane(img.width, img.height);
  pop();

  drawIndicators();
  drawPlanes();
  drawColumns(color(255, 119, 119));
  drawAutomaton();
}

function drawAutomaton() {
  let angle = TWO_PI;
  let spinRate = frameCount * .02;

  let sinVal = sin(angle - spinRate);
  let cosVal = cos(angle - spinRate);

  let targetY = 190;

  if (second() < 10) {
    targetY = 84;
  } else {
    targetY = 190;
  }

  let dY = targetY - autoY;
  autoY += dY * autoEasing;
  console.log("autoY: " + autoY);
  console.log("dY: " + dY);
  console.log("targetY: " + targetY);

  push();
  translate(automatonRadius * sinVal, autoY, 150 + automatonRadius * cosVal);
  texture(automatonImage);
  plane(100);
  pop();
}

function drawIndicators() {
  let indicatorFar = 350;
  let indicatorHours = 230;
  let indicatorMinutes = 340;
  push();
  translate(0, 0, 0);
  strokeWeight(3);
  stroke(187);
  for (let i = 0; i < 12; i++) {
    let angle = radians(i * 10);
    let tx1 = cx + cos(angle - radians(145)) * indicatorFar;
    let ty1 = cy + sin(angle - radians(145)) * indicatorFar;
    let tx2 = cx + cos(angle - radians(145)) * indicatorHours;
    let ty2 = cy + sin(angle - radians(145)) * indicatorHours;
    line(tx1, ty1, -120, tx2, ty2, -120);
  }
  for (let i = 0; i < 55; i++) {
    let angle = radians(i * 2);
    let tx1 = cx + cos(angle - radians(145)) * indicatorFar;
    let ty1 = cy + sin(angle - radians(145)) * indicatorFar;
    let tx2 = cx + cos(angle - radians(145)) * indicatorMinutes;
    let ty2 = cy + sin(angle - radians(145)) * indicatorMinutes;
    line(tx1, ty1, -120, tx2, ty2, -120);
  }
  noStroke();
  pop();
}

function drawColumns(c) {
  push();
  translate(180, -130, -90);
  scale(19);
  fill(c);
  model(column);
  pop();

  push();
  translate(-180, -130, -90);
  scale(19);
  fill(c);
  model(column);
  pop();

  push();
  translate(-180, -130, 290);
  scale(19);
  fill(c);
  model(column);
  pop();

  push();
  translate(180, -130, 290);
  scale(19);
  fill(c);
  model(column);
  pop();
}

function drawPlanes() {
  // plane B
  push();
  translate(0, 130, 0);
  // fill(200, 0, 0);
  texture(checkers);
  rotateX(radians(90));
  plane(planeWidth, planeHeight * 2.35);
  pop();

  // plane A
  push();
  translate(183, 0, 100);
  //fill(200, 200, 0);
  texture(planeAGraphics);
  rotateY(radians(90));
  rotateX(radians(180));
  rotateZ(radians(180));
  plane(planeWidth, planeHeight);
  pop();

  // plane C
  push();
  translate(-183, 0, 100);
  texture(planeCGraphics);
  // fill(0, 200, 200);
  rotateY(radians(90));
  plane(planeWidth, planeHeight);
  pop();

  // plane D
  push();
  translate(0, 0, -90);
  // texture(tab);
  texture(planeDGraphics);
  // fill(200, 0, 200);
  // rotateZ(radians(90));
  rotateX(radians(0));
  plane(planeWidth, planeHeight);
  pop();
}
