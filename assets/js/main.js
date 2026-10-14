/* ALTIERA — interaksi situs: menu, modal, FAQ, kuis, form WhatsApp, animasi. */
(function () {
  var WA = 'https://wa.me/6285604155088';
  var PRODUK = {
    prestige: { nama: 'ALTIERA PRESTIGE', url: 'produk-prestige.html', copy: 'Modern dan ningrat, cocok untuk harian maupun acara spesial.' },
    allure: { nama: 'ALTIERA ALLURE', url: 'produk-allure.html', copy: 'Lembut dan anggun, cocok untuk harian maupun acara spesial.' },
    keangkuhan: { nama: 'ALTIERA KEANGKUHAN', url: 'produk-keangkuhan.html', copy: 'Segar dan maskulin, dirancang untuk pemakaian harian dan outdoor.' }
  };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function waUrl(text) { return WA + '?text=' + encodeURIComponent(text); }
  function openWa(text) { window.open(waUrl(text), '_blank', 'noopener'); }

  // Menu mobile
  var drawer = $('#mobileDrawer'), scrim = $('#drawerScrim'), menuBtn = $('#menuOpen');
  function openDrawer() { if (!drawer) return; drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { if (!drawer) return; drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  var menuClose = $('#menuClose'); if (menuClose) menuClose.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  $$('.drawer-link').forEach(function (a) { a.addEventListener('click', closeDrawer); });

  // Submenu Koleksi di mobile
  var koleksiBtn = $('#koleksiToggle');
  if (koleksiBtn) koleksiBtn.addEventListener('click', function () {
    var sub = $('#koleksiSub'); var open = sub.classList.toggle('hidden') === false;
    koleksiBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Modal
  function openModal(id) {
    var m = document.getElementById(id); if (!m) return;
    m.classList.add('open'); document.body.style.overflow = 'hidden';
    var first = m.querySelector('input,button,textarea,select,a'); if (first) first.focus();
  }
  function closeModal(m) { m.classList.remove('open'); if (!$('.modal-backdrop.open')) document.body.style.overflow = ''; }
  $$('[data-modal-open]').forEach(function (b) { b.addEventListener('click', function () { openModal(b.getAttribute('data-modal-open')); }); });
  $$('.modal-backdrop').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) closeModal(m); });
    $$('[data-modal-close]', m).forEach(function (b) { b.addEventListener('click', function () { closeModal(m); }); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.modal-backdrop.open').forEach(closeModal);
    closeDrawer();
  });

  // Tanya Kami: topik cepat + kirim ke WhatsApp
  var topicBtns = $$('[data-topic]');
  var topicVal = '';
  topicBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      topicBtns.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('active'); b.setAttribute('aria-pressed', 'true'); topicVal = b.getAttribute('data-topic');
    });
  });
  var formTanya = $('#formTanya');
  if (formTanya) formTanya.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = $('#tanyaNama').value.trim() || '-';
    var produk = $('#tanyaProduk').value;
    var tanya = $('#tanyaPertanyaan').value.trim();
    if (!tanya && !topicVal) { $('#tanyaPertanyaan').focus(); return; }
    var text = 'Halo ALTIERA, saya ' + nama + '.' +
      (topicVal ? ' Topik: ' + topicVal + '.' : '') +
      (produk && produk !== 'Umum' ? ' Produk: ' + produk + '.' : '') +
      (tanya ? ' Pertanyaan: ' + tanya : '');
    openWa(text); closeModal(formTanya.closest('.modal-backdrop'));
  });

  // Form pesan (checkout via WhatsApp)
  var formPesan = $('#formPesan');
  if (formPesan) formPesan.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = formPesan; var v = function (n) { return (f.elements[n].value || '').trim(); };
    if (!v('nama') || !v('whatsapp') || !v('kota')) { alert('Mohon isi nama, nomor WhatsApp, dan kota/alamat.'); return; }
    var text = 'Halo ALTIERA, saya ingin memesan.\n' +
      'Produk: ' + v('produk') + '\n' +
      'Jumlah: ' + v('jumlah') + ' botol\n' +
      'Nama: ' + v('nama') + '\n' +
      'No. WhatsApp: ' + v('whatsapp') + '\n' +
      'Kota/Alamat: ' + v('kota') + '\n' +
      (v('catatan') ? 'Catatan: ' + v('catatan') : '');
    openWa(text);
  });

  // Galeri produk: ganti foto utama dari thumbnail
  var mainImg = $('#mainImg');
  $$('[data-thumb]').forEach(function (t) {
    t.addEventListener('click', function () {
      mainImg.src = t.getAttribute('data-thumb'); mainImg.alt = t.getAttribute('data-alt') || mainImg.alt;
      $$('[data-thumb]').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-current', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-current', 'true');
    });
  });

  // Pencari aroma (beranda): tampilkan hasil dengan tautan ke produk
  var finderRes = $('#finderResult');
  $$('[data-finder]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-finder]').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var p = PRODUK[b.getAttribute('data-finder')];
      $('#finderName').textContent = p.nama; $('#finderCopy').textContent = p.copy;
      $('#finderDetail').setAttribute('href', p.url);
      finderRes.classList.remove('hidden');
    });
  });

  // Kuis aroma (promo): hitung karakter terbanyak
  var quiz = $('#quiz');
  if (quiz) {
    var answers = {};
    $$('[data-quiz-q]', quiz).forEach(function (q) {
      $$('[data-p]', q).forEach(function (opt) {
        opt.addEventListener('click', function () {
          $$('[data-p]', q).forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
          opt.classList.add('active'); opt.setAttribute('aria-pressed', 'true');
          answers[q.getAttribute('data-quiz-q')] = opt.getAttribute('data-p');
          if (Object.keys(answers).length === $$('[data-quiz-q]', quiz).length) showQuizResult();
        });
      });
    });
    function showQuizResult() {
      var score = { prestige: 0, allure: 0, keangkuhan: 0 };
      Object.keys(answers).forEach(function (k) { score[answers[k]]++; });
      var best = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; })[0];
      var p = PRODUK[best];
      $('#quizName').textContent = p.nama; $('#quizCopy').textContent = p.copy;
      $('#quizProduk').setAttribute('href', p.url);
      $('#quizWa').setAttribute('href', waUrl('Halo ALTIERA, hasil kuis aroma saya merekomendasikan ' + p.nama + '. Boleh minta info lebih lanjut?'));
      $('#quizResult').classList.remove('hidden');
      $('#quizResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    var ulang = $('#quizReset');
    if (ulang) ulang.addEventListener('click', function () {
      answers = {};
      $$('[data-p]', quiz).forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      $('#quizResult').classList.add('hidden');
    });
  }

  // FAQ accordion
  $$('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item'); var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Tombol kembali ke atas + bayangan header
  var backTop = $('#backTop'), header = $('#siteHeader');
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (backTop) { var show = y > 500; backTop.classList.toggle('opacity-0', !show); backTop.classList.toggle('pointer-events-none', !show); }
    if (header) header.classList.toggle('shadow-md', y > 8);
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Tooltip WhatsApp hilang otomatis
  setTimeout(function () { var t = $('#waTooltip'); if (t) t.classList.add('fade'); }, 4500);

  // Animasi muncul saat di-scroll
  var items = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('visible'); }); }
})();
