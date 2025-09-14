import dateTimeModule from "./modules/datetime.js";
import noiseBackgroundAnimation from "./modules/noiseAnim.js";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const cmn = {
  _q(sel, ctx = document) { return ctx.querySelector(sel); },
  _qq(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); },
  _inited: false,
  _smooth: null,
  _fadeEl: null,

  anim: {
    toggleClass: function(){
      const els = cmn._qq(".anim");
      if (!els.length) return;

      els.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          markers: false,
          onEnter: () => el.classList.add('show'),
          onLeaveBack: () => el.classList.remove('show')
        });
      });
    },
    init: function(){
      this._fadeEl = cmn._qq(".anim");

      this.toggleClass();
    }
  },

  init: function(){
    if(this._inited) return;
    this._inited = true;
    
    this._smooth = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true
    })

    dateTimeModule();
    noiseBackgroundAnimation();
    cmn.anim.init();
  }
}

document.addEventListener("DOMContentLoaded", cmn.init());