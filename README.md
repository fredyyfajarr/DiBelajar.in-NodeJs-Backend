# DiBelajar.in - REST API

Ini adalah backend REST API untuk platform Learning Management System (LMS) **DiBelajar.in**. Dibangun menggunakan Node.js, Express, dan MongoDB dengan fokus pada keamanan, skalabilitas, dan praktik pengembangan modern.

---

## ✨ Fitur Utama

- **Sistem Autentikasi & Otorisasi Lengkap**:
  - Registrasi, Login, dan Logout menggunakan **JWT (JSON Web Tokens)**.
  - Otorisasi berbasis **Peran** (`admin`, `instructor`, `student`).
  - Otorisasi berbasis **Kepemilikan** (pengguna hanya bisa mengubah datanya sendiri).
  - Otorisasi berbasis **Kondisi** (hanya siswa yang terdaftar yang bisa mengakses materi kursus).

- **Arsitektur Efisien & Rapi**:
  - Menggunakan pola **Entity-Loading Middleware** untuk mengurangi query database yang berulang dan menyederhanakan *controller*.
  - Pemisahan tanggung jawab yang jelas antara **Router, Middleware, Controller, dan Service**.

- **Manajemen Fitur LMS**:
  - CRUD (Create, Read, Update, Delete) penuh untuk Pengguna, Kursus, dan Materi.
  - Sistem Pendaftaran (Enrollment) siswa ke kursus.
  - Fitur interaktif: *Submission* Tugas, Hasil Tes, dan Forum Diskusi per materi.

- **Lapisan Keamanan (Hardening) Lengkap**:
  - Validasi Input di setiap *endpoint* yang relevan menggunakan **Joi**.
  - **Rate Limiting** untuk melindungi dari serangan brute-force dan DoS.
  - **Security Headers** otomatis menggunakan **Helmet** untuk melindungi dari serangan web umum (XSS, clickjacking, dll.).
  - Perlindungan dari **HTTP Parameter Pollution** menggunakan **hpp**.
  - Konfigurasi **CORS** untuk interaksi yang aman dengan frontend.

- **Development & Produksi**:
  - **Logging Terstruktur** menggunakan **Winston** untuk jejak audit dan *debugging* yang andal.
  - Manajemen *environment variable* yang aman menggunakan **dotenv**.
  - HTTP Request Logging saat development menggunakan **morgan**.
  - Kompresi respons otomatis dengan **compression** untuk performa lebih baik.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Autentikasi**: JSON Web Token (JWT), bcrypt.js
- **Validasi**: Joi
- **Keamanan & Middleware**: Helmet, express-rate-limit, hpp, cors, compression
- **Logging**: Winston, morgan (dev)
- **Lainnya**: dotenv, nodemon

---

## 🚀 Instalasi & Setup Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### **Prasyarat**
- Node.js (v16 atau lebih tinggi)
- npm
- MongoDB (bisa lokal atau menggunakan URI dari MongoDB Atlas)
- Postman

### **Langkah-langkah**

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/URL_REPO_ANDA/dibelajarin-api.git](https://github.com/URL_REPO_ANDA/dibelajarin-api.git)
    cd dibelajarin-api
    ```

2.  **Install semua dependensi:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Buat file bernama `.env` di folder root dan gunakan template di bawah ini.

    ```env
    # Port server akan berjalan (contoh: 5000)
    PORT=5000
    
    # Lingkungan aplikasi (development atau production)
    NODE_ENV=development

    # Connection String untuk database MongoDB Anda
    MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/database_name"

    # Kunci rahasia untuk menandatangani JWT
    JWT_SECRET="kunci_rahasia_anda_yang_sangat_panjang_dan_aman"
    ```

4.  **Jalankan server:**
    * Untuk mode development dengan auto-reload (menggunakan nodemon):
      ```bash
      npm run dev
      ```
    * Untuk mode produksi:
      ```bash
      npm start
      ```
    Server akan berjalan di `http://localhost:5000` (atau port yang Anda tentukan).

---

## 📚 Ringkasan API Endpoints

Berikut adalah beberapa contoh *endpoint* utama. Untuk detail lengkap, silakan lihat dokumentasi Postman.

| Aksi | Metode | Endpoint | Akses |
| :--- | :--- | :--- | :--- |
| Registrasi User | `POST` | `/api/auth/register`| Publik |
| Login User | `POST`| `/api/auth/login` | Publik |
| Logout User | `POST`| `/api/auth/logout` | Publik |
| Melihat Semua Kursus | `GET` | `/api/courses` | Publik |
| Membuat Kursus | `POST` | `/api/courses` | Admin, Instructor |
| Mengedit Profil Sendiri| `PUT` | `/api/users/:myId` | Pemilik Akun |
| Menghapus User Lain | `DELETE`| `/api/users/:userId`| Admin |
| Melihat Materi Kursus | `GET` | `/api/courses/:id/materials` | Terdaftar di Kursus |
