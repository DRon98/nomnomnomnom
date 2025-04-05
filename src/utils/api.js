/**
 * API client for making requests to the proxy server
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generates food recommendations using the proxy API
 * @param {Object} userPreferences - Contains all user preferences data
 * @returns {Promise<{recommended: Array, avoid: Array, surveyData: Object, lifestyleData: Object}>}
 */
export const generateRecommendationsFromAPI = async (userPreferences) => {
  try {
    const response = await fetch(`${API_BASE_URL}/groq/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPreferences)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling recommendations API:', error);
    throw error;
  }
}; 