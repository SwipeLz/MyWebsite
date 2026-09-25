/* dashboard.js — wiring dashboard: DOM + Chart + Firestore + timer.
   Keputusan domain (ambang, tren, skema) milik Barn; file ini hanya memanggilnya. */

(function () {
  "use strict";

  var db = null;
  if (window.FIREBASE_CONFIGURED) {
    try {
      firebase.initializeApp(window.FIREBASE_CONFIG);
      db = firebase.firestore();
      document.getElementById("mode").textContent = "tersambung Firestore";
      document.getElementById("firestore-note").textContent =
        "Tersambung Firestore — batch telemetri diarsipkan tiap 1 menit ke koleksi telemetry, siklus ke events.";
    } catch (e) { db = null; }
  }

  function el(id) { return document.getElementById(id); }

  function log(msg) {
    var box = el("elog");
    var d = document.createElement("div");
    d.textContent = new Date().toLocaleTimeString("id-ID") + "  " + msg;
    box.prepend(d);
    while (box.children.length > 40) box.lastChild.remove();
  }

  function push(col, doc) {
    if (!db) return;
    doc.t = firebase.firestore.FieldValue.serverTimestamp();
    db.collection(col).add(doc).catch(function () {});
  }

  var s = BarnMock.step(BarnMock.fresh());
  var hist = [];

  var trend = new Chart(el("ch-trend"), {
    type: "line",
    data: { labels: [], datasets: [
      { label: "Standing %", data: [], borderColor: "#0097b9", backgroundColor: "#0097b9", tension: 0.3, pointRadius: 0 },
      { label: "THI", data: [], borderColor: "#b91c1c", backgroundColor: "#b91c1c", tension: 0.3, pointRadius: 0, yAxisID: "y1" }
    ]},
    options: { responsive: true, animation: false,
      scales: { y: { min: 0, max: 100 }, y1: { position: "right", min: 60, max: 85, grid: { drawOnChartArea: false } } } }
  });

  var zones = new Chart(el("ch-zones"), {
    type: "doughnut",
    data: { labels: Barn.ZONES.map(function (z) { return z.label; }),
      datasets: [{ data: [0, 0, 0, 0, 0],
        backgroundColor: Barn.ZONES.map(function (z) { return z.color; }) }] },
    options: { responsive: true, animation: false }
  });

  var legend = el("zone-legend");
  Barn.ZONES.forEach(function (z) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="swatch" style="background:' + z.color + '"></span><span><b>' +
      z.label + '</b> — <span class="px" data-zone="' + z.key + '">–</span> ekor</span>';
    legend.appendChild(li);
  });

  function avgTail(n) {
    var tail = hist.slice(-n);
    if (!tail.length) return null;
    return tail.reduce(function (a, h) { return a + h.r; }, 0) / tail.length;
  }

  function paint() {
    var now = Date.now();
    s = BarnMock.step(s);
    var b = Barn.band(s.thi);
    var r = Barn.ratio(s.standing, s.lying);
    var prev = avgTail(3);

    el("d-thi").textContent = s.thi.toFixed(1);
    el("d-fill").style.transform = "scaleX(" + (1 - Barn.thiFill(s.thi)).toFixed(3) + ")";
    var badge = el("d-band");
    badge.textContent = Barn.actionFor(b.key);
    badge.className = "badge " + b.key;
    el("d-climate").textContent = s.suhu.toFixed(1) + "°C · kelembapan " + s.humidity + "%";

    el("d-ratio").textContent = Barn.pct(r) + " berdiri";
    el("d-count").textContent =
      s.standing + " berdiri · " + s.lying + " berbaring · " + s.occluded + " occluded (excluded)";
    var d = prev === null ? 0 : r - prev;
    el("d-trend").textContent =
      "tren: " + (d > Barn.TREND_EPS ? "naik ▲" : (d < -Barn.TREND_EPS ? "turun ▼" : "stabil ▬"));

    el("d-pump").textContent = "pompa: " + s.pump;
    el("d-fan").textContent = "kipas: " + s.fan;
    el("d-timer").textContent =
      now < s.pumpUntil ? "menyemprot: " + Math.ceil((s.pumpUntil - now) / 1000) + " dtk tersisa"
      : (now < s.cooldownUntil ? "cooldown: " + Math.ceil((s.cooldownUntil - now) / 1000) + " dtk tersisa" : "cooldown: bebas — siklus boleh aktif");
    el("btn-cancel").disabled = !(now < s.pumpUntil);

    hist.push({ r: r, thi: s.thi });
    if (hist.length > 60) hist.shift();
    trend.data.labels = hist.map(function (_, i) { return i; });
    trend.data.datasets[0].data = hist.map(function (h) { return +(h.r * 100).toFixed(1); });
    trend.data.datasets[1].data = hist.map(function (h) { return +h.thi.toFixed(1); });
    trend.update();
    zones.data.datasets[0].data = Barn.ZONES.map(function (z) { return s.zones[z.key]; });
    zones.update();
    Barn.ZONES.forEach(function (z) {
      var node = legend.querySelector('[data-zone="' + z.key + '"]');
      if (node) node.textContent = s.zones[z.key];
    });

    // Policy milik Barn: THI ≥72 DAN standing naik (tren), plus cooldown.
    var verdict = Barn.decide(
      { thi: s.thi, ratio: r, pump: s.pump, cooldownUntil: s.cooldownUntil, now: now }, prev);
    if (verdict.fire) startCycle(verdict.reason);

    if (!paint.lastBatch || now - paint.lastBatch > 60000) {
      paint.lastBatch = now;
      push("telemetry", Barn.telemetryDoc(s));
    }
  }

  function startCycle(why) {
    var now = Date.now();
    s.pumpUntil = now + Barn.CYCLE.pumpMs;
    s.cooldownUntil = now + Barn.CYCLE.pumpMs + Barn.CYCLE.dryMs;
    s.pump = "menyemprot"; s.fan = "menyala";
    log("SIKLUS MULAI — " + why);
    push("events", Barn.eventDoc("cycle_start", why));
  }

  el("btn-override").addEventListener("click", function () {
    startCycle("manual override operator");
  });
  el("btn-cancel").addEventListener("click", function () {
    s.pumpUntil = 0; s.pump = "mati";
    log("SIKLUS DIBATALKAN operator — kipas lanjut pengeringan.");
  });

  log("Dashboard aktif — mock SYNTHETIC tiap 5 detik.");
  paint();
  setInterval(paint, 5000);
})();
