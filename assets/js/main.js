// main.js
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const mainFunc = {
  _inited: false,
  _loco: null,

  visualAnim: function () {
    
  },

  _setup_smooth_scroll() {
    // 1) 스크롤 컨테이너 선택 (없으면 main을 기본으로)
    const scroller_el = document.querySelector("[data-scroll-container]") || document.querySelector("main");
    this._scroller_el = scroller_el;

    // 2) Locomotive 인스턴스
    this._loco = new LocomotiveScroll({
      el: scroller_el,
      smooth: true,
      lerp: 0.1,           // 감쇠(0~1, 낮을수록 더 부드러움)
      smartphone: { smooth: true },
      tablet: { smooth: true }
    });

    // 3) ScrollTrigger와 동기화
    this._loco.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scroller_el, {
      scrollTop: (value) => {
        if (arguments.length) {
          // 즉시 이동(보정용 disableLerp)
          this._loco.scrollTo(value, { duration: 0, disableLerp: true });
        } else {
          return this._loco.scroll.instance.scroll.y;
        }
      },
      getBoundingClientRect: () => ({
        top: 0, left: 0, width: window.innerWidth, height: window.innerHeight
      }),
      // transform 기반인지 고정인지 자동판정
      pinType: scroller_el.style.transform ? "transform" : "fixed"
    });

    // 4) refresh 시 loco 업데이트
    ScrollTrigger.addEventListener("refresh", () => this._loco.update());
    // 초기 1회 refresh
    setTimeout(() => ScrollTrigger.refresh(), 0);
  },

  init: function () {
    if (mainFunc._inited) return;
    mainFunc._inited = true;

    mainFunc._setup_smooth_scroll();

    mainFunc.visualAnim();
  }
};

document.addEventListener("DOMContentLoaded", mainFunc.init);
