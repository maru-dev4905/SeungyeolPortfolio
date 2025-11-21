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
  scrAnim: function () {
    console.log("main.js scrAnim init")
  },

  init: function () {
    if (this._inited) return;
    this._inited = true;

    setTimeout(() => {
      ScrollTrigger.refresh();
      this.scrAnim();
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  mainFunc.init();
});
