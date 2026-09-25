# Handoff Summary

## 1. Konteks proyek

Proyek merancang sistem pendinginan sapi perah Friesian Holstein berbasis sprinkler otomatis yang diperkuat dengan pemantauan kondisi dan perilaku sapi menggunakan kamera CCTV.

Tujuan utama bukan hanya membuat aturan `THI tinggi -> pompa menyala`, tetapi menghubungkan:

1. kondisi lingkungan,
2. respons perilaku sapi,
3. keputusan kontrol,
4. intervensi sprinkler dan kipas,
5. evaluasi perubahan respons setelah pendinginan.

Bahasa komunikasi utama: Bahasa Indonesia.

## 2. Keputusan final

- Sprinkler tetap menjadi aktuator utama sistem.
- Kamera CCTV digunakan sebagai parameter pemantauan dan evaluasi, bukan pengganti sprinkler.
- THI adalah indikator risiko lingkungan, bukan bukti langsung bahwa setiap sapi mengalami heat stress.
- Sensor suhu dan kelembapan relatif tetap diperlukan. Kamera tidak dapat menghitung THI secara langsung.
- Flow sensor ditunda dan belum menjadi bagian wajib sistem.
- Parameter CCTV utama adalah standing/lying.
- Distribusi zona juga digunakan, misalnya area dekat kipas, dekat sprinkler, lorong, area terbuka, area pakan, dan area minum jika terlihat jelas.
- Heavy breathing atau panting hanya digunakan jika sudut kamera memungkinkan bagian kepala serta dada/flank terlihat cukup jelas.
- Kamera tepat vertikal dari atas tidak dianggap andal untuk respiration rate atau panting.
- Posisi kamera yang lebih disarankan adalah tinggi dengan sudut miring atau oblique.
- Target realistis dalam 1 sampai 2 bulan adalah klasifikasi `normal breathing`, `heavy breathing`, `panting berat`, dan `tidak dapat dinilai`, bukan pengukuran respiration rate presisi untuk semua sapi.
- Sapi yang tertutup objek, terlalu kecil, berjalan, atau tidak memiliki bagian tubuh relevan yang terlihat harus diberi label `unknown` atau `occluded`, bukan dianggap normal.
- Perilaku makan dan aktivitas hanya menjadi data pendukung.
- Perilaku minum hanya digunakan jika area minum terlihat jelas.
- Siklus sprinkler yang dibahas bersifat intermiten, sekitar 1,5 menit semprot dan jeda sekitar 5 sampai 8 menit, dengan kipas membantu pengeringan.
- Ambang THI sekitar 68 sampai 72, 72 sampai 78, dan di atas 78 hanya menjadi titik awal dan harus divalidasi secara lokal. Ambang tersebut tidak boleh dianggap universal.
- Kompleksitas, biaya, dan waktu harus realistis untuk proyek mahasiswa. Perkiraan anggaran tambahan sekitar Rp1.000.000 atau kurang.

## 3. Arsitektur perangkat yang direncanakan

- Dua IP camera Wi-Fi dengan RTSP.
- Laptop sebagai pemroses.
- Python, OpenCV, YOLOv8-nano, dan object tracking.
- ESP32 sebagai kontroler lapangan.
- Relay untuk pompa dan kipas.
- Pompa Shimizu dengan presscontrol Brio 2000-M.
- Pipa utama 3/4 inci.
- Enam belas nozzle coarse droplet.
- Satu kipas industri.
- Sensor suhu dan kelembapan.
- Flow sensor belum dipakai.

## 4. Parameter dan formula

- `heavy_breathing_ratio = jumlah sapi heavy breathing / jumlah sapi yang terlihat dan layak dianalisis`
- `standing_ratio = jumlah sapi berdiri / jumlah sapi yang terlihat`
- `lying_ratio = jumlah sapi berbaring / jumlah sapi yang terlihat`

Sapi `unknown` atau `occluded` harus dipisahkan dan tidak boleh dimasukkan sebagai sapi normal tanpa pemeriksaan kelayakan analisis.

Rancangan deteksi heavy breathing:

