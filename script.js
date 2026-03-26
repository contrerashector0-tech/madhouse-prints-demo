'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── ELEMENTS ───────────────────────────────────────── */
  const header      = document.querySelector('.site-header');
  const hamburger   = document.querySelector('.nav__hamburger');
  const navMenu     = document.getElementById('nav-menu');
  const navLinks    = document.querySelectorAll('.nav__link');
  const footerYear  = document.getElementById('footer-year');
  const contactForm = document.querySelector('.contact__form');
  const hero        = document.querySelector('.hero');
  const heroBg      = document.querySelector('.hero__bg-decoration');


  /* ─── 1. MOBILE NAV TOGGLE ───────────────────────────── */
  function openNav() {
    navMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    navMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  // Close on nav link click
  navLinks.forEach(link => link.addEventListener('click', closeNav));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeNav();
    }
  });


  /* ─── 2. SCROLL DETECTION ────────────────────────────── */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    animateParallax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─── 3. SCROLL ANIMATIONS ───────────────────────────── */
  const animatables = document.querySelectorAll('.fade-in, .slide-up');

  if (animatables.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // trigger once only
        }
      });
    }, { threshold: 0.1 });

    animatables.forEach(el => observer.observe(el));
  }


  /* ─── 4. SMOOTH SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ─── 5. FOOTER YEAR ─────────────────────────────────── */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  /* ─── 6. CONTACT FORM ────────────────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl    = contactForm.querySelector('#contact-name');
      const emailEl   = contactForm.querySelector('#contact-email');
      const messageEl = contactForm.querySelector('#contact-message');

      // Clear previous errors
      contactForm.querySelectorAll('.form-error').forEach(el => el.remove());
      contactForm.querySelectorAll('.form-input--error').forEach(el => {
        el.classList.remove('form-input--error');
      });

      const errors = [];

      if (!nameEl.value.trim()) {
        errors.push({ el: nameEl, msg: 'Please enter your name.' });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl.value.trim() || !emailPattern.test(emailEl.value.trim())) {
        errors.push({ el: emailEl, msg: 'Please enter a valid email address.' });
      }

      if (!messageEl.value.trim()) {
        errors.push({ el: messageEl, msg: 'Please enter a message.' });
      }

      if (errors.length) {
        errors.forEach(({ el, msg }) => {
          el.classList.add('form-input--error');
          const errEl = document.createElement('p');
          errEl.className = 'form-error';
          errEl.setAttribute('role', 'alert');
          errEl.textContent = msg;
          errEl.style.cssText = 'color: #e05252; font-size: 0.82rem; margin-top: 0.3rem;';
          el.insertAdjacentElement('afterend', errEl);
        });
        errors[0].el.focus();
        return;
      }

      // Success
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Message Sent!';

      const successMsg = document.createElement('p');
      successMsg.className = 'form-success';
      successMsg.setAttribute('role', 'status');
      successMsg.textContent = "Thanks! We'll be in touch soon.";
      successMsg.style.cssText = [
        'margin-top: 1rem',
        'padding: 0.75rem 1rem',
        'background: rgba(var(--clr-primary-rgb, 99, 56, 241), 0.08)',
        'border-left: 3px solid var(--clr-primary, #6338f1)',
        'border-radius: 0.4rem',
        'font-size: 0.95rem',
      ].join(';');

      contactForm.appendChild(successMsg);
      contactForm.reset();

      // Re-enable after a delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        successMsg.remove();
      }, 5000);
    });
  }


  /* ─── 7. HERO PARALLAX ───────────────────────────────── */
  function animateParallax() {
    if (!hero || !heroBg) return;

    const heroRect   = hero.getBoundingClientRect();
    const heroBottom = heroRect.bottom;

    // Only apply while hero is at least partially visible
    if (heroBottom <= 0) return;

    const scrolled = -heroRect.top;
    const offset   = Math.max(0, scrolled) * 0.25; // 25% speed ratio

    heroBg.style.transform = `translateY(${offset}px)`;
  }

  // Run once on load for initial state
  onScroll();

});
