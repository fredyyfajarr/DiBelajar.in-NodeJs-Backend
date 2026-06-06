import Enrollment from '../models/Enrollment.js';
import Material from '../models/Material.js';
import { buildQuery } from '../utils/queryFeatures.js';
import * as notificationService from './notificationService.js';

const REQUIRED_FORUM_POSTS = 2;

const findMaterialProgress = (enrollment, materialId) =>
  enrollment.progress.find(
    (progress) => progress.materialId.toString() === materialId.toString()
  );

const getOrCreateMaterialProgress = (enrollment, materialId) => {
  let materialProgress = findMaterialProgress(enrollment, materialId);

  if (!materialProgress) {
    materialProgress = {
      materialId,
      hasCompletedTest: false,
      hasSubmittedAssignment: false,
      forumPostCount: 0,
      isCompleted: false,
    };
    enrollment.progress.push(materialProgress);
  }

  return materialProgress;
};

export const getMaterialRequirements = (material) => ({
  hasTest: Array.isArray(material.testContent) && material.testContent.length > 0,
  requiresAssignment: true,
  requiredForumPosts: REQUIRED_FORUM_POSTS,
});

export const evaluateMaterialCompletion = (materialProgress, material) => {
  const requirements = getMaterialRequirements(material);

  return (
    (!requirements.hasTest || materialProgress.hasCompletedTest) &&
    (!requirements.requiresAssignment || materialProgress.hasSubmittedAssignment) &&
    (materialProgress.forumPostCount || 0) >= requirements.requiredForumPosts
  );
};

const syncCourseCompletion = async (enrollment, courseId) => {
  const materials = await Material.find({ courseId }).select('_id');
  const materialIds = new Set(
    materials.map((material) => material._id.toString())
  );
  const completedMaterials = enrollment.progress.filter(
    (progress) =>
      materialIds.has(progress.materialId.toString()) && progress.isCompleted
  ).length;

  if (materials.length > 0 && materials.length === completedMaterials) {
    enrollment.completedAt = enrollment.completedAt || new Date();
  } else {
    enrollment.completedAt = null;
  }
};

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
    const enrollments = await buildQuery(
      Enrollment,
      { userId: userId },
      populateOptions
    );
    const courseIds = enrollments
      .map((enrollment) => enrollment.courseId?._id)
      .filter(Boolean);
    const materialCounts = await Material.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } },
    ]);
    const materialCountByCourse = new Map(
      materialCounts.map((item) => [item._id.toString(), item.count])
    );

    return enrollments.map((enrollment) => {
      const enrollmentObject = enrollment.toObject();
      const courseId = enrollmentObject.courseId?._id?.toString();
      if (enrollmentObject.courseId) {
        enrollmentObject.courseId.materialCount =
          materialCountByCourse.get(courseId) || 0;
      }
      return enrollmentObject;
    });
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
    error.statusCode = 409;
    throw error;
  }

  try {
    return await Enrollment.create({ userId, courseId });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error('User already enrolled in this course');
      duplicateError.statusCode = 409;
      throw duplicateError;
    }
    throw error;
  }
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
  const [enrollment, material] = await Promise.all([
    Enrollment.findOne({ userId, courseId }),
    Material.findById(materialId),
  ]);

  if (!enrollment) {
    const error = new Error('Enrollment not found');
    error.statusCode = 404;
    throw error;
  }

  if (!material) {
    const error = new Error('Materi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const materialProgress = getOrCreateMaterialProgress(enrollment, materialId);
  const wasCompleted = materialProgress.isCompleted;

  if (step === 'test') materialProgress.hasCompletedTest = true;
  if (step === 'assignment') materialProgress.hasSubmittedAssignment = true;
  if (step === 'forum') {
    materialProgress.forumPostCount =
      (materialProgress.forumPostCount || 0) + 1;
  }
  if (step === 'completion') {
    if (!evaluateMaterialCompletion(materialProgress, material)) {
      const error = new Error(
        'Selesaikan kuis, tugas, dan aktivitas forum sebelum menyelesaikan materi.'
      );
      error.statusCode = 400;
      throw error;
    }

    materialProgress.isCompleted = true;

    if (!wasCompleted) {
      await notificationService.createNotification(
        userId,
        `Anda telah menyelesaikan materi: ${materialTitle}`,
        `/learn/${courseSlug || courseId}`
      );
    }
  }

  await syncCourseCompletion(enrollment, courseId);
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
