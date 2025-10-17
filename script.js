const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bgMusic");
const sfxCollision = document.getElementById("sfxCollision");
sfxCollision.volume = 0.8;
const bgCanvas = document.getElementById("animated-bg");
const bgCtx = bgCanvas.getContext("2d");

let bgOffset = 0;

function animateBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  bgCtx.fillStyle = "#111";
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  bgCtx.strokeStyle = "rgba(50, 50, 100, 0.3)";
  bgCtx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    let y = (i * 30 + bgOffset) % (bgCanvas.height + 30);
    bgCtx.beginPath();
    bgCtx.moveTo(0, y);
    bgCtx.lineTo(bgCanvas.width, y);
    bgCtx.stroke();
  }

  bgOffset += 0.5;
  requestAnimationFrame(animateBackground);
}

animateBackground();

function playSFX(audio) {
  audio.currentTime = 0;
  audio.play().catch((e) => console.log("SFX failed:", e));
}

let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

const player = { 
  x: 200,           
  y: 100,
  w: 20,            
  h: 20,
  color: "green",   
  speed: 3 
};

const levels = [
  {
    obstacles: [
      { x: 100, y: 100, w: 200, h: 20 },
      { x: 100, y: 200, w: 20, h: 100 },
      { x: 200, y: 100, w: 20, h: 200 },
      { x: 400, y: 100, w: 200, h: 20 },
    ],
    coins: [
      { x: 150, y: 150, collected: false },
      { x: 450, y: 150, collected: false },
      { x: 300, y: 250, collected: false },
    ],
  },
  {
    obstacles: [
      
      { x: 100, y: 130, w: 100, h: 20 }, 
      { x: 250, y: 150, w: 100, h: 20 }, 
      { x: 400, y: 150, w: 100, h: 20 }, 
      { x: 100, y: 200, w: 400, h: 20 }, 
    ],
    coins: [
      { x: 150, y: 160, collected: false },
      { x: 300, y: 170, collected: false },
      { x: 450, y: 120, collected: false },
      { x: 300, y: 260, collected: false },
    ],
  },
  {
    obstacles: [
      { x: 100, y: 80, w: 400, h: 20 },
      { x: 100, y: 150, w: 20, h: 100 },
      { x: 200, y: 150, w: 20, h: 100 },
      { x: 300, y: 150, w: 20, h: 100 },
      { x: 400, y: 150, w: 20, h: 100 },
      { x: 100, y: 250, w: 400, h: 20 },
      { x: 100, y: 340, w: 20, h: 100 },
      { x: 200, y: 340, w: 20, h: 100 },
      { x: 300, y: 340, w: 20, h: 100 },
      { x: 400, y: 340, w: 20, h: 100 },
    ],
    coins: [
      { x: 150, y: 140, collected: false },
      { x: 250, y: 170, collected: false },
      { x: 350, y: 170, collected: false },
      { x: 150, y: 270, collected: false },
      { x: 250, y: 270, collected: false },
      { x: 350, y: 270, collected: false },
      { x: 150, y: 370, collected: false },
    ],
  },
  {
    obstacles: [
      { x: 0, y: 0, w: 600, h: 20 },
      { x: 0, y: 0, w: 20, h: 400 },
      { x: 600, y: 0, w: 20, h: 400 },
      { x: 0, y: 400, w: 600, h: 20 },
      { x: 100, y: 100, w: 20, h: 150 },
      { x: 200, y: 100, w: 20, h: 150 },
      { x: 300, y: 100, w: 20, h: 150 },
      { x: 400, y: 100, w: 20, h: 150 },
      { x: 500, y: 100, w: 20, h: 150 },
      { x: 100, y: 300, w: 400, h: 20 },
      { x: 100, y: 100, w: 400, h: 20 },
      { x: 100, y: 100, w: 20, h: 200 },
      { x: 100, y: 300, w: 20, h: 50 },
      { x: 300, y: 300, w: 20, h: 50 },
      { x: 500, y: 300, w: 20, h: 50 },
    ],
    coins: [
      { x: 150, y: 150, collected: false },
      { x: 250, y: 150, collected: false },
      { x: 350, y: 150, collected: false },
      { x: 450, y: 150, collected: false },
      { x: 150, y: 350, collected: false },
      { x: 250, y: 350, collected: false },
      { x: 350, y: 350, collected: false },
      { x: 450, y: 350, collected: false },
      { x: 550, y: 350, collected: false },
    ],
  },
];

let currentLevel = 0;

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function drawRect(obj) {
  ctx.fillStyle = obj.color || "white";
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

function update() {
  const level = levels[currentLevel];

  let prevX = player.x;
  let prevY = player.y;

  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y < 0) player.y = 0;
  if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;

  for (let obs of level.obstacles) {
    if (rectsCollide(player, obs)) {
      resetLevel();

      sfxCollision.volume = 0.8; 
      playSFX(sfxCollision);

      ctx.fillStyle = "red";
      ctx.font = "24px Arial";
      ctx.fillText("¡CUIDADO!", canvas.width / 2 - 60, canvas.height / 2);
      setTimeout(() => { draw(); }, 1000);

      break;
    }
  }

  for (let coin of level.coins) {
    if (!coin.collected) {
      if (
        player.x < coin.x + 15 &&
        player.x + player.w > coin.x &&
        player.y < coin.y + 15 &&
        player.y + player.h > coin.y
      ) {
        coin.collected = true;
      }
    }
  }

  const allCollected = level.coins.every((c) => c.collected);
  if (allCollected) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      resetLevel();
      
    } else {
      setTimeout(() => {
        alert("¡Felicitaciones! Joaquin Muñoz");
        currentLevel = 0;
        resetLevel();
        
      }, 500);
    }
  }
}

function resetLevel() {
  player.x = 50;
  player.y = 50;
  levels[currentLevel].coins.forEach((c) => (c.collected = false));
  
  bgMusic.src = `sounds/nivel${currentLevel + 1}.mp3`;
  bgMusic.load();
  bgMusic.play().catch((e) => console.log("No se pudo reproducir música:", e));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.color = currentLevel === 0 ? "green" : "red";
  drawRect(player);

  const level = levels[currentLevel];
  for (let obs of level.obstacles) {
    drawRect({ ...obs, color: "gray" });
  }

  for (let coin of level.coins) {
    if (!coin.collected) {
      ctx.fillStyle = "gold";
      ctx.beginPath();
      ctx.arc(coin.x + 7.5, coin.y + 7.5, 7.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Nivel: ${currentLevel + 1}`, 10, 25);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

resetLevel();
bgMusic.src = "sounds/nivel1.mp3";
bgMusic.load();
bgMusic.play().catch((e) => console.log("No se pudo reproducir música:", e));
gameLoop();
