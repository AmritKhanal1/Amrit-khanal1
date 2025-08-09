/* ============================
   — Configuration & Helpers
   ============================ */
const selectors = {
  preloader: document.getElementById('preloader'),
  themeToggle: document.getElementById('themeToggle'),
  resumeDownload: document.getElementById('resumeDownload'),
  navLinks: document.querySelectorAll('nav a.navlink'),
  projectSearch: document.getElementById('projectSearch'),
  projectsGrid: document.getElementById('projectsGrid'),
  projects: document.querySelectorAll('.project-card'),
  modal: document.getElementById('projectModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalDesc: document.getElementById('modalDesc'),
  modalVisit: document.getElementById('modalVisit'),
  closeModal: document.getElementById('closeModal'),
  contactForm: document.getElementById('contactForm'),
  formStatus: document.getElementById('formStatus'),
  backTop: document.getElementById('backTop'),
  typingEl: document.querySelector('.typing'),
  avatar: document.getElementById('avatar'),
  avatarWrap: document.getElementById('avatarWrap'),
  btnWork: document.getElementById('btnWork'),
  projectsTop: document.getElementById('projectsTop'),
  contactTop: document.getElementById('contactTop'),
  counters: {
    exp: document.getElementById('counterExp'),
    projects: document.getElementById('counterProjects'),
    years: document.getElementById('years'),
    projectsCount: document.getElementById('projectsCount')
  }
};

/* ============================
   — Preloader & init
   ============================ */
window.addEventListener('load', () => {
  // small delay to display preloader nicely
  setTimeout(()=> {
    selectors.preloader.style.opacity = '0';
    selectors.preloader.style.pointerEvents = 'none';
    selectors.preloader.remove();
  }, 650);

  // animate skill bars
  document.querySelectorAll('.bar > i').forEach((el, i) => {
    setTimeout(()=> el.style.width = el.dataset.width || '70%', 400 + i*220);
  });

  // counters
  animateCounter(selectors.counters.exp, 20, 900); // months coding sample
  animateCounter(selectors.counters.projects, 12, 900);
  animateCounter(selectors.counters.years, 1, 900);
  animateCounter(selectors.counters.projectsCount, 12, 900);
});

/* ============================
   — Theme toggle & persistence
   ============================ */
function setTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  selectors.themeToggle.innerHTML = theme === 'dark' ? '<i class=\"fa fa-sun\"></i>' : '<i class=\"fa fa-moon\"></i>';
}
const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);
selectors.themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================
   — Typing effect (custom)
   ============================ */
const typingWords = ["Strategic-Dynamo ⚡","Enthusiastic-Dreamer ✨","Dynamic-Thinker 🔥"];
let tIdx = 0, tPos = 0, typingForward = true;
function typingLoop(){
  const el = selectors.typingEl;
  if(!el) return;
  const word = typingWords[tIdx];
  if(typingForward){
    tPos++;
    el.textContent = word.substring(0, tPos);
    if(tPos === word.length){
      typingForward = false;
      setTimeout(typingLoop, 900);
      return;
    }
  } else {
    tPos--;
    el.textContent = word.substring(0, tPos);
    if(tPos === 0){
      typingForward = true;
      tIdx = (tIdx + 1) % typingWords.length;
    }
  }
  setTimeout(typingLoop, typingForward ? 70 : 30);
}
typingLoop();

/* ============================
   — Smooth scroll + scrollspy
   ============================ */
document.querySelectorAll('a.navlink, #btnWork, #projectsTop, #contactTop').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const href = el.getAttribute('href') || (el.id === 'btnWork' ? '#projects' : (el.id === 'projectsTop' ? '#projects' : '#contact'));
    const target = document.querySelector(href);
    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// scrollspy update
function updateActiveNav(){
  const sections = document.querySelectorAll('section, footer');
  const pos = window.scrollY + 120;
  let current = 'home';
  sections.forEach(s => {
    if(s.offsetTop <= pos) current = s.id || current;
  });
  document.querySelectorAll('nav a.navlink').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', ()=> {
  updateActiveNav();
  // show backtop
  selectors.backTop.style.display = window.scrollY > 400 ? 'grid' : 'none';
});
updateActiveNav();

/* ============================
   — Project filters & search
   ============================ */
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    Array.from(selectors.projects).forEach(card => {
      const tags = (card.dataset.tags || '').split(' ');
      const show = filter === 'all' ? true : tags.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
});

