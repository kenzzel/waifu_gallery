# Waifu Gallery

Waifu Gallery adalah galeri foto anime publik dengan tampilan mobile-first bergaya masonry yang terinspirasi dari pengalaman discovery visual, tetapi memakai identitas visual sendiri: hitam, ungu, dan silver.

## Fitur
- Beranda publik: semua foto member tampil dalam masonry 2 kolom di ponsel.
- Detail foto: Suka, Komentar, Bagikan, Simpan, menu tambahan, dan Download.
- Simpan: menyimpan foto ke tab **Disimpan** di profil Waifu Gallery, bukan ke galeri HP.
- Suka: masuk ke tab **Disukai**. Like dan Simpan merupakan dua tindakan terpisah.
- Download: mengunduh file gambar ke perangkat hanya ketika dipilih.
- Profil member: header sederhana dan hanya tiga tab — Disimpan, Disukai, Koleksi (foto yang diunggah sendiri).
- Pencarian foto berdasarkan judul, anime, karakter, dan nama member.
- Login/register Supabase; pengunjung dapat menjelajah tanpa login.
- Upload foto JPG/PNG/WEBP maksimal 10 MB.
- Tombol + berisi Up foto, Koleksi (album), dan Kolase (2–9 foto).
- Member dapat menghapus foto sendiri; Owner dapat menghapus semua foto.

## Setup
1. Buat project Supabase.
2. Buka SQL Editor dan jalankan seluruh isi `supabase.sql`.
   - Jika database versi sebelumnya sudah dipakai, backup dahulu. Script memakai `IF NOT EXISTS` dan menambahkan tabel interaksi serta kolom bio.
3. Buka `config.js` (file ini sudah disertakan). URL project sudah terisi; ganti `TEMPEL_ANON_PUBLISHABLE_KEY_DI_SINI` dengan anon/publishable key dari Supabase Project Settings → API.
4. Pastikan `config.js` ikut di-commit / di-upload ke GitHub Pages. File ini sengaja tidak diabaikan oleh `.gitignore`; Supabase anon/publishable key memang digunakan di frontend dan wajib dilindungi dengan RLS.
5. Jangan pernah menaruh `service_role` key di frontend.
6. Deploy seluruh file ke hosting static seperti Netlify atau Vercel.

## Menjadikan akun sebagai Owner
Daftar akun terlebih dahulu, lalu jalankan SQL berikut dengan UUID akun sendiri:

```sql
update public.profiles set role = 'owner' where id = 'UUID-AKUN-KAMU';
```

## Catatan
- Semua orang dapat melihat foto yang diunggah ke bucket publik.
- Login dibutuhkan untuk upload, Like, Simpan, komentar, dan membuat album.
- Simpan hanya membuat bookmark di akun Waifu Gallery. Download adalah tindakan terpisah.
- Jumlah foto tidak dibatasi oleh aplikasi, tetapi tetap mengikuti kuota Storage dan bandwidth paket Supabase.


## Catatan login dan akses publik
- Setiap kali halaman dimuat ulang/dibuka kembali, aplikasi menampilkan halaman Masuk terlebih dahulu. Sesi tidak dipulihkan otomatis antar kunjungan.
- Pengunjung tetap dapat menekan “Jelajahi tanpa login” untuk melihat galeri publik.
- Jalankan ulang seluruh `supabase.sql` agar hak akses tabel (GRANT) dan RLS diterapkan. Ini memperbaiki error `permission denied for table wallpapers` bila penyebabnya hak akses tabel belum diberikan.
\n\n### Sesi login\nVersi ini mengaktifkan persistSession Supabase. Setelah login, sesi dipulihkan dari penyimpanan browser saat halaman di-refresh. Tombol Keluar menghapus sesi. Mode Jelajahi tanpa login juga diingat di browser sampai pengguna keluar dari mode tersebut atau login.\n

## Pemisahan halaman login dan aplikasi

- `login.html` adalah halaman khusus Masuk/Daftar.
- `index.html` adalah halaman aplikasi Waifu Gallery.
- `login.js` menangani autentikasi dan menyimpan sesi Supabase di localStorage.
- `app.js` memeriksa sesi sebelum menampilkan aplikasi. Jika belum login dan bukan mode jelajah tamu, pengunjung diarahkan ke `login.html`.
- Setelah login, refresh atau membuka kembali browser akan memulihkan sesi. Tombol Keluar menghapus sesi dan kembali ke `login.html`.
- `Jelajahi tanpa login` tetap tersedia untuk galeri publik.

Pastikan `login.html`, `login.js`, `index.html`, `app.js`, `styles.css`, dan `config.js` berada di folder yang sama pada GitHub Pages.


## Perbaikan sesi Android/mobile

Supabase Auth dikonfigurasi memakai lock callback ringan agar antrean Web Locks browser yang macet tidak menahan pemeriksaan sesi. Pemeriksaan sesi juga memiliki batas waktu 12 detik dan menampilkan pesan yang bisa ditindaklanjuti, bukan membiarkan layar pemuatan menggantung tanpa batas.


## Fix penyimpanan profil

Jika nama/bio sempat berubah tetapi kembali ke email setelah refresh, jalankan SQL migrasi yang dikirim terpisah di chat di Supabase SQL Editor. Perbaikan app sekarang memeriksa apakah UPDATE benar-benar mengembalikan baris; bila profil belum ada, aplikasi membuat baris profil milik akun itu. Pesan sukses hanya ditampilkan setelah data tersimpan dan dikembalikan oleh Supabase.


## Simpan profil (SQL dikirim terpisah di chat)

Versi ini menyimpan nama, bio, dan avatar melalui RPC `update_my_profile`. Jalankan SQL migrasi yang dikirim terpisah di chat pada Supabase SQL Editor sebelum memakai tombol Simpan profil. Fungsi RPC mengambil identitas dari `auth.uid()` sehingga pengguna hanya dapat mengubah profil akunnya sendiri.


## Fitur sosial profil
Profil member menampilkan jumlah Mengikuti, Pengikut, dan Like yang diterima pada foto-fotonya. Tombol Ikuti berubah menjadi Mengikuti; jika kedua member saling mengikuti, statusnya menjadi Teman. Jalankan SQL `user_follows` yang diberikan terpisah di chat sebelum memakai fitur ini.
