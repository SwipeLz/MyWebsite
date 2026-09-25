# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML + Tailwind CDN + Chart.js + Firebase Hosting + Firestore. Mock-first di v1, Auth ditunda ke luar v1.

## Users

Peternak / operator kandang sapi perah Friesian Holstein yang memantau kondisi harian (THI, perilaku sapi, status sprinkler/kipas) dan menjalankan intervensi pendinginan.

## Product Purpose

Website dokumentasi + dashboard demo untuk sistem pendinginan adaptif: menjelaskan konsep lingkungan → respons sapi → keputusan kontrol → intervensi → evaluasi, dan memungkinkan operator memantau THI, standing/lying ratio, distribusi zona, serta status aktuator. Sukses berarti operator dapat membaca kondisi kandang dan kebutuhan siklus pendinginan dari dashboard harian.

## Positioning

Keputusan pendinginan memakai THI sebagai konteks lingkungan ditambah konfirmasi respons sapi dari CCTV (standing/lying ratio, distribusi lima zona kandang), dengan evaluasi sebelum–sesudah intervensi — bukan sprinkler timer atau pemicu suhu tunggal.

## Operating Context

Kandang 16 sapi, 2 kamera IP miring (kiri/kanan), laptop Python OpenCV/YOLOv8-nano untuk deteksi dan tracking, ESP32 menerima keputusan via HTTP/MQTT dan menggerakkan relay/pompa/kipas/nozzle coarse droplet. Siklus: semprot intermiten 1,5 menit + kipas pengeringan 5–8 menit + hysteresis/cooldown + manual override.

## Capabilities and Constraints

Beranda konsep, dashboard mock 4 blok (gauge THI 68–72 peringatan / 72–78 intervensi, chart standing/lying ratio, distribusi zona, status aktuator), halaman logika kontrol. Firestore `telemetry` (dok per menit) + `events` (per siklus); mock di browser tiap ~5 detik, tulis batch tiap 1 menit. Heavy breathing hanya catatan validasi manual di v1, bukan grafik otomatis. Tanpa thermal camera, collar, flow sensor, dan tanpa Auth di v1. Bahasa Indonesia. Target waktu 1–2 bulan. Belum diputuskan: `firebaseConfig` project (masih placeholder, ditempel belakangan).

## Evidence on Hand

Ringkasan konsep 6 halaman (`_me/Ringkasan_Proyek_Sprinkler_CCTV.pdf`), spec JSON (`_me/ringkasan_proyek_sprinkler_cctv_spec.json`, `_me/Ringkasan_Proyek_Sprinkler_CCTV_text.json`), glosarium (`CONTEXT.md`), keputusan hosting (`docs/adr/0001-firebase-hosting-firestore.md`). Tidak ada testimoni, data live, atau aset foto/video kandang — tidak boleh difabrikasi.

## Product Principles

- Urutan keputusan selalu lingkungan → respons sapi → kontrol → intervensi → evaluasi.
- Setiap ratio dihitung dari sapi terlihat dan dapat dinilai; occluded selalu di-exclude.
- Kamera mengonfirmasi, THI memberi konteks; tidak ada pemicu tunggal.
- Intervensi intermiten dengan pengeringan dan jeda; lantai becek dan kelembapan berlebih adalah kegagalan.
- Sukses diukur dari perubahan respons sapi, bukan dari pompa yang menyala.
