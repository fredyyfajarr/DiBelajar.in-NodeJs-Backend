import * as assignmentSubmissionService from '../services/assignmentSubmissionService.js';

export const createSubmission = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Buat URL yang bisa diakses publik untuk file tugas
    const submissionFileUrl = `${req.protocol}://${req.get(
      'host'
    )}/uploads/assignments/${req.file.filename}`;

    const newSubmission = await assignmentSubmissionService.createSubmission(
      userId,
      material._id,
      submissionFileUrl // Kirim URL yang sudah jadi ke service
    );

    res.status(201).json(newSubmission);
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
    res.json(submissions);
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
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};
