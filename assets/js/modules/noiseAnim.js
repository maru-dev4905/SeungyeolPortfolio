export default function noiseBackgroundAnimation(){
  const playNoiseAnim = () => {
    (() => {
      const cvs = document.getElementById('grain');
      const ctx = cvs.getContext('2d', { alpha: true });
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize(){
        cvs.width  = Math.floor(innerWidth  * DPR);
        cvs.height = Math.floor(innerHeight * DPR);
      }
      resize(); addEventListener('resize', resize);

      let raf, frame = 0, running = true;

      function draw(){
        if (!running) return;
        // 2프레임에 한 번만 갱신해 부하 감소
        if ((frame++ % 2) === 0){
          const { width:w, height:h } = cvs;
          const id = ctx.createImageData(w, h);
          const data = id.data;
          for (let i=0; i<data.length; i+=4){
            const v = (Math.random()*255)|0;       // noise
            data[i] = data[i+1] = data[i+2] = v;
            data[i+3] = 28;                        // opacity
          }
          ctx.putImageData(id, 0, 0);
        }
        raf = requestAnimationFrame(draw);
      }

      // a11y
      const mq = matchMedia('(prefers-reduced-motion: reduce)');
      function toggleByPref(){ running = !mq.matches; if (running){ draw(); } else { cancelAnimationFrame(raf); } }
      mq.addEventListener?.('change', toggleByPref);
      toggleByPref();
    })();
  }

  const init = () => {
    // playNoiseAnim();
  }
  init();
}