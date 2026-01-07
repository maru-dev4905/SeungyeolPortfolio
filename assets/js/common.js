// common.js
import Swup from 'https://unpkg.com/swup@4?module';

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
  _pageNamespace: null,
  _isIntro: null,
  _swup: null,

  // ---------------------------
  // ScrollSmoother 한 번만 만들기
  // ---------------------------
  initSmoother() {
    const wrapper = this._q("#smooth-wrapper");
    const content = this._q("#smooth-content");
    if (!wrapper || !content) {
      return;
    }

    if (this._smooth) return; // 한 번만 생성

    this._smooth = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      effects: true,
      normalizeScroll: true
    });
  },

  // ---------------------------
  // 페이지마다 다시 세팅되는 부분
  // ---------------------------
  setupScrollThings() {

    const page = this._q(".page[data-swup='container']");
    if (!page) {
      return;
    }

    this._pageNamespace =
        page.getAttribute("data-namespace") || page.id || null;

    // 인트로 유무
    this._isIntro = this._q("#intro");
    if (this._isIntro) {
      this._smooth && this._smooth.paused(true);
      this.introAnim();
    } else {
      this._smooth && this._smooth.paused(false);
    }

    // 공통 애니메이션
    this.anim.init();
    this.scrTopAnim.init();
    this._setupHeaderScroll();
    this._setupFooterAnim();

    // 인트로 없는 페이지에서는 헤더 오픈 애니메이션
    if (!this._isIntro) {
      gsap
          .timeline({})
          .to(
              "header h1",
              {
                height: 120,
                duration: 1,
                ease: "power2.out"
              },
              ">"
          )
          .to(
              "header nav ul",
              {
                height: 50,
                duration: 1,
                ease: "power2.out"
              },
              "<"
          );
    }

    if(this._pageNamespace.includes('works')){
      work_list.init();
    }else if(this._pageNamespace.includes('about')){
      prjFunc.aboutRollingImgAnim.init();
    }

    ScrollTrigger.refresh();
    this._smooth && this._smooth.refresh();
  },

  // ---------------------------
  // 페이지 떠나기 전에 ScrollTrigger 정리
  // ---------------------------
  destroyScrollThings() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    this._qq(".anim[data-st-init]").forEach((el) =>
        el.removeAttribute("data-st-init")
    );
  },

  // ---------------------------
  // 애니메이션: .anim show 토글
  // ---------------------------
  anim: {
    toggleClass() {
      const els = cmn._qq(".anim:not([data-st-init])");
      if (!els.length) return;

      els.forEach((el) => {
        el.setAttribute("data-st-init", 1);
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("show"),
          onLeaveBack: () => el.classList.remove("show")
        });
      });
    },
    init() {
      this._fadeEl = cmn._qq(".anim");
      this.toggleClass();
    }
  },

  // ---------------------------
  // 맨 위로 이동 버튼 (ScrollSmoother 사용)
  // ---------------------------
  scrTopAnim: {
    scrTop() {
      const btn = cmn._q(".scr_btn");
      if (!btn) return;

      btn.addEventListener("click", () => {
        if (cmn._smooth && cmn._smooth.scrollTo) {
          cmn._smooth.scrollTo(0, true);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    },
    init() {
      cmn._q(".scr_btn") && this.scrTop();
    }
  },

  // ---------------------------
  // 헤더 스크롤 고정/축소
  // ---------------------------
  _setupHeaderScroll() {
    const hd = this._q("header");
    if (!hd) return;

    gsap.to("body", {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        pin: "header",
        pinSpacing: false,
        markers: false
      }
    });

    const tl = gsap.timeline({ paused: true });

    tl.set("header h1", {
      height: 120,
      color: "#fff",
      backgroundColor: "#000",
      duration: 0.25,
      ease: "power2.out"
    })
        .to("header h1", {
          height: 0,
          color: "#fff",
          backgroundColor: "#000",
          duration: 0.25,
          ease: "power2.out"
        })
        .to(
            "header nav ul",
            {
              height: 0,
              backgroundColor: "#000",
              duration: 0.25,
              ease: "power2.out"
            },
            ">"
        )
        .set(
            "header h1",
            {
              backgroundColor: "rgba(244,244,244,0.9)"
            },
            ">"
        )
        .set(
            "header h1 p, header h1 span",
            {
              display: "none"
            },
            ">"
        )
        .set(
            "header nav ul",
            {
              backgroundColor: "rgba(0,0,0,0)"
            },
            ">"
        )
        .to("header h1", {
          height: 120,
          color: "#000",
          backdropFilter: "blur(5px)",
          duration: 0.35,
          ease: "power2.out"
        })
        .to(
            "header nav ul",
            {
              backgroundColor: "rgba(244,244,244,1)",
              height: 50,
              duration: 0.35,
              opacity: 0.8,
              ease: "power2.out"
            },
            ">"
        );

    window.addEventListener("scroll", () => {
      const winY = window.scrollY;
      winY > hd.offsetHeight ? tl.play() : tl.reverse();
    });
  },

  // ---------------------------
  // 푸터 애니메이션
  // ---------------------------
  _setupFooterAnim() {
    const ft = this._q("footer");
    if (!ft) return;

    gsap.to("footer", {
      scrollTrigger: {
        trigger: "footer",
        onEnter: () => ft.classList.add("on"),
        onLeaveBack: () => ft.classList.remove("on")
      }
    });
  },

  // ---------------------------
  // Intro 애니메이션
  // ---------------------------
  introAnim() {
    const paths = [this._q("#path1"), this._q("#path2")].filter(Boolean);
    if (!paths.length) return;

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 2,
          delay: 0.5
        },
        0
    )
        .to(
            paths,
            {
              fill: "#fff",
              attr: { fill: "#fff" },
              duration: 0.35
            },
            ">"
        )
        .to(
            ".item.left",
            {
              x: "-10vw",
              duration: 0.9,
              ease: "power3.inOut"
            },
            ">"
        )
        .to(
            ".item.right",
            {
              x: "10vw",
              duration: 0.9,
              ease: "power3.inOut"
            },
            "<"
        )
        .to(
            ".item.center",
            {
              width: 300,
              scaleX: 1,
              duration: 0.9,
              ease: "power3.inOut"
            },
            "<"
        )
        .to(
            ".item.center",
            {
              width: "100%",
              height: "100vh",
              scaleX: 1,
              duration: 1.5,
              ease: "power3.inOut"
            },
            ">"
        )
        .to(
            "#intro",
            {
              opacity: 0,
              visibility: "hidden",
              duration: 0.2,
              ease: "power3.inOut",
              onComplete: () => {
                this._q(".sec_visual")?.classList.add("on");
                this._q(".coordinate_display")?.classList.add("on");
                this._smooth && this._smooth.paused(false);
              }
            },
            ">"
        )
        .to(
            "header h1",
            {
              height: 120,
              duration: 1,
              ease: "power2.out"
            },
            ">"
        )
        .to(
            "header nav ul",
            {
              height: 50,
              duration: 1,
              ease: "power2.out"
            },
            "<"
        );
  },

  // ---------------------------
  // Swup 설정 (ScrollSmoother와 공존)
  // ---------------------------
  setupSwup() {
    if (this._swup) return;

    this._swup = new Swup({
      containers: [".page"],
      animationSelector: ".transition-fade"
    });

    // 새 콘텐츠 들어오기 직전: 기존 ScrollTrigger 정리
    this._swup.hooks.before("content:replace", () => {
      this.destroyScrollThings();
    });

    // 새 콘텐츠가 들어온 뒤: 공통 UI + 애니 다시 세팅
    this._swup.hooks.on("page:view", () => {
      prjFunc.init();
      this.setupScrollThings();
      moveMouseAnimation();
    });
  },

  // ---------------------------
  // 최초 init
  // ---------------------------
  init() {
    if (this._inited) return;
    this._inited = true;

    window._q = this._q;
    window._qq = this._qq;

    // ScrollSmoother 먼저 생성
    this.initSmoother();

    // 공통 UI
    prjFunc.init();

    // 전역 애니메이션
    noiseBackgroundAnimation();
    moveMouseAnimation();

    // 첫 페이지 세팅
    this.setupScrollThings();

    // Swup 페이지 전환 붙이기
    this.setupSwup();

  }
};

document.addEventListener("DOMContentLoaded", () => cmn.init());

export default cmn;
