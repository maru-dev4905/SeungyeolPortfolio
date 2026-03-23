import cmn from './common.js';

const contactFunc = {
  _langBtns: null,
  _selects: null,

  _langToggle(){
    this._langBtns = cmn._qq('.sec_contact .lang button') ?? "";
    if(!this._langBtns) return;

    this._langBtns.forEach( btn => {
      btn.addEventListener('click', function(e){
        const clicked = e.currentTarget;
        contactFunc._langBtns.forEach((b) => b.classList.toggle('on', b === clicked));

        cmn._qq('.kor, .eng').forEach(el => el.classList.remove('on'));
        if(clicked.classList.contains('kor_btn')){
          cmn._q('.kor')?.classList.add('on');
        }else if(clicked.classList.contains('eng_btn')){
          cmn._q('.eng')?.classList.add('on');
        }

        ScrollTrigger.refresh()
      })
    });
  },

  _selectToggle(){
    this._selects = cmn._qq('.select_wrap') ?? "";
    if(!this._selects) return;

    this._selects.forEach(select => {
      const btns = select.querySelectorAll('.select_btn');

      btns.forEach(btn => {
        btn.addEventListener('click', function(e){
          const clicked = e.currentTarget;
          clicked.closest('.select_wrap').classList.toggle('on');
        });
      });

      const options = select.querySelectorAll('.options label');
      options.forEach(option => {
        option.addEventListener('click', function(e){
          const clicked = e.currentTarget;
          clicked.closest('.select_wrap').querySelector('.select_btn').innerText = clicked.innerText;
          clicked.closest('.select_wrap').classList.add('val');
          clicked.closest('.select_wrap').classList.remove('on');
        });
      });
    });
  },

  init: function(){
    this._langToggle();
    this._selectToggle();
  }
}

export default contactFunc;