// Firebase Configuration for Realtime Database
// Ganti dengan konfigurasi Firebase project Anda

export const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Instruksi Setup Firebase Realtime Database:
// 1. Buat project baru di https://console.firebase.google.com/
// 2. Pilih "Add app" dan pilih "Web"
// 3. Copy konfigurasi Firebase dan ganti nilai di atas
// 4. Di Firebase Console, buka "Realtime Database"
// 5. Klik "Create Database" dan pilih lokasi (pilih yang dekat dengan Indonesia)
// 6. Pilih "Start in test mode" untuk development
// 7. Database URL akan otomatis muncul dalam format: https://project-id-default-rtdb.firebaseio.com/

// Struktur data yang akan disimpan di Realtime Database:
// rsvp/
//   ├── -uniqueKey1/
//   │   ├── nama: "string"
//   │   ├── kehadiran: "hadir" | "tidak-hadir" | "masih-ragu"
//   │   ├── ucapan: "string"
//   │   └── timestamp: Firebase.serverTimestamp()
//   ├── -uniqueKey2/
//   │   └── ...
//   └── ...

// Keunggulan Realtime Database:
// - Real-time synchronization
// - Offline support
// - Simpler structure (JSON tree)
// - Lebih cocok untuk chat/messaging apps