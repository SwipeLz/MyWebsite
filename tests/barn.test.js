"use strict";
/* Tes interface Barn — ambang THI, ratio, dan policy Siklus Pendinginan.
   Jalankan: node --test tests/ (tanpa dependensi). */
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const Barn = require("../assets/js/barn.js");

describe("band THI", () => {
  it("batas bawah: 67.9 aman, 68 peringatan", () => {
    assert.equal(Barn.band(67.9).key, "ok");
    assert.equal(Barn.band(68).key, "warn");
  });
  it("batas intervensi: 71.9 waspada, 72 intervensi", () => {
    assert.equal(Barn.band(71.9).key, "warn");
    assert.equal(Barn.band(72).key, "danger");
    assert.equal(Barn.band(79).key, "danger");
  });
});

describe("ratio", () => {
  it("occluded tidak masuk pembagi", () => {
    assert.equal(Barn.ratio(9, 5), 9 / 14);
  });
  it("nol assessable = 0, bukan NaN", () => {
    assert.equal(Barn.ratio(0, 0), 0);
  });
});

describe("decide — policy Siklus Pendinginan", () => {
  const base = { thi: 74, ratio: 0.7, pump: "mati", cooldownUntil: 0, now: 1000 };
  it("api bila THI di bawah ambang, walau standing naik", () => {
    const d = Barn.decide({ ...base, thi: 70 }, 0.5);
    assert.equal(d.fire, false);
  });
  it("api bila standing tidak naik (sesuai tabel: harus NAIK)", () => {
    const d = Barn.decide(base, 0.7);
    assert.equal(d.fire, false);
    assert.match(d.reason, /tidak naik/);
  });
  it("nyala bila THI ≥72 DAN standing naik", () => {
    const d = Barn.decide(base, 0.6);
    assert.equal(d.fire, true);
    assert.match(d.reason, /otomatis/);
  });
  it("tahan saat pompa menyemprot atau cooldown", () => {
    assert.equal(Barn.decide({ ...base, pump: "menyemprot" }, 0.5).fire, false);
    assert.equal(Barn.decide({ ...base, cooldownUntil: 5000 }, 0.5).fire, false);
  });
  it("menunggu tren bila belum ada histori", () => {
    assert.equal(Barn.decide(base, null).fire, false);
  });
});

describe("telemetryDoc", () => {
  it("hanya berisi field kanonis + zona kanonis", () => {
    const doc = Barn.telemetryDoc({
      thi: 73.456, suhu: 28.123, humidity: 70, standing: 9, lying: 5,
      occluded: 2, zones: { kipas: 5, lorong: 2, terbuka: 2, pakan: 3, minum: 2 },
      pump: "mati", fan: "menyala"
    });
    assert.deepEqual(Object.keys(doc).sort(), ["fan", "humidity", "lying", "occluded", "pump", "standing", "suhu", "synthetic", "thi", "zones"]);
    assert.deepEqual(Object.keys(doc.zones).sort(), ["kipas", "lorong", "minum", "pakan", "terbuka"]);
    assert.equal(doc.thi, 73.46);
  });
});

describe("STATUS", () => {
  it("menyediakan warna untuk tiga band status", () => {
    assert.deepEqual(Object.keys(Barn.STATUS).sort(), ["danger", "ok", "warn"]);
    Object.values(Barn.STATUS).forEach((c) => assert.match(c, /^#[0-9a-f]{6}$/));
  });
});

describe("TIMING koheren", () => {
  it("batch kelipatan tick; histori mencakup jendela evaluasi 5 menit", () => {
    assert.equal(Barn.TIMING.batchMs % Barn.TIMING.tickMs, 0);
    assert.equal(Barn.TIMING.histMax * Barn.TIMING.tickMs, 300000);
  });
});
