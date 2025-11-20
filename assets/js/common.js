import noiseBackgroundAnimation from "./modules/noiseAnim.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const cmn = {
  _q(sel, ctx = document) {
    return ctx.querySelector(sel);
  },
  _qq(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  },
  _inited: false,
  _smooth: null,
  _fadeEl: null,

  anim: {
    toggleClass: function () {
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
    init: function () {
      this._fadeEl = cmn._qq(".anim");

      this.toggleClass();
    }
  },

  init: function () {
    if (this._inited) return;
    this._inited = true;

    this._smooth = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true
    })

    // dateTimeModule();
    noiseBackgroundAnimation();
    cmn.anim.init();

    window.addEventListener('scroll', () => {
      let winY = window.scrollY;
      let hd = this._q('header');

      if (winY > hd.offsetHeight) {
        hdScrAnim.play();
      } else {
        hdScrAnim.reverse();
      }
    });

    let hdScrAnim = gsap.timeline({paused: true});
    hdScrAnim
        .to("header h1", {
          height: 0,
          backgroundColor: "#000",
          duration: .25,
          ease: "power2.out",
        })
        .to("header nav ul", {
          height: 0,
          backgroundColor: "#000",
          duration: .25,
          ease: "power2.out",
        },">")
        .set("header h1", {
          backgroundColor: "rgba(244,244,244,0.95)",
        }, ">")
        .set("header h1 p, header h1 span", {
          display: "none"
        }, ">")
        .set("header nav ul",{
          backgroundColor: "rgba(0,0,0,0)",
        },">")
        .to("header h1", {
          height: 120,
          color: "#000",
          backdropFilter: "blur(4px)",
          duration: .35,
          ease: "power2.out",
        }, "+=0.5")
        .to("header nav ul", {
          height: 50,
          duration: .35,
          opacity: 0.8,
          ease: "power2.out",
        },">")
  }
}

document.addEventListener("DOMContentLoaded", cmn.init());

export default cmn;