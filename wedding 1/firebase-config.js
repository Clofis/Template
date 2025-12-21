// Firebase Configuration
// Ganti dengan konfigurasi Firebase project Anda

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Contoh konfigurasi (tidak akan berfungsi, hanya contoh format):
/*
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "wedding-invitation-12345.firebaseapp.com",
  databaseURL: "https://wedding-invitation-12345-default-rtdb.firebaseio.com/",
  projectId: "wedding-invitation-12345",
  storageBucket: "wedding-invitation-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqr"
};
*/

export default firebaseConfig;