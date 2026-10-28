/* =========================================================
   SCRIPT.JS - Santhiya portfolio
   Features:
   1. Mark JavaScript as enabled (so scroll-reveal styles apply)
   2. Footer year
   3. Navbar background on scroll
   4. Mobile menu (open / close / Escape key)
   5. Active navigation highlighting
   6. Scroll-reveal animations
   7. Back-to-top button
   8. Placeholder links (show a reminder until real URLs are added)
   9. Contact form validation
   ========================================================= */

// Wait until the HTML is fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Tell CSS that JavaScript is running ----------
  document.documentElement.classList.add('js-enabled');

  // ---------- 2. Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- 3. Navbar gets a background after scrolling ----------
  const navbar = document.getElementById('navbar');

  // ---------- 4. Mobile menu ----------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  function setMenu(open) {
    navMenu.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  menuToggle.addEventListener('click', () => {
    setMenu(!navMenu.classList.contains('open'));
  });

  // Close the menu when a link is chosen
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close the menu with the Escape key (keyboard-friendly)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // ---------- 5. Active navigation highlighting ----------
  // Watch each section; when it is in view, highlight its link in the menu
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-45% 0px -50% 0px'   // trigger when section crosses the middle of the screen
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ---------- 6. Scroll-reveal animations ----------
  // Elements with class "reveal" fade and slide in when they enter the screen
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);   // animate only once
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- 7. Back-to-top button and navbar background ----------
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 400);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();   // run once on load in case the page starts scrolled

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- 8. Placeholder links ----------
  // Links with class "placeholder-link" do not go anywhere yet.
  // Clicking them shows a short reminder to add the real URL.
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  document.querySelectorAll('.placeholder-link').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();   // stop the page jumping to the top
      const label = link.dataset.placeholder || '[Add URL]';
      showToast('Link not added yet. Replace ' + label + ' in index.html with the real URL.');
    });
  });

  // ---------- 9. Contact form validation ----------
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // Simple email pattern: text@text.text
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each field has a rule that returns an error message, or an empty string if valid
  const rules = {
    name: (value) => {
      if (!value) return 'Please enter your name.';
      if (value.length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: (value) => {
      if (!value) return 'Please enter your email address.';
      if (!emailPattern.test(value)) return 'Please enter a valid email address.';
      return '';
    },
    subject: (value) => {
      if (!value) return 'Please enter a subject.';
      if (value.length < 3) return 'Subject must be at least 3 characters.';
      return '';
    },
    message: (value) => {
      if (!value) return 'Please write a message.';
      if (value.length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  // Show or hide the error message for one field
  function setFieldError(fieldName, message) {
    const input = form.elements[fieldName];
    const errorEl = document.getElementById(fieldName + 'Error');
    errorEl.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  // Check one field and return true if it is valid
  function validateField(fieldName) {
    const value = form.elements[fieldName].value.trim();
    const message = rules[fieldName](value);
    setFieldError(fieldName, message);
    return message === '';
  }

  // Check all fields; return true only if every one is valid
  function validateForm() {
    let isValid = true;
    Object.keys(rules).forEach(fieldName => {
      if (!validateField(fieldName)) isValid = false;
    });
    return isValid;
  }

  // Check a field as the user leaves it, and clear its error while they type
  Object.keys(rules).forEach(fieldName => {
    const input = form.elements[fieldName];
    input.addEventListener('blur', () => validateField(fieldName));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(fieldName);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();   // stop the browser from reloading the page

    if (!validateForm()) {
      formStatus.textContent = 'Please fix the highlighted fields and try again.';
      formStatus.className = 'form-status error';
      // Move keyboard focus to the first field with an error
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // NOTE: there is no backend in this static site, so the message is NOT sent anywhere.
    // To send real emails, connect a form service (Formspree, EmailJS) or an Express.js API
    // here. See the setup guide for step-by-step instructions.
    formStatus.textContent = 'Thanks! Your message is valid. Real email delivery needs a backend or form service to be connected.';
    formStatus.className = 'form-status success';
    form.reset();
    Object.keys(rules).forEach(fieldName => setFieldError(fieldName, ''));
  });

});
