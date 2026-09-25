/* readout.js — viewmodel readout kandang, murni tanpa DOM.
   summarize(state, prevRatio, now) mengembalikan objek siap tempel;
   dipakai hero (subset) dan paint dashboard (penuh). Test surface: require di node. */

(function (global) {
  "use strict";

  function B() { return global.Barn; }

  function summarize(s, prevRatio, now) {
    var Barn = B();
    var b = Barn.band(s.thi);
    var r = Barn.ratio(s.standing, s.lying);
    var d = (prevRatio === null || prevRatio === undefined) ? 0 : r - prevRatio;
    var trendKey = d > Barn.TREND_EPS ? "up" : (d < -Barn.TREND_EPS ? "down" : "flat");

    return {
      thiText: s.thi.toFixed(1),
      fillScale: 1 - Barn.thiFill(s.thi),
      bandKey: b.key,
      bandLabel: b.label,
      bandAction: Barn.actionFor(b.key),
      climateText: s.suhu.toFixed(1) + "°C · kelembapan " + s.humidity + "%",
      ratio: r,
      ratioText: Barn.pct(r) + " berdiri",
      countText: s.standing + " berdiri · " + s.lying + " berbaring · " +
        s.occluded + " occluded (excluded)",
      trendKey: trendKey,
      trendText: "tren: " + (trendKey === "up" ? "naik ▲" : (trendKey === "down" ? "turun ▼" : "stabil ▬")),
      pumpText: "pompa: " + s.pump,
      fanText: "kipas: " + s.fan,
      timerText: now < s.pumpUntil
        ? "menyemprot: " + Math.ceil((s.pumpUntil - now) / 1000) + " dtk tersisa"
        : (now < s.cooldownUntil
          ? "cooldown: " + Math.ceil((s.cooldownUntil - now) / 1000) + " dtk tersisa"
          : "cooldown: bebas — siklus boleh aktif"),
      cancelDisabled: !(now < s.pumpUntil)
    };
  }

  var Readout = { summarize: summarize };

  global.Readout = Readout;
  if (typeof module !== "undefined" && module.exports) module.exports = Readout;
})(typeof window !== "undefined" ? window : globalThis);
