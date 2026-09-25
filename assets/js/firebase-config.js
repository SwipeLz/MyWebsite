/* Tempel konfigurasi project Firebase kamu di sini, lalu deploy.
   Ambil dari: console.firebase.google.com → Project settings → Your apps → firebaseConfig.
   Selama ada field yang kosong/placeholder, website jalan 100% lokal (mode mock). */

var FIREBASE_CONFIG = {
  apiKey: "GANTI_DENGAN_API_KEY",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};

function FIREBASE_IS_CONFIGURED(cfg) {
  if (!cfg || typeof cfg !== "object") return false;
  var keys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
  for (var i = 0; i < keys.length; i++) {
    var v = cfg[keys[i]];
    if (typeof v !== "string" || !v || v.indexOf("GANTI_") === 0) return false;
  }
  return true;
}

window.FIREBASE_CONFIGURED =
  typeof FIREBASE_CONFIG !== "undefined" && FIREBASE_IS_CONFIGURED(FIREBASE_CONFIG);
