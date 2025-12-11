const btn = document.getElementById("musicBtn");
const audio = document.getElementById("bgm");
btn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    btn.style.background = "rgba(255,255,255,0.45)";
  } else {
    audio.pause();
    btn.style.background = "rgba(255,255,255,0.25)";
  }
});

/* -----------------------------
   RESPONSIVE SNOW ENGINE
----------------------------- */

const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

let w = 0;
let h = 0;

let flakes = [];
let maxFlakes = 220;
let pile = []; // dynamically rebuilt on resize

function resizeSnow() {
  // always use integer values for safer mobile rendering
  w = canvas.width = Math.floor(window.innerWidth);
  h = canvas.height = Math.floor(window.innerHeight);

  // rebuild accumulation array
  pile = new Array(w).fill(0);

  // reposition flakes inside new bounds
  flakes.forEach((f) => {
    if (f.x > w) f.x = Math.random() * w;
    if (f.y > h) f.y = Math.random() * h;
  });
}

resizeSnow();
window.addEventListener("resize", () => {
  // debounce resize for iOS Safari
  clearTimeout(window._snowResizeTimer);
  window._snowResizeTimer = setTimeout(resizeSnow, 150);
});

function spawnFlake() {
  flakes.push({
    x: Math.random() * w,
    y: -10,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 1 + 0.6,
    drift: (Math.random() - 0.5) * 0.7
  });
}

function updateSnow() {
  ctx.clearRect(0, 0, w, h);

  /* ---- Softened accumulated snow at bottom ---- */
  const smooth = new Array(w);
  for (let x = 0; x < w; x++) {
    const L = pile[x - 1] || 0;
    const M = pile[x];
    const R = pile[x + 1] || 0;
    smooth[x] = (L + M + R) / 3;
  }

  ctx.fillStyle = "white";
  for (let x = 0; x < w; x++) {
    const height = smooth[x];
    if (height > 0) {
      ctx.fillRect(x, h - height, 1, height);
    }
  }

  /* ---- Falling snow update ---- */
  const MAX_PILE_HEIGHT = 60; // ❄️ limit to 60px snowy ground

  flakes.forEach((f, i) => {
    f.y += f.speed;
    f.x += f.drift;

    if (f.x < 0) f.x = w;
    if (f.x > w) f.x = 0;

    let px = Math.floor(f.x);
    let ground = h - pile[px];

    if (f.y >= ground - f.r) {
      // grow snow BUT capped
      pile[px] = Math.min(pile[px] + Math.ceil(f.r), MAX_PILE_HEIGHT);

      // feather edges
      if (px > 0) pile[px - 1] = Math.min(pile[px - 1] + 0.4, MAX_PILE_HEIGHT);
      if (px < w - 1)
        pile[px + 1] = Math.min(pile[px + 1] + 0.4, MAX_PILE_HEIGHT);

      flakes.splice(i, 1);
    }

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });

  // spawn new flakes gradually
  if (flakes.length < maxFlakes) spawnFlake();

  requestAnimationFrame(updateSnow);
}

updateSnow();
