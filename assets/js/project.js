/* ==========================================================================
   ForgeLabs demo sites — shared behaviour
   data-nav ........ header that gains .is-scrolled after scrolling
   data-menu-btn ... button that toggles [data-menu]
   data-spy ........ nav links ("a[href^=#]") highlighted by section
   data-tabs ....... container with [data-tab] buttons and [data-panel] panels
   data-carousel ... scroll-snap carousel with [data-prev]/[data-next] buttons
   data-demo-form .. form that shows a friendly "demo" confirmation
   ========================================================================== */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal on scroll */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* sticky header state */
  var nav = $('[data-nav]');
  if (nav) {
    var t = false;
    var upd = function () { nav.classList.toggle('is-scrolled', window.scrollY > 40); t = false; };
    window.addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* mobile menu */
  var btn = $('[data-menu-btn]'), menu = $('[data-menu]');
  if (btn && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      var i = $('i', btn);
      if (i) { i.classList.toggle('ph-list', !open); i.classList.toggle('ph-x', open); }
      document.body.classList.toggle('menu-open', open);
    };
    btn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1023) setMenu(false); });
  }

  /* scroll spy */
  var links = $$('[data-spy] a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute('href').slice(1); if (id) (map[id] = map[id] || []).push(a); });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        (map[e.target.id] || []).forEach(function (a) { a.classList.add('is-active'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* tabs */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[data-tab]', wrap), panels = $$('[data-panel]', wrap);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-tab');
        tabs.forEach(function (x) { var on = x === tab; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== key; });
      });
    });
  });

  /* carousels */
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.carousel', wrap) || wrap;
    var prev = $('[data-prev]', wrap), next = $('[data-next]', wrap);
    var step = function () { var c = track.children[0]; return c ? c.getBoundingClientRect().width + 20 : 300; };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (wrap.hasAttribute('data-auto') && !reduce) {
      var timer;
      var go = function () {
        timer = setInterval(function () {
          var max = track.scrollWidth - track.clientWidth;
          if (track.scrollLeft >= max - 4) track.scrollTo({ left: 0, behavior: 'smooth' });
          else track.scrollBy({ left: step(), behavior: 'smooth' });
        }, 4800);
      };
      go();
      wrap.addEventListener('pointerenter', function () { clearInterval(timer); });
      wrap.addEventListener('pointerleave', function () { clearInterval(timer); go(); });
    }
  });

  /* demo forms (no backend on these concept sites) */
  $$('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var note = $('.form-note', form);
      if (note) {
        note.innerHTML = '<i class="ph-fill ph-check-circle" aria-hidden="true"></i><span>' + (form.getAttribute('data-demo-form') || 'Thanks! This is a concept demo, so nothing was actually sent.') + '</span>';
        note.classList.add('is-on');
      }
      form.reset();
    });
  });

  /* year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
