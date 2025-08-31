import TestResult from '../models/TestResult.js';

export const createTestResult = async (userId, materialId, score, answers) => {
  try {
    const newTestResult = await TestResult.create({
      userId,
      materialId,
      score,
      answers,
    });
    return newTestResult;
  } catch (error) {
    throw error;
  }
};

export const findTestResultsByMaterialId = async (materialId) => {
  try {
    const testResults = await TestResult.find({ materialId });
    return testResults;
  } catch (error) {
    throw error;
  }
};

export const findTestResultsByUserId = async (userId) => {
  try {
    const testResults = await TestResult.find({ userId });
    return testResults;
  } catch (error) {
    throw error;
  }
};
