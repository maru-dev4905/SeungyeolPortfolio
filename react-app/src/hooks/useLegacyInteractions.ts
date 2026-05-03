import { useEffect } from "react";

type PageNamespace = "main" | "about" | "works" | "work" | "contact";

type ScrollTriggerInstance = {
  kill?: () => void;
  refresh?: () => void;
  update?: () => void;
};

type ScrollSmootherInstance = {
  scrollTo?: (value: number, smooth?: boolean) => void;
  refresh?: () => void;
  kill?: () => void;
  paused?: (value: boolean) => void;
  wrapper?: () => Element;
};

type TimelineInstance = {
  set: (
    target: unknown,
    vars: Record<string, unknown>,
    position?: string | number,
  ) => TimelineInstance;
  to: (
    target: unknown,
    vars: Record<string, unknown>,
    position?: string | number,
  ) => TimelineInstance;
  play?: () => void;
  reverse?: () => void;
  kill?: () => void;
  progress?: (value: number) => { pause?: () => void };
};

type GsapWindow = Window &
  typeof globalThis & {
    gsap?: {
      registerPlugin?: (...args: unknown[]) => void;
      set?: (target: unknown, vars: Record<string, unknown>) => void;
      to?: (
        target: unknown,
        vars: Record<string, unknown>,
        position?: string | number,
      ) => void;
      timeline?: (vars?: Record<string, unknown>) => TimelineInstance;
      quickTo?: (
        target: unknown,
        property: string,
        vars: Record<string, unknown>,
      ) => (value: number) => void;
    };
    ScrollTrigger?: {
      create?: (vars: Record<string, unknown>) => ScrollTriggerInstance;
      refresh?: (force?: boolean) => void;
    };
    ScrollSmoother?: {
      create?: (vars: Record<string, unknown>) => ScrollSmootherInstance;
    };
    ScrambleTextPlugin?: unknown;
    _smooth?: ScrollSmootherInstance | null;
    __suppressHeaderShowCycleUntil?: number;
  };

const INTRO_KEY = "intro_enabled";

let smoothScroller: ScrollSmootherInstance | null = null;

function getLegacyWindow() {
  return window as GsapWindow;
}

function getLegacyScrollTriggerCreator() {
  return getLegacyWindow().ScrollTrigger?.create;
}

function getAnimElements(root: ParentNode | Element = document) {
  const elements: Element[] = [];

  if (root instanceof Element && root.matches(".anim")) {
    elements.push(root);
  }

  if ("querySelectorAll" in root) {
    elements.push(...Array.from(root.querySelectorAll(".anim")));
  }

  return elements;
}

export function getLegacyScrollerElement() {
  return smoothScroller?.wrapper?.();
}

export function refreshLegacyMotion() {
  const win = getLegacyWindow();
  win.ScrollTrigger?.refresh?.(true);
  smoothScroller?.refresh?.();
}

export function scrollLegacyToTop() {
  if (smoothScroller?.scrollTo) {
    smoothScroller.scrollTo(0, false);
  }

  window.scrollTo(0, 0);
}

export function registerLegacyAnimToggles(
  root: ParentNode | Element = document,
) {
  const createScrollTrigger = getLegacyScrollTriggerCreator();

  if (!createScrollTrigger) {
    return () => undefined;
  }

  const triggers = getAnimElements(root).map((element) =>
    createScrollTrigger({
      trigger: element,
      start: "top 85%",
      onEnter: () => element.classList.add("show"),
      onLeaveBack: () => element.classList.remove("show"),
      scroller: getLegacyScrollerElement(),
    }),
  );

  return () => {
    triggers.forEach((trigger) => trigger.kill?.());
  };
}

