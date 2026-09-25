/* Tempel konfigurasi project Firebase kamu di sini, lalu deploy.
   Ambil dari: console.firebase.google.com → Project settings → Your apps → firebaseConfig.
   Selama masih diawali "GANTI_", website jalan 100% lokal (mode mock). */

var FIREBASE_CONFIG = {
  apiKey: "GANTI_DENGAN_API_KEY",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};

window.FIREBASE_CONFIGURED =
  typeof FIREBASE_CONFIG !== "undefined" &&
  FIREBASE_CONFIG.apiKey.slice(0, 6) !== "GANTI_";
