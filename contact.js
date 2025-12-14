document.addEventListener('DOMContentLoaded', function(){
  // Form submission handling
  const recommendForm = document.getElementById('recommendForm');
  const questionForm = document.getElementById('questionForm');
  const submissionsList = document.getElementById('submissionsList');

  // Load submissions from localStorage
  function loadSubmissions(){
    const stored = localStorage.getItem('bingeguide_submissions');
    return stored ? JSON.parse(stored) : [];
  }

  function saveSubmissions(submissions){
    localStorage.setItem('bingeguide_submissions', JSON.stringify(submissions));
  }

  function renderSubmissions(){
    const submissions = loadSubmissions();
    if(submissions.length === 0){
      submissionsList.innerHTML = '<p style="color:var(--muted)">No submissions yet. Be the first to share!</p>';
      return;
    }
    submissionsList.innerHTML = submissions.slice(0, 5).map(s => `
      <div style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:left">
        <div style="color:var(--accent);font-weight:600">${s.title || 'Question'}</div>
        <div style="color:var(--cream);font-size:13px;margin-top:4px">${s.reason || s.message || ''}</div>
        <div style="color:var(--muted);font-size:12px;margin-top:4px">by ${s.name}</div>
      </div>
    `).join('');
  }

  if(recommendForm){
    recommendForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const formData = new FormData(recommendForm);
      const submission = {
        type: 'recommendation',
        name: formData.get('name'),
        title: formData.get('title'),
        reason: formData.get('reason'),
        timestamp: new Date().toLocaleString()
      };
      const submissions = loadSubmissions();
      submissions.unshift(submission);
      saveSubmissions(submissions);
      renderSubmissions();
      recommendForm.reset();
      showAlert(`Thank you for recommending "${formData.get('title')}"!`);
    });
  }

  if(questionForm){
    questionForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const formData = new FormData(questionForm);
      const submission = {
        type: 'question',
        name: formData.get('name'),
        title: 'Question',
        message: formData.get('message'),
        timestamp: new Date().toLocaleString()
      };
      const submissions = loadSubmissions();
      submissions.unshift(submission);
      saveSubmissions(submissions);
      renderSubmissions();
      questionForm.reset();
      showAlert('Thank you for your question!');
    });
  }

  // Show alert
  function showAlert(message){
    const alertEl = document.getElementById('simpleAlert');
    if(alertEl){
      alertEl.textContent = message;
      alertEl.classList.add('show');
      setTimeout(()=>alertEl.classList.remove('show'), 3600);
    }
  }

  // FAQ toggle
  document.querySelectorAll('.faq-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e)=>{
      const content = toggle.nextElementSibling;
      const isOpen = toggle.classList.contains('open');
      // Close all other FAQs
      document.querySelectorAll('.faq-toggle').forEach(t => {
        if(t !== toggle){
          t.classList.remove('open');
          t.nextElementSibling.classList.remove('open');
        }
      });
      // Toggle current
      toggle.classList.toggle('open');
      if(content) content.classList.toggle('open');
    });
  });

  // Initial render
  renderSubmissions();
});
