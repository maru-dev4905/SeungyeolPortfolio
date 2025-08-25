// prj.js
gsap.registerPlugin(ScrollTrigger);

const prjFunc = {
  _inited: false,

  scrTxtAnim: {
    _isSlice: false,

    txtSplit: function () {
      if (!this._isSlice) {
        let txtArr = [];
        const scrTxtEls = document.querySelectorAll(".scr_txt_anim");

        if (!scrTxtEls) return false;
        scrTxtEls.forEach((el) => {
          txtArr.push(el.textContent.trim().split(''));
        });
        for (const idx in txtArr) {
          scrTxtEls[idx].textContent = '';
          txtArr[idx].forEach((word) => {
            let wordEl = `<i>${word}</i>`;

            scrTxtEls[idx].innerHTML += wordEl;
          })
        }
        this._isSlice = true;

        this.txtAnim();
      }
    },
    txtAnim: function () {
      const els = document.querySelectorAll(".scr_txt_anim");
      if (!els.length) return;

      els.forEach((el) => {
        const chars = el.querySelectorAll("i");
        if (!chars.length) return;

        // 이전 타임라인/트리거 정리 (재실행 대비)
        if (el._scrTl) {
          el._scrTl.scrollTrigger && el._scrTl.scrollTrigger.kill();
          el._scrTl.kill();
          el._scrTl = null;
        }

        // 초기 상태
        gsap.set(chars, { yPercent: 50, scaleY: 1.75, opacity: 0 });

        const len = chars.length;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top bottom",  
            end: "bottom center",    
            scrub: true,          
            // markers: true,      
            invalidateOnRefresh: true,
          },
        });


        tl.to(chars, {
          yPercent: 0,
          scaleY: 1,
          opacity: 1,
          duration: .85,                
          stagger: {
            each: 1 / len,
            from: 0
          },
        }, 1);
        el._scrTl = tl;
      });

      // 레이아웃 변동 반영
      ScrollTrigger.refresh();
    },

    init: function () {
      this.txtSplit();
    },
  },

  init: function () {
    if (prjFunc._inited) return;
    prjFunc._inited = true;

    prjFunc.scrTxtAnim.init();
  }
};

document.addEventListener("DOMContentLoaded", prjFunc.init);
