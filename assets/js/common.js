import noiseBackgroundAnimation from "./modules/noiseAnim.js";
import moveMouseAnimation from "./modules/moveToMouse.js";
import prjFunc from "./prj.js";
import work_list from "./work.js";

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
  _isIntro: null,
  _pageNamespace: null,

  pageInit: function(){
    this._isIntro = this._q("#intro");
    this._isIntro ? this._smooth.paused(true) : this._smooth.paused(false);
    this._pageNamespace = this._q('div[data-barba-namespace]').getAttribute('data-barba-namespace');
    
    noiseBackgroundAnimation();
    moveMouseAnimation();

    // if(this._pageNamespace === 'about'){
    //   prjFunc.aboutRollingImgAnim.init();
    // }

    cmn.anim.init();
    cmn.scrTopAnim.init();

    // Footer on class toggle
    const ft = this._q("footer");
    gsap.to("footer",{
      scrollTrigger:{
        trigger: "footer",
        onEnter: ()=>{
          ft.classList.add("on");
        },
        onLeaveBack: ()=>{
          ft.classList.remove("on");
        }
      }
    });

    // Intro 없을 시 Header 애니메이션
    !this._isIntro && gsap.timeline({})
        .to("header h1", {
          height: 120,
          duration: 1,
          ease: "power2.out",
        }, ">")
        .to("header nav ul", {
          height: 50,
          duration: 1,
          ease: "power2.out",
        },"<");

        
    ScrollTrigger.refresh();
  },

  anim: {
    toggleClass: function () {
      const els = cmn._qq(".anim:not([data-st-init])");
      if (!els.length) return;

      els.forEach((el) => {
        el.setAttribute('data-st-init', 1);
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

  scrTopAnim: {
    scrTop: function(){
      const btn = cmn._q('.scr_btn');
      btn.addEventListener('click', ()=>{
        cmn._smooth.scrollTo(0 , true);
      });
    },
    init: function(){
      cmn._q(".scr_btn") && this.scrTop();
    }
  },

  introAnim: function () {
    const paths = [this._q("#path1"), this._q("#path2")];
    paths.forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    const pathTL = gsap.timeline({defaults: {ease: "power2.out"}});
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
          x: `-10vw`,
          duration: 0.9,
          ease: "power3.inOut"
        },">")
        .to(".item.right", {
          x: `10vw`,
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
          width: `100%`,
          height: `100vh`,
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut"
        },">")
        .to("#intro", {
          opacity: 0,
          visibility: 'hidden',
          duration: 0.2,
          ease: "power3.inOut",
          onComplete: () => {
            cmn._q(".sec_visual").classList.add('on');
            cmn._q(".coordinate_display").classList.add('on');
            this._smooth.paused(false);
          }
        },">")
        .to("header h1", {
          height: 120,
          duration: 1,
          ease: "power2.out",
        }, ">")
        .to("header nav ul", {
          height: 50,
          duration: 1,
          ease: "power2.out",
        },"<");
  },


  pageMoveTransition: {
    transition:function(){
      let tl = gsap.timeline();
      tl.to('.page-transition', { duration: .5, scaleX:1, transformOrigin: "bottom right", stagger: .2})
      tl.to('.page-transition', { duration: .5, scaleX: 0, transformOrigin: "bottom right", stagger: .1 , delay:.1})
    },
    init: ()=>{
      barba.init({
        transitions: [{
          name: 'default',
          leave(data){
            return gsap.to(data.current.container, {
              opacity: 0,
            })
          },
          enter(data){
            return gsap.from(data.next.container, {
              opacity: 0,
            })
          }
        }]
      });

      barba.hooks.once(()=>{
        cmn.pageInit();
      });

      barba.hooks.afterEnter(()=>{
        cmn.pageInit();
      });
    }
  },

  init: function () {
    if (this._inited) return;
    this._inited = true;
    this._smooth = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true
    });
    window._smooth = this._smooth;
    window._q = this._q;
    window._qq = this._qq;

    cmn._q("#intro") && this.introAnim();
    cmn._q('div[data-barba]') && this.pageMoveTransition.init();

    window.addEventListener('scroll', () => {
      let winY = window.scrollY;
      let hd = this._q('header');

      winY > hd.offsetHeight ? hdScrAnim.play() : hdScrAnim.reverse();
    });

    gsap.to("body",{
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        markers: false,
        pin: "header",
        pinSpacing: false,
      }
    });
    let hdScrAnim = gsap.timeline({paused: true});
    hdScrAnim
      .set("header h1", {
        height: 120,
        color: "#fff",
        backgroundColor: "#000",
        duration: .25,
        ease: "power2.out",
      })
      .to("header h1", {
        height: 0,
        color: "#fff",
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
        backgroundColor: "rgba(244,244,244,0.9)",
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
        backdropFilter: "blur(5px)",
        duration: .35,
        ease: "power2.out",
      }, "+=0.5")
      .to("header nav ul", {
        backgroundColor: "rgba(244,244,244,1)",
        height: 50,
        duration: .35,
        opacity: 0.8,
        ease: "power2.out",
      },">");

    this.pageInit();
  }
}

document.addEventListener("DOMContentLoaded", ()=>cmn.init());

export default cmn;