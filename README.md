# DiBelajar.in - REST API

Ini adalah backend REST API untuk platform Learning Management System (LMS) **DiBelajar.in**. Dibangun menggunakan Node.js, Express, dan MongoDB dengan fokus pada keamanan, skalabilitas, dan praktik arsitektur modern.

---

## ✨ Fitur

### Arsitektur & Performa
- **Arsitektur Berlapis**: Pemisahan tanggung jawab yang jelas antara `Router`, `Middleware`, `Controller`, `Service`, dan `Model`.
- **Entity-Loading Middleware**: Pola `loadCourse`, `loadMaterial`, dan `loadUser` untuk mengurangi query database yang berulang, menyederhanakan controller, dan membersihkan kode.
- **Advanced Results**: Middleware tunggal yang kuat untuk menangani **Pagination**, **Filtering**, dan **Sorting** secara konsisten di semua endpoint daftar.
- **Cascading Deletes**: Menjaga integritas data dengan menghapus semua data turunan (materi, pendaftaran, dll.) saat entitas induk (kursus, pengguna) dihapus, menggunakan transaksi Mongoose.

### Keamanan (Hardening)
- **Autentikasi & Otorisasi Lengkap**:
  - Sistem **Login**, **Register**, dan **Logout** berbasis **JWT (JSON Web Tokens)**.
  - **Otorisasi Berbasis Peran** (`admin`, `instructor`, `student`).
  - **Otorisasi Berbasis Kepemilikan** (pengguna hanya bisa mengubah datanya sendiri).
  - **Otorisasi Kondisional** (hanya siswa yang terdaftar yang bisa mengakses materi kursus).
- **Fitur Lupa & Reset Password**: Alur yang aman menggunakan token sekali pakai yang di-hash dan dikirim melalui email.
- **Perlindungan Terhadap Serangan Umum**:
  - **Rate Limiting** untuk mencegah serangan brute-force dan DoS.
  - **Security Headers** otomatis menggunakan **Helmet**.
  - **CORS** untuk interaksi yang aman dengan frontend.
  - Perlindungan dari **HTTP Parameter Pollution** menggunakan `hpp`.

### Fungsionalitas Inti LMS
- **Manajemen Pengguna**: CRUD (Create, Read, Update, Delete) penuh untuk manajemen pengguna.
- **Manajemen Kursus & Materi**: Instruktur dan Admin dapat mengelola kursus dan materinya.
- **Sistem Pendaftaran (Enrollment)**: Siswa dapat mendaftar (enroll) dan membatalkan pendaftaran (un-enroll) dari kursus.
- **File Uploads**: Penanganan unggahan file sungguhan menggunakan **Multer** untuk *thumbnail* kursus dan *submission* tugas.
- **Fitur Interaktif**: Endpoint untuk *submission* tugas, hasil tes, dan forum diskusi per materi.

### Development & Produksi
- **Logging Terstruktur**: Menggunakan **Winston** untuk mencatat jejak audit dan error ke file, dengan format yang berbeda untuk development dan produksi.
- **Manajemen Environment Variable**: Konfigurasi yang aman dan terpisah untuk development dan produksi menggunakan `dotenv`.
- **HTTP Request Logging**: Menggunakan **morgan** untuk logging request yang informatif selama development.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Autentikasi**: JSON Web Token (JWT), bcrypt.js
- **File Uploads**: Multer
- **Email**: Nodemailer
- **Validasi**: Joi
- **Keamanan & Middleware**: Helmet, express-rate-limit, hpp, cors, compression
- **Logging**: Winston, morgan (dev)
- **Lainnya**: dotenv, nodemon

---

## 🚀 Instalasi & Setup Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### **Prasyarat**
- Node.js (v16 atau lebih tinggi)
- npm / yarn
- MongoDB (lokal atau URI dari MongoDB Atlas)
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

3.  **Buat folder untuk file upload:**
    Di dalam folder root proyek, buat struktur folder berikut secara manual:
    ```
    public/
    └── uploads/
        ├── assignments/
        └── thumbnails/
    ```

4.  **Buat file `.env`:**
    Buat file bernama `.env` di folder root dan isi dengan konfigurasi Anda. Gunakan template di bawah ini.

    ```env
    # --- Konfigurasi Umum ---
    NODE_ENV=development
    PORT=5000

    # --- Database ---
    MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/database_name"

    # --- Autentikasi ---
    JWT_SECRET="kunci_rahasia_anda_yang_sangat_panjang_dan_aman"

    # --- Konfigurasi Email (gunakan kredensial Mailtrap untuk development) ---
    EMAIL_HOST="smtp.mailtrap.io"
    EMAIL_PORT=2525
    EMAIL_USERNAME="your_mailtrap_username"
    EMAIL_PASSWORD="your_mailtrap_password"
    EMAIL_FROM="DiBelajar.in <noreply@dibelajarin.in>"
    ```

5.  **Jalankan server:**
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

Berikut adalah beberapa *endpoint* utama. Untuk detail lengkap, silakan impor koleksi Postman yang tersedia.

| Aksi | Metode | Endpoint | Akses |
| :--- | :--- | :--- | :--- |
| Registrasi User | `POST` | `/api/auth/register`| Publik |
| Login User | `POST`| `/api/auth/login` | Publik |
| Lupa Password | `POST`| `/api/auth/forgot-password` | Publik |
| Melihat Semua Kursus | `GET` | `/api/courses` | Publik |
| Membuat Kursus | `POST` | `/api/courses` | Admin, Instructor |
| Mendaftar ke Kursus | `POST`| `/api/courses/:id/enroll` | Login (Semua Peran) |
| Mengedit Profil Sendiri| `PUT` | `/api/users/:myId` | Pemilik Akun |
| Menghapus User Lain | `DELETE`| `/api/users/:userId`| Admin |
| Melihat Materi Kursus | `GET` | `/api/courses/:id/materials` | Terdaftar di Kursus |
| Submit Tugas | `POST` | `/api/courses/:id/materials/:id/assignments` | Student (Terdaftar) |
