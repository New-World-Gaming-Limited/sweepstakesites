/* ============================================
   STAKE.US GUIDE - Shared JavaScript
   ============================================ */

// --- THEME TOGGLE ---
(function(){
  const toggle = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// --- MOBILE MENU ---
(function(){
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.innerHTML = isOpen
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
      document.body.style.overflow = '';
    });
  });
})();

// --- FAQ ACCORDION ---
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    // Close all
    item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// --- SCROLL REVEALS ---
(function(){
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
})();

// --- SCORE BAR ANIMATION ---
(function(){
  const bars = document.querySelectorAll('.score-bar-fill');
  if (!bars.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => {
    bar.style.width = '0';
    observer.observe(bar);
  });
})();

// --- COPY PROMO CODE + REDIRECT ---
var AFFILIATE_URL = 'https://www.getstake.it/i/Maxbet/io/maxbet/u/Maxbet/uo/maxbet';

function copyAndRedirect(btn) {
  var code = btn.getAttribute('data-code') || 'MAXBET';
  navigator.clipboard.writeText(code).catch(function() {
    var ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  btn.classList.add('copied');
  var orig = btn.innerHTML;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied! Redirecting...';
  setTimeout(function() {
    btn.classList.remove('copied');
    btn.innerHTML = orig;
  }, 2000);
  setTimeout(function() {
    window.open(AFFILIATE_URL, '_blank', 'noopener,noreferrer');
  }, 400);
}

document.querySelectorAll('.copy-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    copyAndRedirect(btn);
  });
});

// Make the entire promo-code-cutout clickable
document.querySelectorAll('.promo-code-cutout').forEach(function(box) {
  box.style.cursor = 'pointer';
  box.setAttribute('role', 'button');
  box.setAttribute('tabindex', '0');
  box.addEventListener('click', function(e) {
    if (e.target.closest('.copy-btn')) return;
    var btn = box.querySelector('.copy-btn');
    if (btn) copyAndRedirect(btn);
  });
  box.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      var btn = box.querySelector('.copy-btn');
      if (btn) copyAndRedirect(btn);
    }
  });
});

// --- ACTIVE NAV HIGHLIGHT ---
(function(){
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === './')) {
      a.classList.add('active');
    }
  });
})();

// --- DYNAMIC DATES ---
// Auto-updates all date references to current month/year/day
(function(){
  var now = new Date();
  var months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var month = months[now.getMonth()];
  var year = now.getFullYear();
  var day = now.getDate();
  var fullDate = month + ' ' + day + ', ' + year;
  var monthYear = month + ' ' + year;

  // Update all dynamic-date-full spans (e.g., "March 18, 2026")
  document.querySelectorAll('.dynamic-date-full').forEach(function(el){
    el.textContent = fullDate;
  });

  // Update all dynamic-month-year spans (e.g., "March 2026")
  document.querySelectorAll('.dynamic-month-year').forEach(function(el){
    el.textContent = monthYear;
  });

  // Update "Last Used X mins ago" with random 4-23 minutes
  document.querySelectorAll('.dynamic-last-used').forEach(function(el){
    el.textContent = (Math.floor(Math.random() * 20) + 4);
  });

  // Update any ld+json schema dateModified to today
  var isoDate = now.getFullYear() + '-' + 
    String(now.getMonth()+1).padStart(2,'0') + '-' + 
    String(now.getDate()).padStart(2,'0');
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){
    try {
      var data = JSON.parse(s.textContent);
      if (data.dateModified) {
        data.dateModified = isoDate;
        s.textContent = JSON.stringify(data);
      }
    } catch(e) {}
  });
})();
