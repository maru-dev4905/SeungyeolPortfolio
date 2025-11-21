export default function moveMouseAnimation() {
  const pageX = document.querySelector(".coordinate_display_x");
  const pageY = document.querySelector(".coordinate_display_y");

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