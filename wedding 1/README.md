# Wedding Invitation - Munah & Mail

Website undangan pernikahan dengan fitur ucapan doa real-time.

## Fitur
- ✅ Undangan digital yang elegan
- ✅ Countdown timer ke hari pernikahan
- ✅ Form ucapan doa
- ✅ Database real-time (Firebase)
- ✅ Responsive design untuk mobile & desktop
- ✅ Backup otomatis ke localStorage

## Setup Firebase (Agar pesan bisa dilihat semua orang)

### Langkah Cepat:
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru
3. Aktifkan "Realtime Database"
4. Copy konfigurasi Firebase
5. Paste ke file `main.html` bagian `firebaseConfig`

### Detail Setup:
Lihat file `FIREBASE_SETUP.md` untuk panduan lengkap.

## Cara Menggunakan
1. Buka `main.html` di browser
2. Jika Firebase sudah disetup: pesan akan tersinkronisasi real-time
3. Jika belum: pesan tersimpan lokal di browser masing-masing

## File Penting
- `main.html` - Halaman utama
- `script.js` - Logika aplikasi
- `style.css` - Styling
- `FIREBASE_SETUP.md` - Panduan setup Firebase