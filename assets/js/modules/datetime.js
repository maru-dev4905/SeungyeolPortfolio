export default function dateTimeModule(){
  const updateDateTime = () => {
    const now = new Date;
  
    const year = now.getFullYear();
    const month = String(now.getDate()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTimeEl = document.querySelector('.datetime');
    dateTimeEl.innerHTML = `
      ${year}.${month}.${day} | ${hour}.${minutes}.${seconds}
    `;
  }

  const init = () => {
    updateDateTime();
    setInterval(()=>{
      updateDateTime();
    },1000)
  }

  init();
}