import Enrollment from '../models/Enrollment.js';
import Material from '../models/Material.js';
import { buildQuery } from '../utils/queryFeatures.js';
import * as notificationService from './notificationService.js';

/**
 * Mengambil semua data pendaftaran dengan data user dan kursus terkait.
 */
export const findAllEnrollments = async () => {
  try {
    return await buildQuery(Enrollment, {}, [
      { path: 'userId', select: 'name email' },
      { path: 'courseId', select: 'title description' },
    ]);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

/**
 * Mencari data pendaftaran berdasarkan ID pengguna.
 */
export const findEnrollmentByUserId = async (userId, options = {}) => {
  try {
    const populateOptions = [
      {
        path: 'courseId',
        select: 'title description slug thumbnail',
      },
    ];
    return await buildQuery(Enrollment, { userId: userId }, populateOptions);
  } catch (error) {
    console.error('Error fetching enrollments by user ID:', error);
    throw error;
  }
};

/**
 * Mencari data pendaftaran berdasarkan ID kursus.
 */
export const findEnrollmentByCourseId = async (courseId, options = {}) => {
  try {
    const conditions = { courseId: courseId };
    const populateOptions = [{ path: 'userId', select: 'name email slug' }];
    return await buildQuery(Enrollment, conditions, populateOptions);
  } catch (error) {
    console.error('Error fetching enrollments by course ID:', error);
    throw error;
  }
};

/**
 * Mendaftarkan pengguna ke dalam sebuah kursus.
 */
export const createEnrollment = async (userId, courseId) => {
  const existingEnrollment = await Enrollment.findOne({ userId, courseId });

  if (existingEnrollment) {
    const error = new Error('User already enrolled in this course');
    error.statusCode = 400; // Bad Request
    throw error;
  }

  return Enrollment.create({ userId, courseId });
};

/**
 * Menghapus data pendaftaran pengguna dari sebuah kursus.
 */
export const removeEnrollment = async (userId, courseId) => {
  const deletedEnrollment = await Enrollment.findOneAndDelete({
    userId: userId,
    courseId: courseId,
  });

  if (!deletedEnrollment) {
    const error = new Error('Enrollment not found');
    error.statusCode = 404;
    throw error;
  }
  return deletedEnrollment;
};

/**
 * Memperbarui progres belajar pengguna pada sebuah materi.
 */
export const updateUserProgress = async (
  userId,
  courseId,
  materialId,
  step,
  materialTitle,
  courseSlug
) => {
  const enrollment = await Enrollment.findOne({ userId, courseId });

  if (!enrollment) {
    const error = new Error('Enrollment not found');
    error.statusCode = 404;
    throw error;
  }

  let materialProgress = enrollment.progress.find(
    (p) => p.materialId.toString() === materialId.toString()
  );

  if (!materialProgress) {
    materialProgress = { materialId };
    enrollment.progress.push(materialProgress);
  }

  if (step === 'test') materialProgress.hasCompletedTest = true;
  if (step === 'assignment') materialProgress.hasSubmittedAssignment = true;
  if (step === 'completion') {
    materialProgress.isCompleted = true;
    await notificationService.createNotification(
      userId,
      `Anda telah menyelesaikan materi: ${materialTitle}`,
      `/learn/${courseSlug || courseId}`
    );
  }

  await enrollment.save();
  return enrollment;
};

/**
 * Mengambil data yang diperlukan untuk sertifikat setelah memverifikasi kelulusan.
 */
export const getCertificateData = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({ userId, courseId });

  if (!enrollment) {
    const error = new Error('Anda tidak terdaftar di kursus ini.');
    error.statusCode = 404;
    throw error;
  }

  // Jika sertifikat sudah pernah dibuat, langsung kembalikan tanggalnya
  if (enrollment.completedAt) {
    return enrollment.completedAt;
  }

  // Jika belum, verifikasi kelulusan
  const totalMaterials = await Material.countDocuments({ courseId });
  const completedMaterials = enrollment.progress.filter(
    (p) => p.isCompleted
  ).length;

  if (totalMaterials > 0 && totalMaterials === completedMaterials) {
    enrollment.completedAt = new Date();
    await enrollment.save();
    return enrollment.completedAt;
  }

  // Jika belum lulus, tolak akses
  const error = new Error('Sertifikat tidak tersedia. Kursus belum selesai.');
  error.statusCode = 403;
  throw error;
};

/**
 * Mengambil detail progres seorang siswa dalam sebuah kursus.
 */
export const getStudentProgress = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    courseId: courseId,
    userId: userId,
  })
    .populate({ path: 'userId', select: 'name' })
    .populate({ path: 'courseId', select: 'title' })
    .populate({ path: 'progress.materialId', select: 'title description' });

  if (!enrollment) {
    const error = new Error('Data pendaftaran siswa tidak ditemukan.');
    error.statusCode = 404;
    throw error;
  }

  const allMaterialsInCourse = await Material.find({ courseId }).select(
    'title'
  );

  return { enrollment, allMaterialsInCourse };
};
