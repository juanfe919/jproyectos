/* ============================================================
   BeeSkin Glow — Shared JS
   Bee animation · Header scroll · Hamburger · Scroll reveal
   ============================================================ */
'use strict';

/* ---- FLYING BEE ---- */
(function initBee() {
  const bee = document.getElementById('bee');
  if (!bee) return;

  // Bezier curve waypoints — bee drifts between them
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // Four control points that shift over time
  let prevX = W() / 2;
  let velX = 0, velY = 0;
  let targetX = W() * 0.5;
  let targetY = H() * 0.35;
  let currentX = targetX;
  let currentY = targetY;

  // Update target periodically — smooth wandering
  function newTarget() {
    const margin = 80;
    targetX = margin + Math.random() * (W() - margin * 2);
    targetY = margin + Math.random() * (H() * 0.7 - margin);
  }
  newTarget();
  let wanderTimer = setInterval(newTarget, 3200);

  // Pause when user scrolls
  let paused = false;
  window.addEventListener('scroll', () => {
    paused = true;
    clearTimeout(window._beeTimer);
    window._beeTimer = setTimeout(() => { paused = false; }, 700);
  }, { passive: true });

  // Interact on mousemove — bee is slightly attracted to cursor
  let mouseX = -999, mouseY = -999;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animate() {
    if (!paused) {
      // Blend target with mouse influence
      const mx = mouseX > 0 ? mouseX * 0.15 + targetX * 0.85 : targetX;
      const my = mouseY > 0 ? mouseY * 0.15 + targetY * 0.85 : targetY;

      // Spring physics
      const stiffness = 0.018;
      const damping   = 0.88;
      velX = (velX + (mx - currentX) * stiffness) * damping;
      velY = (velY + (my - currentY) * stiffness) * damping;
      currentX += velX;
      currentY += velY;

      const scaleX = velX < -0.3 ? -1 : 1;
      bee.style.transform = `translate(${currentX}px, ${currentY}px) scaleX(${scaleX})`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Honey drop on click — tiny burst effect
  bee.addEventListener('click', () => {
    showHoneyDrop(currentX, currentY);
  });

  function showHoneyDrop(x, y) {
    const drop = document.createElement('div');
    drop.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      font-size:20px; pointer-events:none; z-index:9998;
      animation: honeyPop 0.7s ease forwards;
      transform: translate(-50%,-50%);
    `;
    drop.textContent = '🍯';
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 700);
  }

  // Inject honeyPop keyframes
  const s = document.createElement('style');
  s.textContent = `
    @keyframes honeyPop {
      0%   { opacity:1; transform:translate(-50%,-50%) scale(0.5); }
      60%  { opacity:1; transform:translate(-50%,-120%) scale(1.2); }
      100% { opacity:0; transform:translate(-50%,-160%) scale(0.8); }
    }
  `;
  document.head.appendChild(s);
})();


/* ---- HEADER SCROLL ---- */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();


/* ---- HAMBURGER ---- */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();


/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => obs.observe(el));
})();

document.addEventListener("DOMContentLoaded", () => {
    const brand = document.getElementById('brand-shimmer');
    
    // Activamos el brillo
    if (brand) {
        brand.classList.add('animate-shine');
    }
});