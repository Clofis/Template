# Setup Firebase untuk Wedding Invitation

## Langkah-langkah Setup Firebase:

### 1. Buat Project Firebase
1. Kunjungi [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau "Tambah project"
3. Masukkan nama project (contoh: "wedding-invitation-munah-mail")
4. Ikuti langkah-langkah setup

### 2. Setup Realtime Database
1. Di Firebase Console, pilih project Anda
2. Klik "Realtime Database" di menu kiri
3. Klik "Create Database"
4. Pilih lokasi (pilih yang terdekat dengan Indonesia, misalnya Singapore)
5. Pilih "Start in test mode" untuk sementara

### 3. Dapatkan Konfigurasi Firebase
1. Klik ikon gear (⚙️) di pojok kiri atas
2. Pilih "Project settings"
3. Scroll ke bawah ke bagian "Your apps"
4. Klik "Add app" dan pilih Web (</>) 
5. Masukkan nama app (contoh: "wedding-invitation")
6. Copy konfigurasi yang diberikan

### 4. Update Konfigurasi di Website
1. Buka file `main.html`
2. Cari bagian `firebaseConfig`
3. Ganti semua nilai "YOUR_..." dengan nilai dari Firebase Console

Contoh:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "wedding-invitation-12345.firebaseapp.com",
  databaseURL: "https://wedding-invitation-12345-default-rtdb.firebaseio.com/",
  projectId: "wedding-invitation-12345",
  storageBucket: "wedding-invitation-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqr"
};
```

### 5. Setup Security Rules (Opsional tapi Disarankan)
1. Di Realtime Database, klik tab "Rules"
2. Ganti rules dengan:
```json
{
  "rules": {
    "wishes": {
      ".read": true,
      ".write": true,
      "$wishId": {
        ".validate": "newData.hasChildren(['name', 'message', 'attendance', 'timestamp'])"
      }
    }
  }
}
```

### 6. Test Website
1. Buka website di browser
2. Coba kirim pesan doa
3. Buka website di browser/HP lain
4. Pesan seharusnya muncul di semua perangkat

## Troubleshooting

### Jika Firebase tidak berfungsi:
- Website akan otomatis menggunakan localStorage sebagai backup
- Periksa console browser untuk error messages
- Pastikan konfigurasi Firebase sudah benar

### Jika ada error CORS:
- Pastikan domain website sudah ditambahkan di Firebase Console
- Klik "Authentication" > "Settings" > "Authorized domains"

## Fitur yang Didapat:
✅ Pesan tersimpan di cloud (Firebase)
✅ Real-time sync antar perangkat
✅ Backup otomatis ke localStorage
✅ Gratis untuk penggunaan kecil
✅ Tidak perlu server sendiri