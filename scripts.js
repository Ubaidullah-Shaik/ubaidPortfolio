/* =========================================================
   UBAID — Shared interactions
   ========================================================= */

(function() {
  'use strict';

  // ===== CONSTELLATION CANVAS BACKGROUND =====
  document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('.constellation');
    if (!canvas) {
      console.error('Constellation canvas not found!');
      return;
    }

    console.log('Constellation canvas found, initializing...');

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      initParticles();
    });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function initParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
      console.log(`Creating ${count} particles`);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.6 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.25,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.008
        });
      }
    }
    initParticles();
    console.log('Particles initialized, starting animation...');

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Update + draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        // Wrap around edges
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        const twinkleAlpha = p.baseAlpha * (0.7 + Math.sin(p.twinkle) * 0.3);

        // Mouse repel effect
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let glow = 0;
        if (dist < 160) {
          glow = 1 - dist / 160;
          p.x += (dx / dist) * glow * 1.2;
          p.y += (dy / dist) * glow * 1.2;
        }

        // Glow effect when near cursor
        if (glow > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(193, 39, 45, ${glow * 0.15})`;
          ctx.fill();
        }

        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = glow > 0
          ? `rgba(244, 162, 97, ${twinkleAlpha + glow * 0.4})`
          : `rgba(244, 241, 235, ${twinkleAlpha})`;
        ctx.fill();
      });

      // Draw connecting lines between near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(193, 39, 45, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  });

  // ===== PAGE TRANSITION ENTER =====
  document.addEventListener('DOMContentLoaded', function() {
    const transition = document.querySelector('.page-transition');
    if (transition) {
      transition.classList.add('entering');
      setTimeout(() => transition.classList.remove('entering'), 1500);
    }
  });

  // ===== PAGE TRANSITION LEAVE on link click =====
  document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');
    const transition = document.querySelector('.page-transition');

    internalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;
        e.preventDefault();
        if (transition) {
          transition.classList.add('leaving');
          setTimeout(() => { window.location.href = href; }, 900);
        } else {
          window.location.href = href;
        }
      });
    });
  });

  // ===== MOBILE MENU =====
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  });

  // ===== HEADER SCROLL HIDE/SHOW =====
  document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });
  });

  // ===== LIVE CLOCK =====
  document.addEventListener('DOMContentLoaded', function() {
    const clockEl = document.querySelector('[data-clock]');
    if (!clockEl) return;

    function tick() {
      const now = new Date();
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Africa/Johannesburg' };
      clockEl.textContent = now.toLocaleTimeString('en-ZA', opts) + ' SAST';
    }
    tick();
    setInterval(tick, 1000);
  });

  // ===== CUSTOM CURSOR =====
  document.addEventListener('DOMContentLoaded', function() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    const ease = 0.18;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    // Interactive hover states
    const growTargets = document.querySelectorAll('a, button, .menu-toggle, input, textarea, select, .skill-cell, .semester-card, .edu-card');
    growTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow', 'text'));
    });

    const textTargets = document.querySelectorAll('.project-tile .project-viewport, .hero-portrait, .about-portrait');
    textTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('text'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('text'));
    });
  });

  // ===== INTERSECTION REVEAL ANIMATIONS =====
  document.addEventListener('DOMContentLoaded', function() {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  });

  // ===== SKILL METER ANIMATIONS =====
  document.addEventListener('DOMContentLoaded', function() {
    const meters = document.querySelectorAll('.skill-meter-fill');
    if (!meters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.value || '50';
          entry.target.style.width = target + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    meters.forEach(m => observer.observe(m));
  });

})();
