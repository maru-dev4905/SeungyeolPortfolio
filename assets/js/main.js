gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const mainFunc = {
  _inited: false,
  _loco: null,
  _scroller_el: null,

  scrAnim: function () {
    // gsap.to('.circle_box', {
    //   bottom: 0,
    //   scrollTrigger: {
    //     trigger: ".sec_cont2 .arti2",
    //     scrub: true,
    //     marker: true,
    //     start: "",
    //     end: ""
    //   }
    // });
    let smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true
    });
  },

  init: function () {
    if (this._inited) return;
    this._inited = true;

    // this._setup_smooth_scroll();
        setTimeout(() => {
      ScrollTrigger.refresh();
      mainFunc.scrAnim(); 
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  mainFunc.init();
});
