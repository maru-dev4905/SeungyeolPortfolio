gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const mainFunc = {
  _inited: false,
  _scroller_el: null,

  scrAnim: function () {
    const workListPin = ScrollTrigger.create({
      trigger: ".sec_cont3 .work_list",
      scrub: true,
      pin: ".sec_cont3 .line_wrap",
      start: "top top",
      end: "bottom bottom",
      pinSpacing: true,
      markers: false,
    });
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
