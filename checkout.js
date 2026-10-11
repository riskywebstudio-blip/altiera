/* ==========================================================================
   ALTIERA — Cek Ongkir & Checkout WhatsApp
   File ini hanya menambahkan panel pengiriman di dalam modal detail produk.
   Data produk diambil dari const PRODUCTS yang sudah ada di index.html.
   ========================================================================== */

/* ---------- KONFIGURASI (wajib diisi sebelum dipakai untuk transaksi nyata) ---------- */
const CHECKOUT_CONFIG = {
  // Nomor WhatsApp khusus checkout pengiriman ini
  waNumber: '6285604155088',

  // URL backend serverless (lihat folder altiera-ongkir-backend).
  // Contoh: 'https://altiera-ongkir.vercel.app'  (tanpa garis miring di akhir)
  // Dibiarkan kosong = cek ongkir TIDAK aktif dan tombol checkout dikunci.
  backendUrl: '',

  // Batas jumlah botol per pesanan
  maxQty: 10,

  // Batas waktu menunggu respons backend (ms)
  timeoutMs: 20000
};

/* ---------- Helper ---------- */
function scRupiah(n){ return 'Rp' + Number(n || 0).toLocaleString('id-ID'); }
function scEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function scProductById(id){ return PRODUCTS.find(p => p.id === id); }

