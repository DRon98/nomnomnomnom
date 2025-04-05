import { generateRecommendationsFromAPI } from './api';

/**
 * Generates food recommendations using the proxy API
 * @param {Object} userPreferences - Contains all user preferences data
 * @returns {Promise<{recommended: Array, avoid: Array}>} - Arrays of recommended foods and foods to avoid
 */
export const generateAIRecommendations = async (userPreferences) => {
  try {
    // Call the proxy API to get recommendations
    const { recommended, avoid, surveyData, lifestyleData } = await generateRecommendationsFromAPI(userPreferences);

    return {
      recommended,
      avoid,
      surveyData: userPreferences.surveyData,
      lifestyleData: userPreferences.lifestyleData
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    throw error;
  }
};
