import * as enrollmentService from '../services/enrollmentService.js';
import Enrollment from '../models/Enrollment.js';
import Material from '../models/Material.js';

export const enrollInCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.course._id;

    const newEnrollment = await enrollmentService.createEnrollment(
      userId,
      courseId
    );
    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error);
  }
};

export const findAllEnrollments = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// --- FUNGSI YANG DIPERBAIKI ---
export const findEnrollmentByUserId = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.findEnrollmentByUserId(
      req.profile._id,
      req.query
    );
    // Langsung kirim hasil, meskipun array-nya kosong.
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// --- Fungsi ini sudah kita perbaiki sebelumnya, tetap disertakan ---
export const findEnrollmentByCourseId = async (req, res, next) => {
  try {
    console.log('--- CONTROLLER ---');
    console.log('Mencari pendaftar untuk Course ID:', req.course._id);

    const enrollments = await enrollmentService.findEnrollmentByCourseId(
      req.course._id,
      req.query
    );
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const removeEnrollment = async (req, res, next) => {
  try {
    const user = req.profile;
    const course = req.course;
    const deletedEnrollment = await enrollmentService.removeEnrollment(
      user._id,
      course._id
    );
    if (!deletedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.status(200).json({
      message: 'Enrollment deleted successfully',
      data: deletedEnrollment,
    });
  } catch (error) {
    next(error);
  }
};

// ===== GANTI FUNGSI updateUserProgress DENGAN INI =====
export const updateUserProgress = async (req, res, next) => {
  try {
    const courseId = req.course._id;
    const materialId = req.material._id;
    const userId = req.user._id;
    const { step } = req.body;

    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
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
    if (step === 'completion') materialProgress.isCompleted = true;

    // Logika pengecekan kelulusan kita pindahkan dari sini
    await enrollment.save();
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    next(error);
  }
};

// ===== GANTI FUNGSI getCertificateData DENGAN INI =====
export const getCertificateData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.course._id;

    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'Anda tidak terdaftar di kursus ini.' });
    }

    // Cek apakah completedAt sudah ada
    if (!enrollment.completedAt) {
      // Jika belum ada, lakukan verifikasi di sini
      const totalMaterials = await Material.countDocuments({ courseId });
      const completedMaterials = enrollment.progress.filter(
        (p) => p.isCompleted
      ).length;

      // Jika semua materi selesai, update completedAt
      if (totalMaterials > 0 && totalMaterials === completedMaterials) {
        enrollment.completedAt = new Date();
        await enrollment.save();
      } else {
        // Jika belum selesai, tolak akses
        return res.status(403).json({
          error: 'Sertifikat tidak tersedia. Kursus belum selesai.',
        });
      }
    }

    // Kirim data yang dibutuhkan untuk sertifikat
    res.status(200).json({
      success: true,
      data: {
        studentName: req.user.name,
        courseTitle: req.course.title,
        completionDate: enrollment.completedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
