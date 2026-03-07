const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');

const sparks = [];
const SPARK_COUNT = 48;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeSpark() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    r: Math.random() * 2.2 + 0.4,
    hue: Math.random() > 0.4 ? 185 : 60,
    alpha: Math.random() * 0.55 + 0.1,
  };
}

function init() {
  sparks.length = 0;
  for (let i = 0; i < SPARK_COUNT; i += 1) {
    sparks.push(makeSpark());
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sparks.forEach((s) => {
    s.x += s.vx;
    s.y += s.vy;

    if (s.x < -10 || s.x > canvas.width + 10 || s.y < -10 || s.y > canvas.height + 10) {
      Object.assign(s, makeSpark());
    }

    ctx.beginPath();
    ctx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${s.alpha})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  resize();
  init();
});

resize();
init();
draw();
