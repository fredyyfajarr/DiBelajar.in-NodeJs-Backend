// controllers/EnrollmentController.js

import * as enrollmentService from '../services/enrollmentService.js';
import * as notificationService from '../services/notificationService.js';
import { sendSuccess } from '../utils/apiResponse.js';

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

    sendSuccess(res, { data: newEnrollment, statusCode: 201 });
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
    sendSuccess(res, { data: enrollments, meta: { count: enrollments.length } });
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
    sendSuccess(res, { data: enrollments, meta: { count: enrollments.length } });
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
    sendSuccess(res, {
      data: deletedEnrollment,
      message: 'Enrollment deleted successfully',
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
    sendSuccess(res, { data: enrollment });
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
    sendSuccess(res, {
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
    sendSuccess(res, { data: progressData });
  } catch (error) {
    next(error); // <-- Langsung serahkan ke error handler
  }
};
