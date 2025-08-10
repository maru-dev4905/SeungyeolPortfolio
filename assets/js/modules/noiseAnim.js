export default function noiseBackgroundAnimation(){
  const playNoiseAnim = () => {
    const noiseBG = document.querySelector(".noise_bg");
    gsap.to(noiseBG, .03, {
        backgroundPosition: Math.floor(Math.random() * 100) + 1 + "% " + Math.floor(Math.random() * 10) + 1 + "%", 
        onComplete: playNoiseAnim,
        onCompleteParams: [noiseBG],
        ease:SteppedEase.config(1)
    });
  }

  const init = () => {
    playNoiseAnim();
  }
  init();
}