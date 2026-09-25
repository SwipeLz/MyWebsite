/* Mesin mock telemetri kandang — data SYNTHETIC, struktur siap ganti ke sumber asli.
   Tick tiap 5 detik di browser; batch Firestore tiap 1 menit bila firebase dikonfigurasi. */

(function (global) {
  "use strict";

  var ZONES = ["kipas", "lorong", "terbuka", "pakan", "minum"];
  var HERD = 16;

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }

  function freshState() {
    return {
      t: Date.now(),
      thi: 70.5,
      suhu: 27.5,
      humidity: 72,
      standing: 9,
      lying: 5,
      occluded: 2,
      zones: { kipas: 5, lorong: 2, terbuka: 2, pakan: 3, minum: 2 },
      pump: "mati",
      fan: "menyala",
      cooldownUntil: 0,
      pumpUntil: 0
    };
  }

  function step(s) {
    // THI random-walk 66–79; suhu dan kelembapan mengikuti longgar.
    s.thi = clamp(s.thi + rnd(-0.7, 0.7), 66, 79);
    s.suhu = clamp(24 + (s.thi - 60) * 0.28 + rnd(-0.2, 0.2), 24, 33);
    s.humidity = clamp(Math.round(96 - (s.thi - 60) * 1.9 + rnd(-2, 2)), 55, 95);

    // Standing ratio naik saat THI naik; occluded 1–3 ekor.
    var stress = clamp((s.thi - 68) / 10, 0, 1);
    s.occluded = clamp(Math.round(rnd(1, 3)), 0, 4);
    var assessable = HERD - s.occluded;
    var standingShare = clamp(0.45 + stress * 0.4 + rnd(-0.06, 0.06), 0.1, 0.95);
    s.standing = Math.round(assessable * standingShare);
    s.lying = assessable - s.standing;

    // Distribusi zona: sapi bermigrasi ke kipas dan minum saat panas.
    var w = {
      kipas: 3 + stress * 5,
      lorong: 2,
      terbuka: 3 - stress * 1.5,
      pakan: 3,
      minum: 1.5 + stress * 2.5
    };
    var sum = w.kipas + w.lorong + w.terbuka + w.pakan + w.minum;
    var acc = 0;
    s.zones = {};
    ZONES.forEach(function (z, i) {
      if (i === ZONES.length - 1) { s.zones[z] = assessable - acc; }
      else { var c = Math.round(assessable * w[z] / sum); s.zones[z] = c; acc += c; }
    });

    // Status aktuator.
    var now = Date.now();
    if (now < s.pumpUntil) { s.pump = "menyemprot"; s.fan = "menyala"; }
    else if (s.pump === "menyemprot") { s.pump = "mati"; }
    if (now < s.cooldownUntil && s.pump === "mati") { s.fan = "pengeringan"; }
    else if (s.pump === "mati" && s.fan === "pengeringan" && now >= s.cooldownUntil) { s.fan = "menyala"; }

    s.t = now;
    return s;
  }

  function band(thi) {
    if (thi >= 72) return { key: "danger", label: "Intervensi" };
    if (thi >= 68) return { key: "warn", label: "Peringatan awal" };
    return { key: "ok", label: "Aman" };
  }

  function standingRatio(s) {
    var denom = s.standing + s.lying;
    return denom ? s.standing / denom : 0;
  }

  var Mock = {
    ZONES: ZONES,
    HERD: HERD,
    fresh: freshState,
    step: step,
    band: band,
    ratio: standingRatio
  };

  global.BarnMock = Mock;
})(typeof window !== "undefined" ? window : this);
