import * as testResultService from '../Services/testResultService.js';

export const createTestResult = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { userId, score, answers } = req.body;
    const newTestResult = await testResultService.createTestResult(
      userId,
      materialId,
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
    const { materialId } = req.params;
    const testResults = await testResultService.findTestResultsByMaterialId(
      materialId
    );
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};

export const getTestResultsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const testResults = await testResultService.findTestResultsByUserId(userId);
    res.json(testResults);
  } catch (error) {
    next(error);
  }
};
