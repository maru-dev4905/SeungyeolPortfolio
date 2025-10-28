gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const mainFunc = {
  _inited: false,
  _scroller_el: null,

  scrAnim: function () {

  },

  init: function () {
    if (this._inited) return;
    this._inited = true;

    setTimeout(() => {
      ScrollTrigger.refresh();
      mainFunc.scrAnim(); 
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  mainFunc.init();
});
