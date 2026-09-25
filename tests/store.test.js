"use strict";
/* Tes store mode lokal: tanpa konfigurasi Firebase, init langsung done(false)
   dan tulis menjadi no-op false. Jalankan: npm test. */
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const Store = require("../assets/js/store.js");

describe("store mode lokal", () => {
  it("init tanpa konfigurasi → live=false", (_t, done) => {
    Store.init((err, live) => {
      assert.equal(err, null);
      assert.equal(live, false);
      assert.equal(Store.isLive(), false);
      done();
    });
  });
  it("tulis tanpa db → false, input tak dimutasi", () => {
    const tele = { thi: 70 };
    const ev = { kind: "cycle_start", reason: "tes", synthetic: true };
    assert.equal(Store.saveTelemetry(tele), false);
    assert.equal(Store.saveEvent(ev), false);
    assert.deepEqual(tele, { thi: 70 });
    assert.deepEqual(ev, { kind: "cycle_start", reason: "tes", synthetic: true });
  });
});
