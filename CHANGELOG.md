# Changelog & Status Report - Day1 & 2

**Date:** 2026-01-16 01:20 AM
**Author:** Rizki Ramadani (241011400098)
**Status:** Day 1 (Completed) | Day 2 (Late Submission due to Technical Issues)

## ✅ Day 1: Setup & Foundations
Status: **SUCCESS** without issues.
* Instalasi Node.js, Yarn, dan inisialisasi project Hardhat berjalan lancar.

---

## ⚠️ Day 2: Smart Contract & Integration
**Note:** Submission ini dikumpulkan terlambat karena proses debugging mendalam terkait konfigurasi environment.

### Major Technical Obstacles
Selama pengerjaan Day 2, terjadi kendala teknis yang memakan waktu cukup lama untuk di-debug:

#### 1. Konflik Dependency (Yarn, Hardhat, Viem vs Ethers)
* **Masalah:** Terjadi *dependency hell* di mana project menolak berjalan karena konflik antara mode **ESM** (`type: module`) yang diminta oleh Hardhat v3 dengan mode **CommonJS** yang digunakan oleh Hardhat v2 (standar instruktur).
* **Gejala:** Error berulang `Hardhat only supports ESM projects` dan `Error HHE15 (Invalid Config)` saat menjalankan script interact maupun compile.
* **Penyebab Utama:** Saya melakukan instalasi `hardhat` di level **Root Directory** dengan niat awal untuk **fleksibilitas** (agar tool bisa diakses dari workspace mana saja). Ternyata, hal ini menyebabkan workspace `apps/contracts` "mewarisi" Hardhat v3 dari root yang tidak kompatibel dengan kode instruktur (Hardhat v2).
* **Solusi:**
    * Membersihkan dependency Hardhat dari Root level.
    * Melakukan *downgrade* spesifik di `apps/contracts` ke Hardhat v2 (`^2.22.0`).
    * Menyesuaikan `tsconfig.json` kembali ke `commonjs` dan `moduleResolution: node`.

#### 2. Miskonsepsi Kompatibilitas Linux
* Awalnya saya menduga banyak modul Node.js/Hardhat tidak kompatibel dengan environment Linux (Arch Linux) saya karena banyaknya error `file not found` dan `module resolution`.
* **Koreksi:** Setelah debugging, isu tersebut murni kesalahan konfigurasi saya dalam menangani struktur **Monorepo/Workspaces** dan versi library, bukan masalah OS.

## Day 2 Task Completion Results
Meskipun terkendala waktu, seluruh *objective* tugas berhasil diselesaikan dan divalidasi:

1.  **Task 1 & 4 (Ownership & Custom State):**
    * Smart Contract `SimpleStorage.sol` berhasil dimodifikasi.
    * Mengubah tipe data utama dari `uint256` ke `string` untuk menyimpan **Nama & NIM**.
    * Menambahkan modifier `onlyOwner` dan fitur input ganda (Angka & Teks).

2.  **Task 2 (Event Validation):**
    * Event `MessageUpdated` berhasil terpancar (emit).
    * Validasi berhasil dicek melalui Snowtrace Explorer (Bukti SS terlampir).

3.  **Task 3 (Deploy & Interact):**
    * **Contract Address:** `0xb0ab403026f463972f9af3538f2b17faaacf081b`
    * Script `interact.ts` berhasil diperbarui menggunakan library **Viem** untuk interaksi Read/Write ke Fuji Testnet.

### Lampiran Day2:
<img width="937" height="478" alt="Screenshot_20260116_013833" src="https://github.com/user-attachments/assets/5d9c4077-07ee-455b-802b-4938d228bc04" />
<img width="937" height="793" alt="Screenshot_20260116_013852" src="https://github.com/user-attachments/assets/8a78cdd7-a2e0-4c97-b17f-6e91991ae21f" />
<img width="841" height="359" alt="Screenshot_20260116_013809" src="https://github.com/user-attachments/assets/80f4d0e6-7d86-445c-9ad2-b5bc8e6b7bf7" />

---

## 🎨 Day 3: Frontend Integration (Next.js + Wagmi)
Status: **COMPLETED**
* Inisialisasi project Next.js (App Router) di dalam monorepo `apps/frontend`.
* Integrasi **Wagmi & Viem** untuk koneksi wallet (Core/Injected).
* Implementasi **Read Contract** (mengambil data angka & string nama/NIM).
* Implementasi **Write Contract** (mengubah state blockchain).
* **UX Improvements:**
  * Menangani status Loading/Success transaksi.
  * Auto-refresh data setelah transaksi terkonfirmasi.
  * Tampilan UI Minimalis & Dark Mode.
  * Error handling jika user reject transaksi.

---

### Lampiran Day3:
<img width="1261" height="974" alt="Screenshot_20260116_230441" src="https://github.com/user-attachments/assets/6c86cad8-be1c-4756-82d7-2c506bcf7a9a" />
<img width="1261" height="974" alt="Screenshot_20260116_230126" src="https://github.com/user-attachments/assets/00b6c299-13c6-4078-a343-16b2473c6a90" />
<img width="1261" height="974" alt="Screenshot_20260116_230238" src="https://github.com/user-attachments/assets/c0bef80d-61ef-4fa0-aee1-558beef50607" />
<img width="1261" height="974" alt="Screenshot_20260116_230311" src="https://github.com/user-attachments/assets/16184f5e-5e1a-445e-9d10-811eae7721ab" />
<img width="1261" height="974" alt="Screenshot_20260116_230402" src="https://github.com/user-attachments/assets/64097fdd-de33-48bd-b2ee-b5bd522018a5" />


## Day 4: Backend API (NestJS + Viem)
Status: **COMPLETED**
* Inisialisasi project Backend dengan **NestJS**.
* Integrasi library **Viem** untuk membaca data dari Smart Contract.
* **API Endpoints:**
  * `GET /blockchain/value`: Membaca state angka (`uint256`).
  * `GET /blockchain/identity`: Membaca state teks (`string` - Nama/NIM).
  * `GET /blockchain/events`: Menampilkan history transaksi dengan formatting JSON yang rapi.
* **Improvements & Fixes:**
  * Mengatasi isu **RPC Timeout/Rate Limit** dengan berpindah ke `PublicNode` RPC.
  * Mengoptimalkan query `getLogs` dengan membatasi range blok (2000 blok terakhir) agar performa ringan.
  * Menambahkan **Swagger UI (OpenAPI)** untuk dokumentasi API yang interaktif.
