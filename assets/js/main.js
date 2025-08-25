gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const mainFunc = {
  _inited: false,
  _loco: null,
  _scroller_el: null,

  scrAnim: function () {
    // const secCont2 = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: '.sec_cont2 .circle_box',
    //     scrub: true,
    //     pin: true,
    //     pinSpacing: true,
    //     markers: true,
    //     scroller: mainFunc._scroller_el
    //   }
    // });

    // ✅ 테스트용 애니메이션 예시 (없으면 아무 변화가 안 보여)
    // secCont2.to('.sec_cont2 .circle_box', {
    //   scale: 1.5,
    //   duration: 1,
    //   ease: 'none'
    // });
    let smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true
    });
  },

  _setup_smooth_scroll() {
    const scroller_el = document.querySelector("[data-scroll-container]") || document.querySelector("main");
    this._scroller_el = scroller_el;

    this._loco = new LocomotiveScroll({
      el: scroller_el,
      smooth: true,
      lerp: 0.1,
      smartphone: { smooth: true },
      tablet: { smooth: true }
    });

    this._loco.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scroller_el, {
      scrollTop(value) {
        if (arguments.length) {
          mainFunc._loco.scrollTo(value, { duration: 0, disableLerp: true });
        } else {
          return mainFunc._loco.scroll.instance.scroll.y;
        }
      },
      getBoundingClientRect: () => ({
        top: 0, left: 0, width: window.innerWidth, height: window.innerHeight
      }),
      pinType: "transform"
    });

    ScrollTrigger.addEventListener("refresh", () => mainFunc._loco.update());

    
    setTimeout(() => {
      ScrollTrigger.refresh();
      mainFunc.scrAnim(); 
    }, 100);
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
