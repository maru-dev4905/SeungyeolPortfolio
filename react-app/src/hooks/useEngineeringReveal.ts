import { useEffect } from "react";

const REVEAL_SELECTOR = ".eng_reveal";
const COUNT_DURATION = 1100;

function animateCount(element: HTMLElement) {
  const target = Number(element.dataset.count);

  if (!Number.isFinite(target)) {
    return;
  }

  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / COUNT_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

/**
 * #engineering 안의 .eng_reveal 요소를 화면에 들어올 때 한 번 나타나게 하고,
 * [data-count] 숫자는 0에서 목표값까지 센다.
 * 모션 줄이기 설정이나 IntersectionObserver가 없으면 처음부터 모두 보여 준다.
 */
export function useEngineeringReveal(deps: unknown[] = []) {
  useEffect(() => {
    const root = document.getElementById("engineering");

    if (!root) {
      return;
    }

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      return;
    }

    root.classList.add("eng_ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          element.classList.add("is-in");
          element
            .querySelectorAll<HTMLElement>("[data-count]")
            .forEach(animateCount);
          observer.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("eng_ready");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
