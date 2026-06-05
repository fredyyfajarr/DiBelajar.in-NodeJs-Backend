import * as assignmentSubmissionService from '../services/assignmentSubmissionService.js';
import * as enrollmentService from '../services/enrollmentService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createSubmission = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    if (!req.file) {
      const error = new Error('No file uploaded.');
      error.statusCode = 400;
      throw error;
    }

    // Buat URL yang bisa diakses publik untuk file tugas
    const submissionFileUrl = req.file.path;

    const newSubmission = await assignmentSubmissionService.createSubmission(
      userId,
      material._id,
      submissionFileUrl // Kirim URL yang sudah jadi ke service
    );

    await enrollmentService.updateUserProgress(
      userId,
      req.course._id,
      material._id,
      'assignment',
      material.title,
      req.course.slug
    );

    sendSuccess(res, { data: newSubmission, statusCode: 201 });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByMaterialId = async (req, res, next) => {
  try {
    const submissions =
      await assignmentSubmissionService.findSubmissionsByMaterialId(
        req.material._id,
        req.query
      );
    sendSuccess(res, { data: submissions });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByUserId = async (req, res, next) => {
  try {
    const submissions =
      await assignmentSubmissionService.findSubmissionsByUserId(
        req.profile._id,
        req.query
      );
    sendSuccess(res, { data: submissions });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const submission = await assignmentSubmissionService.gradeSubmission(
      req.params.submissionId,
      req.material._id,
      req.body,
      req.user._id
    );

    sendSuccess(res, {
      data: submission,
      message: 'Nilai tugas berhasil disimpan',
    });
  } catch (error) {
    next(error);
  }
};
