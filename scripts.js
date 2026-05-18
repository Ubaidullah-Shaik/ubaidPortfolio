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

  // ===== HERO PORTRAIT INTERACTIVE REVEAL =====
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('hero-portrait-container');
    const canvas = document.getElementById('portrait-reveal-canvas');
    const baseImg = document.querySelector('.hero-portrait-base');

    if (!container || !canvas || !baseImg) return;

    const ctx = canvas.getContext('2d');
    const revealImg = new Image();
    // Use the same image for reveal - it will show the non-grayscale version
    revealImg.src = baseImg.src;

    let isFullyRevealed = false;
    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;

    // Set canvas size to match image
    function resizeCanvas() {
      const rect = baseImg.getBoundingClientRect();
      canvas.width = baseImg.naturalWidth || rect.width;
      canvas.height = baseImg.naturalHeight || rect.height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }

    baseImg.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    // Wait for reveal image to load
    revealImg.onload = function() {
      resizeCanvas();
      console.log('Hero portrait reveal ready');
    };

    // Track mouse position relative to image
    container.addEventListener('mouseenter', function(e) {
      isHovering = true;
      container.classList.add('revealing');
      updateMousePosition(e);
    });

    container.addEventListener('mouseleave', function() {
      isHovering = false;
      container.classList.remove('revealing');
      if (!isFullyRevealed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    container.addEventListener('mousemove', function(e) {
      if (isHovering && !isFullyRevealed) {
        updateMousePosition(e);
        drawReveal();
      }
    });

    // Click to reveal full image
    container.addEventListener('click', function(e) {
      if (!isFullyRevealed) {
        isFullyRevealed = true;
        container.classList.add('fully-revealed');
        container.classList.remove('revealing');
        drawFullReveal();
      } else {
        isFullyRevealed = false;
        container.classList.remove('fully-revealed');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    function updateMousePosition(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    }

    function drawReveal() {
      if (!revealImg.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create circular reveal area with smooth edges
      const radius = 100;
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Draw the reveal image (full color, no grayscale)
      ctx.drawImage(revealImg, 0, 0, canvas.width, canvas.height);

      ctx.restore();

      // Add glowing border around reveal circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(193, 39, 45, 0.8)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(193, 39, 45, 0.6)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }

    function drawFullReveal() {
      if (!revealImg.complete) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(revealImg, 0, 0, canvas.width, canvas.height);
    }

    // Make cursor clickable when showing VIEW text
    const cursor = document.querySelector('.cursor');
    if (cursor) {
      cursor.addEventListener('click', function(e) {
        if (cursor.classList.contains('text') && isHovering && !isFullyRevealed) {
          container.click();
        }
      });
    }
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
