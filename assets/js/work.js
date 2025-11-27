import cmn from './common.js';
import workData from "./workData.js";

const workList = {
  _workData: null,
  _workListEl: null,

  _workPushList: function(){
    let awardsInner = '';
    if (Array.isArray(work.awards) && work.awards.length > 0) {
      if (work.awards.includes('wa')) {
        awardsInner += '<span class="webaward"></span>';
      }
      if (work.awards.includes('gd')) {
        awardsInner += '<span class="gdweb"></span>';
      }
    }

    // 실제로 awardsInner에 뭔가 들어있을 때만 .awards 래퍼 생성
    const awardsHTML = awardsInner
        ? `<span class="awards">${awardsInner}</span>`
        : '';

    this._workData.forEach((work)=>{
      let item = `
        <li class="colST${work.colPC} md_colST${work.colMO} on_${work.anim} anim" style="background:${work.color}">
          <a href="#" class="target">
            <img src="./assets/images/works/${work.nameEN}/visual.png" alt="">
            ${awardsHTML}
          </a>
        </li>
      `;
      this._workListEl.insertAdjacentHTML('beforeend', item);
    })

    cmn.anim.toggleClass();
  },

  init: function(){
    this._workData = Array.from(workData);
    this._workListEl = cmn._q('.sec_work.work_list ul');

    this._workPushList();
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