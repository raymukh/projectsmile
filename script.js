const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const pageLinks = Array.from(document.querySelectorAll('.site-nav a[data-page]'));
const allNavLinks = Array.from(document.querySelectorAll('.site-nav a'));
const hashLinks = Array.from(document.querySelectorAll('a[href^="#"]:not(.skip-link)'));
const yearEl = document.getElementById('year');
const statElements = Array.from(document.querySelectorAll('.stat'));
const animateElements = Array.from(
  document.querySelectorAll(
    '[data-animate="fade-in"], .hero-card, .program-card, .event-card, .testimonial-grid figure, .values article, .program-detail, .resources-grid article, .schedule-card, .team-grid article, .timeline article'
  )
);

const setCurrentYear = () => {
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
};

const toggleNav = () => {
  if (!navToggle || !siteNav) return;
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
  if (navToggle && siteNav) {
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
  }
};

const highlightActiveLink = () => {
  if (!navLinks.length) return;
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

const setActivePageLink = () => {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  pageLinks.forEach((link) => {
    link.classList.toggle('current', link.dataset.page === currentPage);
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

      const suffix = el.dataset.suffix || '';

      const step = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value.toLocaleString()}${suffix}`;
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

  if (!email || !email.includes('@')) {
    feedback.textContent = 'Please share a valid email address so we can reach you.';
    feedback.style.color = '#ffe4c4';
    return;
  }

  feedback.textContent = 'Thank you! A welcome email from Project Smile is on its way.';
  feedback.style.color = '#d1fae5';
  form.reset();
};

const handleContactSubmit = (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = form.querySelector('.form-feedback');

  if (!feedback) return;
  feedback.textContent = 'Thanks for reaching out! Our care team will respond within two business days.';
  feedback.style.color = 'var(--accent)';
  form.reset();
};

const init = () => {
  setCurrentYear();
  setActivePageLink();

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  hashLinks.forEach((link) => link.addEventListener('click', handleLinkClick));

  allNavLinks.forEach((link) =>
    link.addEventListener('click', () => {
      if (!navToggle || !siteNav) return;
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    })
  );

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
