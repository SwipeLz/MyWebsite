# Smart Dairy Farming

Sistem pendinginan otomatis berbasis THI dan CCTV untuk menurunkan indikator heat stress pada sapi Friesian Holstein.

## Language

### Lingkungan

**THI**:
Indeks risiko lingkungan dari suhu dan kelembapan, bukan ukuran stres tiap sapi.
_Avoid_: stres sapi, suhu kandang

### Perilaku

**Standing Ratio**:
Proporsi sapi berdiri di antara sapi yang terlihat dan dapat dinilai.
_Avoid_: standing index, persen berdiri dari total

**Lying Ratio**:
Proporsi sapi berbaring di antara sapi yang terlihat dan dapat dinilai.
_Avoid_: lying index

**Occluded**:
Status sapi yang tidak dapat dinilai karena tertutup sapi lain atau di luar frame, dan di-exclude dari pembagi ratio.
_Avoid_: unknown

**Zona Kandang**:
Lima area kanonis: kipas, lorong, sisi terbuka, area pakan, area minum.
_Avoid_: sektor, region

**Heavy Breathing**:
Klasifikasi napas berat dari CCTV, bukan pengukuran respiration rate presisi; hanya valid jika kamera miring melihat dada atau flank.
_Avoid_: panting rate, respiration rate

### Kontrol

**Siklus Pendinginan**:
Semprot intermiten 1,5 menit diikuti kipas pengeringan 5 sampai 8 menit.
_Avoid_: penyemprotan, shower

**Hysteresis dan Cooldown**:
Jeda wajib setelah indikator membaik sebelum siklus baru boleh aktif.
_Avoid_: delay, jeda semprot
