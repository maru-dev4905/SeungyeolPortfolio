// moveToMouse.js
let cursorInited = false;   // 문서 전체 리스너 중복 방지용
let scaleAnim = null;       // 커서 확대/축소 타임라인 공유

export default function moveMouseAnimation() {
  // 1) 커서 기본 세팅 + 문서 이벤트는 한 번만
  if (!cursorInited) {
    cursorInited = true;

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (!cursorDot || !cursorOutline) {
      console.warn("커서 요소(.cursor-dot, .cursor-outline)를 찾지 못했습니다.");
      return;
    }

    // 기본 상태 세팅
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

    let isVisible = false;

    function updateDisplay(e) {
      const pageX = document.querySelector(".coordinate_display_x");
      const pageY = document.querySelector(".coordinate_display_y");
      if (!pageX || !pageY) return; // 이 페이지에 표시 UI 없으면 패스

      pageX.innerText = `X: ${e.pageX}px`;
      pageY.innerText = `Y: ${e.pageY}px`;
    }

    function mouseMove(e) {
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
    }

    // 문서 전체 마우스 이동 이벤트 → 한 번만 등록
    document.addEventListener("mousemove", mouseMove);

    // 커서 확대/축소 타임라인 (전역에서 재사용)
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
  }

  // 2) 여기부터는 "현재 DOM의 .target"들에 hover 이벤트를 붙이는 파트
  //    → Swup 페이지 전환 후 moveMouseAnimation() 다시 호출하면
  //       새로 생긴 .target에만 이벤트 붙는다.
  const targets = gsap.utils.toArray(".target");

  targets.forEach((target) => {
    // 이미 바인딩된 애는 다시 안 건드리기 위해 플래그 사용
    if (target.dataset.cursorBound === "1") return;
    target.dataset.cursorBound = "1";

    target.addEventListener("mouseenter", () => {
      scaleAnim && scaleAnim.play();
    });

    target.addEventListener("mouseleave", () => {
      scaleAnim && scaleAnim.reverse();
    });
  });
}
