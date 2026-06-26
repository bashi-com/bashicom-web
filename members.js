/* Members ページ — 領域フィルター
   （reveal アニメは app.js が #bb-root の data-rv を処理） */
(function () {
  'use strict';
  var grid = document.getElementById('bb-grid');
  var filterBar = document.getElementById('bb-filters');
  var countEl = document.getElementById('bb-count');
  if (!grid || !filterBar) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.bb-mcard'));
  var total = cards.length;
  var buttons = Array.prototype.slice.call(filterBar.querySelectorAll('.bb-chip'));

  function setActive(btn) {
    buttons.forEach(function (b) {
      var active = b === btn;
      b.style.background = active ? '#62C4CB' : '#fff';
      b.style.color = active ? '#08222a' : '#46515A';
      b.style.borderColor = active ? '#62C4CB' : '#E2E7EA';
    });
  }

  function apply(filter) {
    var shown = 0;
    cards.forEach(function (c) {
      var match = filter === 'all' || c.getAttribute('data-domain') === filter;
      c.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    if (countEl) countEl.textContent = shown + ' / ' + total + ' 名';
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActive(btn);
      apply(btn.getAttribute('data-filter'));
    });
  });
})();
