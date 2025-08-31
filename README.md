# DiBelajar.in - REST API

Ini adalah backend REST API untuk platform Learning Management System (LMS) **DiBelajar.in**. Dibangun menggunakan Node.js, Express, dan MongoDB dengan fokus pada keamanan, skalabilitas, dan praktik pengembangan modern.

---

## ✨ Fitur Utama

- **Autentikasi & Otorisasi**: Sistem login dan registrasi yang aman menggunakan JWT (JSON Web Tokens).
- **Berbasis Peran (Role-Based Access Control)**: Tiga level pengguna (`student`, `instructor`, `admin`) dengan hak akses yang berbeda untuk setiap *endpoint*.
- **Manajemen Pengguna**: Operasi CRUD (Create, Read, Update, Delete) penuh untuk manajemen pengguna oleh Admin.
- **Manajemen Kursus & Materi**: Instruktur dan Admin dapat membuat, mengedit, dan mengelola kursus beserta materi di dalamnya.
- **Sistem Pendaftaran (Enrollment)**: Siswa dapat mendaftar ke kursus, dan akses ke materi kursus diproteksi hanya untuk siswa yang terdaftar.
- **Fitur Interaktif**: Endpoint untuk *submission* tugas, hasil tes, dan forum diskusi per materi.
- **Keamanan (Hardening)**: Dilengkapi dengan berbagai lapisan keamanan seperti validasi input, rate limiting, security headers (Helmet), dan sanitasi data untuk mencegah serangan umum (XSS, NoSQL Injection).
- **Logging**: Logging terstruktur menggunakan Winston untuk memonitor aktivitas dan error.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Autentikasi**: JSON Web Token (JWT)
- **Validasi**: Joi
- **Keamanan**: bcrypt.js, Helmet, express-rate-limit, express-mongo-sanitize, xss-clean
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
    Buat file bernama `.env` di folder root dan salin konten dari `.env.example` (jika ada) atau gunakan template di bawah ini.

    ```env
    # Port server akan berjalan
    PORT=5000

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
    Server akan berjalan di `http://localhost:5000`.

---

## 📚 Ringkasan API Endpoints

Berikut adalah beberapa contoh *endpoint* utama. Untuk detail lengkap, silakan lihat dokumentasi Postman.

| Aksi | Metode | Endpoint | Akses |
| :--- | :--- | :--- | :--- |
| Registrasi User | `POST` | `/api/auth/register`| Publik |
| Login User | `POST`| `/api/auth/login` | Publik |
| Melihat Semua Kursus | `GET` | `/api/courses` | Publik |
| Membuat Kursus | `POST` | `/api/courses` | Admin, Instructor |
| Melihat Semua User | `GET` | `/api/users` | Admin |
| Melihat Materi Kursus | `GET` | `/api/courses/:id/materials` | Terdaftar, Admin, Instructor |
