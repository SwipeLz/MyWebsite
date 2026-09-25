"use strict";
/* Tes determinisme mock: rand/now yang disuntik wajib menghasilkan output berulang,
   dan zona selalu menjumlah ke sapi assessable. Jalankan: node --test tests/. */
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
global.Barn = require("../assets/js/barn.js");
const Mock = require("../assets/js/mock.js");

function seq(values) {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("mock deterministik", () => {
  it("rand dan now yang sama → state yang sama", () => {
    const a = Mock.step(Mock.fresh(), { rand: seq([0.5]), now: 1000 });
    const b = Mock.step(Mock.fresh(), { rand: seq([0.5]), now: 1000 });
    assert.deepEqual(a, b);
  });
  it("zona menjumlah ke 16 − occluded", () => {
    const s = Mock.step(Mock.fresh(), { rand: seq([0.1, 0.9, 0.3, 0.7, 0.2, 0.8, 0.4]), now: 2000 });
    const sum = Object.values(s.zones).reduce((x, y) => x + y, 0);
    assert.equal(sum, 16 - s.occluded);
    assert.equal(s.standing + s.lying, 16 - s.occluded);
  });
  it("kompatibilitas interface lama tetap ada", () => {
    assert.deepEqual(Mock.ZONES, ["kipas", "lorong", "terbuka", "pakan", "minum"]);
    assert.equal(Mock.HERD, 16);
    assert.equal(Mock.band(72).key, "danger");
    assert.equal(Mock.ratio({ standing: 6, lying: 6 }), 0.5);
  });
});
