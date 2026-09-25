/* chrome.js — satu-satunya pemilik chrome navigasi.
   Otomatis me-mount taskbar ke <div data-nav="index|dashboard|kontrol">.
   Interface: ChromeNav.mount() (dipanggil otomatis saat dimuat). */

(function (global) {
  "use strict";

  var PAGES = [
    { href: "index.html", key: "index", label: "Konsep" },
    { href: "dashboard.html", key: "dashboard", label: "Dashboard" },
    { href: "kontrol.html", key: "kontrol", label: "Logika kontrol" }
  ];

  var SPARK = '<svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">' +
    '<path d="M16 2l2.6 7.6L26 11l-6.5 4.9L21.5 24 16 19.3 10.5 24l2-8.1L6 11l7.4-1.4z" ' +
    'fill="#0097b9" stroke="#101e33" stroke-width="1.5"/></svg>';

  function mount() {
    if (typeof document === "undefined") return;
    var slot = document.querySelector("[data-nav]");
    if (!slot) return;
    var cur = slot.getAttribute("data-nav");
    var links = PAGES.map(function (p) {
      var here = p.key === cur ? ' aria-current="page"' : "";
      return '<a href="' + p.href + '"' + here + ">" + p.label + "</a>";
    }).join("");
    slot.innerHTML =
      '<header class="taskbar"><a class="brand" href="index.html" aria-label="Smart Dairy Farming — beranda">' +
      SPARK + "<b>Smart Dairy Farming</b></a>" +
      '<nav aria-label="Navigasi utama">' + links + "</nav></header>";
  }

  global.ChromeNav = { mount: mount, PAGES: PAGES };
  if (typeof module !== "undefined" && module.exports) module.exports = global.ChromeNav;

  mount();
})(typeof window !== "undefined" ? window : globalThis);
