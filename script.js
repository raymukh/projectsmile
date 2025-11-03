const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const yearEl = document.getElementById('year');
const statElements = Array.from(document.querySelectorAll('.stat'));
const animateElements = Array.from(document.querySelectorAll('[data-animate="fade-in"], .hero-card, .program-card, .event-card, .testimonial-grid figure'));

const setCurrentYear = () => {
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
};

const toggleNav = () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open', !expanded);
};

const handleLinkClick = (event) => {
  const targetId = event.currentTarget.getAttribute('href');
  if (!targetId.startsWith('#')) return;

  event.preventDefault();
  const target = document.querySelector(targetId);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth' });
  navToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('open');
};

const highlightActiveLink = () => {
  const fromTop = window.scrollY + 120;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;

    const offsetTop = section.offsetTop;
    const offsetBottom = offsetTop + section.offsetHeight;

    if (fromTop >= offsetTop && fromTop < offsetBottom) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

const animateStats = () => {
  statElements.forEach((el) => {
    const target = Number(el.dataset.target);
    if (!target) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80 && !el.dataset.animated) {
      el.dataset.animated = 'true';
      const duration = 1400;
      const startTime = performance.now();

      const formatValue = (value) => {
        if (target >= 100 && el.textContent.trim().includes('%')) {
          return `${Math.round(value)}%`;
        }
        if (target >= 1000) {
          return Math.round(value).toLocaleString();
        }
        return Math.round(value);
      };

      const step = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatValue(target * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  });
};

const revealOnScroll = () => {
  animateElements.forEach((el) => {
    if (el.classList.contains('visible')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
};

const handleNewsletterSubmit = (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = form.querySelector('.form-feedback');
  const email = form.email.value.trim();

  if (!email) {
    feedback.textContent = 'Please enter a valid email to subscribe.';
    feedback.style.color = '#ffe066';
    return;
  }

  feedback.textContent = 'Thanks for subscribing! Check your inbox for a welcome email.';
  feedback.style.color = '#d4f4dd';
  form.reset();
};

const handleContactSubmit = (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = form.querySelector('.form-feedback');

  if (!feedback) return;
  feedback.textContent = 'Thanks for reaching out! Our team will reply within 2 business days.';
  feedback.style.color = 'var(--primary)';
  form.reset();
};

const init = () => {
  setCurrentYear();

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  navLinks.forEach((link) => link.addEventListener('click', handleLinkClick));

  highlightActiveLink();
  animateStats();
  revealOnScroll();

  document.addEventListener('scroll', () => {
    highlightActiveLink();
    animateStats();
    revealOnScroll();
  });

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
};

window.addEventListener('DOMContentLoaded', init);
