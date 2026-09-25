"use strict";
/* Tes readout: viewmodel murni untuk hero + paint. Jalankan: npm test. */
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
global.Barn = require("../assets/js/barn.js");
const Mock = require("../assets/js/mock.js");
const Readout = require("../assets/js/readout.js");

function state(over) {
  return Object.assign(Mock.fresh(), { thi: 74, suhu: 28.5, humidity: 70 }, over);
}

describe("summarize", () => {
  it("memetakan band + aksi + iklim", () => {
    const vm = Readout.summarize(state({ thi: 74 }), 0.6, 1000);
    assert.equal(vm.bandKey, "danger");
    assert.equal(vm.bandAction, "Intervensi — sprinkler boleh aktif");
    assert.equal(vm.thiText, "74.0");
    assert.equal(vm.climateText, "28.5°C · kelembapan 70%");
  });
  it("tren naik/turun/datar + tanpa histori", () => {
    assert.equal(Readout.summarize(state(), 0.5, 1000).trendKey, "up");
    assert.equal(Readout.summarize(state(), 0.9, 1000).trendKey, "down");
    assert.equal(Readout.summarize(state(), null, 1000).trendKey, "flat");
    assert.match(Readout.summarize(state(), null, 1000).trendText, /stabil/);
  });
  it("timer: menyemprot, cooldown, bebas", () => {
    assert.match(Readout.summarize(state({ pumpUntil: 90000 }), 0.5, 1000).timerText, /menyemprot/);
    assert.equal(Readout.summarize(state({ pumpUntil: 90000 }), 0.5, 1000).cancelDisabled, false);
    assert.match(Readout.summarize(state({ cooldownUntil: 90000 }), 0.5, 1000).timerText, /cooldown/);
    assert.match(Readout.summarize(state(), 0.5, 1000).timerText, /bebas/);
  });
  it("fillScale 0..1 dan count exclude occluded", () => {
    const vm = Readout.summarize(state(), 0.5, 1000);
    assert.ok(vm.fillScale >= 0 && vm.fillScale <= 1);
    assert.match(vm.countText, /2 occluded \(excluded\)/);
  });
});