selectors.projectSearch.addEventListener('input', (e)=> {
  const q = e.target.value.toLowerCase().trim();
  selectors.projects.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const desc = card.dataset.desc.toLowerCase();
    const tags = card.dataset.tags.toLowerCase();
    const show = title.includes(q) || desc.includes(q) || tags.includes(q) || q === '';
    card.style.display = show ? '' : 'none';
  });
});

// open modal for project details
selectors.projects.forEach(card => {
  card.addEventListener('click', ()=> openModal(card));
  card.addEventListener('keypress', (e)=> { if(e.key === 'Enter') openModal(card); });
});

function openModal(card){
  selectors.modalTitle.textContent = card.dataset.title;
  selectors.modalDesc.textContent = card.dataset.desc;
  selectors.modal.classList.add('open');
  selectors.modal.setAttribute('aria-hidden', 'false');
}
function closeModal(){
  selectors.modal.classList.remove('open');
  selectors.modal.setAttribute('aria-hidden', 'true');
}
selectors.closeModal.addEventListener('click', closeModal);
selectors.modal.addEventListener('click', (e) => { if(e.target === selectors.modal) closeModal(); });

/* ============================
   — Contact form (Google Sheets)
   ============================ */
const scriptURL = 'https://script.google.com/macros/s/AKfycbzu68qQSbqYm9lDiP_1opduyRAkyUtJtPg0lXpKaZFTsdOvFAyW9SPq0omTNPlEFQBqFQ/exec';
selectors.contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  // simple validation
  if(!form.NAME.value.trim() || !form.EMAIL.value.trim() || !form.MESSAGE.value.trim()){
    selectors.formStatus.textContent = 'Please fill required fields';
    selectors.formStatus.style.color = 'var(--accent)';
    return;
  }
  selectors.formStatus.textContent = 'Sending...';
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(_ => {
      selectors.formStatus.textContent = 'Thanks! Form submitted.';
      selectors.formStatus.style.color = 'var(--success)';
      form.reset();
      setTimeout(()=> selectors.formStatus.textContent = '', 4000);
    })
    .catch(err => {
      console.error(err);
      selectors.formStatus.textContent = 'Error sending message. Try again later.';
      selectors.formStatus.style.color = 'tomato';
    });
});

/* ============================
   — Back to top
   ============================ */
selectors.backTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

/* ============================
   — Resume download (placeholder PDF)
   ============================ */
selectors.resumeDownload.addEventListener('click', ()=> {
  // Replace this with a real resume link if available.
  const data = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 55 >>\nstream\nBT /F1 18 Tf 30 100 Td (Amrit Khanal Resume) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000061 00000 n \n0000000112 00000 n \n0000000211 00000 n \ntrailer\n<< /Root 1 0 R >>\nstartxref\n306\n%%EOF';
  const blob = new Blob([data], {type:'application/pdf'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Amrit_Khanal_Resume.pdf';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

/* ============================
   — Tiny interactive tilt for avatar & cards
   ============================ */
function tiltElement(el, intensity=12){
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${ -y*intensity }deg) rotateY(${ x*intensity }deg) translateZ(6px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
}
tiltElement(selectors.avatarWrap, 8);
document.querySelectorAll('.project-card').forEach(c=> tiltElement(c, 6));

/* ============================
   — Small reveal on scroll (lightweight)
   ============================ */
const srItems = document.querySelectorAll('.card, .project-card, .timeline-item, .stat');
const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
      e.target.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
      srObserver.unobserve(e.target);
    }
  });
}, {threshold:0.08});
srItems.forEach((s, i) => {
  s.style.opacity = 0; s.style.transform = 'translateY(12px)';
  srObserver.observe(s);
});

/* ============================
   — Utility: animate numeric counters
   ============================ */
function animateCounter(el, target, duration=1000){
  const start = 0, end = target, range = end - start;
  let current = start; const stepTime = Math.max(Math.floor(duration / range), 20);
  const timer = setInterval(() => {
    current += 1;
    el.textContent = current;
    if(current >= end) clearInterval(timer);
  }, stepTime);
}

/* ============================
   — small accessibility improvements
   ============================ */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal();
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================
   — Clean URL hash on load (so home becomes top)
   ============================ */
if(location.hash === '#home') history.replaceState(null, '', ' ');