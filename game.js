const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

// ASSETLER
const bgImg = new Image();
bgImg.src = "arka-plan.jpg";

const penguinImg = new Image();
penguinImg.src = "penguin.png";

const iceImg = new Image();
iceImg.src = "buz.png";

// PUAN
let score = 0;

// PENGUEN
const penguin = {
  x: canvas.width / 2 - 24,
  y: canvas.height - 100,
  width: 48,
  height: 48,
  speed: 5
};

// BUZ ENGELİ
const ice = {
  x: Math.random() * (canvas.width - 40),
  y: -80,
  width: 40,
  height: 80,
  speed: 3
};

// KONTROLLER
let moveLeft = false;
let moveRight = false;

// KLAVYE
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// MOBİL DOKUNMA
canvas.addEventListener("touchstart", e => {
  const x = e.touches[0].clientX;
  if (x < window.innerWidth / 2) moveLeft = true;
  else moveRight = true;
});

canvas.addEventListener("touchend", () => {
  moveLeft = false;
  moveRight = false;
});

// ÇARPIŞMA
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// OYUN DÖNGÜSÜ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ARKA PLAN
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // PENGUEN HAREKET
  if (moveLeft) penguin.x -= penguin.speed;
  if (moveRight) penguin.x += penguin.speed;

  // SINIRLAR (EN SOLA & SAĞA TAM GİDER)
  if (penguin.x < 0) penguin.x = 0;
  if (penguin.x + penguin.width > canvas.width)
    penguin.x = canvas.width - penguin.width;

  // BUZ HAREKET
  ice.y += ice.speed;
  if (ice.y > canvas.height) {
    ice.y = -80;
    ice.x = Math.random() * (canvas.width - ice.width);
    score++;
    document.getElementById("score").innerText = "Puan: " + score;
  }

  // ÇARPIŞMA
  if (isColliding(penguin, ice)) {
    alert("Oyun Bitti! Puan: " + score);
    location.reload();
  }

  // ÇİZİMLER
  ctx.drawImage(penguinImg, penguin.x, penguin.y, penguin.width, penguin.height);
  ctx.drawImage(iceImg, ice.x, ice.y, ice.width, ice.height);

  requestAnimationFrame(gameLoop);
}

// BAŞLAT
bgImg.onload = () => {
  gameLoop();
};
