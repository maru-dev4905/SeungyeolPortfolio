// common.js
import Swup from 'https://unpkg.com/swup@4?module';
import SwupHeadPlugin from 'https://unpkg.com/@swup/head-plugin@2?module';

import noiseBackgroundAnimation from "./modules/noiseAnim.js";
import moveMouseAnimation, {
  releaseIntroCursorSuppression,
  scheduleRevealCustomCursorAfterIntro,
  suppressCustomCursorForIntro,
} from "./modules/moveToMouse.js";
import prjFunc from "./prj.js";
import mainFunc from "./main.js";
import {work_list, work} from "./work.js";
import contactFunc from "./contact.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrambleTextPlugin);

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
  _headerST: null,
  _headerPinST: null,
  _headerTL: null,
  _menuBtnHandler: null,
  _copyToastEl: null,
  _copyToastTimer: null,

  _canControlHeaderShowClass() {
    return window.innerWidth > 1280;
  },
  _headerShowTimer: null,

  _setupHeaderMenuToggle() {
    const menuBtn = this._q("header .menu_btn");
    const headerTitle = this._q("header h1");
    const headerNav = this._q("header nav");
    if (!menuBtn || !headerTitle || !headerNav) return;

    if (this._menuBtnHandler) {
      menuBtn.removeEventListener("click", this._menuBtnHandler);
      this._menuBtnHandler = null;
    }

    this._menuBtnHandler = () => {
      if (this._canControlHeaderShowClass()) return;
      headerNav.classList.toggle("show");
    };

    menuBtn.addEventListener("click", this._menuBtnHandler);

    if (this._canControlHeaderShowClass()) {
      headerTitle.classList.add("show");
      headerNav.classList.add("show");
    } else {
      headerTitle.classList.add("show");
      headerNav.classList.remove("show");
    }
  },

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

    // 공통 애니메이션
    this.anim.init();
    this.scrTopAnim.init();
    this._setupHeaderScroll();
    this._setupHeaderMenuToggle();
    this._setupFooterAnim();

    this._bindCopyButtons();

    const menus = this._qq('.gnb li');

    menus.forEach((menu)=>menu.classList.remove('on'));
    if(this._pageNamespace.includes('works')){
      menus[1].classList.add('on');
      work_list.init();
    }else if(this._pageNamespace.includes('work')){
      menus[1].classList.add('on');
      work.init();
    }else if(this._pageNamespace.includes('contact')){
      menus[2].classList.add('on');
      contactFunc.init();
    }else if(this._pageNamespace.includes('about')){
      menus[0].classList.add('on');
      prjFunc.aboutRollingImgAnim.init();
    }else if(this._pageNamespace.includes('main')){
      this._q(".sec_visual")?.classList.add("on");
      this._q(".coordinate_display")?.classList.add("on");

      this._openHeaderInstant();
      this._smooth && this._smooth.paused(false);
      mainFunc.init();
    }

    ScrollTrigger.refresh();
    this._smooth && this._smooth.refresh();
  },

  _bindCopyButtons() {
    const copyBtns = this._qq(".copy_btn[data-target]");
    if (!copyBtns.length) return;

    copyBtns.forEach((btn) => {
      if (btn.dataset.copyBound === "1") return;
      btn.dataset.copyBound = "1";

      btn.addEventListener("click", async () => {
        const targetId = btn.getAttribute("data-target");
        const targetEl = targetId ? document.getElementById(targetId) : null;
        const value = targetEl ? targetEl.innerText.trim() : "";
        if (!value) return;

        try {
          let ok = false;

          // 1) Clipboard API 우선 시도
          if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            await navigator.clipboard.writeText(value);
            ok = true;
          } else {
            ok = false;
          }

          // 2) 실패/비지원 시 textarea fallback
          if (!ok) {
            const ta = document.createElement("textarea");
            ta.value = value;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            ta.style.top = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            ok = true; // execCommand가 예외를 던지지 않는 케이스 기준
          }

          if (ok) this._showCopyToast("복사가 완료되었습니다");
        } catch (e) {
          console.warn("[copy_btn] copy failed:", e);
          this._showCopyToast("복사가 실패했습니다");
        }
      });
    });
  },

  _showCopyToast(message) {
    if (!this._copyToastEl) {
      const el = document.createElement("div");
      el.id = "copyToast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.bottom = "6.5rem";
      el.style.transform = "translateX(-50%) translateY(0)";
      el.style.padding = "0.75rem 1.25rem";
      el.style.borderRadius = "3.125rem";
      el.style.backgroundColor = "rgba(31, 31, 31, 0.75)";
      el.style.border = "1px solid #aaa";
      el.style.color = "#fff";
      el.style.fontSize = "0.875rem";
      el.style.fontWeight = "500";
      el.style.letterSpacing = "0.02rem";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.zIndex = "1000001";
      el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      document.body.appendChild(el);
      this._copyToastEl = el;
    }

    const el = this._copyToastEl;
    el.textContent = message;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(-6px)";

    if (this._copyToastTimer) clearTimeout(this._copyToastTimer);
    this._copyToastTimer = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(0)";
    }, 1400);
  },

  // ---------------------------
  // 페이지 떠나기 전에 ScrollTrigger 정리
  // ---------------------------
  destroyScrollThings() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    this._qq(".anim[data-st-init]").forEach((el) =>
        el.removeAttribute("data-st-init")
    );

    this._headerST && this._headerST.kill(); this._headerST = null;
    this._headerPinST && this._headerPinST.kill(); this._headerPinST = null;
    this._headerTL && this._headerTL.kill(); this._headerTL = null;

    gsap.set("header h1", { clearProps: "color,backgroundColor,backdropFilter" });
    gsap.set("header nav ul", { clearProps: "backgroundColor,opacity" });
    gsap.set("header h1 p, header h1 span", { clearProps: "display" });
    this._q("header h1")?.classList.remove("show");
    this._q("header nav")?.classList.remove("show");
    const menuBtn = this._q("header .menu_btn");
    if (menuBtn && this._menuBtnHandler) {
      menuBtn.removeEventListener("click", this._menuBtnHandler);
      this._menuBtnHandler = null;
    }
    if (this._headerShowTimer) {
      clearTimeout(this._headerShowTimer);
      this._headerShowTimer = null;
    }

    if(this._pageNamespace.includes('main')) mainFunc.destroy && mainFunc.destroy();
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
      ScrollTrigger.refresh();
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
  // 헤더 즉시 열림 함수
  // ---------------------------
  _openHeaderInstant() {
    this._q("header h1")?.classList.add("show");
    if (this._canControlHeaderShowClass()) {
      this._q("header nav")?.classList.add("show");
    } else {
      this._q("header nav")?.classList.remove("show");
    }
  },

  // ---------------------------
  // 헤더 스크롤 고정/축소
  // ---------------------------
  _setupHeaderScroll() {
    const hd = this._q("header");
    const headerTitle = this._q("header h1");
    const headerNav = this._q("header nav");
    if (!hd) return;

    // 만들어진 헤더 트리거/타임라인 제거
    this._headerST && this._headerST.kill();
    this._headerPinST && this._headerPinST.kill();
    this._headerTL && this._headerTL.kill();

    if (this._headerShowTimer) {
      clearTimeout(this._headerShowTimer);
      this._headerShowTimer = null;
    }

    this._headerST && this._headerST.kill();
    this._headerST = null;

    if (this._canControlHeaderShowClass()) {
      headerTitle?.classList.add("show");
      headerNav?.classList.add("show");
    } else {
      headerTitle?.classList.add("show");
      headerNav?.classList.remove("show");
    }
    let didRunTopRangeTransition = false;
    let wasWithinTopRange = true;
    let lastScroll = 0;

    const runHeaderShowCycle = () => {
      headerTitle?.classList.remove("show");
      if (this._canControlHeaderShowClass()) {
        headerNav?.classList.remove("show");
      }
      if (this._headerShowTimer) {
        clearTimeout(this._headerShowTimer);
        this._headerShowTimer = null;
      }
      this._headerShowTimer = setTimeout(() => {
        headerTitle?.classList.add("show");
        if (this._canControlHeaderShowClass()) {
          headerNav?.classList.add("show");
        }
        this._headerShowTimer = null;
      }, 1000);
    };

    const tl = gsap.timeline({ paused: true });

    tl.set("header h1", { color:"#fff", backgroundColor:"#000" })
      .to("header h1", {
        backgroundColor:"#000",
        duration:0.25,
        ease:"power2.out"
      })
      .to("header nav ul", {
        backgroundColor:"#000",
        duration:0.25,
        ease:"power2.out"
      }, "<")
      .set("header h1", { backgroundColor:"rgba(244,244,244,0.9)" }, ">")
      .set("header h1 p, header h1 span", { display:"none" }, ">")
      .set("header nav ul", { backgroundColor:"rgba(0,0,0,0)" }, ">")
      .to("header h1", {
        color:"#000",
        backdropFilter:"blur(5px)",
        duration:0.35,
        ease:"power2.out"
      })
      .to("header nav ul", {
        backgroundColor:"rgba(244,244,244,1)",
        opacity:0.8,
        duration:0.35,
        ease:"power2.out"
      }, "<");

    this._headerTL = tl;
    tl.progress(0).pause();

    this._headerST = ScrollTrigger.create({
      trigger: "body",
      start: () => `${hd.offsetHeight} top`,
      end: "max",
      onEnter: () => {
        runHeaderShowCycle();
        tl.play(0);
        didRunTopRangeTransition = true;
      },
      onLeaveBack: () => {
        tl.reverse();
        runHeaderShowCycle();
        didRunTopRangeTransition = true;
      },
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        const isWithinTopRange = currentScroll <= hd.offsetHeight;
        const didScroll = Math.abs(currentScroll - lastScroll) > 1;

        if (didScroll && isWithinTopRange && !wasWithinTopRange && !didRunTopRangeTransition) {
          runHeaderShowCycle();
          didRunTopRangeTransition = true;
        }

        if (!isWithinTopRange) {
          didRunTopRangeTransition = false;
        }

        wasWithinTopRange = isWithinTopRange;
        lastScroll = currentScroll;
      },
      // smoother 쓰면 scroller 지정
      scroller: this._smooth ? this._smooth.wrapper() : undefined,
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
      this._headerST && this._headerST.refresh();
      this._headerST && this._headerST.update();
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
  introAnim(done) {
    const intro = this._q("#intro");
    if (!intro || !gsap?.timeline) {
      releaseIntroCursorSuppression();
      done && done();
      return;
    }

    const title = intro.querySelector(".intro-title");
    const line = intro.querySelector(".intro-line");
    const lineWrap = intro.querySelector(".line-wrap");
    const blackDisc = intro.querySelector(".black-disc");
    const dots = [
      intro.querySelector(".travel-dot--1"),
      intro.querySelector(".travel-dot--2"),
      intro.querySelector(".travel-dot--3"),
      intro.querySelector(".travel-dot--4"),
    ];
    if (!title || !line || !lineWrap || !blackDisc || dots.some((d) => !d)) {
      releaseIntroCursorSuppression();
      done && done();
      return;
    }

    const d1 = dots[0];
    const d2 = dots[1];
    const d3 = dots[2];
    const d4 = dots[3];

    const pxTravel = () => Math.max(0, lineWrap.offsetWidth - 8);

    gsap.set(dots, { autoAlpha: 0, left: 0 });
    gsap.set(line, { scaleX: 0 });
    gsap.set(blackDisc, { scale: 0 });
    gsap.set(title, { opacity: 0, y: 28 });

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    const segMoveDur = 0.52;
    const segPause = 0.078;
    const segEase = "power2.inOut";
    const echoDelay2 = 0.072;
    const echoDelay3 = 0.148;
    const echoDelay4 = 0.22;

    const cs = getComputedStyle(lineWrap);
    const dotOp = [
      parseFloat(cs.getPropertyValue("--dot-o-1").trim()) || 1,
      parseFloat(cs.getPropertyValue("--dot-o-2").trim()) || 0.7,
      parseFloat(cs.getPropertyValue("--dot-o-3").trim()) || 0.32,
      parseFloat(cs.getPropertyValue("--dot-o-4").trim()) || 0.08,
    ];

    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.88,
      ease: "power3.out",
    })
      .to(
        line,
        { scaleX: 1, duration: 0.68, ease: "power2.inOut" },
        ">",
      )
      .to(
        d1,
        {
          opacity: dotOp[0],
          visibility: "visible",
          duration: 0.36,
          ease: "power2.out",
        },
        ">",
      )
      .to(
        d2,
        {
          opacity: dotOp[1],
          visibility: "visible",
          duration: 0.36,
          ease: "power2.out",
        },
        "<",
      )
      .to(
        d3,
        {
          opacity: dotOp[2],
          visibility: "visible",
          duration: 0.36,
          ease: "power2.out",
        },
        "<",
      )
      .to(
        d4,
        {
          opacity: dotOp[3],
          visibility: "visible",
          duration: 0.36,
          ease: "power2.out",
        },
        "<",
      );

    const L = pxTravel();
    function pSeg(i) {
      return (L * i) / 4;
    }

    for (var k = 1; k <= 4; k++) {
      tl.to(d1, { left: pSeg(k), duration: segMoveDur, ease: segEase }, ">");
      if (k >= 2) {
        tl.to(
          d2,
          {
            left: pSeg(k - 1),
            duration: segMoveDur * 0.92,
            delay: echoDelay2,
            ease: segEase,
          },
          "<",
        );
      }
      if (k >= 3) {
        tl.to(
          d3,
          {
            left: pSeg(k - 2),
            duration: segMoveDur * 0.86,
            delay: echoDelay3,
            ease: segEase,
          },
          "<",
        );
      }
      if (k >= 4) {
        tl.to(
          d4,
          {
            left: pSeg(k - 3),
            duration: segMoveDur * 0.8,
            delay: echoDelay4,
            ease: segEase,
          },
          "<",
        );
      }
      if (k < 4) {
        tl.to({}, { duration: segPause });
      }
    }

    const introOutDur = 1.05;
    const introOutEase = "power3.inOut";

    tl.to(blackDisc, { scale: 1, duration: 0.56, ease: "power3.out" }, ">")
      .to(
        intro,
        {
          autoAlpha: 0,
          duration: introOutDur,
          ease: introOutEase,
          onComplete: () => {
            intro.classList.add("intro-done");
            this._q(".sec_visual")?.classList.add("on");
            this._q(".coordinate_display")?.classList.add("on");
            scheduleRevealCustomCursorAfterIntro(500);
            done && done();
          },
        },
        "+=0.25",
      )
      .to(
        "header h1",
        {
          duration: 1,
          ease: "power2.out",
          onStart: () => {
            if (!this._canControlHeaderShowClass()) return;
            this._q("header h1")?.classList.add("show");
          },
        },
        ">",
      )
      .to(
        "header nav",
        {
          duration: 1,
          ease: "power2.out",
          onStart: () => {
            if (!this._canControlHeaderShowClass()) return;
            this._q("header nav")?.classList.add("show");
          },
        },
        "<",
      );
  },

  // ---------------------------
  // Swup 전환 후 트리거 위치 안정화용 refresh
  // (이미지/폰트 로드 + 다음 프레임)
  // ---------------------------
  _smartRefresh(){
    const doRefresh = () => {
      ScrollTrigger.refresh(true);
      this._smooth && this._smooth.refresh();
    };

    requestAnimationFrame(()=>{
      doRefresh();

      if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(()=> doRefresh()).catch(()=>{});
      }

      const imgs = Array.from(document.images).filter(img => !img.complete);
      if(imgs.length){
        let done = 0;
        const onDone = () => {
          done +=1;
          if(done === imgs.length) doRefresh();
        };
        imgs.forEach(img => {
          img.addEventListener('load', onDone, {once:true});
          img.addEventListener('error', onDone, {once: true});
        });
      }else{
        setTimeout(doRefresh, 50);
      }
    })
  },

  // ---------------------------
  // Swup 설정 (ScrollSmoother와 공존)
  // ---------------------------
  setupSwup() {
    if (this._swup) return;

    this._swup = new Swup({
      containers: [".page"],
      animationSelector: "#swup-overlay",
      plugins: [new SwupHeadPlugin()]
    });

    // 새 콘텐츠 들어오기 직전: 기존 ScrollTrigger 정리
    this._swup.hooks.before("content:replace", () => {
      this.destroyScrollThings();
      document.documentElement.classList.add("is-changing");
    });

    // 새 콘텐츠가 들어온 뒤: 공통 UI + 애니 다시 세팅
    this._swup.hooks.on("page:view", () => {
      document.documentElement.classList.remove("is-changing");
      if(this._smooth && this._smooth.scrollTo){
        this._smooth.scrollTo(0, false);
      }else{
        window.scrollTo(0,0);
      }

      this._syncIntroVisibility();

      prjFunc.init();
      this.setupScrollThings();
      moveMouseAnimation();

      this._smartRefresh();
    });
  },

  // ---------------------------
  // 세션에 값이 있으면 인트로는 보여주지 않음
  // ---------------------------
  _syncIntroVisibility(){
    const intro = this._q('#intro');
    if(!intro) return false;

    const KEY = 'intro_enabled';

    if(sessionStorage.getItem(KEY)){
      gsap.set(intro, {autoAlpha: 0, opacity: 0, visibility: 'hidden'});
    }else{
      gsap.set(intro, {display: 'flex', autoAlpha: 0, visibility: 'hidden'});
    }
  },

  // ---------------------------
  // 최초 init
  // ---------------------------
  init() {
    if (this._inited) return;
    this._inited = true;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    window._q = this._q;
    window._qq = this._qq;

    // ScrollSmoother 먼저 생성
    this.initSmoother();

    if (this._smooth && this._smooth.scrollTo) {
      this._smooth.scrollTo(0, false);
    }

    window.addEventListener("load", () => {
      if (this._smooth && this._smooth.scrollTo) {
        this._smooth.scrollTo(0, false);
      } else {
        window.scrollTo(0, 0);
      }
    }, { once: true });

    // 공통 UI & 전역 애니메이션
    prjFunc.init();
    noiseBackgroundAnimation();

    const KEY = "intro_enabled";
    if (!sessionStorage.getItem(KEY)) {
      suppressCustomCursorForIntro();
    }
    moveMouseAnimation();

    // Swup 페이지 전환
    this.setupSwup();

    this._syncIntroVisibility();

    // 인트로 스킵 시 실행
    const afterIntro = () => {
      this._smooth && this._smooth.paused(false);
      this.setupScrollThings();
      this._smartRefresh && this._smartRefresh();
    };

    const shouldPlayIntro = !sessionStorage.getItem(KEY);

    if(shouldPlayIntro){
      const intro = this._q('#intro');
      if (intro) gsap.set(intro, {display: 'flex', autoAlpha: 1, visibility: 'visible'});

      this._smooth && this._smooth.paused(true);
      this.introAnim(()=>{
        sessionStorage.setItem(KEY, '1');
        this._syncIntroVisibility();
        afterIntro();
      });
    }else{
      afterIntro();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => cmn.init());

export default cmn;
