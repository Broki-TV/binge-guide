document.addEventListener('DOMContentLoaded', function(){
  const searchBox = document.getElementById('searchBox');
  const yearRange = document.getElementById('yearRange');
  const resetBtn = document.getElementById('resetFilters');
  const cards = Array.from(document.querySelectorAll('.card'));

  function filterCards(){
    const q = searchBox.value.trim().toLowerCase();
    const maxYear = Number(yearRange.value);
    const checkedGenres = Array.from(document.querySelectorAll('.filters-list input[type="checkbox"]:checked')).map(i=>i.value);

    cards.forEach(card => {
      const title = (card.querySelector('.card-title') || {textContent:''}).textContent.toLowerCase();
      const meta = (card.querySelector('.card-meta') || {textContent:''}).textContent.toLowerCase();
      // extract year from meta (format: "Genre • YYYY")
      const yearMatch = meta.match(/(\d{4})/);
      const cardYear = yearMatch ? Number(yearMatch[1]) : 9999;
      const genreMatch = checkedGenres.length === 0 || checkedGenres.some(g => meta.includes(g));
      const yearFiltered = cardYear <= maxYear;
      const textMatch = title.includes(q) || meta.includes(q) || q === '';
      const show = genreMatch && yearFiltered && textMatch;
      card.style.display = show ? '' : 'none';
    });
  }

  if(searchBox){
    searchBox.addEventListener('input', filterCards);
  }
  if(yearRange){
    const updateRange = ()=>{
      const min = Number(yearRange.min), max = Number(yearRange.max), val = Number(yearRange.value);
      const pct = Math.round(((val - min) / (max - min)) * 100);
      yearRange.style.setProperty('--range-progress', pct + '%');
    };
    updateRange();
    yearRange.addEventListener('input', ()=>{ updateRange(); filterCards(); });
  }
  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      searchBox.value = '';
      document.querySelectorAll('.filters-list input[type="checkbox"]').forEach(i=>i.checked = true);
      if(yearRange) yearRange.value = yearRange.max;
      filterCards();
    });
  }

  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const card = e.currentTarget.closest('.card');
      const titleEl = card && card.querySelector('.card-title');
      const titleText = titleEl ? titleEl.textContent.replace(/\s*\(.*\)\s*$/,'').trim() : 'this item';
      const message = `You will be redirected to ${titleText}`;
      if(typeof showAlert === 'function') showAlert(message);
      else {
        const simpleAlert = document.getElementById('simpleAlert');
        if(simpleAlert){ simpleAlert.textContent = message; simpleAlert.classList.add('show'); setTimeout(()=>simpleAlert.classList.remove('show'),3600); }
      }
    });
  });
});
