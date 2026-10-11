(() => {
  'use strict';
  const header = document.getElementById('site-header');
  const progress = document.getElementById('scroll-progress');
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-links');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (window.scrollY / max * 100).toFixed(2) + '%';
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  const closeMenu = () => {
    nav.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    header.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('active', !expanded);
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    header.classList.toggle('menu-open', !expanded);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); }, { passive: true });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('visible'); observer.unobserve(target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -22px 0px' });
    revealItems.forEach(el => observer.observe(el));
  }

  // Restrained desktop-only portrait movement; CSS hover remains the fallback.
  const card = document.getElementById('portrait-card');
  if (card && !reduced && window.matchMedia('(pointer:fine)').matches) {
    const motion = e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(1100px) rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) rotate(1.4deg)`;
    };
    card.addEventListener('pointermove', motion);
    card.addEventListener('pointerleave', () => { card.style.transform = 'rotate(1.4deg)'; });
  }
})();