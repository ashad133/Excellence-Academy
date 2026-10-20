/* ==========================================================================
   EXCELLENCE ACADEMY — MASTER INTERACTIVE & 3D ENGINE (main.js)
   WhatsApp Integration (+92 316 2760662) | Email: ubaidullah02004@gmail.com
   ========================================================================== */

const ACADEMY_CONFIG = {
  whatsappNumber: '923162760662',
  phoneDisplay: '+92 316 2760662',
  email: 'ubaidullah02004@gmail.com',
  timings: '2:00 PM to 8:00 PM (In-House & Online)'
};

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeaderAndProgress();
  initMobileNav();
  init3DTiltEngine();
  initTypewriter();
  initCounters();
  initFilterTabs();
  initFaqAccordion();
  initQuickFinder();
  initWhatsAppForms();
  initNotesRequestButtons();
});

/* 1. Sticky Header Collapse & Scroll Progress Bar */
function initStickyHeaderAndProgress() {
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.fab-top');

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    if (header) {
      header.classList.toggle('header-scrolled', scrollTop > 40);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollTop > 380);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* 2. Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navCenter = document.querySelector('.nav-center');
  if (!toggleBtn || !navCenter) return;

  toggleBtn.addEventListener('click', () => {
    navCenter.classList.toggle('open');
    const isOpen = navCenter.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* 3. True 3D Cursor Tilt & Spotlight Glow Engine */
function init3DTiltEngine() {
  const tiltElements = document.querySelectorAll('.card-3d, .hero-3d-card');
  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* 4. Hero Typewriter Animation */
function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const words = (el.getAttribute('data-typewriter') || '').split('|').filter(Boolean);
  if (!words.length) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = currentWord.substring(0, charIndex);

    let delay = isDeleting ? 45 : 85;
    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  };

  tick();
}

/* 5. Animated Metric Counters */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* 6. Filterable Catalog Tabs (Programs & Study Notes) */
function initFilterTabs() {
  const filterGroups = document.querySelectorAll('[data-filter-group]');
  filterGroups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter]');
    const targetSelector = group.getAttribute('data-filter-group');
    const items = document.querySelectorAll(targetSelector);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');

        items.forEach((item) => {
          const itemCats = (item.getAttribute('data-category') || '').split(' ');
          if (category === 'all' || itemCats.includes(category)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* 7. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

/* 8. Overlapping Quick Board & Grade Finder */
function initQuickFinder() {
  const finderForm = document.getElementById('quickFinderForm');
  if (!finderForm) return;

  finderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const level = finderForm.querySelector('[name="level"]')?.value || 'General';
    const board = finderForm.querySelector('[name="board"]')?.value || 'All Boards';
    const mode = finderForm.querySelector('[name="mode"]')?.value || 'In-House (2:00 PM - 8:00 PM)';
    const slot = finderForm.querySelector('[name="slot"]')?.value || 'Afternoon / Evening';

    const message = [
      '*EXCELLENCE ACADEMY — QUICK PROGRAM & BATCH INQUIRY*',
      '----------------------------------------',
      `*Student Level / Grade:* ${level}`,
      `*Examination Board:* ${board}`,
      `*Preferred Learning Mode:* ${mode}`,
      `*Preferred Time Slot:* ${slot}`,
      '----------------------------------------',
      'Hello Ubaid Ullah & Rohan Ali, please share batch details, fee structure, and trial class availability.'
    ].join('\n');

    const waUrl = `https://wa.me/${ACADEMY_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });
}

/* 9. Universal WhatsApp Form Dispatcher (+92 316 2760662) */
function initWhatsAppForms() {
  const forms = document.querySelectorAll('[data-whatsapp-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formTitle = form.getAttribute('data-whatsapp-form') || 'PARENT & STUDENT APPLICATION';
      const formData = new FormData(form);
      const lines = [
        `*EXCELLENCE ACADEMY — ${formTitle.toUpperCase()}*`,
        '----------------------------------------'
      ];

      for (const [key, value] of formData.entries()) {
        if (value && String(value).trim() !== '') {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          lines.push(`*${label}:* ${String(value).trim()}`);
        }
      }

      lines.push('----------------------------------------');
      lines.push(`*Official Email Copy:* ${ACADEMY_CONFIG.email}`);
      lines.push('*Submitted via Excellence Academy Official Portal*');

      const message = lines.join('\n');
      const waUrl = `https://wa.me/${ACADEMY_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  });
}

/* 10. Study Notes Instant WhatsApp Request */
function initNotesRequestButtons() {
  const noteButtons = document.querySelectorAll('[data-note-request]');
  noteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const packName = btn.getAttribute('data-note-request') || 'Complete Study Notes Pack';
      const board = btn.getAttribute('data-note-board') || 'Academic Board';
      const message = [
        '*EXCELLENCE ACADEMY — STUDY NOTES & PAST PAPER REQUEST*',
        '----------------------------------------',
        `*Resource Pack:* ${packName}`,
        `*Board / Level:* ${board}`,
        '----------------------------------------',
        'Hello Excellence Academy Team, please share this study resource pack and solved past paper guide.'
      ].join('\n');

      const waUrl = `https://wa.me/${ACADEMY_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  });
}
