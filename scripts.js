document.addEventListener('DOMContentLoaded', function(){
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('navToggle');
  
  // Close nav menu on page load to reset state
  if(nav) nav.classList.remove('open');
  if(btn) btn.setAttribute('aria-expanded', 'false');
  
  btn && btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    // update header height when nav expands/collapses
    updateHeaderHeight();
  });

  // set CSS var --header-height to the current header height
  const headerEl = document.querySelector('.site-header');
  function updateHeaderHeight(){
    if(!headerEl) return;
    const h = headerEl.offsetHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }
  // update on load and resize with small delay to ensure layout is ready
  setTimeout(updateHeaderHeight, 0);
  window.addEventListener('resize', updateHeaderHeight);
  // observe header for content changes (nav wrap, font changes)
  if(window.MutationObserver && headerEl){
    const mo = new MutationObserver(updateHeaderHeight);
    mo.observe(headerEl, {childList:true, subtree:true, attributes:true, characterData:true});
  }

  // Simple alert / toast handling for details button
  const alertEl = document.getElementById('simpleAlert');
  let alertTimeout = null;
  function showAlert(message){
    if(!alertEl) return;
    alertEl.textContent = message;
    alertEl.classList.add('show');
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(()=>{
      alertEl.classList.remove('show');
    }, 3600);
  }

  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const card = e.currentTarget.closest('.card');
      const titleEl = card && card.querySelector('.card-title');
      const column = e.currentTarget.closest('.card-column');
      const heading = column && column.querySelector('.cards-heading');
      const titleText = titleEl ? titleEl.textContent.replace(/\s*\(.*\)\s*$/,'').trim() : 'this item';
      const type = heading ? heading.textContent.trim().toLowerCase() : 'item';
      const message = type === 'recommended anime' ? `You will be redirected to this anime's page: ${titleText}` : type === 'recommended manga' ? `You will be redirected to this manga's page: ${titleText}` : `You will be redirected to this item's page: ${titleText}`;
      showAlert(message);
    });
  });
});