# Backend Proyek LMS "DiBelajar.in"

Ini adalah bagian backend dari aplikasi Learning Management System (LMS) "DiBelajar.in". Dibangun dengan stack MERN (MongoDB, Express.js, React, Node.js), backend ini berfungsi sebagai REST API yang menangani semua logika bisnis, manajemen data, dan otentikasi pengguna.

---

### ✨ Fitur Utama

* 🔐 **Otentikasi & Otorisasi**: Sistem login, register, dan lupa password berbasis JWT dengan role-based access control (Admin, Instruktur, Student).
* 📚 **Manajemen Kursus**: Operasi CRUD (Create, Read, Update, Delete) penuh untuk kursus dan materi pembelajaran.
* 👥 **Manajemen Pengguna**: Admin dapat mengelola semua pengguna di dalam sistem.
* 📂 **Upload File**: Menangani upload file untuk *thumbnail* kursus dan pengumpulan tugas mahasiswa menggunakan Multer.
* 📝 **Fitur Interaktif**: Logika untuk pendaftaran kursus (*enrollment*), penyimpanan hasil tes, dan sistem forum diskusi berantai (*threaded*).
* 📊 **Statistik**: Endpoint khusus untuk admin guna menampilkan statistik dasbor (total pengguna, kursus, dll).
* 🔍 **Pencarian & Filter**: Middleware kustom untuk menangani pencarian, paginasi, dan filter data di berbagai *endpoint*.
* 🛡️ **Keamanan**: Validasi input menggunakan Joi dan penanganan error yang terpusat.

---

### 💻 Teknologi yang Digunakan

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB dengan Mongoose ODM
* **Otentikasi**: JSON Web Token (JWT), Bcrypt
* **Validasi**: Joi
* **Upload File**: Multer
* **Lainnya**: `dotenv`, `winston` (untuk logging), `nodemailer` (untuk email)

---

### 🚀 Instalasi dan Setup

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/NAMA_USER_ANDA/proyek-lms-backend.git](https://github.com/NAMA_USER_ANDA/proyek-lms-backend.git)
    cd proyek-lms-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`** di dalam folder root `backend`. Salin konten dari `.env.example` di bawah dan sesuaikan nilainya.

    ```env
    # Port Server
    PORT=3000

    # Koneksi MongoDB
    MONGODB_URI=mongodb://localhost:27017/lms_db

    # JSON Web Token
    JWT_SECRET=rahasia-jwt-anda-yang-sangat-panjang

    # Konfigurasi Nodemailer (contoh menggunakan Mailtrap)
    EMAIL_HOST=smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USERNAME=username_mailtrap
    EMAIL_PASSWORD=password_mailtrap
    EMAIL_FROM=noreply@dibelajar.in
    ```

4.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

---

###  API Endpoints Utama

* `/api/auth`: Rute untuk registrasi, login, logout, dan lupa password.
* `/api/users`: Rute untuk manajemen pengguna (CRUD oleh Admin).
* `/api/courses`: Rute untuk manajemen kursus dan materi.
* `/api/enrollments`: Rute untuk manajemen pendaftaran kursus.
* `/api/stats`: Rute untuk statistik dasbor admin.
