gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const mainFunc = {
  _inited: false,
  _scroller_el: null,
  _smooth: null,

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

    const workListPin = ScrollTrigger.create({
      trigger: ".sec_cont3 .work_list",
      scrub: true,
      pin: ".sec_cont3 .line_wrap",
      start: "top top",
      end: "bottom bottom",
      pinSpacing: true,
      markers: true,
    });
  },

  init: function () {
    if (this._inited) return;
    this._inited = true;

    this._smooth = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true
    })

    setTimeout(() => {
      ScrollTrigger.refresh();
      mainFunc.scrAnim(); 
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  mainFunc.init();
});
