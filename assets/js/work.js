import cmn from './common.js';
console.log(cmn._q('.anim'))

const workList = {
  init: function(){

  }
}
const work = {
  init: function(){
    
  }
}
document.addEventListener("DOMContentLoaded", ()=>{
  const mainEl = cmn._q('main'); 
  const id = ({ work: 0, works: 1 })[mainEl?.id] ?? 0;
  id ? workList.init() : work.init();
});