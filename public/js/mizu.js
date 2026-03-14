/* ===========================
   MIZU - SCROLL ANIMATIONS JS
   =========================== */

(function () {
  'use strict';

  // ---- Loading Screen ----
  function hideLoading() {
    const loader = document.querySelector('.loading-screen');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 1200);
      setTimeout(() => loader.remove(), 1800);
    }
  }

  // ---- Navbar Scroll ----
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // ---- Mobile Menu ----
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Scroll Reveal (IntersectionObserver) ----
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(el => observer.observe(el));
  }

  // ---- Parallax on Scroll ----
  function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.1;
            const rect = el.getBoundingClientRect();
            const yOffset = (scrollY - (el.offsetTop - window.innerHeight)) * speed;
            el.style.transform = `translateY(${yOffset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- Back to Top Button ----
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Custom Cursor (Desktop Only) ----
  function initCustomCursor() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    const interactiveElements = document.querySelectorAll('a, button, .flavor-card, .why-card, .review-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ---- Counter Animation for Rating ----
  function initCounterAnimation() {
    const counter = document.querySelector('[data-counter]');
    if (!counter) return;

    const target = parseFloat(counter.dataset.counter);
    const duration = 1500;
    let start = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = (target * eased).toFixed(1);
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  }

  // ---- Marquee Duplication for seamless loop ----
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;
    // Already duplicated in HTML, just verify
    const content = track.innerHTML;
    if (!track.dataset.duplicated) {
      track.innerHTML = content + content;
      track.dataset.duplicated = 'true';
    }
  }

  // ---- Flavor card tilt effect ----
  function initTiltEffect() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cards = document.querySelectorAll('.flavor-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- Active Nav Link on Scroll ----
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
          link.style.color = 'var(--teal)';
        }
      });
    }, { passive: true });
  }

  // ---- Init All ----
  document.addEventListener('DOMContentLoaded', () => {
    hideLoading();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initParallax();
    initBackToTop();
    initCustomCursor();
    initCounterAnimation();
    initMarquee();
    initTiltEffect();
    initActiveNavLink();
  });
})();
