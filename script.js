'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.nav__hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const footerYear = document.getElementById('footer-year');
  const contactForm = document.querySelector('.contact__form');

  function openNav() {
    navMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    navMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    navLinks.forEach(link => link.addEventListener('click', closeNav));

    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeNav();
      }
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  const animatables = document.querySelectorAll('.fade-in, .slide-up');
  if (animatables.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatables.forEach(el => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = contactForm.querySelector('#contact-name');
      const emailEl = contactForm.querySelector('#contact-email');
      const messageEl = contactForm.querySelector('#contact-message');
      const submitBtn = contactForm.querySelector('[type="submit"]');

      contactForm.querySelectorAll('.form-error').forEach(el => el.remove());
      contactForm.querySelectorAll('.form-input--error').forEach(el => {
        el.classList.remove('form-input--error');
      });

      const errors = [];
      if (!nameEl.value.trim()) errors.push({ el: nameEl, msg: 'Please enter your name.' });

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailEl.value.trim() || !emailPattern.test(emailEl.value.trim())) {
        errors.push({ el: emailEl, msg: 'Please enter a valid email address.' });
      }

      if (!messageEl.value.trim()) errors.push({ el: messageEl, msg: 'Please enter a message.' });

      if (errors.length) {
        errors.forEach(({ el, msg }) => {
          el.classList.add('form-input--error');
          const errEl = document.createElement('p');
          errEl.className = 'form-error';
          errEl.setAttribute('role', 'alert');
          errEl.textContent = msg;
          errEl.style.cssText = 'color: #ff8d8d; font-size: 0.82rem; margin-top: 0.3rem;';
          el.insertAdjacentElement('afterend', errEl);
        });
        errors[0].el.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            contactForm.reset();

            const successMsg = document.createElement('p');
            successMsg.className = 'form-success';
            successMsg.setAttribute('role', 'status');
            successMsg.textContent = 'Thanks — your message was sent to Madhouse Prints.';
            successMsg.style.cssText = [
              'margin-top: 1rem',
              'padding: 0.85rem 1rem',
              'background: rgba(255,255,255,0.08)',
              'border: 1px solid rgba(255,255,255,0.12)',
              'border-radius: 12px',
              'color: #f3f4f6',
              'font-size: 0.95rem'
            ].join(';');

            contactForm.querySelector('.form-success')?.remove();
            contactForm.appendChild(successMsg);
          } else {
            alert('Something went wrong. Please try again.');
          }
        })
        .catch(() => {
          alert('Network error. Please try again.');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }

  onScroll();
});