gsap.registerPlugin(ScrollTrigger)

const mainFunc = {
  _inited: false,

  visualAnim: function(){
    const bgCircle = document.querySelector(".bg_c");
    
    gsap.to(".bg_c .circle", {
      ScrollTrigger: {
        trigger: '.sec_cont1',
        pin: true,
        pinSpacing: true,
        marker: true,
      }
    })
  },
  
  init: function(){
    if(this._inited) return;
    this._inited = true;

    mainFunc.visualAnim();
  }
}

document.addEventListener("DOMContentLoaded", mainFunc.init());