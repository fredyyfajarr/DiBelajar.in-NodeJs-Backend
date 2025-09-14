import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Course from '../models/Course.js';
import Material from '../models/Material.js';
import Enrollment from '../models/Enrollment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import TestResult from '../models/TestResult.js';
import ForumPost from '../models/ForumPost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const findAllCourses = async () => {
  try {
    const courses = await Course.find().populate('instructorId', 'name');
    return courses;
  } catch (error) {
    console.error('Error fetching all courses:', error);
    throw error;
  }
};

export const findCourseById = async (idOrSlug) => {
  try {
    let course;
    // Definisikan cara populate yang lebih sederhana dan aman
    const populateQuery = {
      path: 'instructorId',
      select: 'name email slug _id',
    };

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      course = await Course.findById(idOrSlug).populate(populateQuery);
    } else {
      course = await Course.findOne({ slug: idOrSlug }).populate(populateQuery);
    }
    return course;
  } catch (error) {
    console.error('Error fetching course by ID or slug:', error);
    throw error;
  }
};

export const createCourse = async (newCourseData) => {
  try {
    const newCourse = await Course.create(newCourseData);
    return newCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (courseToUpdate, updatedData) => {
  try {
    Object.assign(courseToUpdate, updatedData);
    const updatedCourse = await courseToUpdate.save();

    return updatedCourse;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const removeCourse = async (courseToDelete) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const courseId = courseToDelete._id;

    // --- LOGIKA BARU UNTUK HAPUS FILE ---
    // 4. Ambil URL thumbnail dari data kursus yang akan dihapus
    const thumbnailUrl = courseToDelete.thumbnail;

    // 5. Cek apakah thumbnail bukan gambar default
    if (thumbnailUrl && !thumbnailUrl.endsWith('default.png')) {
      // Ekstrak path relatif dari URL (misal: /public/uploads/thumbnails/file.png)
      const relativePath = new URL(thumbnailUrl).pathname;
      // Buat path absolut di filesystem server
      // path.join akan menangani separator ( / atau \ ) secara otomatis
      // '..' digunakan untuk naik satu level dari folder 'services' ke root proyek
      const absolutePath = path.join(__dirname, '..', relativePath);

      // 6. Hapus file menggunakan fs.unlink
      // Kita gunakan try-catch di sini untuk mencegah server crash jika file-nya tidak ada
      try {
        fs.unlinkSync(absolutePath);
        console.log(`Successfully deleted thumbnail: ${absolutePath}`);
      } catch (fileErr) {
        console.error(
          `Failed to delete thumbnail file, it might not exist: ${absolutePath}`,
          fileErr
        );
      }
    }
    // --- AKHIR LOGIKA BARU ---

    // Logika lama untuk menghapus data dari database (sudah benar)
    const materialsInCourse = await Material.find({
      courseId: courseId,
    }).session(session);
    const materialIds = materialsInCourse.map((m) => m._id);
    if (materialIds.length > 0) {
      await AssignmentSubmission.deleteMany({
        materialId: { $in: materialIds },
      }).session(session);
      await TestResult.deleteMany({ materialId: { $in: materialIds } }).session(
        session
      );
      await ForumPost.deleteMany({ materialId: { $in: materialIds } }).session(
        session
      );
    }
    await Material.deleteMany({ courseId: courseId }).session(session);
    await Enrollment.deleteMany({ courseId: courseId }).session(session);
    await Course.findByIdAndDelete(courseId).session(session);

    await session.commitTransaction();
    return courseToDelete;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error removing course and its dependencies:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const getCourseDetails = async (courseId, userId = null) => {
  // Ambil data kursus dan materi secara bersamaan
  const [course, materials] = await Promise.all([
    Course.findById(courseId).populate({
      path: 'instructorId',
      select: 'name',
    }),
    Material.find({ courseId: courseId }),
  ]);

  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  let enrollment = null;
  // Jika ada user ID, cari data pendaftarannya
  if (userId) {
    enrollment = await Enrollment.findOne({ userId, courseId });
  }

  return { course, materials, enrollment };
};

export const getCoursesByInstructor = async (instructorId) => {
  return Course.find({ instructorId }).populate('instructorId', 'name');
};
