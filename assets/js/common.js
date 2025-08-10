import dateTimeModule from "./modules/datetime.js";
import noiseBackgroundAnimation from "./modules/noiseAnim.js";

const commonCompo = {
  _inited: false,

  init: function(){
    if(this._inited) return;
    this._inited = true;

    dateTimeModule();
    noiseBackgroundAnimation();
  }
}

document.addEventListener("DOMContentLoaded", commonCompo.init());