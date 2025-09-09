// controllers/EnrollmentController.js

import * as enrollmentService from '../services/enrollmentService.js';
import * as notificationService from '../services/notificationService.js';

export const enrollInCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.course._id;

    const newEnrollment = await enrollmentService.createEnrollment(
      userId,
      courseId
    );

    // Kirim notifikasi ke instruktur
    await notificationService.createNotification(
      req.course.instructorId,
      `${req.user.name} telah mendaftar ke kursus Anda: ${req.course.title}`,
      `/instructor/courses/${req.course.slug}/enrollments`
    );

    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error); // <-- Langsung serahkan ke error handler
  }
};

export const findAllEnrollments = (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

export const findEnrollmentByUserId = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.findEnrollmentByUserId(
      req.profile._id,
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

export const findEnrollmentByCourseId = async (req, res, next) => {
  try {
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
    const deletedEnrollment = await enrollmentService.removeEnrollment(
      req.profile._id,
      req.course._id
    );
    res.status(200).json({
      message: 'Enrollment deleted successfully',
      data: deletedEnrollment,
    });
  } catch (error) {
    next(error); // <-- Langsung serahkan ke error handler
  }
};

export const updateUserProgress = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.updateUserProgress(
      req.user._id,
      req.course._id,
      req.material._id,
      req.body.step,
      req.material.title,
      req.course.slug
    );
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    next(error); // <-- Langsung serahkan ke error handler
  }
};

export const getCertificateData = async (req, res, next) => {
  try {
    const completionDate = await enrollmentService.getCertificateData(
      req.user._id,
      req.course._id
    );
    res.status(200).json({
      success: true,
      data: {
        studentName: req.user.name,
        courseTitle: req.course.title,
        completionDate: completionDate,
      },
    });
  } catch (error) {
    next(error); // <-- Langsung serahkan ke error handler
  }
};

export const getStudentProgressInCourse = async (req, res, next) => {
  try {
    const progressData = await enrollmentService.getStudentProgress(
      req.profile._id,
      req.course._id
    );
    res.status(200).json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    next(error); // <-- Langsung serahkan ke error handler
  }
};
