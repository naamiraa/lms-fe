# Frontend — Fleet Safety LMS

Frontend Fleet Safety LMS digunakan oleh peserta, instructor, dan admin untuk mengakses pelatihan Fleet Safety Simulator.

Aplikasi menampilkan materi, assessment, status sesi simulator, hasil evaluasi, feedback, riwayat, dan sertifikat. Data diambil melalui REST API [backend](https://github.com/naamiraa/lms-be).

## Tech Stack

| Teknologi | Versi | Kegunaan |
| --- | --- | --- |
| Next.js | 16.3.3 | Routing, layout, dan build aplikasi |
| React dan React DOM | 19.2.8 | Komponen dan interaksi halaman |
| TypeScript | ^5 | Tipe data, props, dan kontrak API |
| Tailwind CSS | ^4 | Styling dan tampilan responsive |
| Tailwind PostCSS | ^4 | Pemrosesan CSS |
| ESLint / eslint-config-next | ^9 / 16.3.3 | Pemeriksaan kode |
| Fetch API | Bawaan browser | Request API dan download PDF |
| Web Storage | Bawaan browser | Penyimpanan login dan sesi sementara |
| next/font | Geist dan Geist Mono | Font aplikasi |

State halaman dikelola menggunakan hook React seperti `useState` dan `useEffect`. Pemanggilan API menggunakan wrapper Fetch sendiri.

## Struktur Project

| Folder / File | Isi |
| --- | --- |
| `src/app` | Route, page, layout, dan CSS global |
| `src/features` | Tampilan dan interaksi setiap fitur, dibagi berdasarkan role |
| `src/components/layout` | Bingkai halaman: AppShell, Header, Sidebar, dan AuthLayout |
| `src/components/ui` | Elemen dasar seperti Button, Input, dan Icon |
| `src/components/shared` | Komponen bersama seperti GlassCard, modal, tabel, player, dan indikator progres |
| `src/services` | Fungsi pemanggilan endpoint backend |
| `src/types` | Tipe request dan response API |
| `src/lib` | Helper autentikasi, navigasi, dan gambar pelatihan |
| `public` | Logo, gambar, dan aset statis |
| `next.config.ts` | Konfigurasi Next.js |
| `tsconfig.json` | Konfigurasi TypeScript dan alias import |
| `eslint.config.mjs` | Konfigurasi lint |
| `postcss.config.mjs` | Konfigurasi Tailwind/PostCSS |
| `package.json` | Dependency dan script |

Alias `@/` menunjuk ke folder `src`.

Folder dalam tanda kurung adalah route group dan tidak muncul di URL. Contohnya, `app/(participant)/learning/page.tsx` menghasilkan route `/learning`.

Folder seperti `[moduleId]` digunakan untuk halaman berdasarkan ID.

## Alur Data

**Page → Feature View → Service → Backend API → State → Tampilan**

Page membuka View dari folder `features`. View memanggil service untuk membaca atau mengubah data, lalu memperbarui tampilan berdasarkan hasil request.

Service JSON menggunakan `apiFetch`, yang menangani:

- Base URL backend.
- Header JSON.
- Bearer token dari penyimpanan login.
- Pesan error dari API.
- Response kosong seperti status 204.

TypeScript membantu memeriksa bentuk data saat pengembangan. Response API belum divalidasi menggunakan schema runtime.

## Komponen dan Tampilan

Warna utama aplikasi adalah **#006CB8**. Efek glass dibuat melalui CSS menggunakan background transparan, border, shadow, dan `backdrop-filter`.

Komponen yang digunakan di beberapa halaman:

| Komponen | Fungsi |
| --- | --- |
| `GlassCard` | Panel dengan tampilan glass |
| `PageHeader` | Judul dan keterangan halaman |
| `MetricCard` | Ringkasan angka |
| `ProgressBar` | Progres pembelajaran |
| `StatusBadge` | Label status |
| `ModalFrame` | Bingkai dialog dan form |
| `LearningMedia` | Video, dokumen, dan tautan materi |
| `ScoreGauge` | Tampilan skor |
| `AdminWorkflow` | Petunjuk pengelolaan data admin |

Gambar simulator berada di `public/images/simulator`. Logo Pertamina dipanggil melalui komponen `Brand`.

Aset di folder `public` diakses tanpa menyertakan kata `public`. Contohnya:

```text
/images/pertamina-logo.png
```

## Route Utama

| Role | Route | Kegunaan |
| --- | --- | --- |
| Publik | `/login`, `/register` | Login dan registrasi |
| Participant | `/dashboard` | Ringkasan pelatihan |
| Participant | `/learning` | Daftar modul |
| Participant | `/learning/[moduleId]` | Materi dan progres modul |
| Participant | `/assessment` | Assessment terkait modul |
| Participant | `/assessment/attempts/[attemptId]` | Pengerjaan soal |
| Participant | `/simulation` | Pilihan skenario dan status sesi |
| Participant | `/performance`, `/feedback` | Hasil dan feedback |
| Participant | `/history`, `/certificates` | Riwayat dan sertifikat |
| Admin | `/admin/dashboard`, `/admin/users` | Dashboard dan pengguna |
| Admin | `/admin/learning`, `/admin/assessments`, `/admin/simulations` | Pengelolaan pelatihan |
| Admin | `/admin/analytics` | Analytics |
| Instructor | `/instructor/dashboard` | Dashboard instructor |
| Instructor | `/instructor/participants`, `/instructor/sessions` | Peserta dan sesi |
| Instructor | `/instructor/feedback` | Pemberian feedback |

Beberapa halaman detail dibuka melalui link dari sesi pelatihan dan membutuhkan `sessionId`. Halaman tersebut tidak selalu ditampilkan sebagai menu navigasi.

## Login dan Akses

Registrasi mengirim data pengguna ke backend. Akun baru menunggu persetujuan admin.

Setelah login, token dan identitas pengguna disimpan melalui `saveAuth`:

- `lms_token`: token login.
- `lms_user`: identitas dan role pengguna.

Jika pengguna memiliki beberapa role, dashboard dipilih dengan prioritas `ADMIN`, kemudian `INSTRUCTOR`, lalu `PARTICIPANT`.

`RoleGuard` mengatur akses halaman di client. Pengguna tanpa data login diarahkan ke `/login`; pengguna dengan role yang tidak sesuai diarahkan ke dashboardnya.

Validasi token dan izin API tetap dilakukan backend. Wrapper API belum menyediakan refresh token atau redirect otomatis ketika menerima status 401.

Logout menghapus data login melalui `clearAuth`.

## Alur Pelatihan

### Participant

1. Memilih domain dan modul pembelajaran.
2. Membaca materi atau menonton video, lalu menandainya selesai.
3. Membuka assessment yang terhubung ke modul.
4. Menjawab soal; setiap pilihan disimpan melalui API.
5. Submit assessment dan melanjutkan ke simulator.
6. Memilih domain serta skenario untuk membuat sesi latihan.
7. Menjalankan latihan pada aplikasi simulator.
8. Membuka hasil evaluasi, feedback, riwayat, dan sertifikat yang tersedia.

Progress ditampilkan dari data backend. Pada implementasi backend saat ini, assessment belum mensyaratkan progress learning 100%. Pembuatan sesi simulator membutuhkan assessment selesai, tetapi belum memeriksa kelulusan skor teori.

### Admin

Admin mengelola approval dan role pengguna, domain pembelajaran, modul, materi, assessment, soal, serta domain dan skenario simulator.

Hubungan data yang dipakai:

- Training Domain → Learning Module → Learning Content.
- Learning Module → Assessment → Question dan pilihan jawaban.
- Simulation Domain → Simulation Scenario.

### Instructor

Instructor memilih sesi peserta, membaca hasil dan pelanggaran, lalu memberikan feedback serta rekomendasi perbaikan.

## Integrasi Simulator

Frontend membuat sesi melalui `/api/simulation-sessions` menggunakan `assessmentAttemptId` dan `simulationScenarioId`.

Informasi sesi disimpan sementara pada `sessionStorage`. Frontend memeriksa status setiap lima detik dan menampilkan `READY`, `IN_PROGRESS`, atau `COMPLETED`.

Simulator berjalan di luar aplikasi web. Start dan hasil latihan dikirim ke backend melalui endpoint integrasi yang saat ini membutuhkan role `ADMIN`.

Setelah sesi selesai, peserta membuka `/performance?sessionId=...` untuk melihat hasilnya.

## Materi dan Download

Video MP4/WebM menggunakan player HTML5. YouTube, Vimeo, dan Google Drive menggunakan iframe. PDF materi juga dapat ditampilkan melalui iframe.

Materi `TEXT` dibaca dari deskripsi dan tidak membutuhkan URL video.

Untuk file pada `public/videos/lesson.mp4`, isi Content URL dengan:

```text
/videos/lesson.mp4
```

Jika file berada di backend, gunakan URL backend lengkap.

Sertifikat PDF dibuat di backend menggunakan QuestPDF. Frontend mengambil file dengan Fetch API, membacanya sebagai Blob, lalu membuat link download sementara. Setelah download dipicu, object URL dilepaskan.

Frontend tidak memakai jsPDF atau file-saver untuk download sertifikat.

## Menjalankan Project

Siapkan Node.js minimal 20.9, npm, serta backend dan database yang sudah berjalan.

Dari root frontend, buat `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5216
```

Gunakan alamat backend tanpa tambahan `/api` dan tanpa slash akhir. Service sudah menambahkan path endpoint.

Jika backend memakai profil HTTPS, gunakan:

```dotenv
NEXT_PUBLIC_API_URL=https://localhost:7041
```

Pastikan sertifikat HTTPS lokal sudah dipercaya.

Dari folder `fe`, jalankan:

```powershell
npm ci
npm run dev
```

Buka http://localhost:3000.

`npm ci` menggunakan `package-lock.json`. Jika lockfile belum tersedia, gunakan `npm install`.

Restart development server setelah mengubah `.env.local`. CORS backend saat ini mengizinkan `http://localhost:3000`; sesuaikan jika origin frontend berubah.

Variabel `NEXT_PUBLIC_*` dapat diakses browser, sehingga tidak digunakan untuk menyimpan secret.

## Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | Pemeriksaan ESLint |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build |

Untuk menjalankan build produksi:

```powershell
npm run build
npm run start
```

`NEXT_PUBLIC_API_URL` perlu tersedia saat build. Belum ada script automated test pada `package.json`.

## Menambahkan Fitur

1. Definisikan tipe request dan response di `types`.
2. Tambahkan fungsi API di `services`.
3. Buat View dan interaksi di `features`.
4. Hubungkan View melalui page di `app`.
5. Gunakan komponen bersama untuk tampilan yang berulang.

Menu tiap role diatur melalui `lib/navigation.ts`. Aturan bisnis dan otorisasi data tetap diterapkan di backend.

## Troubleshooting

| Masalah | Yang diperiksa |
| --- | --- |
| API URL belum dikonfigurasi | `.env.local`, nama variabel, lalu restart server |
| Request gagal atau CORS | Backend aktif, base URL benar, dan origin diizinkan |
| Login ditolak | Approval, status aktif akun, dan kredensial |
| Response 401 | Token tidak valid atau kedaluwarsa; login kembali |
| Response 403 | Role atau izin pengguna |
| Gambar tidak muncul | Posisi folder `public` dan URL gambar |
| Video 404 | Content URL dan keberadaan file |
| Simulator tetap READY | Endpoint start belum dipanggil |
| Sertifikat belum tersedia | Sesi, hasil, kelulusan, dan penerbitan di backend |