import cmn from './common.js';
import {featuredData, allData} from "./workData.js";

const work_list = {
  _featuredData: null,
  _allData: null,
  _featuredListEl: null,
  _allListEl: null,
  _currentLabelEl: null,
  _sortBtnEls: null,
  _activeCategory: null,

  _getYearKey(dataStr = ''){
    const v = String(dataStr).trim();

    if(v.includes('-')){
      const last = v.split('-').pop().trim();
      return parseInt(last, 10) || 0;
    }

    return parseInt(v, 10) || 0;
  },

  _onSortClick(btn){
    const txt = btn.innerText;
    if(this._activeCategory === txt) return;

    this._activeCategory = txt;
    this._currentLabelEl.innerText = txt;

    this._sortBtnEls.forEach(btn => btn.classList.remove('on'));
    btn.classList.add('on');

    this._renderList();
  },

  _getListItemHTML(category,work){
    return `
      <li class="anim">
        <h3>${work.name}<span>${work.txt}</span></h3>
        <i>${work.date}</i>
        <p>${category}</p>
      </li>
    `;
  },

  _renderList(){
    if(!this._allListEl) return;

    const current = this._activeCategory;
    this._allListEl.innerHTML = '';

    if(current === 'All.'){
      let html = '';
      const flat = [];

      for (const [category, list] of Object.entries(this._allData)) {
        for(const work of list) flat.push({category, work});
      }
      flat.sort((a,b)=> this._getYearKey(b.work.date) - this._getYearKey(a.work.date));
      html += flat.map(({ category, work }) => this._getListItemHTML(category, work)).join('');

      this._allListEl.insertAdjacentHTML('beforeend', html);

      cmn.anim.toggleClass();
      return;
    }

    const list = (this._allData?.[current] || []).slice().sort(
        (a,b) => this._getYearKey(b.date) - this._getYearKey(a.date)
    );
    const html = list.map(work => this._getListItemHTML(current, work)).join('');
    this._allListEl.insertAdjacentHTML('beforeend', html);

    cmn.anim.toggleClass();
  },

  _getAwardsHTML(work){
    const awards = work?.awards;
    if(!Array.isArray(awards) || awards.length === 0) return '';
    let inner = '';
    if (awards.includes('wa')) inner += '<span class="webaward"></span>';
    if (awards.includes('gd')) inner += '<span class="gdweb"></span>';

    return inner ? `<span class="awards">${inner}</span>` : '';
  },

  _getFeaturedItemHTML(work) {
    const awardsHTML = this._getAwardsHTML(work);
    return `
      <li class="colST${work.colPC} md_colST${work.colMO} on_${work.anim} anim" style="background:${work.color}">
        <a href="#" class="target">
          <img src="./assets/images/works/${work.nameEN}/visual.png" alt="">
          ${awardsHTML}
        </a>
      </li>
    `;
  },

  _renderFeatured(){
    if(!this._featuredListEl || !Array.isArray(this._featuredData)) return;

    const html = this._featuredData.map(w => this._getFeaturedItemHTML(w)).join('');
    this._featuredListEl.insertAdjacentHTML('beforeend', html);

    cmn.anim.toggleClass();
  },

  init(){
    this._featuredData = Array.from(featuredData) || [];
    this._allData = {...allData} || [];

    this._featuredListEl = cmn._q('.work_list ul');
    this._allListEl = cmn._q('.work_list_all ul');

    this._currentLabelEl = cmn._q('.sort_current');
    this._sortBtnEls = cmn._qq('.sort_list > button');
    this._activeCategory = cmn._q('.sort_list > button.on').innerText;

    this._sortBtnEls.forEach(btn => btn.addEventListener('click', ()=>this._onSortClick(btn)));

    this._renderFeatured();
    this._renderList();

    cmn.anim.toggleClass();
  },
}

const work = {
  init: function(){
    
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  const mainEl = cmn._q('main'); 
  const id = ({ work: 0, works: 1 })[mainEl?.id] ?? 0;
  id ? work_list.init() : work.init();
});

export default work_list;