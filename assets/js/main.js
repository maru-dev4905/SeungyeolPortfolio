// main.js
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const mainFunc = {
  _inited: false,
  _ns: "http://www.w3.org/2000/svg",
  _loco: null,
  _scroller_el: null,

  _q(sel, ctx = document) { return ctx.querySelector(sel); },

  _ensure_svg() {
    const wrap = this._q(".bg_c");
    if (!wrap) return null;

    let svg = this._q("#hero_svg", wrap);
    if (!svg) {
      svg = document.createElementNS(this._ns, "svg");
      svg.setAttribute("id", "hero_svg");
      svg.setAttribute("class", "hero_lines");
      svg.style.width = "100%";
      svg.style.height = "100vh";
      wrap.appendChild(svg);
    }

    const w = svg.clientWidth || svg.parentElement.clientWidth || window.innerWidth;
    const h = svg.clientHeight || Math.max(360, Math.round(window.innerHeight * 0.6));
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.innerHTML = "";
    return { svg, w, h };
  },

  _path(svg, d, stroke = "rgba(255,255,255,.35)", width = 1.6, id = "") {
    const p = document.createElementNS(this._ns, "path");
    p.setAttribute("d", d);
    p.setAttribute("stroke", stroke);
    p.setAttribute("stroke-width", width);
    p.setAttribute("fill", "none");
    if (id) p.setAttribute("id", id);
    svg.appendChild(p);
    return p;
  },

  _circle(svg, x, y, r, fill, class_name = "", stroke = null, sw = 1.2) {
    const c = document.createElementNS(this._ns, "circle");
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", r);
    c.setAttribute("fill", fill);
    if (stroke) {
      c.setAttribute("stroke", stroke);
      c.setAttribute("stroke-width", sw);
    }
    if (class_name) c.setAttribute("class", class_name);
    svg.appendChild(c);
    return c;
  },

  _draw_line(path_el, dur = 1.0, ease = "power2.out") {
    const len = path_el.getTotalLength();
    gsap.set(path_el, { strokeDasharray: len, strokeDashoffset: len });
    return gsap.to(path_el, { strokeDashoffset: 0, duration: dur, ease });
  },

  // ---------------- Locomotive Scroll 연결 ----------------
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

  visualAnim: function () {
    // ===== 1) SVG
    const box = this._ensure_svg();
    if (!box) return;
    const { svg, w, h } = box;

    // ===== 2) 레이아웃
    const y_mid  = Math.round(h * 0.52);
    const oreo_x = Math.round(w * 0.55);
    const gap    = Math.max(40, Math.round(w * 0.06));

    // 가로 라인(초기)
    const left_start   = { x: 0,                 y: y_mid };
    const left_end     = { x: oreo_x - gap/2,    y: y_mid };
    const right_start  = { x: oreo_x + gap/2,    y: y_mid };
    const right_end    = { x: w,                 y: y_mid };

    // (참조) 대각선 라인: 우측 끝 → 상단 중앙 (모핑 안함)
    const diag_start = { x: w, y: y_mid };
    const diag_end   = { x: Math.round(w * 0.5), y: 0 };

    // 3) 요소
    const left_line  = this._path(svg, `M${left_start.x} ${left_start.y} L${left_end.x} ${left_end.y}`, "rgba(255,255,255,.38)", 1.6, "left_line");
    const right_line = this._path(svg, `M${right_start.x} ${right_start.y} L${right_end.x} ${right_end.y}`, "rgba(255,255,255,.38)", 1.6, "right_line");
    const diag_line  = this._path(svg, `M${diag_start.x} ${diag_start.y} L${diag_end.x} ${diag_end.y}`, "rgba(255,255,255,.25)", 1.6, "diag_line");

    // 점 (왼쪽 라인 위 5개 균등)
    const dots_cnt = 5;
    const dots = [];
    const left_len = left_line.getTotalLength();
    const right_len = right_line.getTotalLength();
    const left_start_pt = left_line.getPointAtLength(0);

    for (let i = 0; i < dots_cnt; i++) {
      const t_i = i / (dots_cnt - 1);
      const pt  = left_line.getPointAtLength(left_len * t_i);
      const dot = this._circle(svg, left_start_pt.x, left_start_pt.y, 3, "#fff", "dot_left");
      gsap.set(dot, { opacity: 0 });
      dots.push({ el: dot, progress: t_i, tx: pt.x, ty: pt.y });
    }

    // 오레오
    const oreo_outer = this._circle(svg, oreo_x, y_mid, 25, "#161616", "", "#fff", 1.2);
    const oreo_inner = this._circle(svg, oreo_x, y_mid, 4, "#fff");
    gsap.set([oreo_outer, oreo_inner], { opacity: 0, scale: 0, transformOrigin: "50% 50%" });

    // ===== 4) 인트로(핀): 그려지는 순서 =====
    const tl_intro = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        scroller: this._scroller_el,   // ← Locomotive 컨테이너 지정
        trigger: ".sec_cont1",
        start: "top top",
        end: "+=300%",
        pin: true,
        pinSpacing: true,
        markers: true,
        scrub: false
      }
    });

    // (배경 고정이 필요하면 유지, 아니면 제거)
    ScrollTrigger.create({
      scroller: this._scroller_el,     // ← 중요
      trigger: ".bg_c",
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: true,
      markers: true
    });

    // 1) 왼쪽 라인 드로잉
    tl_intro.add(this._draw_line(left_line, 1.0));

    // 2) 점 등장(왼쪽 시작→자기 자리)
    dots.forEach((d, i) => {
      tl_intro.to(d.el, {
        duration: 0.45,
        opacity: 1,
        motionPath: { path: left_line, align: left_line, autoRotate: false, start: 0, end: d.progress }
      }, "-=0.28" + (i * 0.12));
    });

    // 좌표 고정(이후 역재생 대비)
    tl_intro.add(() => {
      dots.forEach((d) => {
        d.el.setAttribute("cx", d.tx);
        d.el.setAttribute("cy", d.ty);
        gsap.set(d.el, { clearProps: "transform" });
      });
    });

    // 3) 오레오 등장
    tl_intro.to([oreo_outer, oreo_inner], { opacity: 1, scale: 1, duration: 0.5 }, "+=0.05");

    // 4) 오른쪽 라인 드로잉
    tl_intro.add(this._draw_line(right_line, 0.9), "+=0.1");

    // 5) 대각선 라인 드로잉(참조용)
    tl_intro.add(this._draw_line(diag_line, 0.9), "-=0.25");

    // ===== 5) 스크럽: .visual 페이드 → 역순 사라짐 (스크롤 업하면 다시 나타남) =====
    const tl_scroll = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        scroller: this._scroller_el,   // ← 중요
        trigger: this._scroller_el,    // main과 동일
        start: "12.5% top",              // 어느 정도 스크롤 시
        end: "+=100%",                 // 앞 50%: visual fade / 뒤 50%: 역순 사라짐
        scrub: true,
        markers: true
      }
    });

    // [Phase 1] .visual 페이드다운 (0%→50%)
    tl_scroll.to(".sec_cont1 .visual", {
      opacity: 0,
      bottom: "-12vh"
    }, 0).addLabel("reverse_start", 1); // 전체의 절반 지점

    // [Phase 2] 역순 사라짐 (50%→100%)
    // a) 대각선 라인 페이드
    tl_scroll.to(diag_line, { opacity: 0, duration: 0.15 }, "reverse_start");

    // b) 오른쪽 라인 역드로
    tl_scroll.to(right_line, {
      strokeDashoffset: right_len,
      duration: 0.35
    }, "reverse_start+=0.05");

    // c) 오레오 축소/페이드
    tl_scroll.to([oreo_outer, oreo_inner], {
      opacity: 0,
      scale: 0.8,
      duration: 0.25
    }, "reverse_start+=0.18");
    
    // d) 점들 되감기(오른쪽 → 왼쪽 순)
    const reversed = dots.slice().reverse();
    reversed.forEach((d, idx) => {
      const proxy = { t: d.progress };
      tl_scroll.to(proxy, {
        t: 0,
        duration: 0.25,
        onUpdate: () => {
          const p = left_line.getPointAtLength(left_len * proxy.t);
          d.el.setAttribute("cx", p.x);
          d.el.setAttribute("cy", p.y);
        }
      }, `reverse_start+=${0.22 + idx * 0.07}`);
      tl_scroll.to(d.el, { opacity: 0, duration: 0.15 }, `reverse_start+=${0.28 + idx * 0.07}`);
    });

    // e) 왼쪽 라인 역드로 (맨 마지막)
    tl_scroll.to(left_line, {
      strokeDashoffset: left_len,
      duration: 0.35
    }, `reverse_start+=${0.25 + reversed.length * 0.07}`);
    
    tl_scroll
      .to(".sec_cont1 .visual", { opacity: 0, bottom: "-12vh" }, 0)
      .addLabel("reverse_start", 1); // 절반 지점

    // === 여기 추가: 원(top/left) 스크럽 이동 ===
    tl_scroll.to(".bg_c .circle", {
      top: "20%",
      left: "-36%"
    }, "reverse_start"); // 역재생 시작과 함께 쭉 이동(스크럽)

    
  },

  init: function () {
    if (mainFunc._inited) return;
    mainFunc._inited = true;

    // 1) Locomotive Scroll 먼저 세팅
    mainFunc._setup_smooth_scroll();

    // 2) 애니메이션 빌드
    mainFunc.visualAnim();

    // (옵션) 리사이즈 대응: loco + ST 동기 업데이트
    // let resize_timer;
    // window.addEventListener("resize", () => {
    //   clearTimeout(resize_timer);
    //   resize_timer = setTimeout(() => {
    //     // 기존 ST 제거 후 재빌드가 가장 안전
    //     ScrollTrigger.getAll().forEach(st => st.kill());
    //     this._loco && this._loco.destroy();
    //     this._setup_smooth_scroll();
    //     this.visualAnim();
    //   }, 150);
    // });
  }
};

document.addEventListener("DOMContentLoaded", mainFunc.init);
