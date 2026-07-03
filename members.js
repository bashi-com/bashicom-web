/* Members ページ — members.json からメンバー一覧を描画
   （reveal アニメは app.js が #bb-root の data-rv を処理） */
(function () {
  'use strict';

  var leadSection = document.getElementById('bb-leadership');
  var leadGrid = document.getElementById('bb-lead-grid');
  var grid = document.getElementById('bb-grid');
  var countEl = document.getElementById('bb-count');
  if (!grid) return;

  var AVATAR_PALETTE = [
    { bg: '#E3F4F5', fg: '#0E6B74' },
    { bg: '#EAF1E9', fg: '#3E6B3A' },
    { bg: '#F3E9F0', fg: '#7A3E63' }
  ];

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function avatarCard(member, index, isLead) {
    var palette = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
    var initial = escapeHtml((member.name || '?').trim().charAt(0).toUpperCase());
    var meta = [member.grade, member.faculty].filter(Boolean).join('・');
    var avSize = isLead ? 62 : 54;
    var roleBadge = member.role
      ? '<div style="display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:#0E6B74;background:#EAF6F7;border:1px solid #CFE9EB;padding:5px 11px;border-radius:99px;margin-bottom:14px">' + escapeHtml(member.role) + '</div>'
      : '';
    return (
      '<div class="bb-mcard" style="background:#fff;border:1px solid ' + (isLead ? '#9FDADF' : '#E6EBED') + ';border-radius:16px;padding:24px 22px 22px">' +
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">' +
          '<div class="bb-av" style="width:' + avSize + 'px;height:' + avSize + 'px;border-radius:50%;background:' + palette.bg + ';display:flex;align-items:center;justify-content:center;font-family:\'IBM Plex Mono\',monospace;font-weight:600;font-size:' + (isLead ? 20 : 18) + 'px;color:' + palette.fg + ';flex-shrink:0">' + initial + '</div>' +
          '<div style="min-width:0"><div style="font-weight:700;font-size:16px;line-height:1.3">' + escapeHtml(member.name) + '</div><div style="font-size:12.5px;color:#8A949B;margin-top:2px">' + escapeHtml(meta) + '</div></div>' +
        '</div>' +
        roleBadge +
        '<p style="margin:0;font-size:13px;line-height:1.75;color:#56616A">' + escapeHtml(member.bio) + '</p>' +
      '</div>'
    );
  }

  fetch('members.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var members = (data && data.members) || [];
      var leaders = members.filter(function (m) { return m.role; });
      var others = members.filter(function (m) { return !m.role; });

      if (leaders.length && leadSection && leadGrid) {
        leadGrid.innerHTML = leaders.map(function (m, i) { return avatarCard(m, i, true); }).join('');
        leadSection.style.display = '';
      } else if (leadSection) {
        leadSection.style.display = 'none';
      }

      grid.innerHTML = others.map(function (m, i) { return avatarCard(m, i, false); }).join('');

      if (countEl) countEl.textContent = members.length + ' 名';
    })
    .catch(function (err) {
      grid.innerHTML = '<p style="color:#B3453D;font-size:14px">メンバー情報の読み込みに失敗しました（members.json を確認してください）。</p>';
      if (typeof console !== 'undefined') console.error(err);
    });
})();
