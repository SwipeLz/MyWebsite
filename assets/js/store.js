/* store.js — module persistensi: satu-satunya pemilik sisi-efek tulis.
   Memory kini (no-op aman); Firestore bila init() berhasil.
   Interface: init(done), saveTelemetry(doc), saveEvent(kind, reason), isLive(). */

(function (global) {
  "use strict";

  var SDK = [
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"
  ];

  var db = null;

  function loadScript(src, done) {
    var tag = global.document.createElement("script");
    tag.src = src;
    tag.onload = function () { done(null); };
    tag.onerror = function () { done(new Error("gagal memuat " + src)); };
    global.document.head.appendChild(tag);
  }

  // done(err, live). Tanpa konfigurasi → langsung done(null, false), tanpa DOM.
  function init(done) {
    if (!global.FIREBASE_CONFIGURED) return done(null, false);
    loadScript(SDK[0], function (e1) {
      if (e1) return done(e1, false);
      loadScript(SDK[1], function (e2) {
        if (e2) return done(e2, false);
        try {
          global.firebase.initializeApp(global.FIREBASE_CONFIG);
          db = global.firebase.firestore();
          done(null, true);
        } catch (err) { db = null; done(err, false); }
      });
    });
  }

  function saveTelemetry(doc) {
    if (!db) return false;
    doc.t = global.firebase.firestore.FieldValue.serverTimestamp();
    db.collection("telemetry").add(doc).catch(function () {});
    return true;
  }

  function saveEvent(kind, reason) {
    if (!db) return false;
    db.collection("events").add({
      t: global.firebase.firestore.FieldValue.serverTimestamp(),
      kind: kind, reason: reason, synthetic: true
    }).catch(function () {});
    return true;
  }

  function isLive() { return db !== null; }

  var Store = { init: init, saveTelemetry: saveTelemetry, saveEvent: saveEvent, isLive: isLive };

  global.Store = Store;
  if (typeof module !== "undefined" && module.exports) module.exports = Store;
})(typeof window !== "undefined" ? window : globalThis);