1. deteksi sapi,
2. tracking ID sementara,
3. pemeriksaan visibilitas,
4. seleksi sapi yang terlihat dari samping,
5. penentuan ROI dada atau flank,
6. optical flow atau frame difference,
7. klasifikasi perilaku pernapasan,
8. validasi manual.

## 5. File yang sudah dibuat

- `C:\Users\MyPC\Documents\ringkasan_proyek_sprinkler_cctv_spec.json`
  - Spesifikasi dokumen Word.

- `C:\Users\MyPC\Documents\Ringkasan_Proyek_Sprinkler_CCTV.docx`
  - Dokumen Word ringkasan proyek.
  - Berhasil dibuat dengan 57 blok.
  - Validasi struktur DOCX melaporkan `ok: true` dan `issues: []`.

- `C:\Users\MyPC\Documents\Ringkasan_Proyek_Sprinkler_CCTV_text.json`
  - Hasil ekstraksi teks dari dokumen untuk pemeriksaan.

- `C:\Users\MyPC\Documents\handoff_proyek_sprinkler_cctv.md`
  - File handoff ini.

Environment Python yang berhasil digunakan untuk pembuatan DOCX:

`C:\Users\MyPC\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe`

## 6. Pekerjaan dan masalah yang belum selesai

- Belum ada dataset CCTV.
- Belum ada validasi model computer vision.
- Belum ada metrik akurasi, precision, recall, confusion matrix, atau hasil validasi manual.
- Heavy breathing belum dapat digunakan secara otomatis jika kamera tetap benar-benar vertikal dari atas.
- Posisi kamera final dan cakupan area kandang belum ditetapkan secara fisik.
- Detail wiring ESP32, relay, pompa, kipas, sensor, dan kamera belum dibuat.
- Skrip produksi untuk ESP32 dan pipeline computer vision belum dibuat.
- Logika kontrol final dan hysteresis belum ditetapkan.
- Detail bibliografi sebagian referensi masih perlu diverifikasi ulang dari halaman jurnal atau penerbit asli.
- Belum ada working directory atau branch Git formal.
- Laporan final, Bab 3, dan protokol pengujian lengkap belum disusun.

## 7. Langkah berikutnya yang disarankan

1. Tetapkan lokasi, tinggi, dan sudut kamera berdasarkan bagian tubuh sapi yang harus terlihat.
2. Tentukan area/zona kandang yang benar-benar masuk cakupan kamera.
3. Pilih sensor suhu dan kelembapan yang realistis untuk anggaran.
4. Buat diagram blok dan rancangan wiring tingkat awal.
5. Tetapkan skema pencatatan data: timestamp, THI, status sprinkler, status kipas, jumlah sapi terlihat, standing ratio, lying ratio, zona, dan label breathing.
6. Kumpulkan video uji pada kondisi normal dan kondisi panas.
7. Lakukan anotasi atau validasi manual sebelum melatih atau mengandalkan classifier.
8. Bangun baseline sederhana untuk standing/lying dan zona sebelum menambahkan heavy breathing.
9. Uji sprinkler secara intermiten dengan memperhatikan lantai becek, pengeringan, dan keselamatan listrik.
10. Bandingkan indikator sebelum dan sesudah intervensi, serta laporkan sapi yang tidak dapat dinilai secara terpisah.
11. Setelah data dan keputusan perangkat cukup jelas, susun metodologi penelitian dan laporan final.

## 8. Hal yang tidak boleh diubah tanpa alasan dan persetujuan

- Jangan mengubah sprinkler menjadi aktuator sekunder. Sprinkler tetap sistem utama.
- Jangan menganggap THI tinggi sebagai bukti langsung heat stress pada semua sapi.
- Jangan menganggap sapi yang tidak terlihat atau teroklusi sebagai sapi normal.
- Jangan menjadikan respiration rate presisi sebagai target utama proyek 1 sampai 2 bulan.
- Jangan mengklaim kamera vertikal dari atas dapat mengukur panting dengan andal.
- Jangan memasukkan flow sensor sebagai komponen wajib sebelum pemasangan dan integrasinya benar-benar disetujui.
- Jangan menggunakan ambang THI yang dibahas sebagai ambang universal tanpa validasi lokal.
- Jangan membuat klaim akurasi computer vision sebelum ada dataset dan validasi.
- Jangan mengarang referensi, hasil eksperimen, statistik, atau data sapi.
- Jangan menyimpan kredensial, token, password, API key, atau connection string di dokumen proyek.

