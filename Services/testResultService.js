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
    console.error('Error creating test result:', error);
    throw error;
  }
};

export const findTestResultsByMaterialId = async (materialId, options = {}) => {
  try {
    const sort = options.sort || '-completeAt';
    const skip = options.skip || 0;
    const limit = options.limit || 10;
    const testResults = await TestResult.find({ materialId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return testResults;
  } catch (error) {
    console.error('Error finding test results by material ID:', error);
    throw error;
  }
};

export const findTestResultsByUserId = async (userId, options = {}) => {
  try {
    const sort = options.sort || '-completeAt';
    const skip = options.skip || 0;
    const limit = options.limit || 10;
    const testResults = await TestResult.find({ userId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return testResults;
  } catch (error) {
    console.error('Error finding test results by user ID:', error);
    throw error;
  }
};
