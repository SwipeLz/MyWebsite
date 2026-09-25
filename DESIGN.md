# Design

Dunia visual: Jendela-Y2K. Instrumen kandang berbalut krom OS awal 2000-an — bilah judul bergradasi, bevel outset, digit piksel — di atas dasar es terang yang dipaksa oleh pemakaian nyata: operator membaca ponsel di kandang siang hari.

## Token

- Ground: `#d7e3f4` → `#bccde6` (gradasi desktop). Surface: `#ffffff`. Ink: `#101e33`; ink-soft `#33475f`.
- Aksen Y2K: aqua `#0097b9`; bilah judul `#006e8c` → `#004e6b` (teks putih, lolos AA).
- Status fungsional: aman `#166534`/`#dcfce7`, peringatan `#92400e`/`#fef3c7`, intervensi `#b91c1c`/`#fee2e2`.
- Zona (bahasa warna tetap): kipas `#0097b9`, lorong `#64748b`, terbuka `#4d7c0f`, pakan `#b45309`, minum `#1d4ed8`.
- Radius 10px; bevel outset 2px; bayangan offset + blur lembut (tanpa halo, tanpa block-shadow).

## Tipografi

- Display/data: Silkscreen (piksel, Google Fonts) untuk angka, label zona, log — suara data, bukan kostum.
- Tubuh: Tahoma, Segoe UI, Verdana. Ukuran fungsional ≥12px; judul seimbang tanpa kicker/eyebrow.

## Komponen

- Taskbar: gradasi terang + nav; halaman aktif berupa sel terbalik (ink solid).
- Window: titlebar gradasi + tiga dot kaca; winbody 20px (14px mobile).
- Loadbar THI: bilah muat tersegmentasi hijau → amber → merah dengan tick 60/68/72/78/85.
- Badge status berbentuk pil; tombol bevel outset (primary = gradasi titlebar).
- Flow rantai keputusan: baris kartu lembut, nomor piksel di sel ink.

## Gerak

Satu momen: kedip-CRT 450ms sekali pada window hero saat muat; nonaktif bila `prefers-reduced-motion`.

## Aturan keras

- Mock selalu berlabel SYNTHETIC; klaim live dilarang.
- Heavy breathing tidak digrafikkan (klasifikasi manual saja).
- Tanpa teks gradasi, tanpa border-left aksen, tanpa kartu ikon-seragam, ikon selalu SVG satu goresan.
