const mainFunc = {
  _q(sel, ctx = document) {
    return ctx.querySelector(sel);
  },
  _qq(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  },
  _inited: false,
  _scroller_el: null,
  scrAnim: function () {
    const test = gsap.to(".sec_about h2 span", {
      scrollTrigger: {
        trigger:".sec_about h2 span",
        markers: false,
        scrub: true,
        start: "bottom center",
        onEnter: ()=>{
          this._q(".sec_about h2 span").classList.add("show")
          this._q(".sec_about h3 p ").classList.add("show")
        },
        onLeaveBack: ()=>{
          this._q(".sec_about h2 span").classList.remove("show")
          this._q(".sec_about h3 p ").classList.remove("show")
        }
      }
    })
    const skillsAnim = gsap.to(".skills_wrap",{
      borderRadius: 0,
      width: '100%',
      maxWidth: '100%',
      scrollTrigger:{
        trigger: ".skills_wrap",
        markers:false,
        scrub: true,
        start: "top center ",
        end: "center top ",
      }
    })
  },

  mainAnim: function(){
    const r_txts = [
        `Turning design into living interaction`,
        `Building structures that last.`,
        `Balancing accessibility with creativity.`,
    ];
    const r_img = this._q('.rolling_img img');
    const r_txt = this._q('.rolling_txt');
    let r_img_idx = 1;
    let r_txt_idx = 0;

    const rollingImgInterval = setInterval(rollingImg, 300);
    const rollingTxtInterval = setInterval(rollingTxt, 4000);

    function rollingImg(){
      r_img_idx = r_img_idx >= 4 ? 1 : r_img_idx + 1;
      r_img.setAttribute('src',`./assets/images/visuals/rolling_v${r_img_idx}.png`);
    }
    function rollingTxt(){
      r_txt.classList.add('hide');
      r_txt_idx = r_txt_idx >= r_txts.length - 1 ? 0 : r_txt_idx + 1;
      setTimeout(()=>{
        r_txt.querySelector('span').innerText = r_txts[r_txt_idx];
        r_txt.classList.remove('hide');
      },1000)
    }
  },

  marqueeAnim: function () {
    const marquee = this._q('.marquee');
    if (!marquee) return;

    let currentScroll = 0;
    let isScrollingDown = true;

    let tween = gsap.to(".marquee_part", {xPercent: -100, repeat: -1, duration: 15, ease: "linear"}).totalProgress(0.5);

    gsap.set(".marquee_inner", {xPercent: -50});

    window.addEventListener("scroll", function(){

      if ( window.pageYOffset > currentScroll ) {
        isScrollingDown = true;
      } else {
        isScrollingDown = false;
      }

      gsap.to(tween, {
        timeScale: isScrollingDown ? 1 : -1
      });

      currentScroll = window.pageYOffset
    });
  },

  scrDown: function(){
    const btn = this._q('.scr_down_btn ');
    if(btn){
      btn.addEventListener('click', function(){
        window._smooth.scrollTo(window.innerHeight, 1);
      });
    }
  },
  
  init: function () {
    if (this._inited) return;
    this._inited = true;

    setTimeout(() => {
      ScrollTrigger.refresh();
      this.scrAnim();
      this.mainAnim();
      this.scrDown();
    }, 100);
  }
};

export default mainFunc;
