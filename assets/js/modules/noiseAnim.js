export default function noiseBackgroundAnimation() {
  const cvs = document.getElementById("grain");
  if (!cvs) return;

  const ctx = cvs.getContext("2d", { alpha: true });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let raf = 0;
  let running = true;

  // 노이즈 타일 (작게)
  const tileSize = 180; // 128~256 사이
  const tile = document.createElement("canvas");
  const tctx = tile.getContext("2d", { alpha: true });

  function makeTile() {
    tile.width = tile.height = tileSize;
    const id = tctx.createImageData(tileSize, tileSize);
    const d = id.data;

    // 알파 포함 랜덤 노이즈
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 28; // opacity
    }
    tctx.putImageData(id, 0, 0);
    return ctx.createPattern(tile, "repeat");
  }

  let pattern = null;
  let frame = 0;

  function resize() {
    cvs.width = Math.floor(innerWidth * DPR);
    cvs.height = Math.floor(innerHeight * DPR);
    cvs.style.width = innerWidth + "px";
    cvs.style.height = innerHeight + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function draw() {
    if (!running) return;

    // 3~4프레임에 1번만 타일 갱신
    if ((frame++ % 3) === 0) pattern = makeTile();

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    raf = requestAnimationFrame(draw);
  }

  // a11y
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  function toggleByPref() {
    running = !mq.matches;
    if (running) draw();
    else cancelAnimationFrame(raf);
  }
  mq.addEventListener?.("change", toggleByPref);

  addEventListener("resize", resize, { passive: true });

  resize();
  toggleByPref();
}
