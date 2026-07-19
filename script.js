/* =========================================================
   GLAMOUR HAIR BOUTIQUE — Ecosystem Logic v2
   ========================================================= */

'use strict';

// ─── 1. META PIXEL — Safe WhatsApp Redirect ──────────────────────────────────
function safeWhatsAppRedirect(url) {
  if (typeof fbq === 'function') {
    fbq('track', 'Lead');
  }
  setTimeout(() => { window.open(url, '_blank', 'noopener'); }, 100);
}

// ─── 2. LUCIDE ICONS ─────────────────────────────────────────────────────────
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ─── 3. NAVBAR — Scroll Effect ───────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── 4. COOKIE BANNER ────────────────────────────────────────────────────────
(function initCookieBanner() {
  const STORAGE_KEY = 'glamour_cookie_v1';
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  if (!banner) return;
  if (!localStorage.getItem(STORAGE_KEY)) {
    setTimeout(() => banner.classList.add('visible'), 900);
  }
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 600);
    });
  }
})();

// ─── 5. NATIVE ACCESSIBILITY WIDGET ──────────────────────────────────────────
(function initA11yWidget() {
  const trigger = document.getElementById('a11y-trigger');
  const modal = document.getElementById('a11y-modal');
  const hcBtn = document.getElementById('a11y-hc-btn');
  const fsIncBtn = document.getElementById('a11y-fs-inc');
  const fsDecBtn = document.getElementById('a11y-fs-dec');
  const resetBtn = document.getElementById('a11y-reset-btn');
  if (!trigger || !modal) return;

  let baseFontSize = 16;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = modal.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && e.target !== trigger) {
      modal.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });

  if (hcBtn) {
    hcBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
    });
  }

  function applyFontSize(size) {
    baseFontSize = Math.min(Math.max(size, 12), 26);
    document.documentElement.style.fontSize = baseFontSize + 'px';
  }

  if (fsIncBtn) { fsIncBtn.addEventListener('click', () => applyFontSize(baseFontSize + 2)); }
  if (fsDecBtn) { fsDecBtn.addEventListener('click', () => applyFontSize(baseFontSize - 2)); }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.body.classList.remove('high-contrast');
      document.documentElement.style.fontSize = '';
      baseFontSize = 16;
    });
  }
})();

// ─── 6. YOUTUBE SHORTS LAZY LOAD (IntersectionObserver) ──────────────────────
(function initYoutubeLazyLoad() {
  const section = document.getElementById('shorts-section');
  if (!section) return;

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const items = section.querySelectorAll('.short-item[data-video-id]');
        items.forEach((item) => {
          const videoId = item.dataset.videoId;
          if (!videoId || item.querySelector('iframe')) return;

          const placeholder = item.querySelector('.short-placeholder');
          if (placeholder) placeholder.remove();

          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.loading = 'lazy';
          iframe.title = 'Glamour Hair Boutique — YouTube Short';
          item.appendChild(iframe);
        });
      });
    },
    { threshold: 0.15 }
  );

  io.observe(section);

  // Shorts track navigation buttons
  const track = document.getElementById('shorts-track');
  const prevBtn = document.getElementById('shorts-prev');
  const nextBtn = document.getElementById('shorts-next');
  if (track && prevBtn && nextBtn) {
    const scrollBy = () => {
      const item = track.querySelector('.short-item');
      return item ? item.offsetWidth + 18 : 300;
    };
    prevBtn.addEventListener('click', () => { track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }); });
    nextBtn.addEventListener('click', () => { track.scrollBy({ left: scrollBy(), behavior: 'smooth' }); });
  }
})();

// ─── 7. BEFORE/AFTER INTERACTIVE SLIDER ──────────────────────────────────────
(function initBaSliders() {
  const isRTL = document.documentElement.dir === 'rtl';

  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const range = slider.querySelector('.ba-range');
    const beforeClip = slider.querySelector('.ba-before-clip');
    const handleLine = slider.querySelector('.ba-handle-line');
    if (!range) return;

    function update() {
      const val = range.value;
      if (beforeClip) {
        if (isRTL) {
          // In RTL, range starts at right
          beforeClip.style.clipPath = `inset(0 0 0 ${100 - val}%)`;
        } else {
          // In LTR, range starts at left
          beforeClip.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
        }
      }
      if (handleLine) {
        if (isRTL) {
          handleLine.style.right = val + '%';
          handleLine.style.left = 'auto';
          handleLine.style.transform = 'translateX(50%)';
        } else {
          handleLine.style.left = val + '%';
          handleLine.style.right = 'auto';
          handleLine.style.transform = 'translateX(-50%)';
        }
      }
    }

    range.addEventListener('input', update);
    update(); // init at 50%
  });
})();

// ─── 8. SCROLL REVEAL ────────────────────────────────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => io.observe(el));
})();

// ─── 9. TRUST STAT COUNTERS ──────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const step = duration / target;
        let current = 0;
        const timer = setInterval(() => {
          current++;
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, step);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => io.observe(el));
})();

// ─── 10. RE-INIT LUCIDE after dynamic DOM changes ───────────────────────────
// (Lucide scans on DOMContentLoaded; BA slider + Shorts inject new icons)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
