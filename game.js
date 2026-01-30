document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  // SABİT OYUN ALANI
  canvas.width = 360;
  canvas.height = 640;

  // ---------------- IMAGES ----------------
  const bgImg = new Image();
  bgImg.src = "arka-plan.jpg";

  const penguinImg = new Image();
  penguinImg.src = "penguin.png";

  const iceImg = new Image();
  iceImg.src = "buz.png";

  // ---------------- SPRITE INFO ----------------
  const SPRITE_FRAME_WIDTH = 32;
  const SPRITE_FRAME_HEIGHT = 32;
  const SPRITE_FRAME_COUNT = 6; // penguin.png içinde GERÇEK kare sayısı

  // ---------------- PLAYER ----------------
  const penguin = {
    x: canvas.width / 2 - 32,
    y: 0,
    width: 64,
    height: 64,
    speed: 5,

    frameX: 0,
    frameTimer: 0,
    frameInterval: 6
  };

  let score = 0;
  let gameOver = false;

  // ---------------- ICE ----------------
  let ices = [];
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

  // MOBILE
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();

    if (gameOver) {
      resetGame();
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;

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
      y: -80,
      width: 40,
      height: 80,
      speed: 4
    });
  }

  function resetGame() {
    gameOver = false;
    score = 0;
    ices = [];
    iceTimer = 0;
    penguin.x = canvas.width / 2 - penguin.width / 2;
    penguin.frameX = 0;
  }

  function update() {
    if (gameOver) return;

    let moving = false;

    if (moveLeft) {
      penguin.x -= penguin.speed;
      moving = true;
    }
    if (moveRight) {
      penguin.x += penguin.speed;
      moving = true;
    }

    if (penguin.x < 0) penguin.x = 0;
    if (penguin.x + penguin.width > canvas.width)
      penguin.x = canvas.width - penguin.width;

    // 🐧 ANİMASYON
    if (moving) {
      penguin.frameTimer++;
      if (penguin.frameTimer >= penguin.frameInterval) {
        penguin.frameX = (penguin.frameX + 1) % SPRITE_FRAME_COUNT;
        penguin.frameTimer = 0;
      }
    } else {
      penguin.frameX = 0;
    }

    iceTimer++;
    if (iceTimer > 60) {
      spawnIce();
      iceTimer = 0;
    }

    for (let i = ices.length - 1; i >= 0; i--) {
      const ice = ices[i];
      ice.y += ice.speed;

      if (
        ice.x < penguin.x + penguin.width &&
        ice.x + ice.width > penguin.x &&
        ice.y < penguin.y + penguin.height &&
        ice.y + ice.height > penguin.y
      ) {
        gameOver = true;
      }

      if (ice.y > canvas.height) {
        ices.splice(i, 1);
        score++;
      }
    }
  }

  function draw() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    penguin.y = canvas.height - penguin.height - 20;

    // 🐧 TEK ve DOĞRU penguen
    ctx.drawImage(
      penguinImg,
      penguin.frameX * SPRITE_FRAME_WIDTH,
      0,
      SPRITE_FRAME_WIDTH,
      SPRITE_FRAME_HEIGHT,
      penguin.x,
      penguin.y,
      penguin.width,
      penguin.height
    );

    for (const ice of ices) {
      ctx.drawImage(iceImg, ice.x, ice.y, ice.width, ice.height);
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Puan: " + score, 16, 30);

    if (gameOver) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 28px Arial";
      ctx.fillText("PENGUEN FINITO", 90, 300);
      ctx.font = "18px Arial";
      ctx.fillText("EKRANA BASIVER FINITO", 85, 330);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    requestAnimationFrame(loop);
  }

  bgImg.onload = () => loop();

});
