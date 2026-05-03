// moveToMouse.js
// 768px 이하: 커스텀 커서·mousemove 비활성, 기본 커서(CSS와 함께 사용)
const CURSOR_MAX_WIDTH = 768;

let cursorInited = false;
let scaleAnim = null;
let mouseMoveHandler = null;
let isVisible = false;

function customCursorEnabled() {
  return window.innerWidth > CURSOR_MAX_WIDTH;
}

function hideCursorVisual() {
  if (typeof gsap === "undefined") return;
  gsap.set(".cursor-outline, .cursor-dot", { opacity: 0, visibility: "hidden" });
}

function prepareCursorVisual() {
  if (typeof gsap === "undefined") return;
  gsap.set(".cursor-outline, .cursor-dot", { visibility: "visible" });
}

function detachMouseMove() {
  if (!mouseMoveHandler) return;
  document.removeEventListener("mousemove", mouseMoveHandler);
}

function attachMouseMove() {
  if (!mouseMoveHandler) return;
  document.addEventListener("mousemove", mouseMoveHandler);
}

function syncDesktopCursorMode() {
  if (!mouseMoveHandler || typeof gsap === "undefined") return;

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  if (!cursorDot || !cursorOutline) return;

  if (!customCursorEnabled()) {
    detachMouseMove();
    hideCursorVisual();
    isVisible = false;
    if (scaleAnim) {
      scaleAnim.progress(0);
      scaleAnim.pause();
    }
    return;
  }

  prepareCursorVisual();
  isVisible = false;
  gsap.set(cursorDot, { scale: 0.1, opacity: 0 });
  gsap.set(cursorOutline, { scale: 0.5, opacity: 0 });
  attachMouseMove();
}

export default function moveMouseAnimation() {
  if (!cursorInited) {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (!cursorDot || !cursorOutline) {
      console.warn("커서 요소(.cursor-dot, .cursor-outline)를 찾지 못했습니다.");
      return;
    }

    if (typeof gsap === "undefined") {
      return;
    }

    cursorInited = true;

    gsap.set(cursorDot, { scale: 0.1, opacity: 0 });
    gsap.set(cursorOutline, { scale: 0.5, opacity: 0 });

    const xCTo = gsap.quickTo(cursorOutline, "left", {
      duration: 0.2,
      ease: "power3"
    });
    const yCTo = gsap.quickTo(cursorOutline, "top", {
      duration: 0.2,
      ease: "power3"
    });

    const xDTo = gsap.quickTo(cursorDot, "left", {
      duration: 0.6,
      ease: "power3"
    });
    const yDTo = gsap.quickTo(cursorDot, "top", {
      duration: 0.6,
      ease: "power3"
    });

    function updateDisplay(e) {
      const pageX = document.querySelector(".coordinate_display_x");
      const pageY = document.querySelector(".coordinate_display_y");
      if (!pageX || !pageY) return;

      pageX.innerText = `X: ${e.pageX}px`;
      pageY.innerText = `Y: ${e.pageY}px`;
    }

    mouseMoveHandler = function mouseMove(e) {
      if (!customCursorEnabled()) return;

      if (!isVisible) {
        gsap.set(".cursor-outline, .cursor-dot", { opacity: 1 });
        isVisible = true;
      }

      const cursorPosition = {
        left: e.clientX - 40,
        top: e.clientY - 40
      };

      xCTo(cursorPosition.left);
      yCTo(cursorPosition.top);
      xDTo(cursorPosition.left);
      yDTo(cursorPosition.top);

      updateDisplay(e);
    };

    scaleAnim = gsap.timeline({ paused: true })
      .to(".cursor-outline", {
        scale: 1
      })
      .to(
        ".cursor-dot",
        {
          scale: 1,
          duration: 0.35
        },
        0
      );

    window.addEventListener("resize", syncDesktopCursorMode);
    syncDesktopCursorMode();
  }

  const targets = gsap.utils.toArray(".target");

  targets.forEach((target) => {
    if (target.dataset.cursorBound === "1") return;
    target.dataset.cursorBound = "1";

    target.addEventListener("mouseenter", () => {
      if (!customCursorEnabled() || !target.classList.contains("target")) return;
      scaleAnim && scaleAnim.play();
    });

    target.addEventListener("mouseleave", () => {
      if (!customCursorEnabled() || !target.classList.contains("target")) return;
      scaleAnim && scaleAnim.reverse();
    });
  });
}
