export default function moveMouseAnimation() {
  const pageX = document.querySelector(".coordinate_display_x");
  const pageY = document.querySelector(".coordinate_display_y");

  gsap.set('.cursor-dot', {scale: 0.1})
  gsap.set('.cursor-outline', {scale: 0.5})

  document.addEventListener("mousemove", mouseMove);

  let xCTo = gsap.quickTo(".cursor-outline", "left", {
    duration: 0.2,
    ease: "power3"
  });
  let yCTo = gsap.quickTo(".cursor-outline", "top", {
    duration: 0.2,
    ease: "power3"
  });

  let xDTo = gsap.quickTo(".cursor-dot", "left", {
    duration: 0.6,
    ease: "power3"
  });
  let yDTo = gsap.quickTo(".cursor-dot", "top", {
    duration: 0.6,
    ease: "power3"
  });

  let isVisible = false;

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
  }

  let targets = gsap.utils.toArray(".target");

  let scaleAnim = gsap.timeline({paused: true});

  scaleAnim
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

  targets.forEach((target) => {
    target.addEventListener("mouseenter", (e) => {
      scaleAnim.play();
    });

    target.addEventListener("mouseleave", (e) => {
      scaleAnim.reverse();
    });
  });

  const updateDisplay = (e) => {
    pageX.innerText = `X: ${e.pageX}px`;
    pageY.innerText = `Y: ${e.pageY}px`;
  }
  
  const init = () => {
    document.addEventListener("mousemove", updateDisplay);
    document.addEventListener("mouseenter", updateDisplay);
    document.addEventListener("mouseleave", updateDisplay);
  }
  init();
}