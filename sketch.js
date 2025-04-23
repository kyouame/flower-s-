let flowers = [];
let pastelColors;
let quotes = [
  "如果一朵花很美，人就會不由自主地想到要活下去。",
  "上邊和下邊的紫花地丁彼此會不會相見，會不會相識呢？",
  "被雨打落的花都髒透了，還會有落花的景致嗎？所謂落花……",
  "像這樣的花叢，與其說是花兒開在樹上，不如說是花兒鋪滿了枝頭。",
  "春陽暖暖，蝶舞蜂歌，煞是好看。",
  "花是活的，它的生命雖然短暫，但活得絢麗奪目。",
  "彷彿整個世界都沉浸在爛漫的花之海洋。",
  "櫻花花期短暫，能夠絢麗燦爛七天，就在繁華熱鬧中凋謝了。",
  "繁花之中，兼有再生與毀滅，我們不得不向前走，在花瓣飄零的盡頭。",
  "花給空氣著彩，就連身體也好像染上了顏色"
];
let currentQuote = quotes[0];

let dingSound;

function preload() {
  dingSound = loadSound('ding.mp3'); // 請確認檔案已上傳進來
}

function setup() {
  createCanvas(450, 675);
  angleMode(DEGREES);
  noStroke();
  textFont('serif');

  pastelColors = [
    color(209, 227, 187),
    color(152, 249, 206),
    color(222, 253, 250),
    color(234, 225, 218),
    color(233, 201, 222),
    color(232, 154, 184),
    color(226, 186, 202),
    color(187, 184, 221),
    color(249, 228, 177),
    color(205, 200, 207)
  ];
}

function draw() {
  background(255);

  // 中央詩句（在最底層）
  push();
  fill(0);
  textFont('serif');
  textSize(12);
  textAlign(CENTER, CENTER);
  text(currentQuote, width / 2, height / 2);
  pop();

  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].update();
    flowers[i].display();

    if (flowers[i].isDead()) {
      flowers.splice(i, 1);
    }
  }
}

function mousePressed() {
  flowers.push(new Flower(mouseX, mouseY));
  currentQuote = random(quotes);

  // 播放ding音效
  if (dingSound && dingSound.isLoaded()) {
    dingSound.play();
  }

  // 讓手機觸發聲音播放
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.petalCount = 5; // 五瓣花
    this.petalLength = random(20, 35);
    this.color = random(pastelColors);
    this.startTime = millis();
    this.lifespan = 4000;

    this.opacity = 255;
    this.falling = false;

    this.stemHeight = 0;
    this.stemMax = 40;

    this.fallenPetals = [];
    for (let i = 0; i < this.petalCount; i++) {
      this.fallenPetals.push({
        angle: i * (360 / this.petalCount),
        x: 0,
        y: 0,
        speed: random(0.3, 1),
        fallTime: random(200, 800)
      });
    }
  }

  update() {
    let age = millis() - this.startTime;

    if (this.stemHeight < this.stemMax) {
      this.stemHeight += 2;
    }

    if (age > this.lifespan) {
      this.falling = true;
    }

    if (this.falling) {
      this.opacity -= 2;
      for (let p of this.fallenPetals) {
        p.y += p.speed;
        p.x += sin(p.angle + frameCount) * 0.5;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    // 花莖
    stroke(80, 180, 100);
    strokeWeight(2);
    line(0, 0, 0, -this.stemHeight);
    noStroke();

    translate(0, -this.stemHeight);

    fill(red(this.color), green(this.color), blue(this.color), this.opacity);

    if (!this.falling) {
      // 畫花瓣（沒有中心白點）
      for (let i = 0; i < this.petalCount; i++) {
        let angle = i * (360 / this.petalCount);
        let px = cos(angle) * this.petalLength;
        let py = sin(angle) * this.petalLength;
        ellipse(px, py, 20, 30);
      }
    } else {
      for (let i = 0; i < this.petalCount; i++) {
        let p = this.fallenPetals[i];
        fill(red(this.color), green(this.color), blue(this.color), this.opacity);
        ellipse(p.x, p.y, 20, 30);
      }
    }

    pop();
  }

  isDead() {
    return this.opacity <= 0;
  }
}