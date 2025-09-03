import * as testResultService from '../services/testResultService.js';

export const createTestResult = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    const { score, answers } = req.body;

    const newTestResult = await testResultService.createTestResult(
      userId,
      material._id,
      score,
      answers
    );
    res.status(201).json(newTestResult);
  } catch (error) {
    next(error);
  }
};

export const getTestResultsByMaterialId = async (req, res, next) => {
  try {
    const testResults = await testResultService.findTestResultsByMaterialId(
      req.material._id,
      req.query
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};

export const getTestResultsByUserId = async (req, res, next) => {
  try {
    const testResults = await testResultService.findTestResultsByUserId(
      req.profile._id,
      req.query
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};