function setupNoise() {
  const canvas = document.getElementById("grain") as HTMLCanvasElement | null;

  if (!canvas) {
    return () => undefined;
  }

  const context = canvas.getContext("2d", { alpha: true });

  if (!context) {
    return () => undefined;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let frame = 0;
  let animationFrameId = 0;
  let running = true;

  const tile = document.createElement("canvas");
  const tileContext = tile.getContext("2d", { alpha: true });

  if (!tileContext) {
    return () => undefined;
  }

  const tileSize = 180;
  let pattern: CanvasPattern | null = null;

  const makeTile = () => {
    tile.width = tileSize;
    tile.height = tileSize;

    const imageData = tileContext.createImageData(tileSize, tileSize);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
      const value = (Math.random() * 255) | 0;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 28;
    }

    tileContext.putImageData(imageData, 0, 0);
    return context.createPattern(tile, "repeat");
  };

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(1, 0, 0, 1, 0, 0);
  };

  const draw = () => {
    if (!running) {
      return;
    }

    if (frame % 3 === 0) {
      pattern = makeTile();
    }

    frame += 1;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (pattern) {
      context.fillStyle = pattern;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    animationFrameId = window.requestAnimationFrame(draw);
  };

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updatePreference = () => {
    running = !mediaQuery.matches;

    if (running) {
      draw();
      return;
    }

    window.cancelAnimationFrame(animationFrameId);
  };

  resize();
  updatePreference();

  window.addEventListener("resize", resize, { passive: true });
  mediaQuery.addEventListener?.("change", updatePreference);

  return () => {
    window.cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", resize);
    mediaQuery.removeEventListener?.("change", updatePreference);
  };
}

