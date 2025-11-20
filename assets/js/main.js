gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const mainFunc = {
  _q(sel, ctx = document) {
    return ctx.querySelector(sel);
  },
  _qq(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  },
  _inited: false,
  _scroller_el: null,

  introAnim: function () {
    const paths = [this._q("#path1"), this._q("#path2")];
    paths.forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    const pathTL = gsap.timeline({defaults: {ease: "power2.out"}});
    const spread = 420;

    pathTL
        .to(paths, {
          strokeDashoffset: 0,
          duration: 2,
          delay: 0.5,
        }, 0)
        .to(paths, {
          fill: "#fff",
          attr: {fill: "#fff"},
          duration: 0.35
        },">")
        .to(".item.left", {
          xPercent: -200,
          duration: 0.9,
          ease: "power3.inOut"
        },">")
        .to(".item.right", {
          xPercent: 200,
          duration: 0.9,
          ease: "power3.inOut"
        },"<")
        .to(".item.center", {
          width: 300,
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut"
        },"<")
        .to(".item.center", {
          width: 300,
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut"
        },"<")
  },
  scrAnim: function () {
    console.log("main.js scrAnim init")
  },

  init: function () {
    if (this._inited) return;
    this._inited = true;

    setTimeout(() => {
      ScrollTrigger.refresh();
      this.introAnim();
      this.scrAnim();
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  mainFunc.init();
});
