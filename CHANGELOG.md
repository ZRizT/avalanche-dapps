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

### Day 2 Task Completion Results
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