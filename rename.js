// rename.js (Versi ES Module)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // <-- Import modul yang dibutuhkan

// --- Cara modern untuk mendapatkan __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- ---

function renameFoldersRecursive(directory) {
  // Cek apakah direktori ada dan bisa diakses
  if (!fs.existsSync(directory)) {
    console.warn(`Direktori tidak ditemukan: ${directory}`);
    return;
  }

  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    // Hindari memproses folder node_modules
    if (item === 'node_modules' || item === '.git') {
      return;
    }

    const oldPath = path.join(directory, item);

    // Gunakan try-catch untuk menangani error izin akses
    try {
      const stat = fs.statSync(oldPath);

      if (stat.isDirectory()) {
        const newItem = item.toLowerCase();

        if (item !== newItem) {
          const newPath = path.join(directory, newItem);
          console.log(`Mengubah nama: ${oldPath} -> ${newPath}`);
          fs.renameSync(oldPath, newPath);
          renameFoldersRecursive(newPath);
        } else {
          renameFoldersRecursive(oldPath);
        }
      }
    } catch (err) {
      console.error(`Gagal mengakses ${oldPath}: ${err.message}`);
    }
  });
}

console.log('Memulai proses mengubah nama folder menjadi huruf kecil...');
// Mulai dari folder backend dan frontend
const backendPath = path.join(__dirname, 'backend');
const frontendPath = path.join(__dirname, 'frontend');

renameFoldersRecursive(backendPath);
renameFoldersRecursive(frontendPath);

console.log('Selesai!');
