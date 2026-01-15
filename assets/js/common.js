// common.js
import Swup from 'https://unpkg.com/swup@4?module';
import SwupHeadPlugin from 'https://unpkg.com/@swup/head-plugin@2?module';

import noiseBackgroundAnimation from "./modules/noiseAnim.js";
import moveMouseAnimation from "./modules/moveToMouse.js";
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
    this._setupFooterAnim();

    const menus = this._qq('.gnb li');

    // 메인 제외 헤더 오픈 애니메이션
    if (!this._pageNamespace.includes('main')) {
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

    gsap.set("header h1", { clearProps: "height,color,backgroundColor,backdropFilter" });
    gsap.set("header nav ul", { clearProps: "height,backgroundColor,opacity" });
    gsap.set("header h1 p, header h1 span", { clearProps: "display" });

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
    gsap.set("header h1", { height: 120 });
    gsap.set("header nav ul", { height: 50 });
  },

  // ---------------------------
  // 헤더 스크롤 고정/축소
  // ---------------------------
  _setupHeaderScroll() {
    const hd = this._q("header");
    if (!hd) return;

    // 만들어진 헤더 트리거/타임라인 제거
    this._headerST && this._headerST.kill();
    this._headerPinST && this._headerPinST.kill();
    this._headerTL && this._headerTL.kill();

    // 이전 페이지 남은 인라인 스타일 초기화
    gsap.set("header h1", { clearProps: "height,color,backgroundColor,backdropFilter" });
    gsap.set("header nav ul", { clearProps: "height,backgroundColor,opacity" });
    gsap.set("header h1 p, header h1 span", { clearProps: "display" });

    this._headerST && this._headerST.kill();
    this._headerST = null;


    // 헤더 상태 변화 타임라인
    const tl = gsap.timeline({ paused: true });

    tl.set("header h1", { height: 120, color:"#fff", backgroundColor:"#000" })
        .to("header h1", { height: 0, color:"#fff", backgroundColor:"#000", duration:0.25, ease:"power2.out" })
        .to("header nav ul", { height: 0, backgroundColor:"#000", duration:0.25, ease:"power2.out" }, ">")
        .set("header h1", { backgroundColor:"rgba(244,244,244,0.9)" }, ">")
        .set("header h1 p, header h1 span", { display:"none" }, ">")
        .set("header nav ul", { backgroundColor:"rgba(0,0,0,0)" }, ">")
        .to("header h1", { height:120, color:"#000", backdropFilter:"blur(5px)", duration:0.35, ease:"power2.out" })
        .to("header nav ul", { backgroundColor:"rgba(244,244,244,1)", height:50, opacity:0.8, duration:0.35, ease:"power2.out" }, ">");

    this._headerTL = tl;
    tl.progress(0).pause();

    this._headerST = ScrollTrigger.create({
      trigger: "body",
      start: () => `${hd.offsetHeight} top`,
      end: "max",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
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
    const paths = [this._q("#path1"), this._q("#path2")].filter(Boolean);
    if (!paths.length) {
      done && done();
      return;
    }

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to("#intro", { opacity: 1, visibility: "visible", duration: 0 })
        .to(paths, { strokeDashoffset: 0, duration: 2, delay: 0.5 }, 0)
        .to(paths, { fill: "#fff", attr: { fill: "#fff" }, duration: 0.35 }, ">")
        .to(".item.left", { x: "-10vw", duration: 0.9, ease: "power3.inOut" }, ">")
        .to(".item.right", { x: "10vw", duration: 0.9, ease: "power3.inOut" }, "<")
        .to(".item.center", { width: 300, scaleX: 1, duration: 0.9, ease: "power3.inOut" }, "<")
        .to(".item.center", { width: "100%", height: "100vh", duration: 1.5, ease: "power3.inOut" }, ">")
        .to("#intro", {
          opacity: 0,
          visibility: "hidden",
          duration: 0.2,
          ease: "power3.inOut",
          onComplete: () => {
            // 있으면 켜고, 없으면 그냥 패스
            this._q(".sec_visual")?.classList.add("on");
            this._q(".coordinate_display")?.classList.add("on");
            done && done();
          }
        }, ">")
        .to("header h1", { height: 120, duration: 1, ease: "power2.out" }, ">")
        .to("header nav ul", { height: 50, duration: 1, ease: "power2.out" }, "<");
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
      gsap.set(intro, {autoAlpha: 0, display: 'none'});
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

    window._q = this._q;
    window._qq = this._qq;

    // ScrollSmoother 먼저 생성
    this.initSmoother();

    // 공통 UI & 전역 애니메이션
    prjFunc.init();
    noiseBackgroundAnimation();
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

    const KEY = 'intro_enabled';
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
