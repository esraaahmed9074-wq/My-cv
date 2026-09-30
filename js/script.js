/**
 * Esraa Ahmed — Junior Data Analyst Portfolio
 * Vanilla JavaScript Implementation
 * Features: Dark/Light Mode, Mobile Nav, ScrollSpy, Animations, Modal, Form UX
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark Default with Light Mode Toggle)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
      themeToggleBtn.setAttribute('aria-pressed', theme === 'light');
    }
  }

  // -------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION MENU
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.contains('open');
      toggleMenu(!isOpen);
    });

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (hamburgerBtn.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        hamburgerBtn.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburgerBtn.classList.contains('open')) {
        toggleMenu(false);
        hamburgerBtn.focus();
      }
    });
  }

  function toggleMenu(open) {
    if (open) {
      hamburgerBtn.classList.add('open');
      navMenu.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    } else {
      hamburgerBtn.classList.remove('open');
      navMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // -------------------------------------------------------------------------
  // 3. SCROLLSPY (ACTIVE NAVIGATION HIGHLIGHT)
  // -------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    trackedSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // -------------------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // -------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, appearOptions);

    fadeElements.forEach(el => appearOnScroll.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // -------------------------------------------------------------------------
  // 5. PROJECT PREVIEW MODAL / LIGHTBOX
  // -------------------------------------------------------------------------
  const modal = document.getElementById('project-modal');
  const openModalBtn = document.getElementById('open-project-modal');
  const imgTrigger = document.getElementById('project-img-trigger');
  const closeModalBtn = document.getElementById('close-project-modal');
  let lastActiveElement = null;

  if (modal && closeModalBtn) {
    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        lastActiveElement = openModalBtn;
        openModal();
      });
    }

    if (imgTrigger) {
      imgTrigger.addEventListener('click', () => {
        lastActiveElement = imgTrigger;
        openModal();
      });

      imgTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lastActiveElement = imgTrigger;
          openModal();
        }
      });
    }

    closeModalBtn.addEventListener('click', () => {
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeModalBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    } else if (openModalBtn) {
      openModalBtn.focus();
    }
  }

  // -------------------------------------------------------------------------
  // 6. CONTACT FORM SUBMISSION (Client-Side UX)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate instantaneous client-side feedback
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.reset();

        formAlert.classList.add('success');
        formAlert.textContent = "Thank you for reaching out! Your message has been prepared. You can also connect directly via LinkedIn, Nafezly, or Kafiil below.";
        formAlert.style.display = 'flex';

        setTimeout(() => {
          formAlert.style.display = 'none';
        }, 8000);
      }, 600);
    });
  }

  // -------------------------------------------------------------------------
  // 7. BACK TO TOP BUTTON
  // -------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
