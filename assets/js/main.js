/* ==========================================================================
   ForgeLabs — main script
   --------------------------------------------------------------------------
   1  Helpers
   2  Theme (dark / light)
   3  Navigation: scroll state, progress bar, active link, drawer, back-to-top
   4  Reveal on scroll + animated counters
   5  Typing effect
   6  Hero sparks canvas
   7  Card spotlight + project tilt
   8  Marquee
   9  Contact form (Web3Forms)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1 · Helpers ------------------------------------------------ */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  var toastTimer;
  function toast(msg) {
    var el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2600);
  }

  /* ---------- 2 · Theme -------------------------------------------------- */
  var themeBtn = $('#themeToggle');
  var themeMeta = $('meta[name="theme-color"]');
  function applyTheme(t, persist) {
    root.setAttribute('data-theme', t);
    if (persist) store('forgelabs-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'light' ? '#f8f6ff' : '#07050f');
    if (themeBtn) {
      var icon = $('i', themeBtn);
      icon.className = 'ph ' + (t === 'light' ? 'ph-moon' : 'ph-sun');
      themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
  }
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
  if (themeBtn) themeBtn.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
  });

  /* ---------- 3 · Navigation -------------------------------------------- */
  var nav = $('#nav'), progress = $('#progress'), toTop = $('#toTop');
  var burger = $('#burger'), drawer = $('#drawer');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('is-scrolled', y > 24);
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    toTop.classList.toggle('is-visible', y > 700);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  // Active link (desktop + drawer)
  var navLinks = $$('.nav__link, .drawer__link');
  var tracked = ['hero', 'about', 'services', 'portfolio', 'contact'];
  function setActive(id) {
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
  }
  if ('IntersectionObserver' in window) {
    var sections = tracked.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Drawer
  function setDrawer(open) {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setDrawer(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1060 && drawer.classList.contains('is-open')) setDrawer(false); });

  /* ---------- 4 · Reveal + counters ------------------------------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        $$('.counter', e.target).forEach(animateCounter);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    $$('.counter').forEach(animateCounter);
  }

  /* ---------- 5 · Typing effect ----------------------------------------- */
  var typedEl = $('#typed');
  if (typedEl && !reduceMotion) {
    var phrases = ['websites that convert', 'apps people love to use', 'brands that stand out', 'cloud setups that scale', 'ideas that become real'];
    var pi = 0, ci = phrases[0].length, deleting = true;
    (function tick() {
      var word = phrases[pi], delay;
      if (deleting) { ci--; delay = 36; } else { ci++; delay = 70; }
      typedEl.textContent = word.slice(0, ci);
      if (!deleting && ci === word.length) { deleting = true; delay = 1700; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 340; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- 6 · Hero sparks ------------------------------------------- */
  var canvas = $('#sparks');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var sparks = [], running = false, raf;
    var COUNT = window.innerWidth < 760 ? 26 : 56;
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      return {
        x: Math.random() * W,
        y: initial ? Math.random() * H : H + 10,
        r: Math.random() * 1.9 + .5,
        vy: Math.random() * .55 + .18,
        vx: (Math.random() - .5) * .25,
        a: Math.random() * .6 + .25,
        hue: Math.random() < .2 ? 32 : 268 + Math.random() * 40,
        ph: Math.random() * 6.28
      };
    }
    function init() { resize(); sparks = []; for (var i = 0; i < COUNT; i++) sparks.push(make(true)); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var light = root.getAttribute('data-theme') === 'light';
      for (var i = 0; i < sparks.length; i++) {
        var s = sparks[i];
        s.y -= s.vy; s.x += s.vx + Math.sin(s.ph += .01) * .15;
        if (s.y < -10) sparks[i] = make(false);
        var fade = Math.min(1, (H - s.y) / (H * .25), s.y / (H * .3) + .2);
        var lum = light ? 48 : 72;
        ctx.beginPath();
        ctx.fillStyle = 'hsla(' + s.hue + ',90%,' + lum + '%,' + (s.a * fade * (light ? .75 : 1)) + ')';
        ctx.shadowColor = 'hsla(' + s.hue + ',95%,65%,.9)';
        ctx.shadowBlur = light ? 4 : 10;
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
    function stop() { running = false; cancelAnimationFrame(raf); }
    init();
    window.addEventListener('resize', function () { init(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(canvas);
    } else { start(); }
  }

  /* ---------- 7 · Spotlight + tilt -------------------------------------- */
  if (finePointer) {
    $$('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    if (!reduceMotion) {
      $$('.project').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          card.style.transform = 'perspective(1000px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 5) + 'deg) translateY(-6px)';
        });
        card.addEventListener('pointerleave', function () { card.style.transform = ''; });
      });
    }
  }

  /* ---------- 8 · Marquee (duplicate group for seamless loop) ------------ */
  var track = $('#marquee');
  if (track) {
    var group = $('.marquee__group', track);
    // repeat until a group is wider than the viewport, then duplicate once
    while (group.scrollWidth < window.innerWidth * 1.1 && group.children.length < 60) {
      Array.prototype.slice.call(group.children, 0, 6).forEach(function (n) { group.appendChild(n.cloneNode(true)); });
    }
    track.appendChild(group.cloneNode(true));
  }

  /* ---------- 9 · Contact form ------------------------------------------ */
  var form = $('#contactForm');
  if (form) {
    var btn = $('#formBtn'), status = $('#formStatus');
    var label = btn.innerHTML;
    function show(type, icon, msg) {
      status.className = 'form__status is-' + type;
      status.innerHTML = '<i class="ph-fill ' + icon + '" aria-hidden="true"></i><span>' + msg + '</span>';
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (form.botcheck && form.botcheck.checked) return;
      btn.disabled = true;
      btn.innerHTML = '<i class="ph ph-circle-notch spin" aria-hidden="true"></i> Sending…';
      status.className = 'form__status';
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            show('ok', 'ph-check-circle', 'Message sent! Thanks for reaching out — we\'ll get back to you soon.');
            form.reset();
            toast('Message sent ✓');
          } else {
            show('err', 'ph-warning-circle', res.message || 'Something went wrong. Please try again or email us directly.');
          }
        })
        .catch(function () {
          show('err', 'ph-warning-circle', 'Network error. Please check your connection or email contact.forgelabs@gmail.com.');
        })
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    });
  }

  /* ---------- Footer year ------------------------------------------------ */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
})();
