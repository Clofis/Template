# Troubleshooting Firebase RSVP

## Langkah-langkah Mengatasi Error "Maaf, terjadi kesalahan"

### 1. Cek Console Browser
1. Buka website undangan di browser
2. Tekan **F12** atau **Ctrl+Shift+I** untuk membuka Developer Tools
3. Klik tab **Console**
4. Coba submit form RSVP
5. Lihat error message yang muncul di console

### 2. Cek Firebase Database Rules
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project "wedding2-efe3b"
3. Klik **Realtime Database**
4. Klik tab **Rules**
5. Pastikan rules seperti ini untuk testing:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**PENTING**: Rules di atas hanya untuk testing. Untuk production, gunakan rules yang lebih aman.

### 3. Cek Network Connection
- Pastikan internet connection stabil
- Coba refresh halaman dan test lagi
- Cek apakah Firebase Console bisa diakses

### 4. Common Error Messages & Solutions

#### Error: "PERMISSION_DENIED"
**Penyebab**: Database rules tidak mengizinkan write
**Solusi**: 
1. Buka Firebase Console > Realtime Database > Rules
2. Ubah rules menjadi:
```json
{
  "rules": {
    "rsvp": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### Error: "Firebase not properly initialized"
**Penyebab**: Konfigurasi Firebase salah atau tidak lengkap
**Solusi**:
1. Cek konfigurasi di main.html
2. Pastikan semua field terisi dengan benar
3. Pastikan databaseURL benar

#### Error: "Network Error"
**Penyebab**: Masalah koneksi internet atau Firebase server
**Solusi**:
1. Cek koneksi internet
2. Coba lagi setelah beberapa menit
3. Cek status Firebase di https://status.firebase.google.com/

### 5. Test Manual Firebase Connection

Tambahkan script test ini di console browser:

```javascript
// Test Firebase connection
const testRef = window.ref(window.database, 'test');
window.push(testRef, {
  message: 'Test connection',
  timestamp: Date.now()
}).then(() => {
  console.log('Firebase connection working!');
}).catch((error) => {
  console.error('Firebase connection failed:', error);
});
```

### 6. Cek Database Structure

Setelah berhasil submit, cek di Firebase Console:
1. Buka Realtime Database
2. Seharusnya ada node "rsvp"
3. Di dalam node "rsvp" ada data dengan struktur:
```json
{
  "rsvp": {
    "-uniqueKey": {
      "nama": "Nama Tamu",
      "kehadiran": "hadir",
      "ucapan": "Ucapan",
      "timestamp": 1640995200000
    }
  }
}
```

### 7. Backup Solution - Temporary Local Storage

Jika Firebase masih bermasalah, saya bisa buatkan backup solution yang menyimpan data ke localStorage browser sementara:

```javascript
// Backup: Save to localStorage
localStorage.setItem('rsvp_' + Date.now(), JSON.stringify({
  nama: nama,
  kehadiran: kehadiran,
  ucapan: ucapan,
  timestamp: Date.now()
}));
```

### 8. Contact Support

Jika masih bermasalah, berikan informasi berikut:
1. Screenshot error message di console
2. Screenshot Firebase Database Rules
3. Browser yang digunakan (Chrome, Firefox, etc.)
4. Device (Desktop/Mobile)

## Quick Fix Checklist

✅ **Database Rules**: Set to allow read/write  
✅ **Internet Connection**: Stable connection  
✅ **Firebase Config**: All fields filled correctly  
✅ **Console Errors**: Check browser console for specific errors  
✅ **Database URL**: Correct format with region  
✅ **Project ID**: Matches Firebase project  

## Emergency Contact

Jika urgent dan perlu bantuan langsung, hubungi developer dengan informasi:
- Error message lengkap dari console
- Screenshot Firebase Console
- Waktu kejadian error