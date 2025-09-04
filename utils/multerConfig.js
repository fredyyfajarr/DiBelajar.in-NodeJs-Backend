import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Konfigurasi Cloudinary dengan kredensial dari .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi penyimpanan untuk THUMBNAIL KURSUS di Cloudinary
const storageThumbnails = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dibelajarin/thumbnails',
    allowed_formats: ['jpeg', 'jpg', 'png'],
    transformation: [{ width: 600, height: 400, crop: 'limit' }],
  },
});

// --- PERBAIKAN DI SINI ---
// Konfigurasi penyimpanan untuk TUGAS SISWA di Cloudinary
const storageAssignments = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dibelajarin/assignments',
    // Secara eksplisit izinkan format file yang umum untuk tugas
    allowed_formats: ['zip', 'pdf', 'doc', 'docx', 'txt', 'rar'],
  },
});
// --- AKHIR PERBAIKAN ---

export const uploadThumbnail = multer({ storage: storageThumbnails });
export const uploadAssignment = multer({ storage: storageAssignments });
