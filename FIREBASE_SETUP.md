# Setup Firebase Realtime Database untuk RSVP Undangan Pernikahan

## Langkah-langkah Setup Firebase Realtime Database:

### 1. Buat Project Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Create a project" atau "Add project"
3. Masukkan nama project (contoh: "undangan-pernikahan-ahmad-mona")
4. Ikuti langkah-langkah setup hingga selesai

### 2. Setup Web App
1. Di dashboard Firebase, klik "Add app" dan pilih icon Web (</>) 
2. Masukkan nickname untuk app (contoh: "undangan-web")
3. Copy konfigurasi Firebase yang diberikan

### 3. Setup Realtime Database
1. Di Firebase Console, buka menu "Realtime Database"
2. Klik "Create Database"
3. Pilih lokasi database (pilih yang terdekat dengan Indonesia, contoh: asia-southeast1)
4. Pilih "Start in test mode" (untuk development)
5. Database akan dibuat dengan URL format: `https://your-project-id-default-rtdb.firebaseio.com/`

### 4. Update Konfigurasi
1. Buka file `main.html`
2. Cari bagian `firebaseConfig` di dalam tag `<script type="module">`
3. Ganti nilai-nilai berikut dengan konfigurasi Firebase Anda:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/", // PENTING!
     projectId: "your-actual-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-actual-sender-id",
     appId: "your-actual-app-id"
   };
   ```

### 5. Atur Security Rules (Opsional untuk Production)
Untuk production, ubah rules Realtime Database di tab "Rules":
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

Untuk rules yang lebih ketat (production):
```json
{
  "rules": {
    "rsvp": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$rsvpId": {
        ".validate": "newData.hasChildren(['nama', 'kehadiran', 'timestamp'])"
      }
    }
  }
}
```

### 6. Test Functionality
1. Buka website undangan di browser
2. Isi form RSVP dan klik "Kirim"
3. Cek di Firebase Console > Realtime Database
4. Seharusnya ada node "rsvp" dengan data yang baru saja dikirim

## Struktur Data RSVP di Realtime Database

Data disimpan dalam struktur JSON tree:
```json
{
  "rsvp": {
    "-uniqueKey1": {
      "nama": "Nama Tamu",
      "kehadiran": "hadir",
      "ucapan": "Selamat menempuh hidup baru",
      "timestamp": 1640995200000
    },
    "-uniqueKey2": {
      "nama": "Nama Tamu 2", 
      "kehadiran": "tidak-hadir",
      "ucapan": "Maaf tidak bisa hadir",
      "timestamp": 1640995300000
    }
  }
}
```

## Keunggulan Realtime Database vs Firestore

### Realtime Database:
✅ **Real-time synchronization** - Data sync otomatis  
✅ **Offline support** - Bekerja tanpa internet  
✅ **Simpler structure** - JSON tree sederhana  
✅ **Lower latency** - Lebih cepat untuk real-time apps  
✅ **Better for chat/messaging** - Cocok untuk RSVP real-time  

### Firestore:
✅ More advanced queries  
✅ Better for complex data  
✅ More scalable  

## Melihat Data RSVP

Untuk melihat data RSVP yang masuk:
1. Buka Firebase Console
2. Pilih project Anda
3. Buka "Realtime Database"
4. Expand node "rsvp"
5. Semua data RSVP akan terlihat dalam struktur tree

## Troubleshooting

### Error: "Firebase not defined"
- Pastikan konfigurasi Firebase sudah benar
- Pastikan `databaseURL` sudah diisi dengan benar

### Error: "Permission denied"
- Pastikan Realtime Database rules mengizinkan write
- Untuk development, gunakan test mode rules

### Data tidak tersimpan
- Cek console browser untuk error messages
- Pastikan `databaseURL` format benar: `https://project-id-default-rtdb.firebaseio.com/`
- Pastikan Realtime Database sudah dibuat (bukan Firestore)

## Export Data RSVP

Untuk export data RSVP:
1. Di Firebase Console, buka Realtime Database
2. Klik pada node "rsvp"
3. Klik menu "..." dan pilih "Export JSON"
4. Atau gunakan Firebase Admin SDK untuk export otomatis

## Real-time Features (Bonus)

Jika ingin menampilkan RSVP secara real-time di halaman admin:
```javascript
import { onValue } from 'firebase/database';

const rsvpRef = ref(database, 'rsvp');
onValue(rsvpRef, (snapshot) => {
  const data = snapshot.val();
  console.log('Real-time RSVP data:', data);
  // Update UI dengan data terbaru
});
```