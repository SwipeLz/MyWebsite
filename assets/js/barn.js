/* barn.js — module kebenaran domain kandang.
   Satu-satunya tempat yang boleh tahu: ambang THI, kanon Zona Kandang,
   kapan Siklus Pendinginan boleh aktif, dan bentuk dokumen telemetri.
   Interface-nya (Barn.*) adalah test surface; panggil dari halaman atau tes. */

(function (global) {
  "use strict";

  // Ambang rancangan awal — kalibrasi lapangan cukup mengedit dua angka ini.
  var THI_WARN = 68;
  var THI_ACT = 72;

  var HERD = 16;

  var ZONES = [
    { key: "kipas", label: "kipas", color: "#0097b9" },
    { key: "lorong", label: "lorong", color: "#64748b" },
    { key: "terbuka", label: "sisi terbuka", color: "#4d7c0f" },
    { key: "pakan", label: "area pakan", color: "#b45309" },
    { key: "minum", label: "area minum", color: "#1d4ed8" }
  ];

  // Durasi Siklus Pendinginan + pengeringan (ms). Satu-satunya sumber durasi.
  var CYCLE = { pumpMs: 90000, dryMs: 6 * 60000 };

  // Kenaikan standing ratio minimum agar dihitung "naik" (sesuai tabel kontrol).
  var TREND_EPS = 0.02;

  function band(thi) {
    if (thi >= THI_ACT) return { key: "danger", label: "Intervensi" };
    if (thi >= THI_WARN) return { key: "warn", label: "Peringatan awal" };
    return { key: "ok", label: "Aman" };
  }

  function actionFor(key) {
    if (key === "danger") return "Intervensi — sprinkler boleh aktif";
    if (key === "warn") return "Peringatan awal — kipas / pantau rapat";
    return "Aman — pantau";
  }

  // Standing Ratio = berdiri ÷ terlihat-dapat-dinilai (occluded selalu excluded).
  function ratio(standing, lying) {
    var denom = standing + lying;
    return denom ? standing / denom : 0;
  }

  // Fraksi isian bilah muat THI untuk skala 60–85.
  function thiFill(thi) {
    return 1 - Math.min(1, Math.max(0, (thi - 60) / 25));
  }

  function pct(r) {
    return (r * 100).toFixed(0) + "%";
  }

  /* Policy Siklus Pendinginan — murni, tanpa DOM/waktu/RNG.
     st: { thi, ratio, pump, cooldownUntil, now }.
     prevRatio: rata-rata standing ratio beberapa tick terakhir (null bila belum ada).
     Mengembalikan { fire, reason }. */
  function decide(st, prevRatio) {
    if (st.pump !== "mati") return { fire: false, reason: "pompa sedang menyemprot" };
    if (st.now < st.cooldownUntil) return { fire: false, reason: "cooldown/hysteresis" };
    if (st.thi < THI_ACT) return { fire: false, reason: "THI di bawah ambang intervensi" };
    if (prevRatio === null || prevRatio === undefined) return { fire: false, reason: "menunggu tren" };
    if (st.ratio - prevRatio <= TREND_EPS) return { fire: false, reason: "standing tidak naik" };
    return {
      fire: true,
      reason: "otomatis (THI " + st.thi.toFixed(1) + ", standing " + pct(st.ratio) + " naik)"
    };
  }

  // Bentuk dokumen Firestore — cerminkan di firestore.rules bila berubah.
  function telemetryDoc(s) {
    var zones = {};
    ZONES.forEach(function (z) { zones[z.key] = s.zones[z.key]; });
    return {
      thi: +s.thi.toFixed(2),
      suhu: +s.suhu.toFixed(2),
      humidity: s.humidity,
      standing: s.standing,
      lying: s.lying,
      occluded: s.occluded,
      zones: zones,
      pump: s.pump,
      fan: s.fan,
      synthetic: true
    };
  }

  function eventDoc(kind, reason) {
    return { kind: kind, reason: reason, synthetic: true };
  }

  var Barn = {
    THI_WARN: THI_WARN,
    THI_ACT: THI_ACT,
    HERD: HERD,
    ZONES: ZONES,
    CYCLE: CYCLE,
    TREND_EPS: TREND_EPS,
    band: band,
    actionFor: actionFor,
    ratio: ratio,
    thiFill: thiFill,
    pct: pct,
    decide: decide,
    telemetryDoc: telemetryDoc,
    eventDoc: eventDoc
  };

  global.Barn = Barn;
  if (typeof module !== "undefined" && module.exports) module.exports = Barn;
})(typeof window !== "undefined" ? window : globalThis);
