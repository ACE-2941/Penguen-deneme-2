const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// --- RESİMLER ---
const bgImg = new Image();
bgImg.src = "arka-plan.jpg";

const penguinImg = new Image();
penguinImg.src = "penguin.png";

const iceImg = new Image();
iceImg.src = "buz.png";

// --- OYUNCU ---
const penguin = {
  x: 100,
  y: 0,
  width: 48,
  height: 48,
  speed: 5
};

let score = 0;

// --- KONTROLLER ---
let moveLeft = false;
let moveRight = false;

// Klavye
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// Mobil – basılı tutma
canvas.addEventListener("touchstart", e => {
  const x = e.touches[0].clientX;
  if (x < canvas.width / 2) moveLeft = true;
  else moveRight = true;
});

canvas.addEventListener("touchend", () => {
  moveLeft = false;
  moveRight = false;
});

// --- OYUN DÖNGÜSÜ ---
function update() {
  if (moveLeft) penguin.x -= penguin.speed;
  if (moveRight) penguin.x += penguin.speed;

  // EKRAN DIŞINA ÇIKMASIN
  if (penguin.x < 0) penguin.x = 0;
  if (penguin.x + penguin.width > canvas.width)
    penguin.x = canvas.width - penguin.width;

  score += 0.05;
}

function draw() {
  // Arka plan
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Penguen YERDE
  penguin.y = canvas.height - penguin.height - 20;
  ctx.drawImage(
    penguinImg,
    penguin.x,
    penguin.y,
    penguin.width,
    penguin.height
  );

  // Puan – SOL ÜST
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Puan: " + Math.floor(score), 20, 40);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}

// RESİMLER YÜKLENİNCE BAŞLA
bgImg.onload = () => {
  loop();
};
