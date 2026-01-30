const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ---------------- CANVAS ----------------
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ---------------- IMAGES ----------------
const bgImg = new Image();
bgImg.src = "arka-plan.jpg";

const penguinImg = new Image();
penguinImg.src = "penguin.png";

const iceImg = new Image();
iceImg.src = "buz.png";

// ---------------- PLAYER ----------------
const penguin = {
  x: 100,
  y: 0,
  width: 64,
  height: 64,
  speed: 6
};

let score = 0;
let gameOver = false;

// ---------------- ICE ----------------
const ices = [];
let iceTimer = 0;

// ---------------- CONTROLS ----------------
let moveLeft = false;
let moveRight = false;

// PC
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// MOBILE (BASILI TUTMA)
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  const x = e.touches[0].clientX;
  if (x < canvas.width / 2) moveLeft = true;
  else moveRight = true;
}, { passive: false });

canvas.addEventListener("touchend", () => {
  moveLeft = false;
  moveRight = false;
});

// ---------------- GAME LOGIC ----------------
function spawnIce() {
  ices.push({
    x: Math.random() * (canvas.width - 40),
    y: -60,
    width: 40,
    height: 80,
    speed: 4
  });
}

function update() {
  if (gameOver) return;

  // Player move
  if (moveLeft) penguin.x -= penguin.speed;
  if (moveRight) penguin.x += penguin.speed;

  // Bounds
  if (penguin.x < 0) penguin.x = 0;
  if (penguin.x + penguin.width > canvas.width)
    penguin.x = canvas.width - penguin.width;

  // Ice spawn
  iceTimer++;
  if (iceTimer > 60) {
    spawnIce();
    iceTimer = 0;
  }

  // Ice update
  for (let i = ices.length - 1; i >= 0; i--) {
    const ice = ices[i];
    ice.y += ice.speed;

    // Collision
    if (
      ice.x < penguin.x + penguin.width &&
      ice.x + ice.width > penguin.x &&
      ice.y < penguin.y + penguin.height &&
      ice.y + ice.height > penguin.y
    ) {
      gameOver = true;
    }

    // Remove
    if (ice.y > canvas.height) {
      ices.splice(i, 1);
      score += 1;
    }
  }
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Penguin ground
  penguin.y = canvas.height - penguin.height - 20;

  // Penguin (sprite fix – tek kare)
  ctx.drawImage(
    penguinImg,
    0, 0, 32, 32,
    penguin.x,
    penguin.y,
    penguin.width,
    penguin.height
  );

  // Ice
  for (const ice of ices) {
    ctx.drawImage(iceImg, ice.x, ice.y, ice.width, ice.height);
  }

  // Score
  ctx.fillStyle = "white";
  ctx.font = "bold 26px Arial";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;
  ctx.fillText("Puan: " + score, 20, 40);
  ctx.shadowBlur = 0;

  // Game Over
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.fillText("HATA BAŞVERDI EKRANA BASIVER", canvas.width / 2 - 120, canvas.height / 2);
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}

// ---------------- START ----------------
bgImg.onload = () => loop();