## 9. Aturan antislop

Mode antislop ditetapkan menjadi **DURING**.

Aturan diterapkan selama proses kerja berlangsung. Untuk pekerjaan UI, website, aplikasi, interface, visual, atau kode komentar:

- Jangan membuat konten realistis yang tidak bersumber.
- Jangan membuat statistik, testimonial, fitur, atau klaim palsu.
- Minta konfirmasi sebelum membuat aset visual yang belum ditentukan.
- Setiap keputusan visual harus memiliki alasan.
- UI harus diverifikasi untuk fungsi, aksesibilitas, responsivitas, dan state yang relevan.
- Delivery Gate antislop dijalankan sebelum menyerahkan hasil UI.

Sampai saat ini belum ada pekerjaan UI yang dimulai, sehingga skill UI antislop tambahan dan `DESIGN.md` belum diperlukan.

## 10. Catatan penggunaan Hermes

- Gunakan Bahasa Indonesia.
- Untuk konteks yang panjang, buat handoff baru per fase proyek.
- Fokus pada `current context`, bukan `Prompt tokens` kumulatif.
- Ukuran konteks mode yang disebut pengguna sekitar 272.000 token.
- Konfigurasi Hermes yang terdeteksi:
  - `compression.enabled: true`
  - `compression.threshold: 0.50`
  - `compression.target_ratio: 0.20`
  - `model.context_length` belum diatur eksplisit di konfigurasi.
- Dengan konteks 272.000 token, kompresi diperkirakan mulai sekitar 136.000 token dan target setelah kompresi sekitar 54.400 token.
- Rekomendasi praktis: gunakan `/compress` sekitar 120.000 sampai 135.000 current context jika ingin meringkas secara manual.
- Buat chat baru sekitar 190.000 current context, setelah 2 sampai 3 kali kompresi, atau lebih cepat ketika berpindah fase proyek.
- Jangan menganggap total 5.469.928 prompt tokens dari sesi lama sebagai ukuran konteks aktif saat ini.

## 11. Instruksi untuk chat baru

Mulai dengan membaca file ini:

`C:\Users\MyPC\Documents\handoff_proyek_sprinkler_cctv.md`

Setelah itu, jangan mengulang seluruh diskusi lama. Tanyakan atau kerjakan hanya langkah berikutnya yang diminta pengguna, dengan tetap mempertahankan keputusan final dan batasan di atas.

## 12. Progres fase 1 setelah handoff

- Workspace proyek dibuat di `C:\Users\MyPC\Documents\Proyek_Sprinkler_CCTV`.
- Git repository lokal dibuat pada branch `main`; belum ada commit karena artefak masih menunggu review.
- Dokumen pradesain sistem dibuat di `docs\01-pradesain-sistem.md`.
- Protokol uji pendahuluan dibuat di `docs\02-protokol-uji-pendahuluan.md`.
- Kontrak telemetry dibuat di `schemas\telemetry_record.schema.json`.
- Kebijakan kontrol kandidat dibuat di `config\control_policy.example.json`; belum untuk produksi.
- Validator telemetry dan lima unit test dibuat di `scripts\validate_telemetry.py` dan `tests\test_validate_telemetry.py`.
- Smoke test valid menghasilkan `VALID: 1 telemetry record(s)`.
- Unit test lulus: 5 test.
- Belum ada video, dataset, anotasi, pemasangan fisik, atau hasil akurasi model.

## 13. Gate berikutnya

Sebelum menulis pipeline computer vision produksi atau mengisi ambang kontrol final, selesaikan survei fisik kamera, peta zona, pemilihan sensor, dan review keselamatan wiring. Setelah itu, masukkan satu sesi uji nyata yang telah diberi `session_id` dan validasi telemetry.