export function useLegacyInteractions(namespace: PageNamespace) {
  useEffect(() => {
    const win = window as GsapWindow;
    const gsap = win.gsap;
    const ScrollTrigger = win.ScrollTrigger;
    const cleanups: Array<() => void> = [];
    const triggers: ScrollTriggerInstance[] = [];
    const documentElement = document.documentElement;

    cleanups.push(setupNoise());

    if (gsap?.registerPlugin) {
      gsap.registerPlugin(
        win.ScrollTrigger,
        win.ScrollSmoother,
        win.ScrambleTextPlugin,
      );
    }

    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");

    if (!smoothScroller && win.ScrollSmoother?.create && wrapper && content) {
      smoothScroller = win.ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        effects: true,
        normalizeScroll: true,
      });
      win._smooth = smoothScroller;
    } else {
      smoothScroller?.refresh?.();
    }

    const intro = document.getElementById("intro");
    const coordinateDisplay = document.querySelector(".coordinate_display");
    const coordinateX = document.querySelector(".coordinate_display_x");
    const coordinateY = document.querySelector(".coordinate_display_y");
    const cursorOutline = document.querySelector(
      ".cursor-outline",
    ) as HTMLDivElement | null;
    const cursorDot = document.querySelector(
      ".cursor-dot",
    ) as HTMLDivElement | null;
    const headerTitle = document.querySelector(
      "header h1",
    ) as HTMLElement | null;
    const headerNav = document.querySelector(
      "header nav",
    ) as HTMLElement | null;
    const menuButton = document.querySelector(
      "header .menu_btn",
    ) as HTMLButtonElement | null;
    const footer = document.querySelector("footer");
    const scrollButton = document.querySelector(".scr_down_btn");
    const mainVisual = document.querySelector(".sec_visual");
    let headerShowTimer: ReturnType<typeof window.setTimeout> | null = null;

    const syncIntroVisibility = () => {
      if (!intro || !gsap?.set) {
        return;
      }

      if (window.sessionStorage.getItem(INTRO_KEY)) {
        gsap.set(intro, { autoAlpha: 0, opacity: 0, visibility: "hidden" });
      } else {
        gsap.set(intro, {
          display: "flex",
          autoAlpha: 0,
          visibility: "hidden",
        });
      }
    };

    const openHeaderInstant = () => {
      headerTitle?.classList.add("show");
      if (window.innerWidth <= 1280) {
        headerNav?.classList.remove("show");
        return;
      }
      headerNav?.classList.add("show");
    };

    const setupHeaderMenuToggle = () => {
      if (!menuButton || !headerTitle || !headerNav) {
        return;
      }

      const handleMenuToggle = () => {
        if (window.innerWidth > 1280) {
          return;
        }
        headerNav.classList.toggle("show");
      };

      menuButton.addEventListener("click", handleMenuToggle);

      if (window.innerWidth <= 1280) {
        headerTitle.classList.add("show");
        headerNav.classList.remove("show");
      }

      cleanups.push(() =>
        menuButton.removeEventListener("click", handleMenuToggle),
      );
    };

    const setupHeaderScroll = () => {
      const createScrollTrigger = ScrollTrigger?.create;

      if (!gsap?.timeline || !createScrollTrigger || !headerTitle) {
        return;
      }

      gsap.set?.("header h1", {
        clearProps: "color,backgroundColor,backdropFilter",
      });
      gsap.set?.("header nav ul", {
        clearProps: "backgroundColor,opacity",
      });
      gsap.set?.("header h1 p, header h1 span", { clearProps: "display" });

      headerTitle.classList.add("show");
      headerNav?.classList.add("show");
      const timeline = gsap.timeline({ paused: true });
      let didRunTopRangeTransition = false;
      let wasWithinTopRange = true;
      let lastScroll = 0;

      const runHeaderShowCycle = () => {
        if (
          (window as GsapWindow).__suppressHeaderShowCycleUntil &&
          Date.now() <
            ((window as GsapWindow).__suppressHeaderShowCycleUntil ?? 0)
        ) {
          return;
        }

        headerTitle.classList.remove("show");
        if (window.innerWidth > 1280) {
          headerNav?.classList.remove("show");
        }

        if (headerShowTimer) {
          window.clearTimeout(headerShowTimer);
          headerShowTimer = null;
        }

        headerShowTimer = window.setTimeout(() => {
          headerTitle.classList.add("show");
          if (window.innerWidth > 1280) {
            headerNav?.classList.add("show");
          }
          headerShowTimer = null;
        }, 1000);
      };

      timeline
        .set("header h1", { color: "#fff", backgroundColor: "#000" })
        .to("header h1", {
          backgroundColor: "#000",
          duration: 0.25,
          ease: "power2.out",
        })
        .to(
          "header nav ul",
          {
            backgroundColor: "#000",
            duration: 0.25,
            ease: "power2.out",
          },
          "<",
        )
        .set("header h1", { backgroundColor: "rgba(244,244,244,0.9)" }, ">")
        .set("header h1 p, header h1 span", { display: "none" }, ">")
        .set("header nav ul", { backgroundColor: "rgba(0,0,0,0)" }, ">")
        .to("header h1", {
          color: "#000",
          backdropFilter: "blur(5px)",
          duration: 0.35,
          ease: "power2.out",
        })
        .to(
          "header nav ul",
          {
            backgroundColor: "rgba(244,244,244,1)",
            opacity: 0.8,
            duration: 0.35,
            ease: "power2.out",
          },
          "<",
        );

      const trigger = createScrollTrigger({
        trigger: "body",
        start: () => `${headerTitle.offsetHeight} top`,
        end: "max",
        onEnter: () => {
          if (
            (window as GsapWindow).__suppressHeaderShowCycleUntil &&
            Date.now() <
              ((window as GsapWindow).__suppressHeaderShowCycleUntil ?? 0)
          ) {
            return;
          }

          runHeaderShowCycle();
          timeline.progress?.(0);
          timeline.play?.();
          didRunTopRangeTransition = true;
        },
        onLeaveBack: () => {
          if (
            (window as GsapWindow).__suppressHeaderShowCycleUntil &&
            Date.now() <
              ((window as GsapWindow).__suppressHeaderShowCycleUntil ?? 0)
          ) {
            return;
          }

          timeline.reverse?.();
          runHeaderShowCycle();
          didRunTopRangeTransition = true;
        },
        onUpdate: (self: { scroll: () => number }) => {
          const currentScroll = self.scroll();
          const isWithinTopRange = currentScroll <= headerTitle.offsetHeight;
          const didScroll = Math.abs(currentScroll - lastScroll) > 1;

          if (
            didScroll &&
            isWithinTopRange &&
            !wasWithinTopRange &&
            !didRunTopRangeTransition
          ) {
            runHeaderShowCycle();
            didRunTopRangeTransition = true;
          }

          if (!isWithinTopRange) {
            didRunTopRangeTransition = false;
          }

          wasWithinTopRange = isWithinTopRange;
          lastScroll = currentScroll;
        },
        scroller: smoothScroller?.wrapper?.(),
      });

      triggers.push(trigger);
      cleanups.push(() => timeline.kill?.());
    };

    const setupAnimationToggles = () => {
      const createScrollTrigger = ScrollTrigger?.create;

      if (!createScrollTrigger) {
        return;
      }

      const elements = getAnimElements();

      elements.forEach((element) => {
        const trigger = createScrollTrigger({
          trigger: element,
          start: "top 85%",
          onEnter: () => element.classList.add("show"),
          onLeaveBack: () => element.classList.remove("show"),
          scroller: smoothScroller?.wrapper?.(),
        });

        triggers.push(trigger);
      });
    };

    const setupFooterAnimation = () => {
      const createScrollTrigger = ScrollTrigger?.create;

      if (!footer || !createScrollTrigger) {
        return;
      }

      const trigger = createScrollTrigger({
        trigger: footer,
        onEnter: () => footer.classList.add("on"),
        onLeaveBack: () => footer.classList.remove("on"),
        scroller: smoothScroller?.wrapper?.(),
      });

      triggers.push(trigger);
    };

    const setupCursor = (deferOpacityRevealMs = 0) => {
      if (!cursorOutline || !cursorDot || !coordinateX || !coordinateY) {
        return;
      }

      const CURSOR_MAX_WIDTH = 768;
      const customCursorOn = () => window.innerWidth > CURSOR_MAX_WIDTH;

      const hideCursorVisual = () => {
        gsap?.set?.(".cursor-outline, .cursor-dot", {
          opacity: 0,
          visibility: "hidden",
        });
      };

      const prepareCursorVisual = () => {
        gsap?.set?.(".cursor-outline, .cursor-dot", { visibility: "visible" });
      };

      gsap?.set?.(cursorDot, { scale: 0.1, opacity: 0 });
      gsap?.set?.(cursorOutline, { scale: 0.5, opacity: 0 });

      const deferMs =
        typeof deferOpacityRevealMs === "number" && deferOpacityRevealMs > 0
          ? deferOpacityRevealMs
          : 0;
      let cursorOpacityLocked = deferMs > 0;
      let revealTimer: ReturnType<typeof window.setTimeout> | null = null;
      let waitingInitialReveal = deferMs > 0;

      const xOutlineTo =
        gsap?.quickTo?.(cursorOutline, "left", {
          duration: 0.2,
          ease: "power3",
        }) ??
        ((value: number) => {
          cursorOutline.style.left = `${value}px`;
        });
      const yOutlineTo =
        gsap?.quickTo?.(cursorOutline, "top", {
          duration: 0.2,
          ease: "power3",
        }) ??
        ((value: number) => {
          cursorOutline.style.top = `${value}px`;
        });
      const xDotTo =
        gsap?.quickTo?.(cursorDot, "left", { duration: 0.6, ease: "power3" }) ??
        ((value: number) => {
          cursorDot.style.left = `${value}px`;
        });
      const yDotTo =
        gsap?.quickTo?.(cursorDot, "top", { duration: 0.6, ease: "power3" }) ??
        ((value: number) => {
          cursorDot.style.top = `${value}px`;
        });

      let cursorShown = false;
      let mouseMoveAttached = false;

      const runDeferredReveal = () => {
        if (!customCursorOn()) {
          cursorOpacityLocked = false;
          return;
        }
        prepareCursorVisual();
        gsap?.set?.(cursorDot, { scale: 0.1, opacity: 0 });
        gsap?.set?.(cursorOutline, { scale: 0.5, opacity: 0 });
        gsap?.set?.(".cursor-outline, .cursor-dot", {
          opacity: 0,
          visibility: "visible",
        });
        attachMouseMove();
        gsap?.to?.(".cursor-outline, .cursor-dot", {
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            cursorOpacityLocked = false;
            cursorShown = true;
          },
        });
      };

      const detachMouseMove = () => {
        if (!mouseMoveAttached) return;
        document.removeEventListener("mousemove", handleMouseMove);
        mouseMoveAttached = false;
      };

      const attachMouseMove = () => {
        if (mouseMoveAttached) return;
        document.addEventListener("mousemove", handleMouseMove);
        mouseMoveAttached = true;
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!customCursorOn()) return;

        const left = event.clientX - 40;
        const top = event.clientY - 40;

        if (!cursorOpacityLocked && !cursorShown) {
          gsap?.set?.(".cursor-outline, .cursor-dot", { opacity: 1 });
          cursorShown = true;
        }

        xOutlineTo(left);
        yOutlineTo(top);
        xDotTo(left);
        yDotTo(top);

        coordinateX.textContent = `X: ${event.pageX}px`;
        coordinateY.textContent = `Y: ${event.pageY}px`;
      };

      const targets = Array.from(document.querySelectorAll(".target"));

      const enlarge = () => {
        if (!customCursorOn()) return;
        gsap?.to?.(".cursor-outline", {
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        });
        gsap?.to?.(".cursor-dot", {
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        });
      };

      const reduce = () => {
        if (!customCursorOn()) return;
        gsap?.to?.(".cursor-outline", {
          scale: 0.5,
          duration: 0.35,
          ease: "power3.out",
        });
        gsap?.to?.(".cursor-dot", {
          scale: 0.1,
          duration: 0.35,
          ease: "power3.out",
        });
      };

      const syncCursorViewport = () => {
        if (!customCursorOn()) {
          if (revealTimer != null) {
            window.clearTimeout(revealTimer);
            revealTimer = null;
          }
          waitingInitialReveal = false;
          cursorOpacityLocked = false;
          detachMouseMove();
          hideCursorVisual();
          cursorShown = false;
          return;
        }

        if (waitingInitialReveal && revealTimer != null) {
          return;
        }

        prepareCursorVisual();
        cursorShown = false;
        gsap?.set?.(cursorDot, { scale: 0.1, opacity: 0 });
        gsap?.set?.(cursorOutline, { scale: 0.5, opacity: 0 });
        attachMouseMove();
      };

      window.addEventListener("resize", syncCursorViewport);

      if (deferMs > 0) {
        hideCursorVisual();
        detachMouseMove();
        cursorShown = false;
        revealTimer = window.setTimeout(() => {
          revealTimer = null;
          waitingInitialReveal = false;
          runDeferredReveal();
        }, deferMs);
        cleanups.push(() => {
          if (revealTimer != null) {
            window.clearTimeout(revealTimer);
            revealTimer = null;
          }
        });
      } else {
        waitingInitialReveal = false;
        syncCursorViewport();
      }

      targets.forEach((target) => {
        target.addEventListener("mouseenter", enlarge);
        target.addEventListener("mouseleave", reduce);
      });

      cleanups.push(() => {
        window.removeEventListener("resize", syncCursorViewport);
        detachMouseMove();
        targets.forEach((target) => {
          target.removeEventListener("mouseenter", enlarge);
          target.removeEventListener("mouseleave", reduce);
        });
      });
    };

    const setupScrollDown = () => {
      if (!scrollButton) {
        return;
      }

      const handleScrollDown = () => {
        if (smoothScroller?.scrollTo) {
          smoothScroller.scrollTo(window.innerHeight, true);
          return;
        }

        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      };

      scrollButton.addEventListener("click", handleScrollDown);
      cleanups.push(() =>
        scrollButton.removeEventListener("click", handleScrollDown),
      );
    };

    const afterIntro = (fromIntroPlayback: boolean) => {
      mainVisual?.classList.add("on");
      coordinateDisplay?.classList.add("on");
      smoothScroller?.paused?.(false);
      setupAnimationToggles();
      setupHeaderScroll();
      setupHeaderMenuToggle();
      setupFooterAnimation();
      setupCursor(fromIntroPlayback ? 500 : 0);
      setupScrollDown();

      if (namespace === "main") {
        openHeaderInstant();
      } else {
        if (window.innerWidth > 1280) {
          headerTitle?.classList.add("show");
          headerNav?.classList.add("show");
        } else {
          headerTitle?.classList.add("show");
          headerNav?.classList.remove("show");
        }
      }

      ScrollTrigger?.refresh?.(true);
      smoothScroller?.refresh?.();
    };

    const introAnim = (done: (introCompleted: boolean) => void) => {
      const introEl = document.getElementById("intro");
      const gIntro = gsap;
      if (!introEl || !gIntro?.timeline || !gIntro.set) {
        done(false);
        return;
      }

      const title = introEl.querySelector<HTMLElement>(".intro-title");
      const line = introEl.querySelector<HTMLElement>(".intro-line");
      const lineWrap = introEl.querySelector<HTMLElement>(".line-wrap");
      const blackDisc = introEl.querySelector<HTMLElement>(".black-disc");
      const dots = [
        introEl.querySelector<HTMLElement>(".travel-dot--1"),
        introEl.querySelector<HTMLElement>(".travel-dot--2"),
        introEl.querySelector<HTMLElement>(".travel-dot--3"),
        introEl.querySelector<HTMLElement>(".travel-dot--4"),
      ];
      if (
        !title ||
        !line ||
        !lineWrap ||
        !blackDisc ||
        dots.some((d) => !d)
      ) {
        done(false);
        return;
      }

      const d1 = dots[0]!;
      const d2 = dots[1]!;
      const d3 = dots[2]!;
      const d4 = dots[3]!;

      const pxTravel = () => Math.max(0, lineWrap.offsetWidth - 8);

      gIntro.set(dots, { autoAlpha: 0, left: 0 });
      gIntro.set(line, { scaleX: 0 });
      gIntro.set(blackDisc, { scale: 0 });
      gIntro.set(title, { opacity: 0, y: 28 });

      const timeline = gIntro.timeline({ defaults: { ease: "power2.inOut" } });

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

      timeline
        .to(title, {
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
      const pSeg = (i: number) => (L * i) / 4;

      for (let k = 1; k <= 4; k++) {
        timeline.to(
          d1,
          { left: pSeg(k), duration: segMoveDur, ease: segEase },
          ">",
        );
        if (k >= 2) {
          timeline.to(
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
          timeline.to(
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
          timeline.to(
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
          timeline.to(
            {} as unknown as HTMLElement,
            { duration: segPause },
            ">",
          );
        }
      }

      const introOutDur = 1.05;
      const introOutEase = "power3.inOut";

      timeline
        .to(blackDisc, { scale: 1, duration: 0.56, ease: "power3.out" }, ">")
        .to(
          introEl,
          {
            autoAlpha: 0,
            duration: introOutDur,
            ease: introOutEase,
            onComplete: () => {
              introEl.classList.add("intro-done");
              done(true);
            },
          },
          "+=0.25",
        )
        .to(
          {},
          {
            duration: 1,
            ease: "power2.out",
            onStart: () => {
              if (window.innerWidth > 1280) {
                headerTitle?.classList.add("show");
                headerNav?.classList.add("show");
              } else {
                headerTitle?.classList.add("show");
                headerNav?.classList.remove("show");
              }
            },
          },
          ">",
        );

      cleanups.push(() => timeline.kill?.());
    };

    smoothScroller?.scrollTo?.(0, false);
    window.scrollTo(0, 0);
    documentElement.classList.remove("is-changing");
    syncIntroVisibility();

    const shouldPlayIntro =
      namespace === "main" && !window.sessionStorage.getItem(INTRO_KEY);

    if (shouldPlayIntro) {
      gsap?.set?.(".cursor-outline, .cursor-dot", {
        opacity: 0,
        visibility: "hidden",
      });
      smoothScroller?.paused?.(true);
      if (intro && gsap?.set) {
        gsap.set(intro, {
          display: "flex",
          autoAlpha: 1,
          visibility: "visible",
        });
      }
      introAnim((introCompleted) => {
        window.sessionStorage.setItem(INTRO_KEY, "1");
        syncIntroVisibility();
        afterIntro(introCompleted);
      });
    } else {
      afterIntro(false);
    }

    cleanups.push(() => {
      triggers.forEach((trigger) => trigger.kill?.());
    });

    return () => {
      if (headerShowTimer) {
        window.clearTimeout(headerShowTimer);
      }
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [namespace]);
}