/* ---------- Panel ---------- */
window.mountShipping = function(modalProduct){
  const host = document.getElementById('shippingHost');
  if (!host || !modalProduct) return;

  const state = {
    productId: modalProduct.id,
    qty: 1,
    rates: [],          // hasil dari API (hanya data yang dikembalikan backend)
    selectedIdx: -1,    // indeks layanan yang dipilih
    loading: false,
    notice: ''          // pesan error/info untuk pembeli
  };

  const configReady = !!CHECKOUT_CONFIG.backendUrl;

  host.innerHTML = `
    <div class="sc-wrap mt-8 border-t border-stone-300 pt-7">
      <p class="eyebrow text-stone-500">PENGIRIMAN & CHECKOUT</p>
      <h3 class="serif text-2xl mt-2">Hitung Ongkir</h3>
      ${configReady ? '' : `<p class="text-xs text-red-700 bg-red-50 border border-red-200 p-3 mt-3">Cek ongkir belum siap digunakan untuk transaksi nyata. Backend ongkir belum dikonfigurasi (CHECKOUT_CONFIG.backendUrl).</p>`}

      <div class="grid sm:grid-cols-2 gap-4 mt-5">
        <label class="text-xs">Produk
          <select id="scProduct" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
            ${PRODUCTS.map(p => `<option value="${p.id}" ${p.id===state.productId?'selected':''}>${scEsc(p.name)} · 30 ml</option>`).join('')}
          </select>
        </label>
        <label class="text-xs">Jumlah botol
          <input id="scQty" type="number" min="1" max="${CHECKOUT_CONFIG.maxQty}" value="1" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs">Nama penerima *
          <input id="scName" type="text" autocomplete="name" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs">Nomor telepon *
          <input id="scPhone" type="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs">Provinsi *
          <input id="scProvince" type="text" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs">Kota / Kabupaten *
          <input id="scCity" type="text" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs">Kecamatan
          <input id="scDistrict" type="text" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs">Kode pos *
          <input id="scPostal" type="text" inputmode="numeric" maxlength="5" placeholder="5 digit" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
        <label class="text-xs sm:col-span-2">Alamat lengkap *
          <textarea id="scAddress" rows="2" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm"></textarea>
        </label>
        <label class="text-xs sm:col-span-2">Catatan (opsional)
          <input id="scNote" type="text" class="w-full border border-stone-300 bg-white p-3 mt-1 text-sm">
        </label>
      </div>

      <button id="scCheck" type="button" class="btn-primary w-full py-4 mt-5 text-xs tracking-widest uppercase" ${configReady ? '' : 'disabled'}>Cek Ongkir</button>
      <p id="scMsg" class="text-xs text-stone-600 mt-3" role="status" aria-live="polite"></p>

      <div id="scRates" class="mt-4"></div>
      <div id="scSummary" class="mt-5"></div>
    </div>`;

  const $ = id => document.getElementById(id);
  const msg = $('scMsg');
  const setMsg = (t, isErr) => { msg.textContent = t || ''; msg.className = 'text-xs mt-3 ' + (isErr ? 'text-red-700' : 'text-stone-600'); };

  /* Reset ongkir bila produk/jumlah berubah, agar tidak ada ongkir lama yang terbawa */
  function resetRates(){
    state.rates = []; state.selectedIdx = -1;
    $('scRates').innerHTML = ''; renderSummary();
  }

  $('scProduct').addEventListener('change', e => { state.productId = e.target.value; resetRates(); });
  $('scQty').addEventListener('change', e => {
    let q = parseInt(e.target.value, 10);
    if (!Number.isInteger(q) || q < 1) q = 1;
    if (q > CHECKOUT_CONFIG.maxQty) q = CHECKOUT_CONFIG.maxQty;
    e.target.value = q; state.qty = q; resetRates();
  });

  /* ---------- Validasi input pembeli ---------- */
  function readForm(){
    const v = {
      name: $('scName').value.trim(),
      phone: $('scPhone').value.replace(/[\s-]/g,''),
      province: $('scProvince').value.trim(),
      city: $('scCity').value.trim(),
      district: $('scDistrict').value.trim(),
      postal: $('scPostal').value.trim(),
      address: $('scAddress').value.trim(),
      note: $('scNote').value.trim()
    };
    if (v.name.length < 2) return { error: 'Isi nama penerima.' };
    if (!/^(\+?62|0)8\d{7,11}$/.test(v.phone)) return { error: 'Nomor telepon tidak valid. Contoh: 08xxxxxxxxxx.' };
    if (!v.province) return { error: 'Isi provinsi.' };
    if (!v.city) return { error: 'Isi kota/kabupaten.' };
    if (!/^\d{5}$/.test(v.postal)) return { error: 'Kode pos harus 5 digit angka.' };
    if (v.address.length < 10) return { error: 'Alamat lengkap terlalu singkat.' };
    return { value: v };
  }

  /* ---------- Cek ongkir ke backend ---------- */
  async function checkRates(){
    if (!configReady) { setMsg('Cek ongkir belum siap digunakan.', true); return; }
    state.qty = parseInt($('scQty').value, 10) || 1;
    const parsed = readForm();
    if (parsed.error) { setMsg(parsed.error, true); return; }

    state.loading = true;
    $('scCheck').disabled = true; $('scCheck').textContent = 'Memeriksa tarif…';
    setMsg('Mengambil tarif dari kurir…');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHECKOUT_CONFIG.timeoutMs);
    try {
      const res = await fetch(CHECKOUT_CONFIG.backendUrl + '/api/ongkir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: state.productId,
          qty: state.qty,
          destinationPostalCode: parsed.value.postal
        }),
        signal: controller.signal
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Gagal mengambil tarif.');

      const list = Array.isArray(data.rates) ? data.rates : [];
      if (!list.length) {
        state.rates = []; state.selectedIdx = -1;
        $('scRates').innerHTML = '';
        setMsg('Tidak ada layanan pengiriman yang tersedia untuk alamat ini.', true);
      } else {
        state.rates = list; state.selectedIdx = -1;
        renderRates();
        setMsg('Pilih layanan pengiriman di bawah.');
      }
    } catch (err) {
      const text = err.name === 'AbortError'
        ? 'Waktu permintaan habis. Coba lagi beberapa saat.'
        : (err.message || 'Gagal mengambil tarif. Coba lagi.');
      setMsg(text, true);
      state.rates = []; state.selectedIdx = -1; $('scRates').innerHTML = '';
    } finally {
      clearTimeout(timer);
      state.loading = false;
      $('scCheck').disabled = !configReady; $('scCheck').textContent = 'Cek Ongkir';
      renderSummary();
    }
  }

  /* ---------- Daftar layanan (hanya data dari API) ---------- */
  function renderRates(){
    $('scRates').innerHTML = `
      <p class="eyebrow text-stone-500 mb-3">PILIH LAYANAN</p>
      <div class="space-y-2">
        ${state.rates.map((r, i) => `
          <label class="flex items-start gap-3 border border-stone-300 bg-white/40 p-3 cursor-pointer ${state.selectedIdx===i?'border-emerald bg-emeraldPale':''}">
            <input type="radio" name="scService" value="${i}" class="mt-1" ${state.selectedIdx===i?'checked':''}>
            <span class="flex-1 text-xs leading-5">
              <b>${scEsc(r.courier)}</b> · ${scEsc(r.service)}
              ${r.etd ? `<br><span class="text-stone-500">Estimasi: ${scEsc(r.etd)}</span>` : ''}
            </span>
            <span class="serif text-base whitespace-nowrap">${scRupiah(r.price)}</span>
          </label>`).join('')}
      </div>`;
    $('scRates').querySelectorAll('input[name="scService"]').forEach(inp =>
      inp.addEventListener('change', e => {
        state.selectedIdx = Number(e.target.value);
        renderRates(); renderSummary();
      }));
  }

  /* ---------- Ringkasan & tombol WhatsApp ---------- */
  function buildWaMessage(p, v, r){
    const subtotal = p.price * state.qty;
    const total = subtotal + r.price;
    const lines = [
      'Halo ALTIERA, saya ingin memesan:',
      '',
      `*Produk:* ${p.name} (30 ml)`,
      `*Jumlah:* ${state.qty} botol`,
      `*Harga satuan:* ${scRupiah(p.price)}`,
      `*Subtotal:* ${scRupiah(subtotal)}`,
      '',
      `*Penerima:* ${v.name}`,
      `*Telepon:* ${v.phone}`,
      `*Alamat:* ${v.address}, ${v.district ? v.district + ', ' : ''}${v.city}, ${v.province} ${v.postal}`,
      '',
      `*Kurir:* ${r.courier} - ${r.service}`,
      `*Ongkir:* ${scRupiah(r.price)}`,
      `*Total sementara:* ${scRupiah(total)}`
    ];
    if (v.note) lines.push(`*Catatan:* ${v.note}`);
    lines.push('', 'Mohon konfirmasi ketersediaan dan informasi pembayaran. Terima kasih.');
    return lines.join('\n');
  }

  function renderSummary(){
    const p = scProductById(state.productId);
    const sum = $('scSummary');
    const r = state.rates[state.selectedIdx];
    if (!p || !r) { sum.innerHTML = ''; return; }

    const subtotal = p.price * state.qty;
    const total = subtotal + r.price;

    sum.innerHTML = `
      <div class="bg-white/50 border border-stone-300 p-5">
        <p class="eyebrow text-stone-500">RINGKASAN PESANAN</p>
        <div class="text-sm mt-3 space-y-1.5">
          <div class="flex justify-between gap-3"><span>${scEsc(p.name)} · ${state.qty} botol</span><span>${scRupiah(subtotal)}</span></div>
          <div class="flex justify-between gap-3"><span>Ongkir (${scEsc(r.courier)} - ${scEsc(r.service)})</span><span>${scRupiah(r.price)}</span></div>
          <div class="flex justify-between gap-3 font-semibold border-t border-stone-300 pt-2 mt-2"><span>Total sementara</span><span>${scRupiah(total)}</span></div>
        </div>
        <p class="text-[11px] text-stone-500 mt-3">Pesanan belum dibayar atau dikonfirmasi. Konfirmasi final dilakukan melalui WhatsApp.</p>
        <button id="scWa" type="button" class="btn-primary w-full py-4 mt-4 text-xs tracking-widest uppercase">Kirim Pesanan via WhatsApp ↗</button>
      </div>`;

    $('scWa').addEventListener('click', () => {
      const parsed = readForm();
      if (parsed.error) { setMsg(parsed.error, true); return; }
      const url = 'https://wa.me/' + CHECKOUT_CONFIG.waNumber + '?text=' +
        encodeURIComponent(buildWaMessage(p, parsed.value, r));
      window.open(url, '_blank', 'noopener');
    });
  }

  /* Alamat berubah setelah cek ongkir = tarif lama tidak berlaku */
  ['scProvince','scCity','scDistrict','scPostal','scAddress'].forEach(id =>
    $(id).addEventListener('input', () => { if (state.rates.length) { resetRates(); setMsg('Alamat berubah. Cek ongkir ulang.'); } }));

  $('scCheck').addEventListener('click', checkRates);
};
