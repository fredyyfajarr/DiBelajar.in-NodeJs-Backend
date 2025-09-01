import multer from 'multer';
import path from 'path';

// --- KONFIGURASI UNTUK THUMBNAIL KURSUS (YANG SUDAH ADA) ---
const storageThumbnails = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/thumbnails/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilterImages = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: File type not allowed! Only JPEG, JPG, and PNG are allowed.');
};

export const uploadThumbnail = multer({
  storage: storageThumbnails,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilterImages,
});

// --- KONFIGURASI BARU UNTUK SUBMISSION TUGAS ---
const storageAssignments = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/assignments/');
  },
  filename: function (req, file, cb) {
    // Kita gunakan nama user dan nama file asli agar lebih mudah diidentifikasi
    const userSlug = req.user.slug || 'user';
    const uniqueSuffix = Date.now();
    cb(null, `${userSlug}-${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilterAssignments = (req, file, cb) => {
  // Izinkan tipe file yang umum untuk dokumen
  const allowedTypes = /pdf|doc|docx|txt|zip|rar/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype || extname) {
    // Cukup salah satu cocok
    return cb(null, true);
  }
  cb(
    'Error: File type not allowed! Only PDF, DOC, DOCX, TXT, ZIP, RAR are allowed.'
  );
};

export const uploadAssignment = multer({
  storage: storageAssignments,
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas lebih besar, misal 10MB
  fileFilter: fileFilterAssignments,
});
