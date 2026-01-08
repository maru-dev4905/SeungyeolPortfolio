const mainFunc = {
  _q(sel, ctx = document) {
    return ctx.querySelector(sel);
  },
  _qq(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  },
  _inited: false,
  _scroller_el: null,
  _rolling_img_timer: null,
  _rolling_txt_timer: null,
  _scrdown_handler: null,

  scrAnim: function () {
    gsap.to(".sec_about h2 span", {
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
    });
    gsap.set(".skills_wrap", { clearProps: "borderRadius,width,maxWidth" });

    gsap.to(".skills_wrap", {
      borderRadius: 0,
      width: "100%",
      maxWidth: "100%",
      scrollTrigger: {
        trigger: ".skills_wrap",
        scrub: true,
        start: "top center",
        end: "center top",
        invalidateOnRefresh: true,
      }
    });
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

    if(this._rolling_img_timer) clearInterval(this._rolling_img_timer);
    if(this._rolling_txt_timer) clearInterval(this._rolling_txt_timer);

    this._rolling_img_timer = setInterval(()=> {
      r_img_idx = r_img_idx >= 4 ? 1 : r_img_idx + 1;
      r_img.setAttribute("src", `./assets/images/visuals/rolling_v${r_img_idx}.png`);
    },300);

    this._rolling_txt_timer = setInterval(() => {
     r_txt.classList.add("hide");
     r_txt_idx = r_txt_idx >= r_txts.length - 1 ? 0 : r_txt_idx + 1;

     setTimeout(()=>{
       const span = r_txt?.querySelector('span');
       if(span) span.innerText = r_txts[r_txt_idx];
       r_txt?.classList.remove('hide');
     },1000);
    },4000);
  },

  scrDown: function(){
    const btn = this._q('.scr_down_btn ');
    if (!btn) return;

    if(this._scrdown_handler){
      btn.removeEventListener('click', this._scrdown_handler);
      this._scrdown_handler = null;
    }

    this._scrdown_handler = () => {
      window._smooth?.scrollTo(window.innerHeight, 1);
    };

    btn.addEventListener('click', this._scrdown_handler);
  },

  destroy: function(){
    this._inited = false;

    if(this._rolling_img_timer) clearInterval(this._rolling_img_timer);
    if(this._rolling_txt_timer) clearInterval(this._rolling_txt_timer);
    this._rolling_img_timer = null;
    this._rolling_txt_timer = null;

    this._scrdown_handler = null;
  },

  init: function () {
    const hasMain = !!this._q('.sec_about') || !!this._q('.rolling_img');
    if(!hasMain) return;

    if (this._inited) return;
    this._inited = true;

    this.scrAnim();
    this.mainAnim();
    this.scrDown();
  }
};

export default mainFunc;
