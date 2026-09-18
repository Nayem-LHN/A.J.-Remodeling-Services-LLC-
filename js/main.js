/* A.J. Remodeling Services — main.js */
(function () {
  'use strict';

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var navClose = document.getElementById('navClose');
  var navPanel = document.getElementById('navPanel');
  var navOverlay = document.getElementById('navOverlay');
  var bodyEl = document.body;

  function openNav() {
    if (!navPanel) return;
    navPanel.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    bodyEl.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!navPanel) return;
    navPanel.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    bodyEl.style.overflow = '';
  }
  if (navToggle) navToggle.addEventListener('click', openNav);
  if (navClose) navClose.addEventListener('click', closeNav);
  if (navOverlay) navOverlay.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeNav(); closeLightbox(); }
  });
  /* Close after navigating */
  if (navPanel) {
    navPanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Marquee: duplicate track for seamless loop ---------- */
  var marquee = document.querySelector('.marquee__track');
  if (marquee) {
    marquee.innerHTML += marquee.innerHTML;
  }

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = Math.round(val) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          co.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Accordion ---------- */
  var accHeads = document.querySelectorAll('.acc__head');
  accHeads.forEach(function (head) {
    head.addEventListener('click', function () {
      var acc = head.parentElement;
      var body = acc.querySelector('.acc__body');
      var isOpen = acc.classList.contains('open');
      /* close siblings */
      var group = acc.closest('.acc-group');
      if (group) {
        group.querySelectorAll('.acc.open').forEach(function (a) {
          if (a !== acc) {
            a.classList.remove('open');
            a.querySelector('.acc__body').style.maxHeight = null;
          }
        });
      }
      if (isOpen) {
        acc.classList.remove('open');
        body.style.maxHeight = null;
      } else {
        acc.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox ? lightbox.querySelector('img') : null;
  var lbCap = lightbox ? lightbox.querySelector('.lightbox__cap') : null;
  var lbItems = [];
  var lbIndex = 0;

  function buildLightbox() {
    lbItems = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  }
  function openLightbox(idx) {
    if (!lightbox) return;
    buildLightbox();
    lbIndex = idx;
    renderLightbox();
    lightbox.classList.add('open');
    bodyEl.style.overflow = 'hidden';
  }
  function renderLightbox() {
    var item = lbItems[lbIndex];
    if (!item) return;
    lbImg.src = item.getAttribute('data-full') || item.querySelector('img').src;
    lbImg.alt = item.getAttribute('data-cap') || '';
    lbCap.textContent = item.getAttribute('data-cap') || '';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    bodyEl.style.overflow = '';
  }
  function moveLightbox(dir) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    renderLightbox();
  }
  buildLightbox();
  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    el.addEventListener('click', function () {
      openLightbox(lbItems.indexOf(el));
    });
  });
  window.closeLightbox = closeLightbox;
  var lbClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var lbPrev = lightbox ? lightbox.querySelector('.lightbox__nav--prev') : null;
  var lbNext = lightbox ? lightbox.querySelector('.lightbox__nav--next') : null;
  if (lbClose) lbClose.addEventListener('click', function (e) { e.stopPropagation(); closeLightbox(); });
  if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); moveLightbox(-1); });
  if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); moveLightbox(1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'ArrowRight') moveLightbox(1);
      if (e.key === 'ArrowLeft') moveLightbox(-1);
    }
  });

  /* ---------- Review carousel paging (desktop bumpers) ---------- */
  var reviewTrack = document.getElementById('reviewTrack');
  var btnPrev = document.getElementById('reviewPrev');
  var btnNext = document.getElementById('reviewNext');
  if (reviewTrack && btnPrev && btnNext) {
    var step = function () { return Math.round(reviewTrack.clientWidth * 0.85); };
    btnPrev.addEventListener('click', function () { reviewTrack.scrollBy({ left: -step(), behavior: 'smooth' }); });
    btnNext.addEventListener('click', function () { reviewTrack.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  /* ---------- Forms ---------- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var subjectInput = form.querySelector('[name="subject"]');
    var successEl = form.querySelector('[data-success]');
    var to = form.getAttribute('data-to') || 'a.j.remodelingservices17@gmail.com';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var field = f.closest('.field');
        var ok = f.value.trim() !== '';
        if (f.type === 'tel' && ok && !/^[0-9+\-(). ]{7,20}$/.test(f.value.trim())) ok = false;
        if (f.type === 'email' && ok && !/^\S+@\S+\.\S+$/.test(f.value.trim())) ok = false;
        if (!ok) {
          field.classList.add('has-error');
          valid = false;
        } else {
          field.classList.remove('has-error');
        }
      });
      if (!valid) return;

      var fd = new FormData(form);
      var parts = [];
      var subjectLine = subjectInput ? subjectInput.value.trim() : '';
      fd.forEach(function (v, k) {
        if (k === 'subject') return;
        if (typeof v === 'string' && v.trim() !== '') {
          parts.push(k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + ': ' + v.trim());
        }
      });
      var body = parts.join('\n\n');

      var gmail = to.indexOf('gmail.com') !== -1;
      var composeUrl;
      if (gmail) {
        composeUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
          '&su=' + encodeURIComponent(subjectLine || 'Consultation Request') +
          '&body=' + encodeURIComponent(body);
      } else {
        composeUrl = 'mailto:' + to + '?subject=' + encodeURIComponent(subjectLine || 'Consultation Request') + '&body=' + encodeURIComponent(body);
      }
      window.open(composeUrl, '_blank', 'noopener');
      form.reset();
      if (successEl) {
        successEl.classList.add('show');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        var hideTimer = function () {
          setTimeout(function () { successEl.classList.remove('show'); }, 9000);
        };
        hideTimer();
      }
    });

    form.querySelectorAll('[required]').forEach(function (f) {
      f.addEventListener('input', function () {
        f.closest('.field').classList.remove('has-error');
      });
    });
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

})();