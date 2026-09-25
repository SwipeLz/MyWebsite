/* Mesin mock telemetri kandang — data SYNTHETIC, struktur siap ganti ke sumber asli.
   Tick tiap 5 detik di browser; batch Firestore tiap 1 menit bila firebase dikonfigurasi.
   Kebenaran domain (ambang, zona) dibaca dari Barn; rand/now dapat disuntik untuk tes. */

(function (global) {
  "use strict";

  function B() { return global.Barn; }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  // Satu-satunya loop apportion: bagi assessable ke kunci Zona Kandang
  // menurut bobot; sisa pembulatan jatuh ke kunci terakhir.
  function apportion(assessable, weights) {
    var keys = B().ZONES.map(function (z) { return z.key; });
    var sum = keys.reduce(function (a, z) { return a + weights[z]; }, 0);
    var zones = {};
    var acc = 0;
    keys.forEach(function (z, i) {
      if (i === keys.length - 1) { zones[z] = assessable - acc; }
      else { var c = Math.round(assessable * weights[z] / sum); zones[z] = c; acc += c; }
    });
    return zones;
  }

  function freshState() {
    // Diturunkan dari Barn.HERD: occluded tetap 2, standing ≈64% assessable.
    var occluded = 2;
    var assessable = B().HERD - occluded;
    var standing = Math.round(assessable * 0.64);
    return {
      t: Date.now(),
      thi: 70.5,
      suhu: 27.5,
      humidity: 72,
      standing: standing,
      lying: assessable - standing,
      occluded: occluded,
      zones: apportion(assessable, { kipas: 5, lorong: 2, terbuka: 2, pakan: 3, minum: 2 }),
      pump: "mati",
      fan: "menyala",
      cooldownUntil: 0,
      pumpUntil: 0
    };
  }

  // opts: { rand: () => [0,1), now: ms }. Default = perilaku browser lama.
  function step(s, opts) {
    var rand = (opts && opts.rand) || Math.random;
    var now = (opts && opts.now !== undefined) ? opts.now : Date.now();
    function rnd(lo, hi) { return lo + rand() * (hi - lo); }

    // THI random-walk 66–79; suhu dan kelembapan mengikuti longgar.
    s.thi = clamp(s.thi + rnd(-0.7, 0.7), 66, 79);
    s.suhu = clamp(24 + (s.thi - 60) * 0.28 + rnd(-0.2, 0.2), 24, 33);
    s.humidity = clamp(Math.round(96 - (s.thi - 60) * 1.9 + rnd(-2, 2)), 55, 95);

    // Standing ratio naik saat THI naik; occluded 1–3 ekor (selalu excluded).
    var stress = clamp((s.thi - B().THI_WARN) / 10, 0, 1);
    s.occluded = clamp(Math.round(rnd(1, 3)), 0, 4);
    var assessable = B().HERD - s.occluded;
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
    s.zones = apportion(assessable, w);

    // Status aktuator.
    if (now < s.pumpUntil) { s.pump = "menyemprot"; s.fan = "menyala"; }
    else if (s.pump === "menyemprot") { s.pump = "mati"; }
    if (now < s.cooldownUntil && s.pump === "mati") { s.fan = "pengeringan"; }
    else if (s.pump === "mati" && s.fan === "pengeringan" && now >= s.cooldownUntil) { s.fan = "menyala"; }

    s.t = now;
    return s;
  }

  // Interface ramping: hanya fresh/step. Ambang, zona, dan ratio milik Barn.
  var Mock = { fresh: freshState, step: step };

  global.BarnMock = Mock;
  if (typeof module !== "undefined" && module.exports) module.exports = Mock;
})(typeof window !== "undefined" ? window : globalThis);
