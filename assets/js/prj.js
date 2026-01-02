// prj.js
import cmn from './common.js';
gsap.registerPlugin(ScrollTrigger);

const prjFunc = {
  _inited: false,

  aboutRollingImgAnim: {
    _imgs: null,
    _length: null,
    _intervalId: null,
    _idx: 0,

    rolling: function(){
      this._imgs.forEach(img=>img.classList.remove('on'));
      this._imgs[this._idx].classList.add('on');
    },
    start: function(){
      this.stop();

      this._intervalId = setInterval(()=>{
        this._idx >= this._length - 1 ? this._idx = 0 : this._idx++;
        this.rolling()
      }, 2000);
    },
    stop: function () {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },
    init: function(){
      this._imgs = _qq('.about_visual img');
      this._length = _qq('.about_visual img').length;

      this.start();

      this._imgs.forEach(img => {
        img.addEventListener('mouseenter', () =>{
          this.stop();
        });
        img.addEventListener('mouseleave', () =>{
          this.start();
        });
      })
    }
  },

  init: function () {
    if (prjFunc._inited) return;
    prjFunc._inited = true;

    // cmn._q('#about') && prjFunc.aboutRollingImgAnim.init();
  }
};

document.addEventListener("DOMContentLoaded", ()=>{
  prjFunc.init();
});

export default prjFunc;