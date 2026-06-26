/* Bashi.com ランディングページの挙動
   元の BashiDirB.dc.html の DCLogic を素のDOM操作へ移植。
   - reading progress（スクロール進捗バー）
   - ナビのアクティブ表示
   - reveal-on-scroll（data-rv）+ 下線アニメ（data-uline）
   - カウンター（data-count / data-suffix）
   - モバイルメニュー開閉
   - FAQ アコーディオン */
(function () {
  'use strict';

  var root = document.getElementById('bb-root');
  var progress = document.getElementById('bb-progress');
  var SECTIONS = ['about', 'activities', 'works', 'join', 'partners'];

  /* ---- reading progress + ナビアクティブ ---- */
  function onScroll() {
    var doc = document.documentElement;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    var pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    if (progress) progress.style.width = pct + '%';

    if (!root) return;
    var active = null;
    var mid = window.innerHeight * 0.35;
    SECTIONS.forEach(function (id) {
      var sec = root.querySelector('#' + id);
      if (sec) {
        var r = sec.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) active = id;
      }
    });
    root.querySelectorAll('[data-navlink]').forEach(function (a) {
      a.classList.toggle('bb-active', a.getAttribute('data-navlink') === active);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- reveal-on-scroll ---- */
  function initReveal() {
    if (!root || !('IntersectionObserver' in window)) { forceAll(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var d = parseFloat(el.getAttribute('data-rv-delay') || '0');
          el.style.transitionDelay = d + 'ms';
          el.style.opacity = '1';
          el.style.transform = 'none';
          var u = el.querySelector ? el.querySelector('[data-uline]') : null;
          if (u) u.style.transform = 'scaleX(1)';
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    root.querySelectorAll('[data-rv]').forEach(function (el) { obs.observe(el); });
  }

  /* ---- カウンター ---- */
  function initCounters() {
    if (!root || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var target = parseFloat(el.getAttribute('data-count'));
          var suf = el.getAttribute('data-suffix') || '';
          var start = performance.now(), dur = 1100;
          var tick = function (now) {
            var p = Math.min(1, (now - start) / dur);
            var ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * ease) + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    root.querySelectorAll('[data-count]').forEach(function (el) { obs.observe(el); });
  }

  /* ---- フォールバック（IO未発火時に全表示） ---- */
  function forceAll() {
    if (!root) return;
    root.querySelectorAll('[data-rv]').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    root.querySelectorAll('[data-uline]').forEach(function (el) {
      el.style.transform = 'scaleX(1)';
    });
    root.querySelectorAll('[data-count]').forEach(function (el) {
      if (/^[1-9]/.test(el.textContent)) return;
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---- モバイルメニュー ---- */
  function initMenu() {
    var btn = document.getElementById('bb-menu-btn');
    var menu = document.getElementById('bb-mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- FAQ アコーディオン（同時に1つだけ開く） ---- */
  function initFaq() {
    var container = document.getElementById('bb-faq');
    if (!container) return;
    var items = Array.prototype.slice.call(container.querySelectorAll('.bb-faq-item'));
    items.forEach(function (item) {
      var btn = item.querySelector('.bb-faq-q');
      var ans = item.querySelector('.bb-faq-a');
      var icon = item.querySelector('.bb-faq-icon');
      btn.addEventListener('click', function () {
        var isOpen = ans.style.display !== 'none';
        // すべて閉じる
        items.forEach(function (other) {
          other.querySelector('.bb-faq-a').style.display = 'none';
          other.querySelector('.bb-faq-icon').style.transform = 'rotate(0deg)';
          other.querySelector('.bb-faq-q').setAttribute('aria-expanded', 'false');
        });
        // クリックされたものを開く（閉じていた場合のみ）
        if (!isOpen) {
          ans.style.display = '';
          icon.style.transform = 'rotate(45deg)';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function init() {
    initReveal();
    initCounters();
    initMenu();
    initFaq();
    onScroll();
    // IO が発火しない環境のための保険
    setTimeout(forceAll, 1300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
