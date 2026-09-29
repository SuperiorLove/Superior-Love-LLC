/* ============================================================
   SUPERIOR LOVE LLC — main.js
   ============================================================ */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

// ---- CARE TILE EXPAND ----
document.querySelectorAll('.care-tile-expand').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const detail   = document.getElementById(targetId);
    const isOpen   = detail.classList.contains('open');

    // Close all
    document.querySelectorAll('.care-tile-detail').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.care-tile-expand').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.textContent = b.textContent.replace('−', '+');
    });

    if (!isOpen) {
      detail.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = btn.textContent.replace('+', '−');
    }
  });
});

// ---- SERVICE DROPDOWNS (accordion on #services if present) ----
document.querySelectorAll('.service-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const body   = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.service-header').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('open');
    }
  });
});

// ---- TEAM BIO EXPAND ----
document.querySelectorAll('.team-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const bioEl    = document.getElementById(targetId);
    const isOpen   = bioEl.classList.contains('open');

    // Collapse all bios
    document.querySelectorAll('.team-bio-full').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.team-expand-btn').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.textContent = 'Read Full Bio +';
    });

    if (!isOpen) {
      bioEl.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Collapse Bio −';
    }
  });
});

// ---- GALLERY LIGHTBOX ----
const lightbox        = document.getElementById('lightbox');
const lightboxMedia   = document.getElementById('lightboxMedia');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const caption    = item.dataset.caption || '';
      const placeholder = item.querySelector('.gallery-placeholder');
      const icon       = placeholder ? placeholder.querySelector('span').textContent : '&#128247;';
      const label      = placeholder ? placeholder.querySelector('p').textContent : '';

      lightboxMedia.innerHTML   = `<span style="font-size:4rem">${icon}</span>`;
      lightboxCaption.textContent = caption || label;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
}

// ---- TESTIMONIAL CAROUSEL ----
(function () {
  const track   = document.getElementById('carouselTrack');
  const dotsEl  = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let current = 0;
  let perView = getPerView();
  let autoId  = null;

  function getPerView() {
    if (window.innerWidth < 600)  return 1;
    if (window.innerWidth < 1000) return 2;
    return 3;
  }
  function maxIndex() { return Math.max(0, total - perView); }

  function buildDots() {
    dotsEl.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }
  function updateDots() {
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function autoPlay() {
    autoId = setInterval(() => goTo(current < maxIndex() ? current + 1 : 0), 4500);
  }
  function resetAuto() { clearInterval(autoId); autoPlay(); }

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    resetAuto();
  });

  function init() {
    perView = getPerView();
    current = Math.min(current, maxIndex());
    buildDots();
    goTo(current);
  }
  window.addEventListener('resize', init);
  init();
  autoPlay();
})();

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

[
  '#about .about-inner',
  '.care-tile',
  '.amenities-inner',
  '.org-chart',
  '.amenities-panel',
  '#promise .promise-inner',
  '.testimonial-card',
  '.team-card',
  '.booking-inner',
  '.cta-banner-inner',
  '.footer-grid > div'
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    observer.observe(el);
  });
});
