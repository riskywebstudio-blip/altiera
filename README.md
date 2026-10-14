# ALTIERA — Website E-Commerce (Multi-Halaman)

Website statis untuk ALTIERA, parfum lokal premium. Dibuat dengan HTML, Tailwind CSS (via CDN), dan JavaScript vanilla. Tanpa backend dan tanpa framework. Seluruh teks dalam Bahasa Indonesia.

## Cara preview
1. Ekstrak ZIP.
2. Buka `index.html` di browser, atau gunakan ekstensi Live Server di VS Code.
3. Koneksi internet dibutuhkan untuk memuat Tailwind CSS via CDN.

## Cara deploy
**Netlify (drop manual)**
1. Masuk ke Netlify, pilih **Add new site** → **Deploy manually**.
2. Drag & drop folder `altiera-ecommerce` (hasil ekstrak ZIP), lalu tunggu URL terbit.

**Vercel**
1. Masuk ke Vercel, pilih **Add New** → **Project**, lalu import folder atau repositori GitHub.
2. Framework preset: **Other**. Output directory: kosongkan (root). Klik **Deploy**.

## Daftar halaman
| File | Isi |
|---|---|
| `index.html` | Beranda: hero, keunggulan, mengapa kami, koleksi, video, pencari aroma, piramida aroma, cara performa, FAQ, form pesan via WhatsApp, marketplace |
| `produk-prestige.html` | Detail ALTIERA PRESTIGE (galeri foto, notes, detail, pengiriman) |
| `produk-allure.html` | Detail ALTIERA ALLURE |
| `produk-keangkuhan.html` | Detail ALTIERA KEANGKUHAN |
| `tentang-kami.html` | Tentang ALTIERA, mengapa kami, galeri foto dan video |
| `promo.html` | Penawaran bulan ini dan kuis aroma 5 pertanyaan |

Seluruh halaman memakai header, footer, tombol WhatsApp melayang, dan jendela Tanya Kami yang sama.

## Struktur folder
- `assets/css/style.css`: gaya tambahan bersama.
- `assets/js/main.js`: menu, jendela (modal), kuis, pencari aroma, form WhatsApp, FAQ, animasi.
- `assets/img/`: foto produk dan galeri dari arsip terbaru (sudah dioptimasi).
- `assets/altiera-product-video.mp4`: video produk.

## Hal yang perlu dikonfirmasi pemilik sebelum publish
1. **Harga**: Rp99.000 per botol 30 ml dipakai di seluruh halaman. Pastikan sudah sesuai harga marketplace.
2. **Nomor WhatsApp**: 0856-0415-5088 (6285604155088) dipakai di seluruh situs.
3. **Promo gratis ongkir**: syarat beli minimal 2 parfum dan area berlakunya harus sesuai promo aktif.
4. **Garansi uang kembali 100%**: klaim maksimal 7 hari melalui Shopee. Pastikan sesuai kebijakan toko.
5. **Ketahanan 8–12 jam, aman di pakaian putih**: klaim dari informasi brand. Pastikan sudah sesuai hasil uji atau pernyataan resmi.
6. **Pengiriman Senin–Sabtu, pesanan sebelum 15.00 WIB**: pastikan jadwal kirim sudah benar.
7. **Tautan marketplace**: Shopee, TikTok Shop, dan Lazada dipakai sesuai tautan yang diberikan. Cek kembali bahwa semuanya masih aktif.
8. **Kebijakan Privasi**: belum dibuat. Tambahkan halaman kebijakan privasi bila diperlukan, lalu tautkan di footer.
9. **Foto**: foto produk dari arsip terbaru. Foto `PRASTIGE 2` sengaja tidak dipakai karena tulisannya menyebut "pengiriman proses setiap hari", berbeda dengan jadwal Senin–Sabtu.
10. **Label "Chat with Us"** pada tombol WhatsApp melayang sesuai brief, dan tampil di layar lebar saja.
11. **Cek ongkir Biteship**: belum termasuk di versi ini.

## Catatan
- Kuis aroma dan pencari aroma hanya memberi rekomendasi awal berdasarkan karakter, bukan janji hasil.
- Klaim ketahanan, keamanan kain, gratis ongkir, dan garansi ditampilkan sebagai informasi brand. Hasil dapat berbeda sesuai kulit, cuaca, aktivitas, dan cara pemakaian.
- Form pesan membuka WhatsApp dengan isi pesan yang sudah terisi. Pesanan final dikonfirmasi admin.
